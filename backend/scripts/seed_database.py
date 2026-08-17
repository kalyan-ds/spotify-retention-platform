import asyncio
import logging
from faker import Faker
import random
from typing import List
from datetime import datetime, timedelta

from app.database.engine import AsyncSessionLocal
from app.models.auth import User, Role
from app.models.catalog import Artist, Genre, Album, Song, SongArtist, SongGenre
from app.models.subscription import SubscriptionPlan, Subscription
from app.models.listening import ListeningSession, ListeningHistory

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Deterministic setup
faker = Faker()
faker.seed_instance(42)
random.seed(42)

async def seed_roles(db) -> List[Role]:
    from sqlalchemy import select
    existing_roles = (await db.execute(select(Role))).scalars().all()
    if existing_roles:
        return existing_roles

    roles = [
        Role(name="admin", description="Administrator"),
        Role(name="user", description="Regular user"),
        Role(name="artist", description="Verified artist")
    ]
    db.add_all(roles)
    await db.commit()
    for r in roles: await db.refresh(r)
    return roles

async def seed_subscription_plans(db) -> List[SubscriptionPlan]:
    from sqlalchemy import select
    existing_plans = (await db.execute(select(SubscriptionPlan))).scalars().all()
    if existing_plans:
        return list(existing_plans)

    plans = [
        SubscriptionPlan(name="Free", price=0.0, billing_cycle="monthly"),
        SubscriptionPlan(name="Premium Individual", price=9.99, billing_cycle="monthly"),
        SubscriptionPlan(name="Premium Duo", price=12.99, billing_cycle="monthly"),
        SubscriptionPlan(name="Premium Family", price=15.99, billing_cycle="monthly")
    ]
    db.add_all(plans)
    await db.commit()
    for p in plans: await db.refresh(p)
    return plans

async def seed_users_and_subscriptions(db, roles: List[Role], plans: List[SubscriptionPlan], count=1000):
    user_role = next(r for r in roles if r.name == "user")

    users = []
    for _ in range(count):
        user = User(
            email=faker.unique.email(),
            password_hash="hashed_password",
            first_name=faker.first_name(),
            last_name=faker.last_name(),
            country=faker.country_code(),
            role_id=user_role.id
        )
        users.append(user)

    db.add_all(users)
    await db.commit()
    for u in users: await db.refresh(u)

    # Assign subscriptions
    subscriptions = []
    for user in users:
        plan = random.choices(plans, weights=[0.5, 0.3, 0.1, 0.1])[0]
        sub = Subscription(
            user_id=user.id,
            plan_id=plan.id,
            status="active" if plan.name != "Free" else "inactive",
            start_date=faker.date_time_between(start_date="-1y", end_date="now"),
            auto_renew=random.choice([True, False])
        )
        sub.end_date = sub.start_date + timedelta(days=30)
        subscriptions.append(sub)

    db.add_all(subscriptions)
    await db.commit()
    return users

async def seed_catalog(db, artists_count=50, albums_count=100, songs_count=5000):
    genres = [Genre(name=g, description=g) for g in ["Pop", "Rock", "Hip Hop", "R&B", "Jazz", "Classical", "Electronic"]]
    db.add_all(genres)
    await db.commit()
    for g in genres: await db.refresh(g)

    artists = []
    for _ in range(artists_count):
        artist = Artist(
            name=faker.name(),
            bio=faker.text(max_nb_chars=200),
            country=faker.country_code()
        )
        artists.append(artist)
    db.add_all(artists)
    await db.commit()
    for a in artists: await db.refresh(a)

    albums = []
    for _ in range(albums_count):
        artist = random.choice(artists)
        album = Album(
            title=faker.catch_phrase(),
            artist_id=artist.id,
            release_date=faker.date_between(start_date="-20y", end_date="today"),
            album_type=random.choice(["album", "single", "ep"])
        )
        albums.append(album)
    db.add_all(albums)
    await db.commit()
    for a in albums: await db.refresh(a)

    songs = []
    for _ in range(songs_count):
        album = random.choice(albums)
        song = Song(
            title=faker.catch_phrase(),
            album_id=album.id,
            duration_ms=random.randint(120000, 360000),
            release_date=album.release_date
        )
        songs.append(song)

    db.add_all(songs)
    await db.commit()
    for s in songs: await db.refresh(s)

    # Establish Many-to-Many Relationships for Songs
    song_artists = []
    song_genres = []
    for song in songs:
        # Song Artists (Main)
        song_artists.append(SongArtist(song_id=song.id, artist_id=random.choice(artists).id, artist_role="Main Artist"))
        # Song Genres
        song_genres.append(SongGenre(song_id=song.id, genre_id=random.choice(genres).id))

    db.add_all(song_artists)
    db.add_all(song_genres)
    await db.commit()

    return songs

