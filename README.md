

## Page 1

1
ACADEMIC PROJECT DOCUMENTATION
CyberGuard AI:
Comprehensive
Submission-Quality
Project Report &
Documentation
AI-Based Mobile Threat Intelligence & Explainable
Cybersecurity Platform
Course: Bachelor of Science / Technology in Computer Science &
Engineering
Subject: Final Semester Project Submission
Platform: Full-Stack Web App with AI/ML Microservices
Date of Submission: June 2026
Version: 2.0 (Submission Grade)
6/5/26, 11:43 PM 	CyberGuard AI: Comprehensive Submission-Quality Project Report & Documentation

## Page 2

2
Table of Contents
1. Executive Summary / Abstract
2. Introduction & Background
3. Problem Statement & Objectives
4. Proposed Solution & Step-by-Step Methodology
5. System Design & Technical Architecture
6. Detailed Repository Directory & File-by-File Analysis
7. Frontend Architecture & UI Modules
8. Backend Server & Route Handlers
9. Database Modeling & Schema Relationships
10. REST API Endpoint Specifications
11. External Integrations & Core APIs
12. Machine Learning Pipeline & AI Explanation
13. Conversational AI Agent & Safety Guardrails
14. Security Standards, Privacy, & Hardening
15. Deployment & Cloud Hosting Plan
16. Limitations & Sandbox Boundaries
17. Future Scope & Product Roadmap
18. Step-by-Step Live Demonstration Script
19. Viva / Interview Q&A Guide
20. Project Conclusion
6/5/26, 11:43 PM 	CyberGuard AI: Comprehensive Submission-Quality Project Report & Documentation

## Page 3

3
1. Executive Summary / Abstract
CyberGuard AI is a full-stack mobile threat intelligence platform designed to bridge the gap
between complex technical threat detection and non-technical user understanding. While
traditional antivirus software checks files against static database signatures, it fails to analyze
the threat context of daily mobile communications (e.g., text messages, web links) and
permission abuse. Additionally, traditional alerts often confuse everyday users, leading to "alert
fatigue" where warnings are ignored.
CyberGuard AI addresses these limitations through a layered security approach:
Static & Reputation Scanning: Inspects file hashes using the VirusTotal registry and
validates domain safety using the Google Safe Browsing API.
Contextual NLP Checking: Classifies text messages (SMS) using a rule-based natural
language processing engine deployed as an isolated microservice.
Explainable Generative AI: Integrates Google's Gemini Generative AI ( gemini-1.5-
flash ) to analyze logged threats and translate technical details into plain, actionable
advice.
Operating as an interactive "digital bodyguard," CyberGuard AI helps users identify,
understand, and remediate cybersecurity risks in real time without requiring technical
expertise.
6/5/26, 11:43 PM 	CyberGuard AI: Comprehensive Submission-Quality Project Report & Documentation

## Page 4

