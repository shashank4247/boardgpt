import os
import asyncio
import json
import google.generativeai as genai
from groq import Groq
from mistralai import Mistral
from dotenv import load_dotenv
from models import AgentResponse, NewsGPTResponse
from pathlib import Path

env_path = Path(__file__).parent / '.env'
load_dotenv(dotenv_path=env_path)

# API Configuration
GEMINI_KEY = os.getenv("GEMINI_API_KEY")
GROQ_KEY = os.getenv("GROQ_API_KEY")
MISTRAL_KEY = os.getenv("MISTRAL_API_KEY")

if GEMINI_KEY:
    genai.configure(api_key=GEMINI_KEY)

# Initialize clients only if key is valid (not placeholder)
def is_valid_key(key):
    return key and key.strip() and "YOUR_" not in key

groq_client = Groq(api_key=GROQ_KEY) if is_valid_key(GROQ_KEY) else None
mistral_client = Mistral(api_key=MISTRAL_KEY) if is_valid_key(MISTRAL_KEY) else None

# Role to Model Mapping (Updated for 2026 availability)
# Role to Model Mapping (Updated for 2026 availability)
AGENT_CONFIGS = {
    "Finance": {"provider": "gemini", "model": "gemini-2.0-flash"},
    "Risk": {"provider": "groq", "model": "llama-3.3-70b-versatile"},
    "Strategy": {"provider": "groq", "model": "llama-3.3-70b-versatile"}, # Switched due to Mistral 401
    "Ethics": {"provider": "groq", "model": "llama-3.1-8b-instant"},
    "Operations": {"provider": "gemini", "model": "gemini-2.0-flash-lite-001"} # Switched to valid Lite model
}

# Robust Fallback Configuration
FALLBACK_CONFIGS = {
    "Strategy": {"provider": "mistral", "model": "mistral-large-latest"}, # Mistral as fallback
    "Risk": {"provider": "gemini", "model": "gemini-2.0-flash"},
    "Ethics": {"provider": "gemini", "model": "gemini-2.0-flash"},
    "Finance": {"provider": "groq", "model": "llama-3.1-8b-instant"},
    "Operations": {"provider": "groq", "model": "llama-3.3-70b-versatile"}
}

# System Prompts
AGENT_PROMPTS = {
    "Finance": """You are the Chief Financial Officer (CFO). 
    Analyze the business decision from a strictly financial perspective.
    Consider ROI, cash flow, budget impact, and long-term financial viability.
    Your output must be a valid JSON object with the following keys:
    "verdict": "Approve", "Reject", or "Conditional"
    "confidence": integer (0-100)
    "reasoning": a paragraph explaining your financial analysis
    "assumptions": a list of financial assumptions made.""",

    "Risk": """You are the Chief Risk Officer (CRO). 
    Analyze the business decision from a risk and compliance perspective.
    Consider market risks, legal risks, operational risks, and potential pitfalls.
    Your output must be a valid JSON object with the following keys:
    "verdict": "Approve", "Reject", or "Conditional"
    "confidence": integer (0-100)
    "reasoning": a paragraph explaining your risk assessment
    "assumptions": a list of risks and assumptions identified.""",

    "Strategy": """You are the Chief Strategy Officer (CSO). 
    Analyze the business decision from a strategic growth and competitive advantage perspective.
    Consider market positioning, scalability, and alignment with corporate goals.
    Your output must be a valid JSON object with the following keys:
    "verdict": "Approve", "Reject", or "Conditional"
    "confidence": integer (0-100)
    "reasoning": a paragraph explaining your strategic reasoning
    "assumptions": a list of strategic assumptions made.""",

    "Ethics": """You are the Ethics and Governance Officer. 
    Analyze the business decision from an ESG (Environmental, Social, Governance), ethical, and brand reputation perspective.
    Consider social impact, environmental sustainability, and ethical trade-offs.
    Your output must be a valid JSON object with the following keys:
    "verdict": "Approve", "Reject", or "Conditional"
    "confidence": integer (0-100)
    "reasoning": a paragraph explaining your ethical analysis
    "assumptions": a list of ethical assumptions made.""",

    "Operations": """You are the Chief Operating Officer (COO). 
    Analyze the business decision from an execution and operational efficiency perspective.
    Consider resource allocation, supply chain, logistics, and internal processes.
    Your output must be a valid JSON object with the following keys:
    "verdict": "Approve", "Reject", or "Conditional"
    "confidence": integer (0-100)
    "reasoning": a paragraph explaining your operational analysis
    "assumptions": a list of operational assumptions made."""
}

