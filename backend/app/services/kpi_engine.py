class KPIEngine:
    """
    Centralized Calculator for standardizing rates, ratios, and percentages
    across the Analytics Domain.
    """

    @staticmethod
    def calculate_delta_percentage(current: float, previous: float) -> float:
        """Calculates percentage growth between two periods."""
        if previous == 0:
            return 100.0 if current > 0 else 0.0
        return ((current - previous) / previous) * 100.0

    @staticmethod
    def calculate_arpu(total_revenue: float, active_users: int) -> float:
        """Average Revenue Per User"""
        if active_users == 0:
            return 0.0
        return total_revenue / active_users

    @staticmethod
    def calculate_ltv(arpu: float, churn_rate_percentage: float) -> float:
        """Customer Lifetime Value based on MRR churn."""
        if churn_rate_percentage <= 0:
            return 0.0 # Avoid division by zero, or return infinite proxy if 0 churn
        churn_decimal = churn_rate_percentage / 100.0
        return arpu / churn_decimal

    @staticmethod
    def calculate_conversion_rate(converted_users: int, total_users: int) -> float:
        """General conversion rate formula."""
        if total_users == 0:
            return 0.0
        return (converted_users / total_users) * 100.0

    @staticmethod
    def calculate_churn_rate(canceled_subscriptions: int, total_active_subscriptions: int) -> float:
        """Standard monthly churn formula."""
        if total_active_subscriptions == 0:
            return 0.0
        return (canceled_subscriptions / total_active_subscriptions) * 100.0

    @staticmethod
    def determine_trend_direction(delta_percentage: float) -> str:
        """Returns standard 'up', 'down', 'flat' identifiers for the UI."""
        if delta_percentage > 0:
            return "up"
        elif delta_percentage < 0:
            return "down"
        return "flat"

kpi_engine = KPIEngine()
