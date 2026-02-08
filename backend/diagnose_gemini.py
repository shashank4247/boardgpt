import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()
api_key = os.getenv("GEMINI_API_KEY")
genai.configure(api_key=api_key)

print("Listing models directly...")
models = list(genai.list_models())
if not models:
    print("No models found!")
else:
    for m in models:
        print(f"Name: {m.name}, Methods: {m.supported_generation_methods}")
    
    # Try the first one that supports generateContent
    target = next((m.name for m in models if 'generateContent' in m.supported_generation_methods), None)
    if target:
        print(f"Attempting to use: {target}")
        try:
            model = genai.GenerativeModel(target)
            resp = model.generate_content("test")
            print(f"Success! Response: {resp.text}")
        except Exception as e:
            print(f"Failed with {target}: {e}")
