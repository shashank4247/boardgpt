from fastapi import FastAPI, HTTPException, Form, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from models import DecisionRequest, ConsensusResponse
from agents import run_board_meeting, generate_news
from logic import aggregate_verdicts, load_history, get_cached_analysis
from typing import List, Optional

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
async def analyze_decision(
    text: str = Form(..., min_length=10, description="The strategic business decision to analyze"),
    mode: str = Form("enterprise", description="The decision-making mode (enterprise or startup)"),
    file: Optional[UploadFile] = File(None)
):
    try:
        decision_text = text
        if file:
            content = await file.read()
            try:
                # Try decoding as utf-8
                file_content = content.decode("utf-8")
                decision_text += f"\n\n[Attached File Content: {file.filename}]:\n{file_content}"
            except UnicodeDecodeError:
                print(f"Failed to decode file {file.filename}")
                # If not text, maybe skip or just note it linked? 
                # For now, just append a note that file was attached but couldn't be read as text
                decision_text += f"\n\n[Attached File: {file.filename}] (Binary content not processed)"
        
        # Check Cache first
        # We use the combined text for cache key, which is good.
        cached = get_cached_analysis(decision_text, mode)
        if cached:
            print(f"Returning cached result for: {decision_text[:50]}...")
            return cached

        # Run the multi-agent board meeting if not cached
        agent_analyses = await run_board_meeting(decision_text, mode)
        
        # Aggregate the results and save to history
        consensus = aggregate_verdicts(agent_analyses, decision_text, mode)
        
        # Generate News articles based on verdict
        news_data = await generate_news(decision_text, consensus.final_verdict, mode)
        consensus.news = news_data
        
        return consensus
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/history", response_model=List[dict])
async def get_history():
    return load_history()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
