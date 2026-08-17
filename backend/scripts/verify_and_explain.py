import asyncio
import logging
from sqlalchemy import text
from sqlalchemy.ext.asyncio import create_async_engine
from app.core.config import settings

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

async def run_explains():
    logger.info("Starting EXPLAIN analysis for critical queries...")
    engine = create_async_engine(settings.SQLALCHEMY_DATABASE_URI, echo=False)

    queries = [
        {
            "name": "Dashboard: High Risk Users by Plan",
            "sql": """
                EXPLAIN SELECT sp.name, COUNT(u.id) as high_risk_count
                FROM users u
                JOIN subscriptions s ON u.id = s.user_id
                JOIN subscription_plans sp ON s.plan_id = sp.id
                JOIN predictions p ON u.id = p.user_id
                WHERE p.risk_level = 'High' AND s.status = 'active'
                GROUP BY sp.name
            """
        },
        {
            "name": "Dashboard: Listening History Recent Activity",
            "sql": """
                EXPLAIN SELECT u.country, COUNT(lh.id) as total_plays
                FROM listening_history lh
                JOIN users u ON lh.user_id = u.id
                WHERE lh.timestamp >= DATE_SUB(NOW(), INTERVAL 7 DAY)
                GROUP BY u.country
            """
        },
        {
            "name": "Dashboard: Top Songs by Completion Rate",
            "sql": """
                EXPLAIN SELECT s.title, AVG(lh.completion_percentage) as avg_completion
                FROM listening_history lh
                JOIN songs s ON lh.song_id = s.id
                GROUP BY s.id, s.title
                ORDER BY avg_completion DESC
                LIMIT 10
            """
        }
    ]

    async with engine.begin() as conn:
        for q in queries:
            logger.info(f"--- {q['name']} ---")
            result = await conn.execute(text(q['sql']))
            rows = result.fetchall()
            keys = result.keys()

            # Print column headers
            header = " | ".join(str(k) for k in keys)
            logger.info(header)
            logger.info("-" * len(header))

            for row in rows:
                logger.info(" | ".join(str(val) for val in row))
            logger.info("\n")

    await engine.dispose()
    logger.info("EXPLAIN analysis complete.")

if __name__ == "__main__":
    asyncio.run(run_explains())
