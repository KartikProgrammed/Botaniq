import os
import json
from flask import Flask, request, jsonify
import re

app = Flask(__name__)

@app.route("/", methods=["GET"])
def home():
    return "Botaniq webhook is live!"

def get_plant_key(parameters):
    plant_param = parameters.get("plant")
    if isinstance(plant_param, list) and plant_param:
        plant = plant_param[0]
    elif isinstance(plant_param, str):
        plant = plant_param
    else:
        plant = "your plant"
    return re.sub(r"\s+", " ", plant.lower().strip()), plant

def load_plant_data():
    script_dir = os.path.dirname(os.path.abspath(__file__))
    file_path = os.path.join(script_dir, "plant_data.json")
    with open(file_path, "r") as f:
        return json.load(f), file_path

@app.route("/api/webhook", methods=["POST"])
def webhook():
    req = request.get_json()
    intent = req["queryResult"]["intent"]["displayName"]
    parameters = req["queryResult"].get("parameters", {})

    plant_key, original_plant = get_plant_key(parameters)

    try:
        plant_care_data, file_path = load_plant_data()
        care_info = plant_care_data.get(plant_key)

        if intent == "PlantCareIntent":
            if care_info:
                response_text = f"Here's some care advice for your {original_plant}:\n"
                for key in ["light", "water", "soil"]:
                    if key in care_info:
                        response_text += f"- {key.capitalize()}: {care_info[key]}\n"
            else:
                response_text = f"Sorry, I don't have specific care information for {original_plant} right now."

        elif intent == "vastuShastra":
            if care_info:
                response_text = f"Here's some Vastu insight for your {original_plant}:\n"
                if "vastu" in care_info:
                    response_text += f"{care_info['vastu']}"
                else:
                    response_text += "I don't have specific Vastu info, but you can refer to general Vastu guidelines for plant placement."
            else:
                response_text = f"Sorry, I don't have vastu-specific information for {original_plant} right now."

        elif intent == "fertilizerNeeds":
            if care_info:
                response_text = f"Here's some fertilizer advice for your {original_plant}:\n"
                if "fertilizer" in care_info:
                    response_text += care_info["fertilizer"]
                else:
                    response_text += "General advice: Use a balanced fertilizer during the growing season. Check specific requirements for your plant."
            else:
                response_text = f"Sorry, I don't have fertilizer information for {original_plant} right now."

        elif intent == "weatherReq":
            if care_info:
                response_text = f"Here's some weather-related care advice for your {original_plant}:\n"
                if "suitable_weather" in care_info:
                    response_text += care_info["suitable_weather"]
                else:
                    response_text += "Most indoor plants thrive in 18-24°C and moderate humidity. Conditions can vary depending on plant type."
            else:
                response_text = f"Sorry, I don't have weather-specific information for {original_plant} right now."

        else:
            response_text = "I'm still learning how to help with that!"

    except FileNotFoundError:
        response_text = f"Error: Plant care data file not found."
    except json.JSONDecodeError:
        response_text = "Error: Could not decode plant care data."
    except Exception as e:
        response_text = f"An unexpected error occurred: {e}"

    return jsonify({"fulfillmentText": response_text})

if __name__ == "__main__":
    app.run(debug=True)
