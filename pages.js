const pages = {
  home: `
    <div class="container mt-6">
      <div class="hero">
        <h1>AI-Based Threat Detection for Mobile Safety</h1>
        <p>Detect suspicious messages, risky links, unsafe app permissions, and mobile security threats before they cause harm.</p>
        <div class="flex justify-center gap-4 mt-4">
          <a href="#signup" class="btn btn-primary">Get Started</a>
          <a href="#demo" class="btn btn-outline">View Demo</a>
        </div>
      </div>
      
      <div class="mt-6 mb-6">
        <h2 class="text-center mb-4">Why CyberGuard AI?</h2>
        <div class="grid grid-cols-3 gap-6">
          <div class="card text-center">
            <i data-feather="shield" class="text-accent mb-2" style="width:32px;height:32px;"></i>
            <h3>Real-time Alerts</h3>
            <p class="text-muted mt-2">Get instant notifications when suspicious activity is detected.</p>
          </div>
          <div class="card text-center">
            <i data-feather="message-square" class="text-accent mb-2" style="width:32px;height:32px;"></i>
            <h3>Smart SMS Scanning</h3>
            <p class="text-muted mt-2">AI automatically flags phishing and scam messages.</p>
          </div>
          <div class="card text-center">
            <i data-feather="cpu" class="text-accent mb-2" style="width:32px;height:32px;"></i>
            <h3>CyberGuard Agent</h3>
            <p class="text-muted mt-2">Your 24/7 AI security assistant to answer your safety questions.</p>
          </div>
        </div>
      </div>
    </div>
  `,
  
  features: `
    <div class="container mt-6 mb-6">
      <h2 class="text-center mb-6">Enterprise-Grade Features for Everyone</h2>
      <div class="grid grid-cols-3 gap-6">
        <div class="card">
          <i data-feather="message-circle" class="text-accent mb-2"></i>
          <h3>Suspicious SMS Detection</h3>
          <p class="text-muted mt-2">Analyzes incoming messages to identify scam patterns and OTP theft attempts.</p>
        </div>
        <div class="card">
          <i data-feather="link" class="text-accent mb-2"></i>
          <h3>Phishing Link Analysis</h3>
          <p class="text-muted mt-2">Scans URLs in real-time to prevent you from visiting fraudulent websites.</p>
        </div>
        <div class="card">
          <i data-feather="unlock" class="text-danger mb-2"></i>
          <h3>Risky Permission Alerts</h3>
          <p class="text-muted mt-2">Finds apps that have unnecessary access to your camera, mic, or contacts.</p>
        </div>
        <div class="card">
          <i data-feather="activity" class="text-safe mb-2"></i>
          <h3>Mobile Safety Score</h3>
          <p class="text-muted mt-2">A unified score representing your device's overall security health.</p>
        </div>
        <div class="card">
          <i data-feather="bell" class="text-warning mb-2"></i>
          <h3>Real-time Alerts</h3>
          <p class="text-muted mt-2">Immediate push notifications when a threat is identified.</p>
        </div>
        <div class="card">
          <i data-feather="cpu" class="text-accent mb-2"></i>
          <h3>CyberGuard Agent</h3>
          <p class="text-muted mt-2">Interactive AI assistant providing context on why something is blocked.</p>
        </div>
        <div class="card">
          <i data-feather="check-circle" class="text-safe mb-2"></i>
          <h3>Security Recommendations</h3>
          <p class="text-muted mt-2">Actionable steps to improve your safety score and protect data.</p>
        </div>
        <div class="card">
          <i data-feather="clock" class="text-muted mb-2"></i>
          <h3>Threat History</h3>
          <p class="text-muted mt-2">A comprehensive log of all mitigated threats and historical alerts.</p>
        </div>
      </div>
    </div>
  `,
  
  dashboard: `
    <div>
      <h2 class="mb-4">Dashboard Overview</h2>
      
      <div class="grid grid-cols-3 gap-6 mb-6">
        <div class="card text-center flex flex-col justify-center">
          <h3 class="mb-2">Safety Score</h3>
          <div class="score-circle">85</div>
          <p class="text-muted mt-2">Good Standing</p>
        </div>
        
        <div class="card flex flex-col justify-center gap-4">
          <div class="flex justify-between items-center">
            <span class="text-muted">Suspicious Messages</span>
            <span class="badge badge-warning">3 Detected</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-muted">Risky Links</span>
            <span class="badge badge-danger">2 Blocked</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-muted">Permission Risks</span>
            <span class="badge badge-warning">5 Warnings</span>
          </div>
        </div>
        
        <div class="card">
          <h3 class="mb-4">AI Recommendations</h3>
          <ul class="flex flex-col gap-2 text-sm text-muted">
            <li class="flex items-center gap-2"><i data-feather="chevron-right" class="text-accent"></i> Revoke camera access from 'Flashlight App'</li>
            <li class="flex items-center gap-2"><i data-feather="chevron-right" class="text-accent"></i> Update OS to patch 2 vulnerabilities</li>
            <li class="flex items-center gap-2"><i data-feather="chevron-right" class="text-accent"></i> Delete 3 suspected spam SMS</li>
          </ul>
        </div>
      </div>

      <div class="grid grid-cols-1 gap-6">
        <div class="card">
          <h3 class="mb-4">Recent Alerts</h3>
          <div class="flex flex-col gap-4">
            <div class="flex justify-between items-center pb-2 border-b" style="border-color: var(--border)">
              <div class="flex items-center gap-4">
                <i data-feather="message-square" class="text-danger"></i>
                <div>
                  <div class="font-medium">Suspicious bank verification message</div>
                  <div class="text-sm text-muted">Just now</div>
                </div>
              </div>
              <a href="#threat-details" class="btn btn-outline text-sm">Review</a>
            </div>
            
            <div class="flex justify-between items-center pb-2 border-b" style="border-color: var(--border)">
              <div class="flex items-center gap-4">
                <i data-feather="link" class="text-danger"></i>
                <div>
                  <div class="font-medium">Unknown shortened payment link</div>
                  <div class="text-sm text-muted">2 hours ago</div>
                </div>
              </div>
              <a href="#threat-details" class="btn btn-outline text-sm">Review</a>
            </div>
            
            <div class="flex justify-between items-center">
              <div class="flex items-center gap-4">
                <i data-feather="unlock" class="text-warning"></i>
                <div>
                  <div class="font-medium">App requesting contacts & microphone</div>
                  <div class="text-sm text-muted">Yesterday</div>
                </div>
              </div>
              <a href="#threat-details" class="btn btn-outline text-sm">Review</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,

  scan: `
    <div>
      <h2 class="mb-4">System Scan</h2>
      <div class="card text-center mb-6 py-6">
        <i data-feather="search" class="text-accent mb-4" style="width:48px;height:48px;"></i>
        <h3>Analyze Your Device</h3>
        <p class="text-muted mt-2 mb-4">Run a deep scan to find hidden threats, risky links, and app vulnerabilities.</p>
        <button id="start-scan-btn" class="btn btn-primary">Start Deep Scan</button>
        
        <div id="scan-progress-area" class="hidden mt-6 text-left">
          <div class="flex justify-between mb-1">
            <span class="text-sm font-medium">Scanning progress...</span>
            <span id="scan-percentage" class="text-sm font-medium">0%</span>
          </div>
          <div class="progress-bar-container">
            <div id="scan-progress-bar" class="progress-bar"></div>
          </div>
          <div class="grid grid-cols-2 gap-4 mt-4 text-sm text-muted">
            <div class="flex items-center gap-2"><i data-feather="check-circle" class="text-safe" id="scan-step-1" style="opacity:0.3"></i> Messages</div>
            <div class="flex items-center gap-2"><i data-feather="check-circle" class="text-safe" id="scan-step-2" style="opacity:0.3"></i> Links</div>
            <div class="flex items-center gap-2"><i data-feather="check-circle" class="text-safe" id="scan-step-3" style="opacity:0.3"></i> App Permissions</div>
            <div class="flex items-center gap-2"><i data-feather="check-circle" class="text-safe" id="scan-step-4" style="opacity:0.3"></i> Installed Apps</div>
          </div>
        </div>
      </div>
      
      <div id="scan-results" class="hidden">
        <h3 class="mb-4">Scan Results</h3>
        <div class="grid grid-cols-2 gap-4">
           <div class="card border border-danger">
              <div class="flex justify-between items-start">
                <div>
                  <h4 class="text-danger">High Risk SMS</h4>
                  <p class="text-sm text-muted mt-1">1 message containing potential phishing link.</p>
                </div>
                <span class="badge badge-danger">Danger</span>
              </div>
           </div>
           <div class="card border border-safe">
              <div class="flex justify-between items-start">
                <div>
                  <h4 class="text-safe">App Permissions</h4>
                  <p class="text-sm text-muted mt-1">No overly permissive apps found.</p>
                </div>
                <span class="badge badge-safe">Safe</span>
              </div>
           </div>
        </div>
      </div>
    </div>
  `,

  "threat-details": `
    <div>
      <div class="flex items-center gap-2 mb-4">
        <a href="#dashboard" class="text-muted hover:text-primary"><i data-feather="arrow-left"></i></a>
        <h2>Threat Details</h2>
      </div>
      
      <div class="card mb-6">
        <div class="flex justify-between items-center mb-4 pb-4 border-b" style="border-color:var(--border)">
          <div class="flex items-center gap-3">
            <div class="p-2 bg-danger-bg rounded-full">
              <i data-feather="message-square" class="text-danger"></i>
            </div>
            <div>
              <h3 class="text-lg">Suspicious bank verification message</h3>
              <p class="text-sm text-muted">Sender: Unknown Number</p>
            </div>
          </div>
          <span class="badge badge-danger">High Risk</span>
        </div>
        
        <div class="mb-4">
          <h4 class="mb-2">Threat Explanation</h4>
          <p class="text-muted bg-main p-3 rounded" style="background:var(--bg-main)">
            "Dear customer, your bank account is temporarily locked. Click here to verify your identity: http://bit.ly/fake-bank"
          </p>
        </div>
        
        <div class="mb-6">
          <h4 class="mb-2">Risk Factors</h4>
          <ul class="text-sm text-muted flex flex-col gap-2">
            <li>• Contains a URL shortener often used to hide true destinations.</li>
            <li>• Urgency tactics ("temporarily locked").</li>
            <li>• Sender is not in your contacts and has no verified sender ID.</li>
          </ul>
        </div>
        
        <div class="mb-6">
          <h4 class="mb-2">Recommended Actions</h4>
          <p class="text-sm text-muted">Do not click the link. Delete the message immediately. If concerned, log into your bank app directly.</p>
        </div>
        
        <div class="flex gap-4">
          <button class="btn btn-primary" onclick="showToast('Threat marked as reviewed.')">Mark Reviewed</button>
          <button class="btn btn-outline" onclick="showToast('Threat reported.')">Report</button>
          <button class="btn btn-outline text-muted" onclick="showToast('Threat ignored.')">Ignore</button>
        </div>
      </div>
    </div>
  `,

  "ai-agent": `
    <div class="flex flex-col h-full">
      <h2 class="mb-4">CyberGuard Agent</h2>
      <p class="text-muted mb-4 text-sm">Ask your AI assistant to analyze a message, check a link, or give safety advice.</p>
      
      <div class="chat-container">
        <div class="chat-messages" id="chat-messages">
          <div class="chat-message bot">
            Hello! I'm your CyberGuard Agent. I can help analyze suspicious messages, links, or app permissions. How can I protect you today?
          </div>
        </div>
        
        <div class="p-3 border-t bg-main flex gap-2 overflow-x-auto" style="border-color:var(--border); background:var(--bg-main)">
          <button class="badge badge-neutral cursor-pointer whitespace-nowrap quick-reply">Check a link</button>
          <button class="badge badge-neutral cursor-pointer whitespace-nowrap quick-reply">Analyze message</button>
          <button class="badge badge-neutral cursor-pointer whitespace-nowrap quick-reply">Explain alert</button>
          <button class="badge badge-neutral cursor-pointer whitespace-nowrap quick-reply">Safety tips</button>
        </div>
        
        <div class="chat-input-area">
          <input type="text" id="chat-input" class="form-control" placeholder="Type a message or paste a link...">
          <button id="send-btn" class="btn btn-primary"><i data-feather="send"></i></button>
        </div>
      </div>
    </div>
  `,

  alerts: `
    <div>
      <div class="flex justify-between items-center mb-4">
        <h2>All Alerts</h2>
        <select class="form-control" style="width:auto" id="alert-filter">
          <option value="all">All Alerts</option>
          <option value="danger">High Risk</option>
          <option value="warning">Warning</option>
          <option value="safe">Resolved</option>
        </select>
      </div>
      
      <div class="flex flex-col gap-4" id="alerts-list">
        <div class="card flex justify-between items-center alert-item" data-type="danger">
          <div class="flex items-center gap-4">
            <i data-feather="message-square" class="text-danger"></i>
            <div>
              <div class="font-medium">Suspicious bank verification message</div>
              <div class="text-sm text-muted">Today, 10:30 AM</div>
            </div>
          </div>
          <button class="btn btn-outline text-sm" onclick="resolveAlert(this)">Mark Resolved</button>
        </div>
        
        <div class="card flex justify-between items-center alert-item" data-type="danger">
          <div class="flex items-center gap-4">
            <i data-feather="link" class="text-danger"></i>
            <div>
              <div class="font-medium">Unknown shortened payment link</div>
              <div class="text-sm text-muted">Yesterday</div>
            </div>
          </div>
          <button class="btn btn-outline text-sm" onclick="resolveAlert(this)">Mark Resolved</button>
        </div>
        
        <div class="card flex justify-between items-center alert-item" data-type="warning">
          <div class="flex items-center gap-4">
            <i data-feather="unlock" class="text-warning"></i>
            <div>
              <div class="font-medium">App requesting contacts & microphone</div>
              <div class="text-sm text-muted">May 8th</div>
            </div>
          </div>
          <button class="btn btn-outline text-sm" onclick="resolveAlert(this)">Mark Resolved</button>
        </div>
      </div>
    </div>
  `,

  tips: `
    <div>
      <h2 class="mb-4">Security Tips</h2>
      <div class="grid grid-cols-2 gap-4">
        <div class="card">
          <div class="flex items-center gap-3 mb-2">
            <i data-feather="key" class="text-accent"></i>
            <h4 class="m-0">Never share OTP</h4>
          </div>
          <p class="text-sm text-muted">Banks and tech companies will never ask for your One Time Password. If someone asks, it's a scam.</p>
        </div>
        <div class="card">
          <div class="flex items-center gap-3 mb-2">
            <i data-feather="link-2" class="text-accent"></i>
            <h4 class="m-0">Avoid unknown links</h4>
          </div>
          <p class="text-sm text-muted">Do not click on links sent by unknown numbers, especially those promising free gifts or urgent account updates.</p>
        </div>
        <div class="card">
          <div class="flex items-center gap-3 mb-2">
            <i data-feather="eye-off" class="text-accent"></i>
            <h4 class="m-0">Review app permissions</h4>
          </div>
          <p class="text-sm text-muted">Regularly check which apps have access to your camera, microphone, and location. Revoke unnecessary access.</p>
        </div>
        <div class="card">
          <div class="flex items-center gap-3 mb-2">
            <i data-feather="smartphone" class="text-accent"></i>
            <h4 class="m-0">Keep phone updated</h4>
          </div>
          <p class="text-sm text-muted">Software updates contain vital security patches. Always keep your OS and apps up to date.</p>
        </div>
        <div class="card">
          <div class="flex items-center gap-3 mb-2">
            <i data-feather="shield" class="text-accent"></i>
            <h4 class="m-0">Use official apps only</h4>
          </div>
          <p class="text-sm text-muted">Only download apps from the official Google Play Store or Apple App Store to avoid malware.</p>
        </div>
      </div>
    </div>
  `,

  support: `
    <div class="container mt-6 mb-6 max-w-3xl" style="max-width:800px">
      <h2 class="text-center mb-6">Help & Support</h2>
      
      <div class="mb-6 relative">
        <input type="text" class="form-control pl-10" placeholder="Search for help..." style="padding-left: 2.5rem;">
        <i data-feather="search" class="absolute left-3 top-3 text-muted"></i>
      </div>
      
      <div class="grid grid-cols-2 gap-4 mb-8">
        <div class="card text-center cursor-pointer hover-bg-main" style="cursor:pointer">
          <i data-feather="user" class="mb-2 text-accent mx-auto"></i>
          <span class="font-medium text-sm">Account & Login</span>
        </div>
        <div class="card text-center cursor-pointer hover-bg-main" style="cursor:pointer">
          <i data-feather="shield" class="mb-2 text-accent mx-auto"></i>
          <span class="font-medium text-sm">Threat Scanning</span>
        </div>
        <div class="card text-center cursor-pointer hover-bg-main" style="cursor:pointer">
          <i data-feather="bell" class="mb-2 text-accent mx-auto"></i>
          <span class="font-medium text-sm">Alerts</span>
        </div>
        <div class="card text-center cursor-pointer hover-bg-main" style="cursor:pointer">
          <i data-feather="lock" class="mb-2 text-accent mx-auto"></i>
          <span class="font-medium text-sm">Privacy & Data</span>
        </div>
      </div>
      
      <h3 class="mb-4">Contact Support</h3>
      <div class="card">
        <form onsubmit="event.preventDefault(); showToast('Message sent to support!'); this.reset();">
          <div class="form-group">
            <label class="form-label">Subject</label>
            <input type="text" class="form-control" required>
          </div>
          <div class="form-group">
            <label class="form-label">Message</label>
            <textarea class="form-control" rows="4" required></textarea>
          </div>
          <button type="submit" class="btn btn-primary">Send Message</button>
        </form>
      </div>
    </div>
  `,

  login: `
    <div class="container flex justify-center items-center" style="min-height: calc(100vh - var(--topbar-height));">
      <div class="card" style="width: 100%; max-width: 400px;">
        <h2 class="text-center mb-6">Sign In</h2>
        <form onsubmit="handleAuthForm(event, 'login')">
          <div class="form-group">
            <label class="form-label">Email or Mobile Number</label>
            <input type="text" class="form-control" required placeholder="Enter email or mobile">
          </div>
          <div class="form-group">
            <label class="form-label">Password</label>
            <input type="password" class="form-control" required placeholder="Enter password">
          </div>
          <div class="flex justify-between items-center mb-4 text-sm">
            <label class="flex items-center gap-2 cursor-pointer">
              <input type="checkbox"> Remember me
            </label>
            <a href="#" class="text-accent">Forgot password?</a>
          </div>
          <button type="submit" class="btn btn-primary btn-block">Sign In</button>
          <div class="text-center mt-4 text-sm text-muted">
            Don't have an account? <a href="#signup" class="text-accent font-medium">Create account</a>
          </div>
        </form>
      </div>
    </div>
  `,

  signup: `
    <div class="container flex justify-center items-center py-6" style="min-height: calc(100vh - var(--topbar-height));">
      <div class="card" style="width: 100%; max-width: 400px;">
        <h2 class="text-center mb-6">Create Account</h2>
        <form onsubmit="handleAuthForm(event, 'signup')">
          <div class="form-group">
            <label class="form-label">Full Name</label>
            <input type="text" class="form-control" required placeholder="John Doe">
          </div>
          <div class="form-group">
            <label class="form-label">Email</label>
            <input type="email" class="form-control" required placeholder="john@example.com">
          </div>
          <div class="form-group">
            <label class="form-label">Mobile Number</label>
            <input type="tel" class="form-control" required placeholder="+1 234 567 8900">
          </div>
          <div class="form-group">
            <label class="form-label">Password</label>
            <input type="password" class="form-control" required placeholder="Create a strong password">
          </div>
          <div class="form-group">
            <label class="form-label">Confirm Password</label>
            <input type="password" class="form-control" required placeholder="Confirm your password">
          </div>
          <div class="mb-4 text-sm">
            <label class="flex items-start gap-2 cursor-pointer">
              <input type="checkbox" required class="mt-1"> 
              <span class="text-muted">I agree to the Terms of Service and Privacy Policy.</span>
            </label>
          </div>
          <button type="submit" class="btn btn-primary btn-block">Create Account</button>
          <div class="text-center mt-4 text-sm text-muted">
            Already have an account? <a href="#login" class="text-accent font-medium">Sign in</a>
          </div>
        </form>
      </div>
    </div>
  `,

  otp: `
    <div class="container flex justify-center items-center py-6" style="min-height: calc(100vh - var(--topbar-height));">
      <div class="card text-center" style="width: 100%; max-width: 400px;">
        <h2 class="mb-2">Verify Account</h2>
        <p class="text-muted text-sm mb-6">We've sent a 6-digit code to your mobile number.</p>
        <form onsubmit="handleAuthForm(event, 'otp')">
          <div class="form-group">
            <input type="text" class="form-control text-center text-lg tracking-widest" style="letter-spacing: 0.5em;" required placeholder="000000" maxlength="6" pattern="[0-9]{6}">
          </div>
          <button type="submit" class="btn btn-primary btn-block mb-4">Verify</button>
          <div class="text-sm text-muted">
            Didn't receive the code? <button type="button" class="btn btn-outline text-xs mt-2" onclick="showToast('Code resent!')">Resend Code</button>
          </div>
        </form>
      </div>
    </div>
  `,

  settings: `
    <div class="max-w-3xl">
      <h2 class="mb-6">Profile & Settings</h2>
      
      <div class="card mb-6">
        <h3 class="mb-4 border-b pb-2" style="border-color:var(--border)">Account Details</h3>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="text-xs text-muted">Full Name</label>
            <div class="font-medium">John Doe</div>
          </div>
          <div>
            <label class="text-xs text-muted">Email</label>
            <div class="font-medium">john.doe@example.com</div>
          </div>
          <div>
            <label class="text-xs text-muted">Mobile</label>
            <div class="font-medium">+1 987 654 3210</div>
          </div>
          <div>
            <label class="text-xs text-muted">Plan</label>
            <div class="font-medium text-accent">Free Tier</div>
          </div>
        </div>
      </div>
      
      <div class="card mb-6">
        <h3 class="mb-4 border-b pb-2" style="border-color:var(--border)">Preferences</h3>
        
        <div class="flex flex-col gap-4">
          <div class="flex justify-between items-center">
            <div>
              <div class="font-medium">Real-time SMS Scanning</div>
              <div class="text-sm text-muted">Automatically scan incoming SMS</div>
            </div>
            <label class="switch relative inline-block w-10 h-6">
              <input type="checkbox" id="setting-sms" class="opacity-0 w-0 h-0" checked onchange="saveSetting(this)">
              <span class="slider absolute cursor-pointer top-0 left-0 right-0 bottom-0 bg-border rounded-full transition-all" style="background-color: var(--accent);"></span>
            </label>
          </div>
          
          <div class="flex justify-between items-center">
            <div>
              <div class="font-medium">Push Notifications</div>
              <div class="text-sm text-muted">Receive alerts for high-risk threats</div>
            </div>
            <label class="switch relative inline-block w-10 h-6">
              <input type="checkbox" id="setting-push" class="opacity-0 w-0 h-0" checked onchange="saveSetting(this)">
              <span class="slider absolute cursor-pointer top-0 left-0 right-0 bottom-0 bg-border rounded-full transition-all" style="background-color: var(--accent);"></span>
            </label>
          </div>
          
          <div class="flex justify-between items-center">
            <div>
              <div class="font-medium">Auto-block Malicious Links</div>
              <div class="text-sm text-muted">Prevent browser from opening known bad links</div>
            </div>
            <label class="switch relative inline-block w-10 h-6">
              <input type="checkbox" id="setting-block" class="opacity-0 w-0 h-0" onchange="saveSetting(this)">
              <span class="slider absolute cursor-pointer top-0 left-0 right-0 bottom-0 bg-border rounded-full transition-all" style="background-color: var(--border);"></span>
            </label>
          </div>
        </div>
      </div>
      
      <button class="btn btn-danger" onclick="logout()">Logout</button>
    </div>
  `
};
