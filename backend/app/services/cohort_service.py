from sqlalchemy.ext.asyncio import AsyncSession
from app.schemas.retention import CohortMatrixResponse
from app.schemas.analytics import AnalyticsFilter
from app.repositories.retention_cohort_repository import retention_cohort_repo

class CohortService:
    """
    Business logic for cohort retention analysis.
    """

    async def get_retention_matrix(self, db: AsyncSession, filters: AnalyticsFilter, granularity: str = "monthly") -> CohortMatrixResponse:
        """
        Retrieves the retention matrix populated by the Cohort Repository.
        """

        # Stub logic: pass-through to repo
        matrix_rows = await retention_cohort_repo.get_monthly_retention_matrix(db, filters)

        return CohortMatrixResponse(
            granularity=granularity,
            rows=matrix_rows
        )

cohort_service = CohortService()
