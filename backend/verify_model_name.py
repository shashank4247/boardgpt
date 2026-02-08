import google.generativeai as genai
import os
import json
from dotenv import load_dotenv

load_dotenv()
api_key = os.getenv("GEMINI_API_KEY")
genai.configure(api_key=api_key)

with open("verification_results_utf8.txt", "w", encoding="utf-8") as out:
    out.write("Listing all models...\n")
    try:
        models = list(genai.list_models())
        for m in models:
            out.write(f"- {m.name}\n")
    except Exception as e:
        out.write(f"Error listing models: {e}\n")

    test_names = ["gemini-1.5-flash", "models/gemini-1.5-flash", "gemini-1.5-flash-latest", "gemini-pro"]

    for name in test_names:
        out.write(f"\nTesting: '{name}'\n")
        try:
            model = genai.GenerativeModel(name)
            response = model.generate_content("Say hi")
            out.write(f"SUCCESS with '{name}': {response.text[:20]}...\n")
        except Exception as e:
            out.write(f"FAILED with '{name}': {e}\n")

print("Verification complete. Results in verification_results_utf8.txt")
