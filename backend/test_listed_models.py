import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()
api_key = os.getenv("GEMINI_API_KEY")
genai.configure(api_key=api_key)

# Models that were listed in verify_model_name.py
listed_models = [
    "gemini-flash-latest",
    "gemini-2.0-flash",
    "gemini-2.5-flash",
    "gemini-pro-latest"
]

with open("listed_model_tests.txt", "w", encoding="utf-8") as out:
    for name in listed_models:
        out.write(f"\nTesting: '{name}'\n")
        try:
            model = genai.GenerativeModel(name)
            response = model.generate_content("Say hi")
            out.write(f"SUCCESS with '{name}': {response.text[:20]}...\n")
        except Exception as e:
            out.write(f"FAILED with '{name}': {e}\n")

print("Test complete. Results in listed_model_tests.txt")
