from typing import Dict, Any, List
from app.ai.schemas.business_decision import (
    BusinessRuleEvaluationDTO,
    DecisionClassificationDTO,
    DecisionOverrideDTO
)

class BusinessRuleEngine:
    """
    Enterprise Business Decision & Override Rule Engine.
    Applies governance rules, threshold logic, and automated vs CSM action routing.
    """

    def evaluate_rules(self, churn_prob: float, risk_tier: str, payment_failures: int) -> BusinessRuleEvaluationDTO:
        applied_rules = ["RULE_CHURN_THRESHOLD_CHECK", "RULE_PAYMENT_FAILURE_CHECK"]

        # Decision classification
        if churn_prob >= 0.85 or payment_failures >= 2:
            decision_type = "EXECUTIVE_REVIEW"
            applied_rules.append("RULE_EXECUTIVE_ESCALATION_TRIGGER")
        elif churn_prob >= 0.70 or risk_tier == "Critical":
            decision_type = "AUTOMATED_INTERVENTION"
            applied_rules.append("RULE_CRITICAL_AUTO_INTERVENTION")
        elif churn_prob >= 0.40 or risk_tier == "High":
            decision_type = "CSM_ALERT"
            applied_rules.append("RULE_CSM_TASK_ROUTING")
        else:
            decision_type = "NO_ACTION"

        # Check override conditions (e.g. recent payment failure overrides low engagement)
        is_overridden = payment_failures > 0 and churn_prob < 0.50
        override_dto = DecisionOverrideDTO(
            is_overridden=is_overridden,
            override_rule_name="OVERRIDE_INVOLUNTARY_BILLING_PRIORITY" if is_overridden else None,
            override_reason="Payment authorization failure detected; forcing automated billing retry intervention." if is_overridden else None
        )

        return BusinessRuleEvaluationDTO(
            rules_applied=applied_rules,
            classification=DecisionClassificationDTO(
                decision_type=decision_type,
                risk_level=risk_tier
            ),
            override=override_dto,
            final_action_approved=True
        )

business_rule_engine = BusinessRuleEngine()
