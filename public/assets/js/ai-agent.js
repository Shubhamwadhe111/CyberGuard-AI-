// ===== CYBERGUARD AI AGENT - TRAINED KNOWLEDGE BASE =====

const KB = [
  // --- PHISHING ---
  { keys: ['phishing','phish','fake','scam','fraud'], risk: 'high',
    reply: `<p><strong>🎣 Phishing</strong> is when attackers disguise themselves as trusted sources to steal your data.</p>
    <div class="ag-risk-box high"><i class="fa-solid fa-triangle-exclamation"></i> High Risk Topic</div>
    <p style="margin-top:0.75rem;"><strong>Common signs:</strong></p>
    <ul><li>Urgency: "Act NOW or your account will close!"</li><li>Unknown sender with a known brand name</li><li>Shortened or misspelled URLs (paypa1.com)</li><li>Requests for OTP, password, or card details</li></ul>
    <p style="margin-top:0.75rem;"><strong>✅ What to do:</strong></p>
    <ul><li>Never click links in suspicious messages</li><li>Call the company directly using their official number</li><li>Report the sender to your carrier</li><li>Run a CyberGuard scan immediately</li></ul>
    <div class="ag-bubble-actions"><a href="scan.html" class="ag-bubble-btn"><i class="fa-solid fa-satellite-dish"></i> Run Scan</a><a href="security-tips.html" class="ag-bubble-btn">Learn More</a></div>`, tips:1, threats:1 },

  // --- SMS PHISHING (SMISHING) ---
  { keys: ['sms','smish','text message','message','bank sms','otp sms'], risk: 'high',
    reply: `<p><strong>📱 SMS Phishing (Smishing)</strong> is one of the fastest-growing mobile threats.</p>
    <div class="ag-risk-box high"><i class="fa-solid fa-triangle-exclamation"></i> High Risk</div>
    <p style="margin-top:0.75rem;"><strong>Red flags in SMS:</strong></p>
    <ul><li>"Your bank account is suspended" from an unknown number</li><li>Links to verify payment or confirm details</li><li>Prize / lottery win notifications</li><li>Delivery failure with a suspicious link</li></ul>
    <p style="margin-top:0.75rem;"><strong>✅ Action steps:</strong></p>
    <ul><li>Do NOT reply or click any link</li><li>Block &amp; report the number</li><li>Paste the SMS text here and I'll analyze it</li><li>Check your alerts for flagged messages</li></ul>
    <div class="ag-bubble-actions"><a href="alerts.html" class="ag-bubble-btn">View Alerts</a><a href="scan.html" class="ag-bubble-btn">Scan SMS</a></div>`, tips:1, threats:1 },

  // --- URL / LINK CHECK ---
  { keys: ['link','url','website','site','click','bit.ly','http','www'], risk: 'medium',
    reply: `<p><strong>🔗 Suspicious URL Analysis</strong></p>
    <p>Here's how I evaluate a link for safety:</p>
    <ul><li><strong>Shortened URLs</strong> (bit.ly, tinyurl) hide the real destination — always suspicious</li><li><strong>New domains</strong> registered &lt;30 days ago are a major red flag</li><li><strong>HTTP (not HTTPS)</strong> means no encryption</li><li><strong>Typosquatting</strong>: paypa1.com, amaz0n.net, micros0ft.com</li><li><strong>Mismatched branding</strong>: "Netflix support" from a gmail address</li></ul>
    <div class="ag-risk-box medium"><i class="fa-solid fa-circle-exclamation"></i> Always verify before clicking</div>
    <p style="margin-top:0.75rem;"><strong>✅ Safe steps:</strong></p>
    <ul><li>Use our URL Checker on the <a href="scan.html" style="color:var(--color-accent);">Scan page</a></li><li>Hover over links to preview the destination</li><li>Type URLs manually instead of clicking</li></ul>
    <div class="ag-bubble-actions"><a href="scan.html" class="ag-bubble-btn"><i class="fa-solid fa-link"></i> Check URL Now</a></div>`, tips:1, urls:1 },

  // --- APP PERMISSIONS ---
  { keys: ['permission','app','install','access','microphone','camera','contact','location','storage'], risk: 'medium',
    reply: `<p><strong>📱 App Permission Risk Analysis</strong></p>
    <p>Dangerous permission combinations to watch for:</p>
    <ul><li>🎤 <strong>Microphone + Contacts</strong> in a Flashlight or Calculator app</li><li>📍 <strong>Location + Camera</strong> in a game with no map feature</li><li>📁 <strong>Storage + Network</strong> in a simple utility app</li><li>📞 <strong>Call logs + SMS</strong> in any non-messaging app</li></ul>
    <div class="ag-risk-box medium"><i class="fa-solid fa-mobile-screen"></i> These combos suggest data harvesting</div>
    <p style="margin-top:0.75rem;"><strong>✅ How to fix:</strong></p>
    <ul><li>Go to <strong>Settings → Apps → [App Name] → Permissions</strong></li><li>Revoke any permission that seems unrelated to the app's function</li><li>Uninstall apps you don't recognize or use</li><li>Only install apps from the official Play Store / App Store</li></ul>
    <div class="ag-bubble-actions"><a href="scan.html" class="ag-bubble-btn">App Audit Scan</a><a href="alerts.html" class="ag-bubble-btn">View App Alerts</a></div>`, tips:1, threats:1 },

  // --- OTP FRAUD ---
  { keys: ['otp','one time password','verification code','2fa','two factor','pin'], risk: 'high',
    reply: `<p><strong>🔑 OTP Fraud — How it works &amp; how to stay safe</strong></p>
    <div class="ag-risk-box high"><i class="fa-solid fa-triangle-exclamation"></i> Critical: Never share your OTP</div>
    <p style="margin-top:0.75rem;"><strong>How attackers steal OTPs:</strong></p>
    <ul><li><strong>Social engineering</strong>: Calling as "bank support" and asking you to read the OTP</li><li><strong>SIM Swapping</strong>: Convincing your carrier to transfer your number to their SIM</li><li><strong>Fake apps</strong>: Malicious apps that read SMS in background</li><li><strong>Phishing pages</strong>: Fake login portals that capture your OTP in real-time</li></ul>
    <p style="margin-top:0.75rem;"><strong>✅ Protect yourself:</strong></p>
    <ul><li><strong>NEVER</strong> share OTP with anyone — banks never ask</li><li>Enable SIM lock with your carrier</li><li>Use authenticator apps instead of SMS-based 2FA</li><li>If OTP arrives unexpectedly, your account may be under attack — change password immediately</li></ul>`, tips:1, threats:1 },

  // --- WIFI / NETWORK ---
  { keys: ['wifi','wi-fi','network','public wifi','hotspot','vpn','router','connection'], risk: 'medium',
    reply: `<p><strong>📶 Public Wi-Fi Safety Guide</strong></p>
    <p>Public Wi-Fi is a prime hunting ground for attackers.</p>
    <div class="ag-risk-box medium"><i class="fa-solid fa-wifi"></i> Medium Risk — Use with caution</div>
    <p style="margin-top:0.75rem;"><strong>Risks on public Wi-Fi:</strong></p>
    <ul><li><strong>Man-in-the-Middle (MITM)</strong>: Attacker intercepts your data between you and the server</li><li><strong>Evil Twin attacks</strong>: Fake hotspot named "Starbucks_Free_WiFi" that looks legitimate</li><li><strong>Packet sniffing</strong>: Capturing unencrypted data passing through the network</li><li><strong>Session hijacking</strong>: Stealing your login cookies</li></ul>
    <p style="margin-top:0.75rem;"><strong>✅ Stay safe:</strong></p>
    <ul><li>Use a <strong>VPN</strong> on public networks</li><li>Avoid banking or shopping on public Wi-Fi</li><li>Verify the exact network name with staff before connecting</li><li>Enable "forget network" after use</li><li>Use mobile data for sensitive tasks</li></ul>`, tips:1 },

  // --- HOW TO SECURE PHONE ---
  { keys: ['secure','protect','hacker','safe','privacy','security'], risk: 'low',
    reply: `<p><strong>🔒 Complete Phone Security Checklist</strong></p>
    <div class="ag-risk-box low"><i class="fa-solid fa-shield-check"></i> Follow these steps for maximum protection</div>
    <p style="margin-top:0.75rem;"><strong>Immediate actions:</strong></p>
    <ul>
      <li>✅ Enable screen lock (PIN/biometric)</li>
      <li>✅ Keep OS and apps updated</li>
      <li>✅ Enable 2-Factor Authentication on all accounts</li>
      <li>✅ Review and revoke unnecessary app permissions</li>
      <li>✅ Only install apps from official stores</li>
      <li>✅ Use a strong, unique password for each account</li>
      <li>✅ Encrypt your device (usually on by default)</li>
      <li>✅ Disable Bluetooth and NFC when not in use</li>
      <li>✅ Back up data regularly to a secure location</li>
      <li>✅ Install CyberGuard and run weekly scans</li>
    </ul>
    <div class="ag-bubble-actions"><a href="scan.html" class="ag-bubble-btn">Run Full Scan</a><a href="security-tips.html" class="ag-bubble-btn">Security Tips</a></div>`, tips:1 },

  // --- IDENTITY THEFT ---
  { keys: ['identity','id theft','personal data','data breach','stolen','account hacked','hacked'], risk: 'high',
    reply: `<p><strong>🪪 Identity Theft &amp; Data Breach Response</strong></p>
    <div class="ag-risk-box high"><i class="fa-solid fa-triangle-exclamation"></i> Act immediately if you suspect compromise</div>
    <p style="margin-top:0.75rem;"><strong>Signs your identity may be stolen:</strong></p>
    <ul><li>Unexpected OTPs arriving on your phone</li><li>Unrecognized transactions in your bank account</li><li>Accounts locked out unexpectedly</li><li>Friends receiving spam from your accounts</li></ul>
    <p style="margin-top:0.75rem;"><strong>✅ Immediate steps:</strong></p>
    <ul><li>Change passwords on all critical accounts (email, banking first)</li><li>Enable 2FA everywhere immediately</li><li>Contact your bank to freeze accounts if needed</li><li>Check Have I Been Pwned (haveibeenpwned.com) for breaches</li><li>Report to cybercrime portal: cybercrime.gov.in</li></ul>`, tips:1, threats:1 },

  // --- CLICKED PHISHING LINK ---
  { keys: ['clicked','opened link','visited site','accidentally clicked','mistake'], risk: 'high',
    reply: `<p><strong>🚨 You Clicked a Suspicious Link — Act Fast!</strong></p>
    <div class="ag-risk-box high"><i class="fa-solid fa-triangle-exclamation"></i> Take action within the next 5 minutes</div>
    <p style="margin-top:0.75rem;"><strong>Step-by-step response:</strong></p>
    <ul>
      <li><strong>Step 1:</strong> Disconnect from Wi-Fi/mobile data immediately</li>
      <li><strong>Step 2:</strong> Do NOT enter any information on the page that opened</li>
      <li><strong>Step 3:</strong> Clear your browser cache and cookies</li>
      <li><strong>Step 4:</strong> Change passwords for any account you were logged into</li>
      <li><strong>Step 5:</strong> Run a full CyberGuard scan right now</li>
      <li><strong>Step 6:</strong> Check your bank statements for unauthorized transactions</li>
      <li><strong>Step 7:</strong> Enable 2FA on all critical accounts</li>
    </ul>
    <p style="margin-top:0.5rem;font-size:0.85rem;color:var(--text-muted);">The faster you act, the less damage can be done.</p>
    <div class="ag-bubble-actions"><a href="scan.html" class="ag-bubble-btn"><i class="fa-solid fa-satellite-dish"></i> Scan Now</a><a href="alerts.html" class="ag-bubble-btn">Check Alerts</a></div>`, tips:1, threats:1 },

  // --- MALWARE ---
  { keys: ['malware','virus','spyware','ransomware','trojan','keylogger'], risk: 'high',
    reply: `<p><strong>🦠 Malware on Mobile Devices</strong></p>
    <div class="ag-risk-box high"><i class="fa-solid fa-triangle-exclamation"></i> Serious threat — act now</div>
    <p style="margin-top:0.75rem;"><strong>Types of mobile malware:</strong></p>
    <ul><li><strong>Spyware</strong>: Silently reads SMS, calls, and tracks location</li><li><strong>Ransomware</strong>: Encrypts your files and demands payment</li><li><strong>Keylogger</strong>: Records everything you type (passwords, cards)</li><li><strong>Trojan</strong>: Hidden inside legitimate-looking apps</li><li><strong>Adware</strong>: Bombards you with ads and collects data</li></ul>
    <p style="margin-top:0.75rem;"><strong>✅ Remove malware:</strong></p>
    <ul><li>Run a full device scan immediately</li><li>Identify and uninstall the suspicious app</li><li>Revoke all permissions from unknown apps</li><li>Factory reset if infection is severe</li><li>Restore from a clean backup</li></ul>
    <div class="ag-bubble-actions"><a href="scan.html" class="ag-bubble-btn">Full Device Scan</a></div>`, tips:1, threats:1 },

  // --- EXPLAIN ALERT ---
  { keys: ['alert','explain','what is','notification','warning'], risk: 'low',
    reply: `<p><strong>🔔 Understanding Your Security Alerts</strong></p>
    <p>CyberGuard generates alerts in 3 severity levels:</p>
    <ul>
      <li><strong style="color:var(--color-danger);">🔴 High Risk</strong> — Immediate action required. A confirmed threat has been detected (phishing link, malicious SMS, credential harvesting attempt).</li>
      <li><strong style="color:var(--color-warning);">🟡 Warning</strong> — Potential risk detected. Review and decide action (suspicious app permission, unencrypted Wi-Fi, shortened URL).</li>
      <li><strong style="color:#60a5fa;">🔵 Info</strong> — Informational only. No immediate threat (OS update available, scan completed, weekly report).</li>
    </ul>
    <p style="margin-top:0.75rem;"><strong>✅ Best practice:</strong> Resolve High Risk alerts within 24 hours and review Warnings weekly.</p>
    <div class="ag-bubble-actions"><a href="alerts.html" class="ag-bubble-btn">View My Alerts</a><a href="dashboard.html" class="ag-bubble-btn">Dashboard</a></div>`, tips:1 },

  // --- SOCIAL ENGINEERING ---
  { keys: ['social engineering','manipulation','impersonation','caller','call','fake support'], risk: 'high',
    reply: `<p><strong>🎭 Social Engineering Attacks</strong></p>
    <p>Attackers manipulate human psychology — not technology — to gain access.</p>
    <div class="ag-risk-box high"><i class="fa-solid fa-triangle-exclamation"></i> Humans are the #1 attack vector</div>
    <p style="margin-top:0.75rem;"><strong>Common tactics:</strong></p>
    <ul><li><strong>Vishing</strong>: Phone calls pretending to be bank/tech support</li><li><strong>Pretexting</strong>: Creating a believable backstory to extract info</li><li><strong>Baiting</strong>: Offering free USB drives or prizes containing malware</li><li><strong>Urgency</strong>: "Your account will be deleted in 2 hours!"</li></ul>
    <p style="margin-top:0.75rem;"><strong>✅ Defense:</strong></p>
    <ul><li>Verify caller identity by hanging up and calling the official number</li><li>Never share OTP, PIN, or password on a call</li><li>Legitimate companies never ask for passwords</li><li>When in doubt, say "I'll call you back" and verify</li></ul>`, tips:1, threats:1 },

  // --- PASSWORD ---
  { keys: ['password','weak password','strong password','password manager'], risk: 'low',
    reply: `<p><strong>🔑 Password Security Best Practices</strong></p>
    <div class="ag-risk-box low"><i class="fa-solid fa-shield-check"></i> Strong passwords are your first line of defense</div>
    <p style="margin-top:0.75rem;"><strong>Rules for a strong password:</strong></p>
    <ul><li>At least <strong>12 characters</strong> long</li><li>Mix of uppercase, lowercase, numbers, and symbols</li><li><strong>Never reuse</strong> passwords across sites</li><li>Avoid personal info (name, birthday, pet name)</li><li>Use a <strong>passphrase</strong>: "Coffee!Runs@Midnight2024"</li></ul>
    <p style="margin-top:0.75rem;"><strong>✅ Tools:</strong></p>
    <ul><li>Use a <strong>password manager</strong> (Bitwarden, 1Password) to generate and store passwords</li><li>Enable 2FA (authenticator app, not SMS if possible)</li><li>Check if your email is in breaches: haveibeenpwned.com</li></ul>`, tips:1 },

  // --- DEFAULT ---
  { keys: [], risk: 'low',
    reply: `<p>I'm your <strong>CyberGuard Security Agent</strong>, specialized in mobile cybersecurity.</p>
    <p style="margin-top:0.5rem;">I can help you with:</p>
    <ul><li>🔗 Analyzing suspicious links or URLs</li><li>📱 SMS and message threat analysis</li><li>📲 App permission risks</li><li>🔑 OTP and identity fraud</li><li>📶 Wi-Fi and network safety</li><li>🛡️ Step-by-step threat resolution</li></ul>
    <p style="margin-top:0.5rem;">Try asking: <em>"Is this SMS safe?"</em> or <em>"My app wants microphone access"</em></p>`, tips:0 }
];

