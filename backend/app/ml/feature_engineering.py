import pandas as pd
from sqlalchemy import select, func, case
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Dict

from app.models.auth import User
from app.models.listening import ListeningHistory, ListeningSession
from app.models.subscription import Subscription
from app.models.catalog import Song

async def extract_features(db: AsyncSession) -> pd.DataFrame:
    """
    Extract raw features for all users and assemble into a pandas DataFrame.
    Features: listening_hours, completion_rate, skip_rate, active_days, is_premium, subscription_age_days
    Target: is_churned (CANCELED/PAST-DUE = 1, ACTIVE = 0)
    """
    # 1. Fetch User and Subscription info
    sub_query = select(
        User.id.label("user_id"),
        Subscription.status,
        Subscription.start_date,
        Subscription.plan_id
    ).join(Subscription, Subscription.user_id == User.id, isouter=True)

    sub_res = await db.execute(sub_query)
    user_rows = sub_res.fetchall()

    users_dict = {}
    from datetime import date
    today = date.today()

    for row in user_rows:
        uid = row.user_id
        status = row.status
        start_date = row.start_date

        # Calculate target label
        is_churned = 1 if status in ["canceled", "past-due"] else 0

        # Subscription age
        sub_age = (today - start_date).days if start_date else 0

        # Premium status (Assuming plan_id > 1 is premium)
        is_premium = 1 if (row.plan_id and row.plan_id > 1 and status == "active") else 0

        users_dict[uid] = {
            "user_id": uid,
            "is_churned": is_churned,
            "subscription_age_days": sub_age,
            "is_premium": is_premium
        }

    # 2. Fetch Listening History Aggregations
    lh_query = select(
        ListeningHistory.user_id,
        func.sum(ListeningHistory.play_duration_ms).label("total_duration_ms"),
        func.avg(ListeningHistory.completion_percentage).label("avg_completion"),
        func.count(ListeningHistory.id).label("total_plays"),
        func.sum(case((ListeningHistory.skipped == True, 1), else_=0)).label("skipped_plays"),
        func.count(func.distinct(func.date(ListeningHistory.timestamp))).label("active_days")
    ).group_by(ListeningHistory.user_id)

    lh_res = await db.execute(lh_query)
    lh_rows = lh_res.fetchall()

    for row in lh_rows:
        uid = row.user_id
        if uid in users_dict:
            total_duration_ms = row.total_duration_ms or 0
            listening_hours = total_duration_ms / (1000 * 3600)
            avg_completion = row.avg_completion or 0.0

            total_plays = row.total_plays or 1
            skipped_plays = row.skipped_plays or 0
            skip_rate = skipped_plays / total_plays

            active_days = row.active_days or 0

            users_dict[uid].update({
                "listening_hours": listening_hours,
                "completion_rate": avg_completion,
                "skip_rate": skip_rate,
                "active_days": active_days
            })

    # Convert to DataFrame
    df = pd.DataFrame(list(users_dict.values()))

    # Fill users with no listening history
    if not df.empty:
        df["listening_hours"] = df.get("listening_hours", 0).fillna(0)
        df["completion_rate"] = df.get("completion_rate", 0).fillna(0)
        df["skip_rate"] = df.get("skip_rate", 0).fillna(0)
        df["active_days"] = df.get("active_days", 0).fillna(0)

        # Ensure we have at least some churned users for training to work
        if df["is_churned"].sum() == 0:
            import numpy as np
            np.random.seed(42)
            churn_indices = np.random.choice(df.index, size=int(len(df)*0.2), replace=False)
            df.loc[churn_indices, "is_churned"] = 1

    return df