async def seed_listening_records(db, users, songs, count_per_user=100):
    sessions = []
    histories = []

    # Batch limits
    batch_size = 5000

    logger.info(f"Generating listening history...")
    for i, user in enumerate(users):
        if i % 100 == 0:
            logger.info(f"Processed {i}/{len(users)} users for listening history...")

        # Generate some sessions
        for _ in range(random.randint(1, 10)):
            session = ListeningSession(
                user_id=user.id,
                start_time=faker.date_time_between(start_date="-1y", end_date="now")
            )
            session.end_time = session.start_time + timedelta(hours=random.randint(1, 4))
            sessions.append(session)

            # For each session, add history
            num_songs = random.randint(5, count_per_user)
            for _ in range(num_songs):
                song = random.choice(songs)
                histories.append(ListeningHistory(
                    user_id=user.id,
                    song_id=song.id,
                    timestamp=faker.date_time_between(start_date=session.start_time, end_date=session.end_time),
                    play_duration_ms=random.randint(30000, song.duration_ms),
                    completion_percentage=random.uniform(0.1, 1.0),
                    playback_source=random.choice(["playlist", "album", "search", "radio"]),
                    repeat_mode=random.choice(["off", "track", "context"])
                ))

        if len(histories) >= batch_size:
            db.add_all(sessions)
            db.add_all(histories)
            await db.commit()
            sessions = []
            histories = []

    if histories:
        db.add_all(sessions)
        db.add_all(histories)
        await db.commit()

    return True

async def seed_ml_data(db, users, songs):
    from app.models.ml import Prediction, Recommendation, RecommendationHistory, ModelVersion

    # First create a model version
    mv = ModelVersion(name="churn_prediction_v1", version="1.0.0", description="Initial model")
    db.add(mv)
    await db.commit()
    await db.refresh(mv)

    predictions = []
    recs = []
    rec_histories = []

    logger.info("Generating ML predictions...")
    for user in users:
        # Retention Prediction
        pred = Prediction(
            user_id=user.id,
            model_version_id=mv.id,
            prediction_score=random.uniform(0.1, 0.9),
            retention_probability=random.uniform(0.1, 0.9),
            churn_probability=random.uniform(0.1, 0.9),
            risk_level=random.choice(["Low", "Medium", "High"]),
            confidence_score=random.uniform(0.5, 0.99),
            prediction_timestamp=faker.date_time_between(start_date="-1m", end_date="now"),
            prediction_status="success"
        )
        predictions.append(pred)

        # Recommendation
        rec = Recommendation(
            user_id=user.id,
            song_id=random.choice(songs).id,
            recommendation_score=random.uniform(0.5, 0.99),
            algorithm_name="collaborative_filtering",
            generated_time=faker.date_time_between(start_date="-1w", end_date="now")
        )
        recs.append(rec)

    db.add_all(predictions)
    db.add_all(recs)
    await db.commit()
    for r in recs: await db.refresh(r)

    # Recommendation history links
    for rec in recs:
        for _ in range(1):
            rec_histories.append(RecommendationHistory(
                recommendation_id=rec.id,
                historical_state={"interacted": random.choice([True, False]), "position": random.randint(1, 10)}
            ))

    db.add_all(rec_histories)
    await db.commit()

    return True

async def seed_database(profile="development"):
    logger.info(f"Starting seed with profile '{profile}'")

    users_count = 50000 if profile == "enterprise" else 100
    songs_count = 10000 if profile == "enterprise" else 500

    async with AsyncSessionLocal() as db:
        logger.info("Seeding Roles...")
        roles = await seed_roles(db)

        logger.info("Seeding Plans...")
        plans = await seed_subscription_plans(db)

        logger.info(f"Seeding {users_count} Users and Subscriptions...")
        users = await seed_users_and_subscriptions(db, roles, plans, count=users_count)

        logger.info(f"Seeding Catalog with {songs_count} Songs...")
        songs = await seed_catalog(db, songs_count=songs_count)

        logger.info("Seeding Listening Records...")
        await seed_listening_records(db, users, songs, count_per_user=10 if profile == "development" else 100)

        logger.info("Seeding ML Predictions...")
        await seed_ml_data(db, users, songs)

        logger.info("Database seeding completed successfully.")

if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser()
    parser.add_argument("--profile", default="development", choices=["development", "enterprise"])
    args = parser.parse_args()

    asyncio.run(seed_database(args.profile))
