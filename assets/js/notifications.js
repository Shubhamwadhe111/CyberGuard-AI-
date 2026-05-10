// ===== CYBERGUARD NOTIFICATION SYSTEM =====
(function () {
    // ---- Inject CSS ----
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'assets/css/notifications.css';
    document.head.appendChild(link);

    // ---- Notification Data ----
    const STORE_KEY = 'cg_notifications';

    const DEFAULT_NOTIFS = [
        { id: 1, type: 'danger',  icon: 'fa-triangle-exclamation', title: 'High Risk: Phishing SMS detected',       desc: 'A message from +91-XXXXX matches known phishing patterns.', time: '2 min ago',  read: false, cat: 'threat', link: 'alerts.html' },
        { id: 2, type: 'danger',  icon: 'fa-link',                  title: 'Malicious link blocked',                desc: 'CyberGuard blocked access to a suspected phishing page.',  time: '18 min ago', read: false, cat: 'threat', link: 'alerts.html' },
        { id: 3, type: 'warning', icon: 'fa-mobile-screen',         title: 'App permission risk detected',          desc: '"Calculator Pro" requested microphone and contacts access.', time: '1h ago',     read: false, cat: 'threat', link: 'alerts.html' },
        { id: 4, type: 'warning', icon: 'fa-wifi',                  title: 'Unsecured Wi-Fi network connected',     desc: 'Your device is connected to an open, unencrypted network.', time: '2h ago',     read: false, cat: 'threat', link: 'alerts.html' },
        { id: 5, type: 'info',    icon: 'fa-satellite-dish',        title: 'Scheduled scan completed',              desc: 'Daily scan finished. 2 warnings found. Tap to review.',    time: '3h ago',     read: true,  cat: 'scan',   link: 'scan.html' },
        { id: 6, type: 'info',    icon: 'fa-robot',                 title: 'AI Agent tip ready',                    desc: 'New security recommendation available in your AI Agent.',   time: '5h ago',     read: true,  cat: 'system', link: 'ai-agent.html' },
        { id: 7, type: 'success', icon: 'fa-shield-check',          title: 'Threat resolved successfully',          desc: 'Alert #3 has been marked resolved. Device is safer now.',  time: 'Yesterday',  read: true,  cat: 'system', link: 'alerts.html' },
        { id: 8, type: 'info',    icon: 'fa-download',              title: 'Security patch available',              desc: 'Android security update KB-2024-05 is ready to install.',   time: 'Yesterday',  read: true,  cat: 'system', link: 'security-tips.html' },
    ];

    function getNotifs() {
        try {
            const stored = localStorage.getItem(STORE_KEY);
            return stored ? JSON.parse(stored) : DEFAULT_NOTIFS;
        } catch { return DEFAULT_NOTIFS; }
    }
    function saveNotifs(notifs) {
        try { localStorage.setItem(STORE_KEY, JSON.stringify(notifs)); } catch {}
    }
    function unreadCount(notifs) { return notifs.filter(n => !n.read).length; }

    // ---- Build Dropdown HTML ----
    function buildDropdown(notifs, filter) {
        const filtered = filter === 'all' ? notifs : notifs.filter(n => n.cat === filter);
        const items = filtered.length ? filtered.map(n => `
            <div class="notif-item ${n.read ? '' : 'unread'}" data-id="${n.id}" onclick="window.__cgNotif.openItem(${n.id})">
                <div class="notif-item-icon notif-icon-${n.type}"><i class="fa-solid ${n.icon}"></i></div>
                <div class="notif-item-body">
                    <div class="notif-item-title">${n.title}</div>
                    <div class="notif-item-desc">${n.desc}</div>
                    <div class="notif-item-time"><i class="fa-regular fa-clock" style="font-size:0.6rem;"></i> ${n.time}</div>
                </div>
                <button class="notif-item-dismiss" onclick="event.stopPropagation();window.__cgNotif.dismiss(${n.id})" title="Dismiss"><i class="fa-solid fa-xmark"></i></button>
            </div>`).join('') :
            `<div class="notif-empty"><i class="fa-regular fa-bell-slash"></i>No notifications</div>`;

        return `
        <div class="notif-header">
            <div class="notif-header-title">
                Notifications
                ${unreadCount(notifs) > 0 ? `<span class="notif-unread-pill">${unreadCount(notifs)} new</span>` : ''}
            </div>
            <button class="notif-mark-all" onclick="window.__cgNotif.markAll()">Mark all read</button>
        </div>
        <div class="notif-tabs">
            <button class="notif-tab ${filter === 'all' ? 'active' : ''}" onclick="window.__cgNotif.setFilter('all')">All</button>
            <button class="notif-tab ${filter === 'threat' ? 'active' : ''}" onclick="window.__cgNotif.setFilter('threat')">Threats</button>
            <button class="notif-tab ${filter === 'scan' ? 'active' : ''}" onclick="window.__cgNotif.setFilter('scan')">Scans</button>
            <button class="notif-tab ${filter === 'system' ? 'active' : ''}" onclick="window.__cgNotif.setFilter('system')">System</button>
        </div>
        <div class="notif-list">${items}</div>
        <div class="notif-footer">
            <a href="alerts.html">View All Alerts</a>
            <button onclick="window.__cgNotif.clearAll()">Clear All</button>
        </div>`;
    }

    // ---- Controller ----
    let currentFilter = 'all';
    let dropdownEl = null, badgeEl = null;

    window.__cgNotif = {
        setFilter(f) { currentFilter = f; this.render(); },
        markAll() {
            const n = getNotifs().map(x => ({ ...x, read: true }));
            saveNotifs(n); this.render();
        },
        dismiss(id) {
            const n = getNotifs().filter(x => x.id !== id);
            saveNotifs(n); this.render();
        },
        clearAll() {
            saveNotifs([]); this.render();
        },
        openItem(id) {
            const notifs = getNotifs();
            const notif = notifs.find(x => x.id === id);
            if (notif) {
                notif.read = true;
                saveNotifs(notifs);
                if (notif.link) window.location.href = notif.link;
            }
            this.render();
        },
        render() {
            if (!dropdownEl) return;
            const notifs = getNotifs();
            dropdownEl.innerHTML = buildDropdown(notifs, currentFilter);
            const uc = unreadCount(notifs);
            if (badgeEl) {
                badgeEl.textContent = uc;
                badgeEl.style.display = uc > 0 ? 'flex' : 'none';
            }
        },
        toggle() {
            if (!dropdownEl) return;
            dropdownEl.classList.toggle('open');
            if (dropdownEl.classList.contains('open')) this.render();
        },
        close() {
            if (dropdownEl) dropdownEl.classList.remove('open');
        }
    };

    // ---- Inject into Navbar ----
    function inject() {
        // Target the dedicated placeholder span
        const anchor = document.getElementById('navBellLink');
        if (!anchor) return;

        const uc = unreadCount(getNotifs());

        // Build wrapper
        const wrapper = document.createElement('div');
        wrapper.className = 'notif-wrapper';
        wrapper.innerHTML = `
            <button class="notif-bell-btn" id="notifBellBtn" aria-label="Notifications" title="Notifications">
                <i class="fa-solid fa-bell-concierge"></i>
                <span class="notif-badge" id="notifBadge" style="display:${uc > 0 ? 'flex' : 'none'};">${uc}</span>
            </button>
            <div class="notif-dropdown" id="notifDropdown"></div>`;

        // Replace the placeholder span
        anchor.replaceWith(wrapper);

        dropdownEl = document.getElementById('notifDropdown');
        badgeEl    = document.getElementById('notifBadge');

        // Toggle on click
        document.getElementById('notifBellBtn').addEventListener('click', (e) => {
            e.stopPropagation();
            window.__cgNotif.toggle();
        });

        // Close on outside click
        document.addEventListener('click', (e) => {
            if (!wrapper.contains(e.target)) window.__cgNotif.close();
        });

        // Initial render (fill badge)
        window.__cgNotif.render();

        // Simulate new notification after 30s (demo)
        setTimeout(() => {
            const notifs = getNotifs();
            const newN = { id: Date.now(), type: 'danger', icon: 'fa-triangle-exclamation', title: 'New threat detected in background scan', desc: 'CyberGuard identified a new smishing attempt in your SMS inbox.', time: 'Just now', read: false, cat: 'threat', link: 'alerts.html' };
            notifs.unshift(newN);
            saveNotifs(notifs);
            window.__cgNotif.render();
            // Flash bell
            const btn = document.getElementById('notifBellBtn');
            if (btn) { btn.style.color = 'var(--color-danger)'; setTimeout(() => btn.style.color = '', 2000); }
        }, 30000);
    }

    // Run after DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', inject);
    } else {
        inject();
    }
})();