// ===== STATE =====
let statMessages = 0, statThreats = 0, statUrls = 0, statTips = 0;

function updateStats(r) {
  statMessages++;
  if (r.threats) statThreats++;
  if (r.urls)    statUrls++;
  if (r.tips)    statTips++;
  const s = id => document.getElementById(id);
  if (s('statMessages')) s('statMessages').textContent = statMessages;
  if (s('statThreats'))  s('statThreats').textContent  = statThreats;
  if (s('statUrls'))     s('statUrls').textContent     = statUrls;
  if (s('statTips'))     s('statTips').textContent     = statTips;
}

// ===== GEMINI API CALL =====
async function fetchGeminiReply(text) {
  const token = localStorage.getItem('cyberguard_token');
  const res = await fetch('/api/agent/analyze', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-auth-token': token
    },
    body: JSON.stringify({ message: text })
  });
  if (!res.ok) throw new Error('Agent API error');
  const data = await res.json();
  return data.reply;
}

function getTime() {
  return new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'});
}

function appendMsg(htmlOrText, role, time) {
  const chat = document.getElementById('chatMessages');
  const isBot = role === 'bot';
  const div = document.createElement('div');
  div.className = `ag-msg ${role}`;

  const avatarDiv = document.createElement('div');
  avatarDiv.className = 'ag-msg-avatar';
  const avatarIcon = document.createElement('i');
  avatarIcon.className = isBot ? 'fa-solid fa-robot' : 'fa-solid fa-user';
  avatarDiv.appendChild(avatarIcon);
  div.appendChild(avatarDiv);

  const contentDiv = document.createElement('div');
  contentDiv.className = 'ag-msg-content';

  const bubbleDiv = document.createElement('div');
  bubbleDiv.className = `ag-msg-bubble ${role}`;
  if (role === 'user') {
    bubbleDiv.textContent = htmlOrText;
  } else if (htmlOrText instanceof Node) {
    // Safe: DOM node passed directly (e.g. from Gemini API reply built with createElement)
    bubbleDiv.appendChild(htmlOrText);
  } else {
    // Trusted HTML from local knowledge base only
    bubbleDiv.innerHTML = htmlOrText;
  }
  contentDiv.appendChild(bubbleDiv);

  const timeDiv = document.createElement('div');
  timeDiv.className = 'ag-msg-time';
  timeDiv.textContent = time;
  contentDiv.appendChild(timeDiv);

  div.appendChild(contentDiv);
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
}

