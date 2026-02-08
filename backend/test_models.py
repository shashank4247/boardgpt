import google.generativeai as genai
import os
import json
from dotenv import load_dotenv

load_dotenv()
api_key = os.getenv("GEMINI_API_KEY")
genai.configure(api_key=api_key)

test_models = ["gemini-1.5-flash", "gemini-1.5-flash-latest", "gemini-1.5-flash-001"]

for model_name in test_models:
    print(f"Testing model: {model_name}")
    try:
        model = genai.GenerativeModel(model_name)
        response = model.generate_content("Hello")
        print(f"Success with {model_name}")
        break
    except Exception as e:
        print(f"Failed with {model_name}: {e}")
