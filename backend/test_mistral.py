import os
import asyncio
from mistralai import Mistral
from dotenv import load_dotenv
from pathlib import Path

env_path = Path(__file__).parent / '.env'
load_dotenv(dotenv_path=env_path)

api_key = os.getenv("MISTRAL_API_KEY")
print(f"Mistral Key present: {bool(api_key)}")

async def test_mistral():
    try:
        client = Mistral(api_key=api_key)
        # Simple test request
        response = await asyncio.to_thread(lambda: client.chat.complete(
            model="mistral-large-latest",
            messages=[{"role": "user", "content": "Hello, valid JSON please: {}"}]
        ))
        print("Mistral Test Success!")
        print(response.choices[0].message.content)
    except Exception as e:
        print(f"Mistral Test Failed: {e}")

if __name__ == "__main__":
    asyncio.run(test_mistral())
