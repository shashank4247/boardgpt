from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from models import DecisionRequest, ConsensusResponse
from agents import run_board_meeting
from logic import aggregate_verdicts, load_history, get_cached_analysis
from typing import List

app = FastAPI(title="BoardGPT API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "BoardGPT Backend is running"}

@app.post("/analyze", response_model=ConsensusResponse)
async def analyze_decision(request: DecisionRequest):
    try:
        # Check Cache first
        cached = get_cached_analysis(request.text, request.mode)
        if cached:
            print(f"Returning cached result for: {request.text[:50]}...")
            return cached

        # Run the multi-agent board meeting if not cached
        agent_analyses = await run_board_meeting(request.text, request.mode)
        
        # Aggregate the results and save to history
        consensus = aggregate_verdicts(agent_analyses, request.text, request.mode)
        
        return consensus
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/history", response_model=List[dict])
async def get_history():
    return load_history()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
