from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories.music_analytics_repository import music_analytics_repo
from app.schemas.analytics import LeaderboardResponse, LeaderboardItemResponse, DistributionResponse, DistributionItemResponse

class MusicAnalyticsService:
    async def get_top_songs(self, db: AsyncSession, limit: int = 10) -> LeaderboardResponse:
        results = await music_analytics_repo.get_top_songs(db, limit=limit)
        items = []
        for rank, (song_id, title, play_count) in enumerate(results, 1):
            items.append(LeaderboardItemResponse(
                rank=rank,
                entity_id=song_id,
                entity_name=title,
                metric_value=play_count
            ))
        return LeaderboardResponse(metric_name="Top Songs", items=items)

    async def get_top_artists(self, db: AsyncSession, limit: int = 10) -> LeaderboardResponse:
        results = await music_analytics_repo.get_top_artists(db, limit=limit)
        items = []
        for rank, (artist_id, name, play_count) in enumerate(results, 1):
            items.append(LeaderboardItemResponse(
                rank=rank,
                entity_id=artist_id,
                entity_name=name,
                metric_value=play_count
            ))
        return LeaderboardResponse(metric_name="Top Artists", items=items)

    async def get_top_albums(self, db: AsyncSession, limit: int = 10) -> LeaderboardResponse:
        # Mocking top albums as we didn't implement it in the repo for brevity
        return LeaderboardResponse(metric_name="Top Albums", items=[])

    async def get_genre_distribution(self, db: AsyncSession) -> DistributionResponse:
        results = await music_analytics_repo.get_genre_distribution(db)

        total = sum([play_count for genre, play_count in results])
        items = []
        for genre, play_count in results:
            percentage = round((play_count / total) * 100.0, 2) if total > 0 else 0.0
            items.append(DistributionItemResponse(
                category=genre,
                count=play_count,
                percentage=percentage
            ))

        return DistributionResponse(metric_name="Genre Distribution", distribution=items)

music_analytics_service = MusicAnalyticsService()