4
2. Introduction & Background
2.1 The Concept of CyberGuard AI
CyberGuard AI is a web-based threat intelligence dashboard. It serves as a unified command
center where users can run security scans, inspect suspicious inputs, view device health
statistics (Safety Score), and interact with a security chatbot assistant to resolve threats.
2.2 The Mobile Cybersecurity Landscape
Mobile devices have become central to daily life, holding private credentials, bank accounts,
and personal correspondence. This concentration of sensitive information makes mobile
operating systems prime targets for cyber criminals. Modern attacks have shifted from simple
file-based malware to sophisticated social engineering, phishing, and credential harvesting.
2.3 Why Traditional Security Software Falls Short
Standard antivirus tools operate on the assumption that threats exist as malicious executable
files. They scan storage drives but remain blind to communication-layer scams:
Smishing (SMS Phishing): Urgently requesting users to click a link (e.g., "Your card is
suspended, login here"). No file is downloaded, so traditional antivirus tools do not trigger.
Ambiguous Warnings: Standard tools output technical alerts like Trojan:JS/Phish.A .
Average users do not know what this means, nor how to respond, often ignoring the
warning.
2.4 CyberGuard AI's Paradigm Shift
CyberGuard AI introduces Explainable Security. When a scan flags a threat, the system
computes the risk level and invokes Generative AI to answer the user's questions (e.g., "What is
this risk?", "How did it get here?", "What steps do I take to remove it?"). By explaining the threat,
the system helps educate users to avoid future scams.
6/5/26, 11:43 PM 	CyberGuard AI: Comprehensive Submission-Quality Project Report & Documentation

## Page 5

5
3. Problem Statement & Objectives
3.1 Problem Statement
Modern mobile security faces several distinct challenges:
1. Rise of Social Engineering: Smishing attacks bypass traditional device file scanners.
2. Sophisticated Phishing Domains: Attackers use typosquatting (e.g., paypal-security-
verification.com ) to trick users.
3. Permission Abuse: Applications request permissions beyond their operational scope (e.g.,
a flashlight app demanding contact and SMS storage access).
4. Technical Alert Fatigue: Complex, jargon-filled security alerts confuse users and result in
ignored warnings.
5. Offline Vulnerability: Lack of lightweight local detection scripts makes users vulnerable
when internet connection is lost.
3.2 Project Objectives
Multi-Vector Threat Scanning: Develop an interface to scan local files, URLs, and
incoming text strings.
Dynamic Health Scoring: Calculate and display a Safety Score (0–100) reflecting the
device's overall security posture.
Explainable Security Agent: Build a conversational interface backed by Google Gemini to
clarify threats in plain English.
Account Protection: Implement robust user signup, authentication, password validation,
and brute-force protection.
Modular Architecture: Maintain an isolated backend, database collection, and dedicated
NLP classification service.
Responsive UI: Create a glassmorphic dashboard optimized for both mobile viewports
and desktop web browsers.
6/5/26, 11:43 PM 	CyberGuard AI: Comprehensive Submission-Quality Project Report & Documentation

## Page 6

6
4. Proposed Solution & Step-by-Step Methodology
4.1 System Modules
1. Auth & Verification: Secure signup, password strength validation, brute-force lockout,
and simulated SMS OTP verification.
2. Safety Dashboard: A dynamic dashboard utilizing animated gauges to show threat
counters and safety scores.
3. Threat Scanner: Multi-tab panel separating file scans, link reputation lookups, and SMS
content analysis.
4. Alerts Management: A console that displays, filters, and resolves active security threats,
restoring safety points upon resolution.
5. AI Security Assistant: Conversational chat panel connected to Gemini that reads user
database records to provide personalized guidance.
6. Support Center: Form enabling users to submit tickets directly to MongoDB for
administrator review.
4.2 Step-by-Step User Journey
┌──────────────┐ 	┌──────────────┐ 	┌──────────────┐ 	┌──────────────┐
│ 1. Landing │ ──► │ 2. Register │ ──► │ 3. SMS OTP │ ──► │ 4. Dashboard │
│ 	Page 	│ 	│ & Password │ 	│ Verification │ 	│ Safety Score│
└──────────────┘ 	└──────────────┘ 	└──────────────┘ 	└──────────────┘
│
┌──────────────┐ 	┌──────────────┐ 	┌──────────────┐ 	▼
│ 8. Chat with │ ◄── │ 7. Review 	│ ◄── │ 6. Flag 	│ ◄── │ 5. Perform │
│ AI Agent 	│ 	│ Threat Log │ 	│ threat & score│ 	│ Scan (File/ │
│ for Cleanup │ 	│ Details 	│ 	│ decrement 	│ 	│ URL/SMS Text)│
└──────────────┘ 	└──────────────┘ 	└──────────────┘ 	└──────────────┘
1. Landing Page: The user lands on the homepage and views general features.
2. Sign-Up: The user inputs details. A password strength meter validates complexity.
3. Simulated OTP: A token verification challenge page verifies the mobile number.
4. Safety Score Baseline: User enters the dashboard with a clean status score of 100.
5. Initiating Scan: The user opens the scanner. They scan a simulated malicious file hash,
paste a phishing link, or submit a smishing message.
6/5/26, 11:43 PM 	CyberGuard AI: Comprehensive Submission-Quality Project Report & Documentation

## Page 7

7
6. Backend Analysis & Scoring: The backend processes input APIs, identifies threats, saves
them as active Alert documents, and decrements the Safety Score.
7. Alert Console Review: The user navigates to Alerts to view the threat logs (Critical, High,
Medium, Low severity).
8. Generative AI Consultation: The user opens the AI Agent. The agent queries active alerts
and explains the issues step-by-step.
9. Threat Remediation: The user clicks "Resolve" in the Alerts console. The alert status
updates to resolved, and the Safety Score increments back to safe.
6/5/26, 11:43 PM 	CyberGuard AI: Comprehensive Submission-Quality Project Report & Documentation

## Page 8

8
5. System Design & Technical Architecture
The architecture separating front-end rendering, core business logic, microservices, and
database persistence is outlined below:
┌────────────────────────────────┐
│ 	Client Web Browser 	│
│ (HTML5, CSS3, ES6 JavaScript) │
└────────────────────────────────┘
│
(REST Requests & WebSockets)
▼
┌────────────────────────────────┐
│ 	Node.js Express Server 	│
│ (App Routing, JWT, Security) │
└────────────────────────────────┘
│ 	│ 	│
┌────────────────────────┘ 	│
└────────────────────────┐
▼ 	▼
▼
┌──────────────────┐ 	┌──────────────────┐
┌──────────────────┐
│ MongoDB Database │ 	│ Python Flask │ 	│
External Cloud │
│ (Mongoose ORM) │ 	│ NLP Service (on │ 	│ APIs
(Gemini, │
│ - Users, Scans │ 	│ Port 5000 / HF) │ 	│
SafeBrowsing, │
│ - Alerts, Logs │ 	│ - SMS Classifier│ 	│
VirusTotal) 	│
└──────────────────┘ 	└──────────────────┘
└──────────────────┘
5.1 Architecture Layers Explained
1. Client Presentation Layer (Frontend)
Built using HTML5 for markup, vanilla CSS3 variables for styling, and JavaScript (ES6) for UI
orchestration. It handles form inputs, animates dashboard gauges, runs timer routines, and
sends fetch requests to backend endpoints.
6/5/26, 11:43 PM 	CyberGuard AI: Comprehensive Submission-Quality Project Report & Documentation

## Page 9

9
2. Application Logic Layer (Backend)
Powered by Node.js and the Express framework. It defines API routing, validates authorization
tokens (JWT), coordinates middleware checks (rate-limiting, security headers), and securely
proxies external API queries.
3. Database Layer
Uses MongoDB as a NoSQL document database, using Mongoose schema configurations to
enforce strict data structures, validation rules, and automatic index lifecycle management.
4. NLP Microservice Layer
An isolated Python Flask server (running locally on Port 5000 or hosted remotely on Hugging
Face Spaces). This service parses incoming text strings to detect urgent expressions, phishing
patterns, and fraudulent links.
5. Integration Layer (APIs)
Google Gemini API: Implements Generative AI text analysis using the gemini-1.5-flash
model.
Google Safe Browsing API: Validates the reputation of URL domains.
VirusTotal API: Scans file checksums against database lists.
Firebase SDK: Drives customer phone number authentication simulations.
6/5/26, 11:43 PM 	CyberGuard AI: Comprehensive Submission-Quality Project Report & Documentation

## Page 10

10
6. Detailed Repository Directory & File-by-File Analysis
This section maps out every directory and file in the project, detailing their roles and why they
are used.
6.1 Root Project Files
server.js: Why we use it: The primary entry point for the Node.js backend. It imports
Express, connects to MongoDB, configures security middlewares (cors, helmet, rate-
limiters), mounts API route folders, handles error-catching, and starts the HTTP server.
package.json: Why we use it: The project manifest listing project details, start scripts
( node server.js ), and Node module dependencies.
package-lock.json: Why we use it: Locks exact sub-dependency versions to ensure
identical installs across environment systems.
.env: Why we use it: Stores environment configurations and API keys ( MONGO_URI ,
JWT_SECRET , GEMINI_API_KEY , VIRUSTOTAL_API_KEY ). Kept out of version control to
protect credentials.
.env.example: Why we use it: A template file illustrating the environment key format for
other developers.
.gitignore: Why we use it: Prevents sensitive files (like .env ) and heavy directories (like
node_modules ) from being committed to Git.
vulnerability_test.js: Why we use it: A developer test utility that validates backend
endpoints against simulated SQL/NoSQL injections, brute-force requests, and invalid JWT
tokens.
6.2 Frontend HTML Pages (Root Directory)
index.html: Why we use it: The landing page presenting the application features and
directing visitors to sign up or log in.
home.html: Why we use it: Alternate homepage or logged-in greeting page.
signup.html: Why we use it: Account creation page containing a real-time password
complexity tracker.
login.html: Why we use it: Account access portal with brute-force delay mechanisms.
otp.html: Why we use it: Handles simulated SMS OTP challenges to confirm user phone
identities.
6/5/26, 11:43 PM 	CyberGuard AI: Comprehensive Submission-Quality Project Report & Documentation

## Page 11

11
permissions.html: Why we use it: Onboarding guide where users grant simulated mobile
permissions (SMS, storage) to establish an initial safety score.
dashboard.html: Why we use it: The central user dashboard displaying safety gauges,
threat counts, active logs, and diagnostic indicators.
scan.html: Why we use it: Houses the scanning tools for files, URLs, and SMS strings.
alerts.html: Why we use it: Display screen for logged threats, categorized by severity, with
buttons to resolve them.
threat-details.html: Why we use it: Displays granular analysis of specific alert documents.
ai-agent.html: Why we use it: The conversational chat interface for the Gemini AI Security
Agent.
security-tips.html: Why we use it: An educational center providing security tips and
interactive threat prevention checklists.
settings.html: Why we use it: Dashboard settings to customize scan thresholds and
database log retention.
profile.html: Why we use it: Displays and edits account profiles and verification badges.
support.html: Why we use it: Forms interface for filing support tickets.
features.html: Why we use it: Explains system features, algorithms, and integration
capabilities to prospective users.
6.3 Shared Configuration & Middleware
config/db.js: Why we use it: Connects the Node.js application to MongoDB using
Mongoose, handling error logging and termination events.
middleware/auth.js: Why we use it: Validates JWTs in request headers, granting access to
protected routes and attaching the current user ID to request objects.
6.4 Mongoose Model Definitions ( models/ )
models/User.js: Why we use it: Schema defining user profiles (name, email, hashed
password, phone, role).
models/Alert.js: Why we use it: Schema representing logged threat alerts (title,
description, severity, status).
models/Scan.js: Why we use it: Schema logging scan events (type, target scanned, result,
safety score impact).
models/AgentLog.js: Why we use it: Schema recording conversation exchanges between
users and the AI Security Agent.
6/5/26, 11:43 PM 	CyberGuard AI: Comprehensive Submission-Quality Project Report & Documentation

## Page 12

12
models/Settings.js: Why we use it: Schema storing user-specific configurations.
models/SupportTicket.js: Why we use it: Schema recording user-submitted support
inquiries.
models/ThreatDetails.js: Why we use it: Schema housing detailed vulnerability information
and instructions.
models/OTP.js: Why we use it: Schema storing temporary SMS verification OTP codes,
using MongoDB TTL indexes for auto-deletion.
6.5 Route Handler Handlers ( routes/ )
routes/auth.js: Why we use it: Handlers for login, registration, and password checks.
routes/user.js: Why we use it: Handlers for profile queries and updates.
routes/dashboard.js: Why we use it: Aggregates safety stats, alert counts, and histories for
frontend dashboards.
routes/alerts.js: Why we use it: CRUD endpoints for loading active threats, updating alert
statuses, and deleting threat records.
routes/threats.js: Why we use it: Endpoint returning diagnostic details for a specific threat
ID.
routes/scan.js & routes/scan_v2.js: Why we use it: Backend routing for executing file
scans, URL inspections, and SMS checks. Communicates with VirusTotal, Safe Browsing, and
the Flask service.
routes/agent.js: Why we use it: Endpoint that pulls active threats from the database and
forwards them as context to Google Gemini.
routes/settings.js: Why we use it: Endpoint for updating and retrieving configuration
settings.
routes/support.js: Why we use it: Handler for logging support requests to MongoDB.
6.6 Client Design & Scripts ( assets/ )
assets/css/style.css: Why we use it: Core stylesheet managing themes, variables,
animations, and typography.
assets/css/dashboard-premium.css: Why we use it: Layouts and style sheets for
dashboard metric grids and safety meters.
assets/css/ai-agent.css: Why we use it: Styling rules for conversational chat bubbles.
assets/css/alerts.css: Why we use it: CSS rules for alert lists, cards, and severity labels.
6/5/26, 11:43 PM 	CyberGuard AI: Comprehensive Submission-Quality Project Report & Documentation

## Page 13

13
assets/css/mobile-app.css: Why we use it: Core layout adjustments to mimic native mobile
screens.
assets/css/notifications.css: Why we use it: Styling for toaster notifications and alerts.
assets/css/profile.css: Why we use it: Layout rules for user profile views.
assets/css/scan.css: Why we use it: Layout styles for scanner grids and terminal readouts.
assets/css/tips.css: Why we use it: Styling for educational tips accordions.
assets/js/main.js: Why we use it: Main frontend initializer containing utility scripts.
assets/js/navigation.js: Why we use it: Handles top navbar rendering, sidebar toggles, and
client-side page routing.
assets/js/auth.js: Why we use it: Manages user login forms, validation, and brute-force
lockout states on the client.
assets/js/dashboard.js: Why we use it: Fetches metrics, updates animated safety score
circles, and populates lists on load.
assets/js/scan.js: Why we use it: Manages scan controls, handles file hash generation, and
outputs simulation logs.
assets/js/alerts.js: Why we use it: Manages list generation, filters alerts by risk, and handles
threat resolution actions.
assets/js/ai-agent.js: Why we use it: Drives conversational chats, formatting user and
assistant bubbles.
assets/js/threat-details.js: Why we use it: Formats and renders specific details for
individual threat IDs.
assets/js/profile.js: Why we use it: Populates user profile inputs and submits updates.
assets/js/settings.js: Why we use it: Synchronizes user interface setting state variables with
backend database tables.
assets/js/support.js: Why we use it: Handles contact support ticket form validation and
submissions.
assets/js/security-tips.js: Why we use it: Orchestrates accordion expansion and interactive
checkboxes for security guidelines.
assets/js/notifications.js: Why we use it: Displays global push alerts and toasters for new
threats.
6.7 Python NLP Microservice & Docker Containers
ai_service/app.py: Why we use it: Runs the Python Flask web application. It exposes
endpoints to analyze text strings, parsing them with regular expression rules to flag
6/5/26, 11:43 PM 	CyberGuard AI: Comprehensive Submission-Quality Project Report & Documentation

## Page 14

14
phishing signals.
ai_service/requirements.txt: Why we use it: Specifies dependencies ( flask , regex ) for
installing the Python microservice.
ai_service/Dockerfile: Why we use it: Compiles the Python microservice into a container,
defining standard configurations and boot commands.
6.8 Hugging Face Deployment Package ( hf_cyber/ )
Why we use this directory: Hugging Face Spaces provides free hosting for machine learning
microservices. This folder contains the scripts required to deploy the SMS NLP classifier
microservice as an isolated cloud space:
hf_cyber/app.py: Why we use it: The production script for Flask, deployed to Hugging
Face Spaces to handle cloud-based classification.
hf_cyber/requirements.txt: Why we use it: Standard requirements manifest used by
Hugging Face to install Python libraries.
hf_cyber/Dockerfile: Why we use it: Instructs Hugging Face to build a container exposing
Port 7860 (Hugging Face default) rather than standard Flask Port 5000 .
hf_cyber/.gitattributes: Why we use it: Configures Git Large File Storage (LFS) rules to
support large serialized model file uploads in Git repositories.
hf_cyber/README.md: Why we use it: Provides metadata configuration headers (title,
emoji, SDK choice, python version) used by Hugging Face to initialize the Space container.
6/5/26, 11:43 PM 	CyberGuard AI: Comprehensive Submission-Quality Project Report & Documentation

## Page 15

15
7. Frontend Architecture & UI Modules
7.1 Visual System & Theme Selection
The frontend UI is built using a premium dark-mode glassmorphic theme.
Aesthetic Principle: Utilizes CSS backdrop filters ( backdrop-filter: blur(12px) )
combined with semi-transparent border strokes ( border: 1px solid rgba(255, 255, 255,
0.1) ) and deep gradient backgrounds. This results in card components that appear as
floating panes of glass over a dynamic, colorful backdrop.
Color Palette: Dark background bases ( #0d0e12 to #161922 ), vivid teal highlights
( #00f2fe ) for safe actions, warm amber ( #f39c12 ) for medium risks, and crimson
( #ff4d4d ) for critical warnings.
Typography: Implements Google Fonts (like Inter or Outfit) to replace standard browser
font defaults, enhancing readable structure and text scanning.
7.2 Core UI Modules
Password Complexity Indicator: Tracks password entries against strict complexity rules
(length, uppercase, lowercase, numbers, special characters) using regex matches, updating
warning badges dynamically.
Dynamic Lockout Mechanism: A security feature on the login page. If a client attempts
to log in and fails three consecutive times, the javascript script blocks input elements, starts
a visible countdown timer, and prevents new login attempts for 30 seconds to block
automated brute-force scripts.
Safety Score Gauge: A dashboard visual module built with SVG circular strokes. When the
page fetches active user stats, Javascript updates the stroke offset to reflect the Safety
Score. It uses smooth CSS transitions to animate the gauge in real-time.
Command Terminal Simulator: Embedded on the scanner screen, it simulates a console
output that shows real-time file hash parsing, API queries, and detection events to keep the
user informed.
7.3 Frontend Session Management
Because this prototype does not require heavy React or Angular dependencies, session
persistence is managed using localStorage :
6/5/26, 11:43 PM 	CyberGuard AI: Comprehensive Submission-Quality Project Report & Documentation

## Page 16

16
Upon login, the backend returns a JSON Web Token (JWT). The frontend saves it to
localStorage.setItem('token', token) .
Every API request attaches this token to the HTTP authorization header ( Authorization:
Bearer <token> ).
If a request returns an authentication error (Status 401 or 403 ), the javascript script clears
the storage token and redirects the user to the login screen.
6/5/26, 11:43 PM 	CyberGuard AI: Comprehensive Submission-Quality Project Report & Documentation

## Page 17

17
8. Backend Server & Route Handlers
The Node.js Express server manages the core platform logic and API endpoints.
8.1 Express Framework Setup
In server.js , Express initialized with standard configuration headers:
Body Parsing: express.json() and express.urlencoded({ extended: true }) parse
payload JSON bodies.
CORS Configuration: Restricts API calls to approved domain origins, preventing
unauthorized websites from reading user data.
Socket.io Integration: Configures WebSockets alongside the HTTP server to enable
instant alert broadcasts to connected clients.
8.2 Custom Authorization Middleware
The file middleware/auth.js intercepts incoming requests for protected endpoints:
const jwt = require('jsonwebtoken');
module.exports = function (req, res, next) {
const token = req.header('Authorization')?.replace('Bearer ', '');
if (!token) return res.status(401).json({ msg: 'Access denied. No token provided.'
});
try {
const decoded = jwt.verify(token, process.env.JWT_SECRET);
req.user = decoded; // Attach user payload to request
next();
} catch (err) {
res.status(400).json({ msg: 'Invalid token.' });
}
};
This ensures database routes remain inaccessible to unauthorized requests.
8.3 Security Hardening Middlewares
To prevent attacks, the server implements two key security libraries:
1. Helmet.js: Sets standard HTTP response headers (e.g. X-Frame-Options to block
Clickjacking, X-Content-Type-Options to prevent mime-sniffing, and Content Security
6/5/26, 11:43 PM 	CyberGuard AI: Comprehensive Submission-Quality Project Report & Documentation

## Page 18

18
Policies).
2. Express-Rate-Limit: Restricts requests to preventing Denial of Service (DoS) and API
abuse. For example, login routes are limited to 5 attempts per minute.
6/5/26, 11:43 PM 	CyberGuard AI: Comprehensive Submission-Quality Project Report & Documentation

## Page 19

19
9. Database Modeling & Schema Relationships
CyberGuard AI uses MongoDB to store documents across 8 collections.
9.1 Collection Schemas & Fields
1. Users Collection ( User.js )
_id : ObjectId (Primary Key)
name : String (Required, trimmed)
email : String (Required, unique, email validation regex)
password : String (Required, stored as a bcrypt hash)
phone : String (Required, verified mobile format)
role : String (Enum: ['user', 'admin'] , default: user )
2. Alerts Collection ( Alert.js )
_id : ObjectId
userId : ObjectId (Foreign Key pointing to Users._id )
title : String (e.g., "Suspicious Smishing Text Detected" )
description : String (Details regarding the threat vector)
severity : String (Enum: ['low', 'medium', 'high', 'critical'] )
status : String (Enum: ['active', 'resolved'] , default: active )
timestamp : Date (default: Date.now )
3. Scans Collection ( Scan.js )
_id : ObjectId
userId : ObjectId (Foreign key pointing to Users._id )
type : String (Enum: ['file', 'url', 'sms'] )
target : String (The hash, link, or text parsed)
result : String (Outcome summary)
threatFound : Boolean (Flag indicating if a threat was found)
timestamp : Date
6/5/26, 11:43 PM 	CyberGuard AI: Comprehensive Submission-Quality Project Report & Documentation

## Page 20

20
4. Agent Logs Collection ( AgentLog.js )
_id : ObjectId
userId : ObjectId (Foreign key pointing to Users._id )
prompt : String (User query)
response : String (Gemini assistant response)
timestamp : Date
5. OTP Verification Tokens ( OTP.js )
_id : ObjectId
phone : String (Mobile number target)
code : String (Hashed verification string)
createdAt : Date (Configured with a MongoDB TTL Index of 300 seconds, causing the
document to self-delete after 5 minutes)
6. System Settings ( Settings.js )
_id : ObjectId
userId : ObjectId (Unique Index)
realTimeScanning : Boolean (default: true )
autoResolveThreshold : String (default: medium )
7. Support Tickets ( SupportTicket.js )
_id : ObjectId
userId : ObjectId
subject : String
message : String
status : String (Enum: ['open', 'closed'] , default: open )
8. Rich Threat Details ( ThreatDetails.js )
_id : ObjectId
alertId : ObjectId
remediationSteps : Array of Strings
technicalImpact : String
6/5/26, 11:43 PM 	CyberGuard AI: Comprehensive Submission-Quality Project Report & Documentation

## Page 21

21
9.2 Relational Model Diagram
┌──────────────┐
│ 	Users 	│
└──────────────┘
│ 	│ 	│
│ 	│ 	└──────────────────────────┐
│ 	└─────────────────┐ 	│
▼ 	▼ 	▼
┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│ 	Scans 	│ │ 	Alerts 	│ │ AgentLogs │
└──────────────┘ └──────────────┘ └──────────────┘
│
▼
┌──────────────┐
│ThreatDetails │
└──────────────┘
6/5/26, 11:43 PM 	CyberGuard AI: Comprehensive Submission-Quality Project Report & Documentation

## Page 22

22
10. REST API Endpoint Specifications
All endpoints use JSON payloads and return descriptive HTTP status codes.
10.1 Authentication Routes ( /api/auth )
POST /signup : Registers user, validates email uniqueness, hashes password, and saves user
details.
Status 201: { msg: "User registered", token: "JWT..." }
POST /login : Compares hashed passwords. Returns a JWT if valid.
Status 200: { token: "JWT..." }
POST /verify-otp : Confirms simulated OTP code matching.
10.2 Dashboard Information Routes ( /api/dashboard )
GET / : Fetches aggregate details for the current authenticated user.
Payload response: { safetyScore: 85, threatsCounter: 2, totalScans: 12 }
10.3 Scan Processing Routes ( /api/scan_v2 )
POST /file : Receives file checksum hash, query Safe Browsing/VirusTotal APIs, logs threat
alert if marked positive.
POST /url : Performs reputation lookup for domain strings.
POST /message : Forwards message payload strings to Python Flask NLP service.
10.4 AI Agent Interaction Routes ( /api/agent )
POST /analyze : Reads user ID active alerts, appends query string, and requests advice
from the Google Gemini API.
6/5/26, 11:43 PM 	CyberGuard AI: Comprehensive Submission-Quality Project Report & Documentation

## Page 23

23
11. External Integrations & Core APIs
CyberGuard AI integrates third-party APIs to verify input variables and translate technical logs.
11.1 Google Safe Browsing API
Why we use it: To evaluate URL safety.
How it works: When a URL is scanned, the backend sends a query request to Google Safe
Browsing's lookup endpoint with the URL target. If Google's registry flags it as malicious
(phishing, social engineering, malware hosting), the endpoint returns a threat classification.
CyberGuard AI then generates a corresponding critical alert.
11.2 VirusTotal API
Why we use it: To scan files without uploading their raw, private contents.
How it works: Instead of uploading large, private files, the frontend script generates a
local SHA-256 hash checksum of the file. The backend forwards only this hash to the
VirusTotal lookup endpoint. VirusTotal scans its engine registry database. If the checksum
matches flagged malware signatures, it returns a threat report.
11.3 Google Gemini API
Why we use it: To power explainable AI features.
How it works: Rather than relying on static help texts, the system passes active threat
records (names, details, severity levels) along with user queries to Gemini using system
instructions. Gemini generates tailored, step-by-step remediation advice based on this
context.
11.4 Firebase Auth Client SDK
Why we use it: For simulated phone verification.
How it works: Employs Firebase's Javascript SDK challenges to simulate phone number
verifications, ensuring user identities are verified before database changes are permitted.
6/5/26, 11:43 PM 	CyberGuard AI: Comprehensive Submission-Quality Project Report & Documentation

## Page 24

24
12. Machine Learning Pipeline & AI Explanation
12.1 Rule-Based vs. Machine Learning Processing
Rule-Based Classifier: Uses regular expressions and text parsing rules to find spam
keywords (e.g. urgent , verify , OTP , winner ). This approach is fast but brittle, failing if an
attacker alters spelling (e.g., Urgent!!! or V-e-r-i-f-y ).
Machine Learning Classifier: Processes semantic patterns. The model learns context and
can classify spam even if the wording changes.
12.2 Python Flask Microservice Design
The Flask microservice in ai_service/app.py acts as a text classifier. It processes incoming
messages and uses rules to check for spam indicators, returning a JSON response:
{
"text": "Your account has been blocked. Login at http://fake.com",
"is_phishing": true,
"confidence_score": 0.89,
"flagged_keywords": ["blocked", "login"]
}
12.3 Machine Learning Pipeline & TF-Lite Roadmap
To implement production-grade NLP threat detection, the system will use the following
pipeline:
┌──────────────┐ 	┌──────────────┐ 	┌──────────────┐ 	┌──────────────┐
│1. Gather SMS │ ──► │2. Text Clean │ ──► │3. Tokenize │ ──► │4. TF-IDF 	│
│ Dataset 	│ 	│ & Lowercase │ 	│ & Stopwords │ 	│ Vectorizer │
└──────────────┘ 	└──────────────┘ 	└──────────────┘ 	└──────────────┘
│
┌──────────────┐ 	┌──────────────┐ 	┌──────────────┐ 	▼
│8. TF-Lite 	│ ◄── │7. Export 	│ ◄── │6. Evaluate │ ◄── │5. Model 	│
│ Compile 	│ 	│ Saved Model │ 	│ Metrics 	│ 	│ Training 	│
└──────────────┘ 	└──────────────┘ 	└──────────────┘ 	└──────────────┘
1. Dataset Gathering: Collect and label thousands of SMS texts using open datasets (e.g.,
the UCI SMS Spam Corpus).
6/5/26, 11:43 PM 	CyberGuard AI: Comprehensive Submission-Quality Project Report & Documentation

## Page 25

25
2. Text Preprocessing: Clean the raw messages, convert text to lowercase, and strip HTML
tags.
3. Tokenization: Split strings into tokens and remove stop words (e.g. is , the , at ).
4. Vectorization: Vectorize text using TF-IDF (Term Frequency-Inverse Document Frequency)
or word embeddings (Word2Vec, GloVe).
5. Model Training: Train a classification model (e.g., Multinomial Naive Bayes, Support
Vector Machines, or LSTMs).
6. Performance Evaluation: Validate performance against evaluation metrics (Accuracy,
Precision, Recall, F1-Score).
7. Model Serialization: Save weights and export the model structure using joblib or
TensorFlow saves.
8. TensorFlow Lite Compilation: Convert the trained model into a .tflite flat buffer. This
creates a lightweight file that can run locally on mobile devices without relying on network
APIs.
6/5/26, 11:43 PM 	CyberGuard AI: Comprehensive Submission-Quality Project Report & Documentation

## Page 26

26
13. Conversational AI Agent & Safety Guardrails
The conversational AI agent helps users understand and address security alerts.
13.1 Generative Prompt Structure & Context Injection
When a user asks a question, the backend queries the database for all active alert records
associated with that user. It formats these alerts into a context string and injects them into the
Gemini system prompt:
// Example Server Prompt Formulation
const systemInstruction = `
You are the CyberGuard AI assistant, an expert digital safety coach.
The user has the following active security threats detected on their device:
${activeAlertsList}
Using this context, answer the user's questions in clear, simple language.
Follow these rules:
1. Explain what the threat is without using technical jargon.
2. Provide a step-by-step remediation guide.
3. Never ask for, verify, or accept passwords, pins, or OTP codes.
4. If a user asks for hacking scripts or malicious code, refuse to answer.
`;
This system prompt ensures the AI agent has the context needed to provide relevant advice.
13.2 System Safety Guardrails
To prevent abuse, the prompt implements several safety guardrails:
Zero-Credential Policy: If the user inputs text containing keywords like "password", "pin",
or "OTP", the agent is instructed to refuse to parse the values and warn the user about
credential sharing risks.
No Offensive Support: Prompt templates restrict the model from generating exploit
payloads or hacking scripts.
Sandbox Advisory: The agent cannot execute device modifications or delete files directly.
It acts strictly as an advisor, guiding the user to take action.
6/5/26, 11:43 PM 	CyberGuard AI: Comprehensive Submission-Quality Project Report & Documentation

## Page 27

27
14. Security Standards, Privacy, & Hardening
CyberGuard AI uses industry-standard security practices to protect user data and endpoints.
14.1 Cryptographic Password Hashing
User passwords are encrypted before database storage using bcrypt with a cost factor (salt
rounds) of 10. The system never stores plain text passwords, protecting credentials even in the
event of a database breach.
14.2 Query Sanitization & NoSQL Injection Block
Mongoose schemas enforce strict validation rules. Dynamic queries bind input parameters to
schema types, preventing NoSQL injection attacks.
14.3 CORS Controls & API Protection
CORS Configuration: Restricts access to authorized domains to block cross-site request
forgery.
Environment Secret Separation: API keys and secrets are loaded from a .env file at
runtime, keeping credentials secure and out of the git repository.
6/5/26, 11:43 PM 	CyberGuard AI: Comprehensive Submission-Quality Project Report & Documentation

## Page 28

28
15. Deployment & Cloud Hosting Plan
The platform is designed to deploy across modular cloud infrastructure services.
┌────────────────────────┐ 	┌────────────────────────┐
│ 	Frontend Web 	│ 	│ 	Backend Server 	│
│ 	(Static Hosting) 	│ 	│ 	(PaaS Hosting) 	│
│ 	- GitHub Pages 	│ 	│ 	- Render / Heroku │
│ 	- Netlify / Vercel │ 	│ 	- Dockerized Host │
└────────────────────────┘ 	└────────────────────────┘
│ 	│
▼ 	▼
┌────────────────────────┐ 	┌────────────────────────┐
│ 	Database Cloud 	│ 	│ 	NLP Microservice 	│
│ (Database-as-a-Service) 	│ 	(Isolated Container)│
│ - MongoDB Atlas 	│ 	│ 	- Hugging Face Space│
└────────────────────────┘ 	└────────────────────────┘
15.1 Frontend Target (Vercel / Netlify / GitHub Pages)
Static assets (HTML, CSS, JS) are hosted on static platforms. These services offer global CDN
delivery and SSL termination.
15.2 Backend Target (Render / AWS / Heroku)
The Express app runs inside a Node.js runtime on platforms like Render or AWS App Runner. It
connects to database clusters and proxies API requests.
15.3 Database Cloud Instance (MongoDB Atlas)
Stores application data in a managed MongoDB Atlas cluster. Atlas provides automatic scaling,
secure network access lists, and regular database backups.
15.4 AI Service Host (Hugging Face Spaces)
Why we use it: The Python Flask service runs inside a Docker space on Hugging Face.
Isolation: Separates Python dependencies from the main Node server, preventing resource
conflicts.
Efficiency: Provides containerized hosting for machine learning microservices.
Git Sync: Syncs with git repositories to automate container builds upon code updates.
6/5/26, 11:43 PM 	CyberGuard AI: Comprehensive Submission-Quality Project Report & Documentation

## Page 29

29
6/5/26, 11:43 PM 	CyberGuard AI: Comprehensive Submission-Quality Project Report & Documentation

## Page 30

30
16. Limitations & Sandbox Boundaries
Browser Sandbox Limits: The web prototype cannot read physical device SMS databases
or modify storage filesystems directly due to browser security restrictions.
External API Dependencies: Scans require active internet connections and API keys to
query VirusTotal and Safe Browsing.
Simulation Scope: File checksum scans simulate hash extraction rather than uploading
whole, heavy files.
Synchronous Delay Risk: Network latency can delay Safe Browsing checks if API services
experience outages.
6/5/26, 11:43 PM 	CyberGuard AI: Comprehensive Submission-Quality Project Report & Documentation

## Page 31

31
17. Future Scope & Product Roadmap
Capacitor.js Native Wrapping: Wrap the web frontend using Capacitor.js to package the
application as a native Android APK or iOS IPA.
Native Bridge Integration: Use Capacitor plugins to request native permissions
( READ_SMS , ACCESS_FINE_LOCATION , WRITE_EXTERNAL_STORAGE ).
Offline TensorFlow Lite Scanning: Replace rule-based text checks with an offline-
capable TensorFlow Lite NLP model.
Twilio SMS OTP Verification: Integrate Twilio's SMS API to automate user OTP
verification messaging.
Advanced Device Diagnostics: Integrate hardware security checks to detect rooted or
jailbroken operating systems.
6/5/26, 11:43 PM 	CyberGuard AI: Comprehensive Submission-Quality Project Report & Documentation

## Page 32

32
18. Step-by-Step Live Demonstration Script
This script outlines a demonstration workflow to showcase the platform's features:
1. Landing Page Showcase: Open index.html . Point out the glassmorphic styling, design
consistency, and feature descriptions.
2. Signup Execution: Click "Get Started". Enter registration details, showcasing the password
complexity meter dynamically checking input criteria.
3. OTP Verification Simulation: Complete the challenge on the otp.html page to enter
the dashboard.
4. Dashboard Inspection: Verify the dashboard Safety Score begins at a clean baseline of
100.
5. Simulated File Hash Scan: Open scan.html , select the file tab, and scan a malicious file
hash (e.g., e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 ).
Watch the terminal simulation log output results.
6. Flagging Phishing Links: Under the URL tab, paste http://paypal-security-
activation.com and click check.
7. Alert Console Logging: Navigate to alerts.html . Verify that the threats are logged and
the Safety Score has dropped.
8. AI Conversation Consultation: Open ai-agent.html and click "What do my alerts
mean?". The AI assistant reads the active threat records and provides plain English
remediation advice.
9. Resolving Alert Actions: Return to the alerts console and click "Resolve" next to a threat.
Verify that the Safety Score increases as alerts are resolved.
10. Device Responsiveness Showcase: Open browser developer tools and toggle the
responsive device viewport to show the mobile layout.
6/5/26, 11:43 PM 	CyberGuard AI: Comprehensive Submission-Quality Project Report & Documentation

## Page 33

33
19. Viva / Interview QA Guide
Q1: What is CyberGuard AI?
Answer: A full-stack mobile safety platform that scans files, links, and messages, and
uses Google Gemini to translate complex threat logs into simple, conversational
explanations.
Q2: How are security alerts explained?
Answer: The backend retrieves the user's active threat records from MongoDB and
injects them into the system prompt of the Google Gemini API. This allows the AI agent
to provide relevant, context-aware remediation advice.
Q3: Why is the NLP SMS service isolated?
Answer: The Python Flask service is isolated to keep Python dependencies separate from
the Node.js backend. This prevents resource conflicts and allows the services to scale
independently.
Q4: How does the file checksum scan work?
Answer: The system generates a cryptographic SHA-256 hash of the file locally. It then
checks this hash against VirusTotal's database of known malware, protecting user
privacy by avoiding file uploads.
Q5: How does the app prevent NoSQL Injection?
Answer: The app uses Mongoose schemas to sanitize user input. Query parameters are
bound to specific schema data types, preventing attackers from injecting malicious
queries.
Q6: What is a MongoDB TTL index?
Answer: A Time-To-Live index automatically deletes documents after a specified time.
We use it in the OTP collection to expire verification codes after 5 minutes.
Q7: How does client-side session authentication work?
Answer: Upon successful login, the backend issues a JWT token. The client stores this
token in localStorage and includes it in the header of all subsequent API requests.
Q8: What is Helmet.js?
Answer: A middleware that secures Express apps by setting various HTTP headers. It
helps protect the app from attacks like cross-site scripting (XSS) and clickjacking.
6/5/26, 11:43 PM 	CyberGuard AI: Comprehensive Submission-Quality Project Report & Documentation

## Page 34

34
Q9: Why does the system calculate a Safety Score?
Answer: The Safety Score provides users with an easy-to-understand metric of their
device's security status. Points are deducted for active alerts and restored when threats
are resolved.
Q10: What is brute-force lockout?
Answer: A security measure that temporarily disables the login form for 30 seconds after
three failed login attempts, helping protect accounts from automated login attacks.
Q11: Why is Hugging Face Spaces used?
Answer: Hugging Face Spaces provides free, containerized hosting for the Python NLP
microservice, allowing it to run independently of the Node.js backend.
Q12: How does the URL scan detect phishing?
Answer: It checks the URL against Google's Safe Browsing API. If the domain is flagged
in Google's database as a known phishing site, it triggers a security alert.
Q13: What is the purpose of .env files?
Answer: .env files store sensitive environment variables, such as API keys and database
credentials. Keeping these variables in a local file prevents them from being exposed in
the git repository.
Q14: What are the main limitations of this web application?
Answer: Because the app runs in a browser sandbox, it cannot directly access native
phone filesystems or SMS databases.
Q15: How can these sandbox limits be resolved in the future?
Answer: The web app can be wrapped in Capacitor.js to run as a native mobile
application, allowing it to request access to native APIs like SMS and storage.
6/5/26, 11:43 PM 	CyberGuard AI: Comprehensive Submission-Quality Project Report & Documentation

## Page 35

35
20. Project Conclusion
CyberGuard AI demonstrates how generative AI and full-stack web architectures can be
combined to make cybersecurity more accessible. By translating complex, technical warnings
into simple, actionable advice, the platform helps protect non-technical users from social
engineering attacks, phishing links, and permission abuse. This prototype provides a modular
foundation that can scale into a native mobile application, showing how explainable security
can empower users to manage their own digital safety.
6/5/26, 11:43 PM 	CyberGuard AI: Comprehensive Submission-Quality Project Report & Documentation
