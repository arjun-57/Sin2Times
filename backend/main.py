from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai
import os
from dotenv import load_dotenv

# Load .env variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# Secure your Gemini API Key
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY")

if not GEMINI_API_KEY:
    raise EnvironmentError("GEMINI_API_KEY not set in environment or .env file")

# Configure the Gemini client
genai.configure(api_key=GEMINI_API_KEY)

# Initialize the model (use gemini-1.5-flash if needed)
model = genai.GenerativeModel('gemini-2.0-flash')

@app.route('/query', methods=['POST'])
def query_gemini():
    data = request.get_json()
    query = data.get('query', '').strip()

    if not query:
        return jsonify({'error': 'No query provided'}), 400

    try:
        prompt = f"""
        Generate a mind map for this topic as JSON with 'nodes' and 'edges', example format:
        {{
          "nodes": [
            {{"id": "1", "title": "Root node", "category": "root"}},
            {{"id": "2", "title": "Child node", "category": "child"}}
          ],
          "edges": [
            {{"id": "e1-2", "source": "1", "target": "2"}}
          ]
        }}
        Topic: {query}
        Provide only valid JSON without any explanation.
        """

        response = model.generate_content(prompt)
        return jsonify({'response': response.text})

    except Exception as e:
        print("❌ Error occurred:", e)  # Debug print
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
