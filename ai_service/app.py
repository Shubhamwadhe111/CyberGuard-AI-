from flask import Flask, request, jsonify
import re

app = Flask(__name__)

# Basic ML-like Logic for Threat Classification
# In a real scenario, you'd load a TensorFlow/PyTorch model here
def classify_message(text):
    text = text.lower()
    
    # Phishing patterns
    phishing_patterns = [
        r"verify.*account",
        r"login.*required",
        r"suspended.*access",
        r"bank.*alert",
        r"click.*link.*confirm"
    ]
    
    for pattern in phishing_patterns:
        if re.search(pattern, text):
            return {
                "label": "Dangerous",
                "score": 0.89,
                "explanation": "Detected high-confidence phishing language pattern matching credential theft techniques."
            }
            
    # Suspicious patterns
    suspicious_patterns = [
        r"gift.*card",
        r"won.*lottery",
        r"urgent.*payment"
    ]
    
    for pattern in suspicious_patterns:
        if re.search(pattern, text):
            return {
                "label": "Suspicious",
                "score": 0.65,
                "explanation": "Message contains language typical of social engineering or lottery scams."
            }
            
    return {
        "label": "Safe",
        "score": 0.12,
        "explanation": "No malicious patterns detected in message content."
    }

@app.route('/analyze/message', methods=['POST'])
def analyze_message():
    data = request.get_json()
    message = data.get('message', '')
    
    if not message:
        return jsonify({"error": "No message provided"}), 400
        
    result = classify_message(message)
    return jsonify(result)

import os

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))
    print(f"AI Threat Analysis Microservice starting on port {port}...")
    app.run(host="0.0.0.0", port=port)