# Startup-Specific Prompts
STARTUP_PROMPTS = {
    "Finance": """You are the Chief Financial Officer (CFO) of a fast-growing startup.
    Analyze the business decision with a focus on runway, burn rate, short-term cash sustainability, and funding dependency.
    Prioritize survival and scalability over long-term enterprise ROI.
    Your output must be a valid JSON object with the following keys:
    "verdict": "Approve", "Reject", or "Conditional"
    "confidence": integer (0-100)
    "reasoning": a paragraph explaining your startup financial analysis
    "assumptions": a list of financial assumptions made.""",

    "Risk": """You are the Chief Risk Officer (CRO) of a startup.
    Analyze the business decision emphasizing existential risk, market uncertainty, single-point failures, and founder dependency.
    Consider the high-risk nature of startup environments.
    Your output must be a valid JSON object with the following keys:
    "verdict": "Approve", "Reject", or "Conditional"
    "confidence": integer (0-100)
    "reasoning": a paragraph explaining your startup risk assessment
    "assumptions": a list of risks and assumptions identified.""",

    "Strategy": """You are the Chief Strategy Officer (CSO) of a startup.
    Evaluate the decision based on product-market fit, competitive differentiation, pivot readiness, and growth leverage.
    Prioritize speed and adaptability.
    Your output must be a valid JSON object with the following keys:
    "verdict": "Approve", "Reject", or "Conditional"
    "confidence": integer (0-100)
    "reasoning": a paragraph explaining your startup strategic reasoning
    "assumptions": a list of strategic assumptions made.""",

    "Ethics": """You are the Ethics and Governance Officer for a startup.
    Assess founder-investor fairness, employee impact in small teams, and responsible scaling.
    Consider the ethical implications of "moving fast and breaking things."
    Your output must be a valid JSON object with the following keys:
    "verdict": "Approve", "Reject", or "Conditional"
    "confidence": integer (0-100)
    "reasoning": a paragraph explaining your startup ethical analysis
    "assumptions": a list of ethical assumptions made.""",

    "Operations": """You are the Chief Operating Officer (COO) of a startup.
    Focus on execution speed, team bandwidth, operational simplicity, and severe resource constraints.
    Prioritize agility and "doing more with less."
    Your output must be a valid JSON object with the following keys:
    "verdict": "Approve", "Reject", or "Conditional"
    "confidence": integer (0-100)
    "reasoning": a paragraph explaining your startup operational analysis
    "assumptions": a list of operational assumptions made."""
}

NEWS_GPT_PROMPT = """You are NewsGPT, an AI designed to find historical/real-world news context.
The board has analyzed a business decision: {decision_text}
Their Consensus Verdict was: {verdict}

If the verdict is Approve or Conditional, your task is to retrieve or generate realistic, historical news articles where similar decisions succeeded or were successfully implemented.
If the verdict is Reject, find real-world cases/news where similar decisions failed or led to negative consequences.

Your output must be a valid JSON object matching this exact schema:
{{
  "articles": [
    {{
      "headline": "...",
      "summary": "...",
      "source": "...",
      "date": "..."
    }}
  ],
  "explanation": "A paragraph explaining how these real-world events relate to the board's decision."
}}
Return ONLY valid JSON. Return exactly 3 to 4 articles."""


async def retry_with_backoff(func, *args, retries=3, delay=2):
    """Retries an async function if a rate limit (429) occurs."""
    for attempt in range(retries):
        try:
            return await func(*args)
        except Exception as e:
            error_str = str(e).lower()
            # Check for common 429/quota indicators
            if "429" in error_str or "quota" in error_str or "exhausted" in error_str:
                if attempt < retries - 1:
                    wait_time = delay * (2 ** attempt)  # Exponential backoff: 2s, 4s, 8s
                    print(f"Rate limit hit. Retrying in {wait_time}s... (Attempt {attempt + 1}/{retries})")
                    await asyncio.sleep(wait_time)
                    continue
            raise e

async def call_gemini(model_name: str, prompt: str):
    if not GEMINI_KEY: raise ValueError("Gemini API Key missing")
    # Prepend models/ if not present
    full_model_name = f"models/{model_name}" if not model_name.startswith("models/") else model_name
    model = genai.GenerativeModel(full_model_name)
    loop = asyncio.get_event_loop()
    
    async def _generate():
        response = await loop.run_in_executor(None, lambda: model.generate_content(
            prompt, 
            generation_config={
                "response_mime_type": "application/json",
                "temperature": 0
            }
        ))
        return json.loads(response.text)

    return await retry_with_backoff(_generate)

