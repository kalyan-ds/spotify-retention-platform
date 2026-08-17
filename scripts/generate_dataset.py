import pandas as pd
try:
    import numpy as np
except Exception:
    # Minimal shim if numpy is unavailable in the environment
    import random as _random

    class _RandomShim:
        def seed(self, s):
            _random.seed(s)

        def randint(self, a, b=None):
            if b is None:
                return _random.randint(0, a)
            return _random.randint(a, b - 1) if isinstance(b, int) else _random.randint(a, b)

        def uniform(self, a, b):
            return _random.uniform(a, b)

        def choice(self, seq, p=None):
            if p is None:
                return _random.choice(seq)
            # weighted choice
            r = _random.random()
            cum = 0.0
            for item, prob in zip(seq, p):
                cum += prob
                if r <= cum:
                    return item
            return seq[-1]

    class _NumpyShim:
        def __init__(self):
            self.random = _RandomShim()

    np = _NumpyShim()
from faker import Faker

fake = Faker()

# Reproducibility
np.random.seed(42)

# Number of users
NUM_USERS = 10000

# Categories
countries = [
    "USA", "India", "UK", "Germany", "Canada",
    "Australia", "Brazil", "France", "Japan", "South Korea"
]

device_types = [
    "Mobile",
    "Desktop",
    "Tablet",
    "Web Player"
]

payment_methods = [
    "Credit Card",
    "Debit Card",
    "UPI",
    "PayPal",
    "Apple Pay",
    "Google Pay"
]

genders = [
    "Male",
    "Female",
    "Other"
]

print("Generating Spotify User Dataset...")

data = []

for user_id in range(1, NUM_USERS + 1):

    age = np.random.randint(18, 60)

    gender = np.random.choice(genders)

    country = np.random.choice(countries)

    premium_user = np.random.choice(
        [0, 1],
        p=[0.4, 0.6]
    )

    subscription_months = (
        np.random.randint(1, 48)
        if premium_user == 1
        else 0
    )

    monthly_subscription_fee = (
        np.random.choice([4.99, 9.99, 14.99])
        if premium_user == 1
        else 0
    )

    payment_method = (
        np.random.choice(payment_methods)
        if premium_user == 1
        else "Free Plan"
    )

    daily_listening_hours = round(
        np.random.uniform(0.2, 8),
        2
    )

    songs_played_per_day = np.random.randint(5, 200)

    session_duration = round(
        np.random.uniform(5, 240),
        2
    )

    listening_days_per_week = np.random.randint(1, 8)

    skip_rate = round(
        np.random.uniform(0, 100),
        2
    )

    playlist_count = np.random.randint(0, 50)

    liked_songs = np.random.randint(0, 5000)

    search_frequency = np.random.randint(0, 100)

    shares_per_month = np.random.randint(0, 30)

    followed_artists = np.random.randint(0, 300)

    last_active_days = np.random.randint(0, 30)

    device_type = np.random.choice(device_types)

    notifications_clicked = np.random.randint(0, 100)

    ads_clicked = np.random.randint(0, 50)

    monthly_spending = (
        monthly_subscription_fee
        if premium_user == 1
        else 0
    )

    premium_renewals = (
        np.random.randint(0, 24)
        if premium_user == 1
        else 0
    )

    lifetime_value = round(
        monthly_spending *
        max(subscription_months, 1),
        2
    )
    # AI Scores
    engagement_score = min(
        100,
        round(
            (
                daily_listening_hours * 10
                + playlist_count * 0.5
                + liked_songs * 0.01
                + followed_artists * 0.05
                ),
                2
                )
                )
    retention_score = min(
        100,
        round(
            (
                engagement_score
                - skip_rate * 0.3
                - last_active_days * 1.5
                ),
                2
                )
                )
    retention_score = max(
        retention_score,
        0
        )
    satisfaction_score = min(
        100,
        round(
            (
                100
                - skip_rate * 0.5
                + daily_listening_hours * 5
                ),
                2
                )
                )
    satisfaction_score = max(
        satisfaction_score,
        0
        )
    # Churn Logic

    churn_probability = 0

    if daily_listening_hours < 1:
        churn_probability += 0.25
    if playlist_count < 2:
        churn_probability += 0.15

    if skip_rate > 60:
        churn_probability += 0.20

    if last_active_days > 15:
        churn_probability += 0.25

    if retention_score < 40:
        churn_probability += 0.20

    if premium_user == 1:
        churn_probability -= 0.15

    churn_probability = max(
        0,
        min(churn_probability, 1)
        )
    churn = np.random.choice(
        [0, 1],
        p=[
            1 - churn_probability,
            churn_probability
            ]
            )
    data.append([
    user_id,
    age,
    gender,
    country,

    premium_user,
    subscription_months,
    monthly_subscription_fee,
    payment_method,

    daily_listening_hours,
    songs_played_per_day,
    session_duration,
    listening_days_per_week,
    skip_rate,

    playlist_count,
    liked_songs,
    search_frequency,
    shares_per_month,
    followed_artists,

    last_active_days,
    device_type,
    notifications_clicked,
    ads_clicked,

    monthly_spending,
    premium_renewals,
    lifetime_value,

    engagement_score,
    retention_score,
    satisfaction_score,

    churn
])
print("Phase 2 Generation Logic Working")
columns = [
    "user_id",
    "age",
    "gender",
    "country",

    "premium_user",
    "subscription_months",
    "monthly_subscription_fee",
    "payment_method",

    "daily_listening_hours",
    "songs_played_per_day",
    "session_duration",
    "listening_days_per_week",
    "skip_rate",

    "playlist_count",
    "liked_songs",
    "search_frequency",
    "shares_per_month",
    "followed_artists",

    "last_active_days",
    "device_type",
    "notifications_clicked",
    "ads_clicked",

    "monthly_spending",
    "premium_renewals",
    "lifetime_value",

    "engagement_score",
    "retention_score",
    "satisfaction_score",

    "churn"
]

df = pd.DataFrame(
    data,
    columns=columns
)

df.to_csv(
    "data/raw/spotify_users.csv",
    index=False
)

print("\nDataset Generated Successfully!")

print("\nShape:")
print(df.shape)

print("\nFirst 5 Rows:")
print(df.head())

print("\nChurn Distribution:")
print(df["churn"].value_counts())

print("\nDataset Saved:")
print("data/raw/spotify_users.csv")
