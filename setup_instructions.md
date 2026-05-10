# 🚀 CyberGuard AI - Production Setup Instructions

This version of CyberGuard AI features a real-time Node.js backend, a Python AI microservice, and MongoDB persistence.

## Prerequisites
- Node.js (v16+)
- MongoDB (running locally or Atlas)
- Python 3.8+ (for AI Microservice)

## 1. Backend Setup (Node.js)
```bash
# Navigate to project root
npm install

# Setup environment variables
cp .env.example .env
# Edit .env with your JWT_SECRET and MONGO_URI
```

## 2. AI Microservice Setup (Python)
```bash
# Navigate to the ai_service folder
cd ai_service

# Install dependencies (Flask)
pip install flask

# Run the service
python app.py
```

## 3. Run the Application
```bash
# Start the Node server
npm run dev # or node server.js
```

## 4. Key Features to Test
- **System Scan**: Uses the real workspace file traversal engine.
- **File Scan**: Upload a file (like an `.exe` or `.apk`) to see hash-based analysis.
- **URL Scan**: Enter a phishing-style URL to see indicator detection.
- **Message Scan**: Uses the Python AI service to classify text messages.

## Security Features Active
- **Helmet**: Protects against well-known web vulnerabilities.
- **Rate Limiting**: Prevents brute force on `/api` routes.
- **JWT Auth**: All scans and profile updates require a valid token.
- **Input Sanitization**: Built into the model layer and route handlers.
