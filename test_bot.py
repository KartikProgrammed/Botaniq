import os
from google.cloud import dialogflow_v2 as dialogflow

# Set path to your service account key
os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "botaniq-chatbot-0f6d509d6dd3.json"

project_id = "botaniq-chatbot"  # Your GCP project ID
session_id = "1234567"           # Any unique ID per user session
language_code = "en"

def detect_intent_text(text):
    session_client = dialogflow.SessionsClient()
    session = session_client.session_path(project_id, session_id)

    text_input = dialogflow.TextInput(text=text, language_code=language_code)
    query_input = dialogflow.QueryInput(text=text_input)

    response = session_client.detect_intent(request={"session": session, "query_input": query_input})

    print("Query text:", response.query_result.query_text)
    print("Detected intent:", response.query_result.intent.display_name)
    print("Response:", response.query_result.fulfillment_text)

# 🔁 Run a test query
detect_intent_text("Hello")