async def call_groq(model_name: str, prompt: str):
    if not groq_client: raise ValueError("Groq API Key missing or using placeholder")
    loop = asyncio.get_event_loop()
    
    async def _generate():
        response = await loop.run_in_executor(None, lambda: groq_client.chat.completions.create(
            model=model_name,
            messages=[{"role": "user", "content": prompt + "\nReturn ONLY valid JSON."}],
            response_format={"type": "json_object"},
            temperature=0
        ))
        return json.loads(response.choices[0].message.content)

    return await retry_with_backoff(_generate)

async def call_mistral(model_name: str, prompt: str):
    if not mistral_client: raise ValueError("Mistral API Key missing or using placeholder")
    
    async def _generate():
        response = await asyncio.get_event_loop().run_in_executor(None, lambda: mistral_client.chat.complete(
            model=model_name,
            messages=[{"role": "user", "content": prompt + "\nBy returning ONLY valid JSON following the schema."}],
            response_format={"type": "json_object"},
            temperature=0
        ))
        return json.loads(response.choices[0].message.content)

    return await retry_with_backoff(_generate)

async def get_agent_analysis(role: str, decision_text: str, mode: str = "enterprise") -> AgentResponse:
    config = AGENT_CONFIGS[role]
    
    # Select prompt based on mode
    base_prompts = STARTUP_PROMPTS if mode == "startup" else AGENT_PROMPTS
    prompt = f"Role Context: {base_prompts[role]}\n\nDecision to Analyze: {decision_text}"
    
    async def try_execute(cfg):
        if cfg["provider"] == "gemini":
            return await call_gemini(cfg["model"], prompt)
        elif cfg["provider"] == "groq":
            return await call_groq(cfg["model"], prompt)
        elif cfg["provider"] == "mistral":
            return await call_mistral(cfg["model"], prompt)
        raise ValueError(f"Unknown provider: {cfg['provider']}")

    try:
        # Try Primary
        data = await try_execute(config)
    except Exception as e:
        print(f"Primary {role} ({config['provider']}-{config['model']}) failed: {e}. Trying fallback...")
        try:
            # Try Fallback
            fallback = FALLBACK_CONFIGS[role]
            data = await try_execute(fallback)
        except Exception as fe:
            print(f"Fallback {role} failed: {fe}")
            return AgentResponse(
                agent_role=role,
                verdict="Reject",
                confidence=0,
                reasoning=f"Critical Error: {str(e)}",
                assumptions=["AI Provider services are currently unavailable"]
            )

    # Normalize assumptions (LLMs sometimes return objects instead of strings)
    raw_assumptions = data.get("assumptions", [])
    normalized_assumptions = []
    for asm in raw_assumptions:
        if isinstance(asm, dict):
            # Extract text if LLM returned an object like {"assumption": "...", "probability": 70}
            text = asm.get("assumption") or asm.get("text") or str(asm)
            normalized_assumptions.append(text)
        else:
            normalized_assumptions.append(str(asm))

    return AgentResponse(
        agent_role=role,
        verdict=data.get("verdict", "Reject"),
        confidence=data.get("confidence", 0),
        reasoning=data.get("reasoning", "No reasoning provided."),
        assumptions=normalized_assumptions
    )

async def generate_news(decision_text: str, verdict: str, mode: str = "enterprise") -> dict:
    prompt = NEWS_GPT_PROMPT.format(decision_text=decision_text, verdict=verdict)
    
    # Try Gemini first
    try:
        data = await call_gemini("gemini-2.0-flash", prompt)
        if "articles" in data and "explanation" in data:
            return data
    except Exception as e:
        print(f"NewsGPT (Gemini) failed: {e}. Trying fallback to Groq...")
    
    # Try Groq as Fallback
    try:
        data = await call_groq("llama-3.3-70b-versatile", prompt)
        if "articles" in data and "explanation" in data:
            return data
    except Exception as e:
        print(f"NewsGPT (Groq) failed: {e}. Trying fallback to Mistral...")
        
    # Try Mistral as second fallback
    try:
        data = await call_mistral("mistral-large-latest", prompt)
        if "articles" in data and "explanation" in data:
            return data
    except Exception as e:
        print(f"NewsGPT (Mistral) failed: {e}")
        
    # Final fallback empty response
    return {
        "articles": [],
        "explanation": "Could not connect to AI providers to fetch relevant news."
    }

async def run_board_meeting(decision_text: str, mode: str = "enterprise"):
    tasks = [get_agent_analysis(role, decision_text, mode) for role in AGENT_PROMPTS.keys()]
    results = await asyncio.gather(*tasks)
    return results
