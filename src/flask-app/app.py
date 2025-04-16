from flask import Flask, request, jsonify
from flask_cors import CORS
import json

app = Flask(__name__)
CORS(app, origins="http://localhost:5000")

@app.route('/api/gemini', methods=['POST'])
def gemini():
    if request.method == 'POST':
        user_message = request.json.get("user_message")
        return user_message
