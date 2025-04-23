import os
from flask import Flask, request, jsonify
import json

app = Flask(__name__)

@app.route("/", methods=["GET"])
def home():
    return "Botaniq webhook is live!"

@app.route("/api/webhook", methods=["POST"])
def webhook():
    req = request.get_json()
    intent = req["queryResult"]["intent"]["displayName"]
    parameters = req["queryResult"].get("parameters", {})

    if intent == "PlantCareIntent":
        plant_list = parameters.get("plant")
        if plant_list and isinstance(plant_list, list) and plant_list:
            plant = plant_list[0]
        else:
            plant = "your plant"  # Default value if 'plant' is missing or empty
        plant_lower = plant.lower()

        try:
            # Construct the path relative to the script's directory
            script_dir = os.path.dirname(os.path.abspath(__file__))
            file_path = os.path.join(script_dir, "plant_data.json")

            with open(file_path, "r") as f:
                plant_care_data = json.load(f)

            if plant_lower in plant_care_data:
                care_info = plant_care_data[plant_lower]
                response_text = f"Here's some care advice for your {plant}:\n"
                for key, value in care_info.items():
                    if key != "vastu":
                        response_text += f"- {key.capitalize()}: {value}\n"
                if "vastu" in care_info:
                    response_text += f"\nRegarding Vastu, for a {plant}: {care_info['vastu']}"
                else:
                    response_text += "\nAccording to Vastu principles, the placement and care of plants can influence the energy in your home. You might want to research specific Vastu guidelines for optimal placement of your plant."
            else:
                response_text = f"Sorry, I don't have specific care information for {plant} right now. General care usually involves providing appropriate light and watering when the topsoil is dry. You might also want to research Vastu principles related to this plant."

        except FileNotFoundError:
            response_text = f"Error: Plant care data file not found at path: {file_path}"
        except json.JSONDecodeError:
            response_text = "Error: Could not decode plant care data."
        except Exception as e:
            response_text = f"An unexpected error occurred: {e}"

    else:
        response_text = "I'm still learning how to help with that!"

    return jsonify({"fulfillmentText": response_text})

if __name__ == "__main__":
    app.run(debug=True)