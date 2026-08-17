from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional

class DecisionClassificationDTO(BaseModel):
    decision_type: str = Field(..., description="AUTOMATED_INTERVENTION, CSM_ALERT, EXECUTIVE_REVIEW, NO_ACTION")
    risk_level: str

class DecisionOverrideDTO(BaseModel):
    is_overridden: bool = False
    override_rule_name: Optional[str] = None
    override_reason: Optional[str] = None

class BusinessRuleEvaluationDTO(BaseModel):
    rules_applied: List[str]
    classification: DecisionClassificationDTO
    override: DecisionOverrideDTO
    final_action_approved: bool = True
