from typing import List
from models import AgentResponse, ConsensusResponse
from datetime import datetime
import json
import os

HISTORY_FILE = "decision_history.json"

def aggregate_verdicts(analyses: List[AgentResponse], decision_text: str, mode: str = "enterprise") -> ConsensusResponse:
    verdicts = [a.verdict for a in analyses]
    
    # Calculate majority
    approve_count = verdicts.count("Approve")
    reject_count = verdicts.count("Reject")
    conditional_count = verdicts.count("Conditional")
    
    # Simple majority logic (requires strict majority over both other categories)
    if approve_count > reject_count and approve_count > conditional_count:
        final_verdict = "Approve"
    elif reject_count > approve_count and reject_count > conditional_count:
        final_verdict = "Reject"
    else:
        final_verdict = "Conditional"
        
    avg_confidence = int(sum(a.confidence for a in analyses) / len(analyses))
    
    # Generate an automated explanation of the consensus
    agreement = "High" if max(approve_count, reject_count, conditional_count) >= 4 else "Moderate"
    if max(approve_count, reject_count, conditional_count) <= 2:
        agreement = "Low (Deeply Contested)"
        
    explanation = f"Board consensus is {final_verdict} with {agreement} agreement. "
    explanation += f"Approvals: {approve_count}, Rejections: {reject_count}, Conditionals: {conditional_count}."

    consensus = ConsensusResponse(
        decision_text=decision_text,
        final_verdict=final_verdict,
        average_confidence=avg_confidence,
        agent_analyses=analyses,
        explanation=explanation,
        mode=mode,
        timestamp=datetime.now().isoformat()
    )
    
    save_to_history(consensus)
    return consensus

def save_to_history(decision: ConsensusResponse):
    history = load_history()
    history.append(decision.dict())
    
    try:
        with open(HISTORY_FILE, "w") as f:
            json.dump(history[-20:], f, indent=2) # Keep last 20 entries
    except Exception as e:
        print(f"Error saving history: {e}")

def load_history() -> List[dict]:
    if not os.path.exists(HISTORY_FILE):
        return []
    try:
        with open(HISTORY_FILE, "r") as f:
            return json.load(f)
    except:
        return []

def get_cached_analysis(decision_text: str, mode: str) -> dict:
    history = load_history()
    search_text = decision_text.strip().lower()
    for entry in history:
        if entry.get("decision_text", "").strip().lower() == search_text and entry.get("mode", "enterprise") == mode:
            return entry
    return None