function showTyping() {
  const chat = document.getElementById('chatMessages');
  const d = document.createElement('div');
  d.className = 'ag-msg bot'; d.id = 'typingIndicator';
  d.innerHTML = `<div class="ag-msg-avatar"><i class="fa-solid fa-robot"></i></div>
    <div class="ag-msg-content"><div class="ag-msg-bubble bot"><div class="ag-typing"><span></span><span></span><span></span></div></div></div>`;
  chat.appendChild(d); chat.scrollTop = chat.scrollHeight;
}

function removeTyping() {
  const t = document.getElementById('typingIndicator');
  if (t) t.remove();
}

window.sendMessage = async function() {
  const input = document.getElementById('chatInput');
  const text  = input.value.trim();
  if (!text) return;
  input.value = '';
  appendMsg(text, 'user', getTime());
  // Hide chips after first message
  const chips = document.getElementById('suggestionChips');
  if (chips) chips.style.display = 'none';
  showTyping();

  try {
    const reply = await fetchGeminiReply(text);
    removeTyping();
    // Build bot reply as DOM paragraphs (safe — no innerHTML for user/server text)
    const replyFrag = document.createDocumentFragment();
    reply.split('\n').filter(line => line.trim()).forEach(line => {
      const p = document.createElement('p');
      p.style.margin = '0.25rem 0';
      p.textContent = line;
      replyFrag.appendChild(p);
    });
    statMessages++;
    const el = document.getElementById('statMessages');
    if (el) el.textContent = statMessages;
    // Wrap fragment in a div to pass to appendMsg
    const replyWrapper = document.createElement('div');
    replyWrapper.appendChild(replyFrag);
    appendMsg(replyWrapper, 'bot', getTime());

    // Show risk panel for dangerous keywords
    const rp = document.getElementById('riskPanel');
    const rc = document.getElementById('riskContent');
    const lower = text.toLowerCase();
    if (rp && rc) {
      const isHigh = ['phishing','malware','virus','hack','otp','bank'].some(k => lower.includes(k));
      const isMed  = ['link','url','permission','wifi'].some(k => lower.includes(k));
      if (isHigh || isMed) {
        const level = isHigh ? 'HIGH' : 'MEDIUM';
        const color = isHigh ? 'var(--color-danger)' : 'var(--color-warning)';
        rc.innerHTML = '';
        const wrapper = document.createElement('div');
        wrapper.style.fontSize = '0.85rem';
        wrapper.style.color = 'var(--text-muted)';
        wrapper.style.marginTop = '0.5rem';
        
        const levelDiv = document.createElement('div');
        levelDiv.style.fontSize = '1.5rem';
        levelDiv.style.fontWeight = '800';
        levelDiv.style.color = color;
        levelDiv.textContent = level;
        
        const descDiv = document.createElement('div');
        descDiv.style.marginTop = '0.25rem';
        descDiv.innerHTML = 'Risk level for this query. <a href="scan.html" style="color:var(--color-accent);">Run a scan</a> for real-time analysis.';
        
        wrapper.appendChild(levelDiv);
        wrapper.appendChild(descDiv);
        rc.appendChild(wrapper);
        rp.style.display = 'block';
      }
    }
  } catch (err) {
    removeTyping();
    appendMsg('<p>⚠️ I could not reach the AI engine. Please make sure the server is running and try again.</p>', 'bot', getTime());
    console.error('Agent error:', err);
  }
};

