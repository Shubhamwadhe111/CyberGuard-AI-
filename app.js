// App State
let isLoggedIn = localStorage.getItem('cyberguard_auth') === 'true';

// Shell Templates
const publicShell = `
  <nav id="public-nav" class="navbar">
    <div class="container">
      <a href="#home" class="logo">
        <i data-feather="shield"></i> CyberGuard AI
      </a>
      <div class="nav-links">
        <a href="#features">Features</a>
        <a href="#support">Support</a>
        <a href="#login" class="btn btn-outline" style="padding: 0.375rem 1rem;">Login</a>
        <a href="#signup" class="btn btn-primary" style="padding: 0.375rem 1rem;">Get Started</a>
      </div>
      <button class="mobile-menu-btn" onclick="toggleMobileMenu()">
        <i data-feather="menu"></i>
      </button>
    </div>
  </nav>
  <main id="content-area" class="public-layout flex-1"></main>
  <footer class="bg-card border-t py-6 text-center text-muted text-sm mt-auto" style="border-top:1px solid var(--border)">
    &copy; 2026 CyberGuard AI. All rights reserved.
  </footer>
`;

const appShell = `
  <div class="app-layout logged-in">
    <!-- Desktop Sidebar -->
    <aside id="app-sidebar" class="sidebar">
      <div class="sidebar-header">
        <a href="#dashboard" class="logo">
          <i data-feather="shield"></i> CyberGuard AI
        </a>
      </div>
      <div class="sidebar-nav">
        <a href="#dashboard" class="nav-item" data-path="dashboard"><i data-feather="grid"></i> Dashboard</a>
        <a href="#scan" class="nav-item" data-path="scan"><i data-feather="search"></i> System Scan</a>
        <a href="#alerts" class="nav-item" data-path="alerts"><i data-feather="bell"></i> Alerts</a>
        <a href="#ai-agent" class="nav-item" data-path="ai-agent"><i data-feather="cpu"></i> CyberGuard Agent</a>
        <a href="#tips" class="nav-item" data-path="tips"><i data-feather="info"></i> Security Tips</a>
        <a href="#settings" class="nav-item" data-path="settings"><i data-feather="settings"></i> Settings</a>
      </div>
    </aside>
    
    <div class="main-content">
      <header class="topbar">
        <div class="flex items-center gap-4">
          <h2 class="text-lg hidden md:block" id="page-title">Dashboard</h2>
        </div>
        <div class="flex items-center gap-4">
          <span class="badge badge-safe"><i data-feather="check" class="mr-1" style="width:12px"></i> Protected</span>
          <a href="#settings" class="w-8 h-8 rounded-full bg-main flex items-center justify-center text-primary" style="background:var(--bg-main)">
            <i data-feather="user"></i>
          </a>
        </div>
      </header>
      
      <main id="content-area" class="content-area"></main>
    </div>
    
    <!-- Mobile Bottom Navigation -->
    <nav class="bottom-nav">
      <a href="#dashboard" class="bottom-nav-item" data-path="dashboard"><i data-feather="grid"></i><span>Home</span></a>
      <a href="#scan" class="bottom-nav-item" data-path="scan"><i data-feather="search"></i><span>Scan</span></a>
      <a href="#ai-agent" class="bottom-nav-item" data-path="ai-agent"><i data-feather="cpu"></i><span>Agent</span></a>
      <a href="#alerts" class="bottom-nav-item" data-path="alerts"><i data-feather="bell"></i><span>Alerts</span></a>
      <a href="#settings" class="bottom-nav-item" data-path="settings"><i data-feather="user"></i><span>Profile</span></a>
    </nav>
  </div>
`;

// Router
function renderShell() {
  const appContainer = document.getElementById('app');
  if (isLoggedIn) {
    appContainer.innerHTML = appShell;
  } else {
    appContainer.innerHTML = publicShell;
  }
  feather.replace();
}

function handleRoute() {
  let hash = window.location.hash.substring(1) || 'home';
  
  // Guard logged in routes
  const publicRoutes = ['home', 'features', 'support', 'login', 'signup', 'otp'];
  if (!isLoggedIn && !publicRoutes.includes(hash)) {
    window.location.hash = 'login';
    return;
  }
  if (isLoggedIn && publicRoutes.includes(hash)) {
    window.location.hash = 'dashboard';
    return;
  }

  const contentArea = document.getElementById('content-area');
  
  // Inject Page content
  if (pages[hash]) {
    contentArea.innerHTML = pages[hash];
  } else {
    contentArea.innerHTML = '<div class="container text-center mt-6"><h2>Page Not Found</h2><a href="#" class="btn btn-primary mt-4">Go Home</a></div>';
  }

  // Update Navigation Active States
  document.querySelectorAll('.nav-item, .bottom-nav-item').forEach(el => el.classList.remove('active'));
  document.querySelectorAll(`[data-path="${hash}"]`).forEach(el => el.classList.add('active'));

  // Run specific page scripts
  initPageScripts(hash);

  feather.replace();
}

function initPageScripts(hash) {
  if (hash === 'scan') {
    document.getElementById('start-scan-btn')?.addEventListener('click', startScan);
  }
  if (hash === 'ai-agent') {
    document.getElementById('send-btn')?.addEventListener('click', sendChatMessage);
    document.getElementById('chat-input')?.addEventListener('keypress', (e) => {
      if(e.key === 'Enter') sendChatMessage();
    });
    document.querySelectorAll('.quick-reply').forEach(btn => {
      btn.addEventListener('click', () => {
        document.getElementById('chat-input').value = btn.innerText;
        sendChatMessage();
      });
    });
  }
  if (hash === 'settings') {
    // Load setting state from localStorage
    ['sms', 'push', 'block'].forEach(id => {
      const el = document.getElementById('setting-' + id);
      if (el) {
        const val = localStorage.getItem('setting-' + id);
        if (val !== null) {
          el.checked = val === 'true';
          updateSwitchUI(el);
        }
      }
    });
  }
  if (hash === 'alerts') {
    document.getElementById('alert-filter')?.addEventListener('change', filterAlerts);
  }
}

