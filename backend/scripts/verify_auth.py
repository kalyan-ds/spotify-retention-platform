import asyncio
import logging
from sqlalchemy import select, update
from app.database.engine import AsyncSessionLocal
from app.models.auth import User, Role
from app.core.security import get_password_hash
from app.services.auth import AuthService
from fastapi import Request

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Fake Request class for testing
class MockRequest:
    def __init__(self):
        self.headers = {"user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 TestBrowser/1.0"}
        class Client:
            host = "127.0.0.1"
        self.client = Client()

async def verify_auth():
    async with AsyncSessionLocal() as db:
        # 1. Update first user with a valid Argon2 hash
        logger.info("Setting valid password for first user...")
        query = select(User).limit(1)
        user = (await db.execute(query)).scalar_one_or_none()

        if not user:
            logger.error("No users found in database.")
            return

        test_email = user.email
        test_password = "TestPassword123!"
        hashed = get_password_hash(test_password)

        user.password_hash = hashed
        await db.commit()
        await db.refresh(user)
        logger.info(f"User {test_email} updated with real hash.")

        # 2. Test Login
        logger.info("Testing login flow...")
        mock_request = MockRequest()
        result = await AuthService.authenticate(db, test_email, test_password, mock_request)

        if not result:
            logger.error("Login failed!")
            return

        access_token = result["access_token"]
        refresh_token = result["refresh_token"]
        logger.info(f"Login successful! Got Access Token (len={len(access_token)}) and Refresh Token (len={len(refresh_token)})")

        # 3. Test Refresh
        logger.info("Testing refresh token rotation...")
        refresh_result = await AuthService.refresh_tokens(db, refresh_token, mock_request)
        if not refresh_result:
            logger.error("Refresh token rotation failed!")
            return

        new_access = refresh_result["access_token"]
        new_refresh = refresh_result["refresh_token"]
        logger.info("Refresh successful. Got new tokens.")

        # 4. Test Logout
        logger.info("Testing logout...")
        logout_success = await AuthService.logout(db, new_refresh, mock_request)
        if logout_success:
            logger.info("Logout successful.")
        else:
            logger.error("Logout failed.")

if __name__ == "__main__":
    asyncio.run(verify_auth())
