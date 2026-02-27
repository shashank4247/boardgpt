from pathlib import Path
from dotenv import load_dotenv
import os

# Mimic the loading logic in agents.py
env_path = Path(__file__).parent / '.env'
print(f"Loading .env from: {env_path}")
load_dotenv(dotenv_path=env_path)

# Check keys
gemini = os.getenv("GEMINI_API_KEY")
groq = os.getenv("GROQ_API_KEY")
mistral = os.getenv("MISTRAL_API_KEY")

print(f"GEMINI_API_KEY found: {'Yes' if gemini else 'No'}")
print(f"GROQ_API_KEY found: {'Yes' if groq else 'No'}")
print(f"MISTRAL_API_KEY found: {'Yes' if mistral else 'No'}")

if gemini and groq and mistral:
    print("SUCCESS: All keys loaded.")
else:
    print("FAILURE: Some keys are missing.")
