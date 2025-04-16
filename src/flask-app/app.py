from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app, origins="http://localhost:5000")

# Test API
@app.route('/api/test', methods=['POST'])
def test():
    if request.method == 'POST':
        data = request.json.get("data")
        return jsonify(data), 200
    else:
        return None