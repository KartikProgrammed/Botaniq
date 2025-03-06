import os
import requests
import json
from pprint import pprint

API_KEY = os.getenv("PLANTNET_API_KEY")
if not API_KEY:
    raise ValueError("API Key not found. Set PLANTNET_API_KEY as an environment variable.")
PROJECT = "all"  # Try specific floras: "weurope", "canada"...
API_ENDPOINT = f"https://my-api.plantnet.org/v2/identify/{PROJECT}?api-key={API_KEY}"

# List of images to process
image_paths = []
organs = []

while True:
    img_name = input("Enter image filename (or type 'done' to finish): ")
    if img_name.lower() == 'done':
        break
    
    organ_type = input("Enter the type of organ in the image (flower, leaf, etc.): ")
    image_paths.append(img_name)
    organs.append(organ_type)

data = {'organs': organs}

# Open images safely using context managers
files = [('images', (img_path, open(img_path, 'rb'))) for img_path in image_paths]

try:
    response = requests.post(API_ENDPOINT, files=files, data=data)
    response.raise_for_status()  # Raises an error for bad responses (4xx, 5xx)
    
    json_result = response.json()
    
    best_match = json_result.get('bestMatch', 'Unknown')
    print(f"Identified Flower: {best_match}")
    pprint(response.status_code)
    #pprint(json_result)
    
except requests.exceptions.RequestException as e:
    print("Error occurred:", e)

finally:
    # Ensure files are closed after the request
    for _, (_, file) in files:
        file.close()
