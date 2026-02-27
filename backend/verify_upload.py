
import requests
import time
import os

# Create a dummy file
with open("test_upload.txt", "w") as f:
    f.write("This is a test file content for BoardGPT decision analysis.")

try:
    # Wait for server to start
    time.sleep(5)
    
    url = "http://localhost:8000/analyze"
    
    # Test case 1: Text + File
    files = {
        'file': ('test_upload.txt', open('test_upload.txt', 'rb'), 'text/plain')
    }
    data = {
        'text': 'Should we integrate this attached document into our strategy?',
        'mode': 'startup'
    }
    
    print("Sending request with file...")
    response = requests.post(url, data=data, files=files)
    
    print(f"Status Code: {response.status_code}")
    if response.status_code == 200:
        print("Success! Response:")
        print(response.json())
        # Check if response reflects file content awareness (hard to verify without LLM output check, but 200 is good enough for connectivity)
    else:
        print("Failed!")
        print(response.text)

    # Test case 2: Text only (Regression)
    print("\nSending request without file (Regression Test)...")
    # Note: Using data=data relies on backend handling Form data correctly even without file
    response_reg = requests.post(url, data=data) 
    # requests.post(url, data=data) sends x-www-form-urlencoded or multipart/form-data depending on files arg?
    # If files is not present, requests sends application/x-www-form-urlencoded by default for data dict.
    # FastAPI Form handle both.
    
    print(f"Status Code: {response_reg.status_code}")
    if response_reg.status_code == 200:
        print("Success! Response:")
        # print(response_reg.json())
    else:
        print("Failed!")
        print(response_reg.text)

except Exception as e:
    print(f"Error: {e}")

finally:
    if os.path.exists("test_upload.txt"):
        os.remove("test_upload.txt")