// Logic implementations
function handleAuthForm(event, type) {
  event.preventDefault();
  if (type === 'login') {
    login();
  } else if (type === 'signup') {
    window.location.hash = 'otp';
  } else if (type === 'otp') {
    login();
  }
}

function login() {
  localStorage.setItem('cyberguard_auth', 'true');
  isLoggedIn = true;
  renderShell();
  window.location.hash = 'dashboard';
  showToast('Successfully logged in!');
}

function logout() {
  localStorage.setItem('cyberguard_auth', 'false');
  isLoggedIn = false;
  renderShell();
  window.location.hash = 'home';
  showToast('Logged out securely.');
}

function startScan() {
  const btn = document.getElementById('start-scan-btn');
  const area = document.getElementById('scan-progress-area');
  const bar = document.getElementById('scan-progress-bar');
  const pct = document.getElementById('scan-percentage');
  const results = document.getElementById('scan-results');
  
  btn.disabled = true;
  area.classList.remove('hidden');
  results.classList.add('hidden');
  
  let progress = 0;
  let interval = setInterval(() => {
    progress += Math.floor(Math.random() * 15) + 5;
    if (progress > 100) progress = 100;
    
    bar.style.width = progress + '%';
    pct.innerText = progress + '%';
    
    if (progress > 25) document.getElementById('scan-step-1').style.opacity = '1';
    if (progress > 50) document.getElementById('scan-step-2').style.opacity = '1';
    if (progress > 75) document.getElementById('scan-step-3').style.opacity = '1';
    
    if (progress === 100) {
      clearInterval(interval);
      document.getElementById('scan-step-4').style.opacity = '1';
      setTimeout(() => {
        area.classList.add('hidden');
        results.classList.remove('hidden');
        btn.disabled = false;
        btn.innerText = "Scan Again";
        showToast('Scan completed!');
      }, 500);
    }
  }, 300);
}

function sendChatMessage() {
  const input = document.getElementById('chat-input');
  const text = input.value.trim();
  if (!text) return;
  
  const messages = document.getElementById('chat-messages');
  
  // Add user message
  const userDiv = document.createElement('div');
  userDiv.className = 'chat-message user';
  userDiv.innerText = text;
  messages.appendChild(userDiv);
  
  input.value = '';
  messages.scrollTop = messages.scrollHeight;
  
  // Bot reply demo
  setTimeout(() => {
    const botDiv = document.createElement('div');
    botDiv.className = 'chat-message bot';
    
    let reply = "I'm analyzing that right now...";
    const lower = text.toLowerCase();
    
    if (lower.includes('link') || lower.includes('http')) {
      reply = "That link appears to be highly suspicious and is known for phishing. Do NOT click it.";
    } else if (lower.includes('message') || lower.includes('sms')) {
      reply = "That message uses urgency and requests sensitive info. It is a classic social engineering attempt. Please delete it.";
    } else if (lower.includes('tip')) {
      reply = "Always keep your phone's OS updated. Updates contain critical security patches!";
    } else {
      reply = "Based on our AI analysis, your device is currently safe. Please let me know if you notice any unusual app behavior.";
    }
    
    botDiv.innerText = reply;
    messages.appendChild(botDiv);
    messages.scrollTop = messages.scrollHeight;
  }, 800);
}

function resolveAlert(btn) {
  const item = btn.closest('.alert-item');
  item.style.opacity = '0.5';
  btn.innerText = 'Resolved';
  btn.disabled = true;
  item.dataset.type = 'safe';
  showToast('Alert marked as resolved.');
  feather.replace();
}

function filterAlerts(e) {
  const val = e.target.value;
  document.querySelectorAll('.alert-item').forEach(item => {
    if (val === 'all' || item.dataset.type === val) {
      item.style.display = 'flex';
    } else {
      item.style.display = 'none';
    }
  });
}

function saveSetting(el) {
  const id = el.id;
  localStorage.setItem(id, el.checked);
  updateSwitchUI(el);
  showToast('Preferences updated.');
}

function updateSwitchUI(el) {
  const slider = el.nextElementSibling;
  if (el.checked) {
    slider.style.backgroundColor = 'var(--accent)';
  } else {
    slider.style.backgroundColor = 'var(--border)';
  }
}

function showToast(message) {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<i data-feather="info"></i> ${message}`;
  container.appendChild(toast);
  feather.replace();
  
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

function toggleMobileMenu() {
  const links = document.querySelector('.nav-links');
  if (links) {
    if (links.style.display === 'flex') {
      links.style.display = 'none';
    } else {
      links.style.display = 'flex';
      links.style.flexDirection = 'column';
      links.style.position = 'absolute';
      links.style.top = '100%';
      links.style.left = '0';
      links.style.right = '0';
      links.style.background = 'var(--bg-card)';
      links.style.padding = '1rem';
      links.style.borderBottom = '1px solid var(--border)';
    }
  }
}

// Initialization
window.addEventListener('hashchange', handleRoute);
document.addEventListener('DOMContentLoaded', () => {
  renderShell();
  handleRoute();
});
