from flask import Flask, request, jsonify,render_template
import os
import requests

app = Flask(__name__)

API_KEY = os.getenv("PLANTNET_API_KEY")
if not API_KEY:
    raise ValueError("API Key not found. Set PLANTNET_API_KEY as an environment variable.")
PROJECT = "all"
API_ENDPOINT = f"https://my-api.plantnet.org/v2/identify/{PROJECT}?api-key={API_KEY}"

@app.route('/')
def home():
    return render_template('test.html') 

@app.route('/identify-plant', methods=['POST'])
def identify_plant():
    if 'images' not in request.files:
        return jsonify({'error': 'No image provided'}), 400

    images = request.files.getlist('images')
    organs = request.form.getlist('organs')

    if not organs or len(organs) != len(images):
        return jsonify({'error': 'Organ types are missing or mismatched'}), 400

    files = [('images', (img.filename, img.stream, img.mimetype)) for img in images]
    data = {'organs': organs}

    try:
        response = requests.post(API_ENDPOINT, files=files, data=data)
        response.raise_for_status()
        json_result = response.json()

        # Extract scientific and common names
        best_match = json_result.get("results", [])
        if best_match and "species" in best_match[0]:
            species = best_match[0]["species"]
            scientific_name = species.get("scientificName", "Unknown")
            common_names = species.get("commonNames", [])
            return jsonify({
                "scientificName": scientific_name,
                "commonNames": common_names
            })
        else:
            return jsonify({"scientificName": "Unknown", "commonNames": []})

    except requests.exceptions.RequestException as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