window.sendChip = function(btn) {
  document.getElementById('chatInput').value = btn.textContent.replace(/^[^\s]+\s/, '');
  window.sendMessage();
};

window.quickAsk = function(q) {
  document.getElementById('chatInput').value = q;
  window.sendMessage();
};

window.clearChat = function() {
  const chat = document.getElementById('chatMessages');
  chat.innerHTML = '';
  appendMsg(`<p>🔄 <strong>New conversation started.</strong> How can I help you stay secure today?</p>`, 'bot', getTime());
  const chips = document.getElementById('suggestionChips');
  if (chips) chips.style.display = 'flex';
  const rp = document.getElementById('riskPanel');
  if (rp) rp.style.display = 'none';
  statMessages = statThreats = statUrls = statTips = 0;
  ['statMessages','statThreats','statUrls','statTips'].forEach(id => {
    const el = document.getElementById(id); if (el) el.textContent = '0';
  });
};

window.exportChat = function() {
  const msgs = document.querySelectorAll('.ag-msg-bubble');
  let text = 'CyberGuard AI Agent — Chat Export\n' + new Date().toLocaleString() + '\n\n';
  msgs.forEach((m,i) => { text += (i%2===0?'Agent: ':'You: ') + m.innerText + '\n\n'; });
  const a = document.createElement('a');
  a.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent(text);
  a.download = 'cyberguard-chat.txt'; a.click();
};

document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('chatInput');
  if (input) input.addEventListener('keydown', e => { if (e.key === 'Enter') window.sendMessage(); });

  // Automatically trigger query from URL parameter
  const urlParams = new URLSearchParams(window.location.search);
  const urlQuery = urlParams.get('query');
  if (urlQuery && input) {
    input.value = urlQuery;
    // Small delay to ensure everything is initialized
    setTimeout(() => {
      window.sendMessage();
    }, 400);
  }
});
