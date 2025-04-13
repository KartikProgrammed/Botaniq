# botaniq_flask.py
from flask import Flask, request, jsonify
from google.cloud import dialogflow_v2 as dialogflow
import os

os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "botaniq-hb9t-6e09749492e3.json"

app = Flask(__name__)
project_id = "botaniq-hb9t"

@app.route('/chat', methods=['POST'])
def chat():
    data = request.get_json()
    message = data.get("message")
    session_id = data.get("session_id", "12345")

    session_client = dialogflow.SessionsClient()
    session = session_client.session_path(project_id, session_id)

    text_input = dialogflow.TextInput(text=message, language_code="en")
    query_input = dialogflow.QueryInput(text=text_input)

    response = session_client.detect_intent(request={"session": session, "query_input": query_input})
    result = {
        "query": response.query_result.query_text,
        "intent": response.query_result.intent.display_name,
        "response": response.query_result.fulfillment_text
    }
    return jsonify(result)

if __name__ == "__main__":
    app.run(debug=True)
