from pydantic import BaseModel, Field
from typing import List, Optional

class DecisionRequest(BaseModel):
    text: str = Field(..., min_length=10, description="The strategic business decision to analyze")
    mode: str = Field("enterprise", description="The decision-making mode (enterprise or startup)")

class AgentResponse(BaseModel):
    agent_role: str
    verdict: str  # Approve, Reject, Conditional
    confidence: int = Field(..., ge=0, le=100)
    reasoning: str
    assumptions: List[str]

class ConsensusResponse(BaseModel):
    decision_text: str
    final_verdict: str
    average_confidence: int
    agent_analyses: List[AgentResponse]
    explanation: str
    mode: str = "enterprise"
    timestamp: Optional[str] = None
