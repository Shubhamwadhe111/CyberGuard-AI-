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

    // ---- Build a single notification item as a DOM element ----
    function buildNotifItem(n) {
        const div = document.createElement('div');
        div.className = 'notif-item' + (n.read ? '' : ' unread');
        div.dataset.id = n.id;
        div.addEventListener('click', () => window.__cgNotif.openItem(n.id));

        const iconDiv = document.createElement('div');
        iconDiv.className = `notif-item-icon notif-icon-${n.type}`;
        const iconI = document.createElement('i');
        iconI.className = `fa-solid ${n.icon}`;
        iconDiv.appendChild(iconI);

        const bodyDiv = document.createElement('div');
        bodyDiv.className = 'notif-item-body';

        const titleDiv = document.createElement('div');
        titleDiv.className = 'notif-item-title';
        titleDiv.textContent = n.title;

        const descDiv = document.createElement('div');
        descDiv.className = 'notif-item-desc';
        descDiv.textContent = n.desc;

        const timeDiv = document.createElement('div');
        timeDiv.className = 'notif-item-time';
        const clockI = document.createElement('i');
        clockI.className = 'fa-regular fa-clock';
        clockI.style.fontSize = '0.6rem';
        timeDiv.appendChild(clockI);
        timeDiv.appendChild(document.createTextNode(' ' + n.time));

        bodyDiv.appendChild(titleDiv);
        bodyDiv.appendChild(descDiv);
        bodyDiv.appendChild(timeDiv);

        const dismissBtn = document.createElement('button');
        dismissBtn.className = 'notif-item-dismiss';
        dismissBtn.title = 'Dismiss';
        dismissBtn.addEventListener('click', (e) => { e.stopPropagation(); window.__cgNotif.dismiss(n.id); });
        const xmarkI = document.createElement('i');
        xmarkI.className = 'fa-solid fa-xmark';
        dismissBtn.appendChild(xmarkI);

        div.appendChild(iconDiv);
        div.appendChild(bodyDiv);
        div.appendChild(dismissBtn);
        return div;
    }

    // ---- Build Dropdown as DocumentFragment ----
    function buildDropdown(notifs, filter) {
        const filtered = filter === 'all' ? notifs : notifs.filter(n => n.cat === filter);
        const frag = document.createDocumentFragment();

        // Header
        const header = document.createElement('div');
        header.className = 'notif-header';
        const headerTitle = document.createElement('div');
        headerTitle.className = 'notif-header-title';
        headerTitle.textContent = 'Notifications';
        const uc = unreadCount(notifs);
        if (uc > 0) {
            const pill = document.createElement('span');
            pill.className = 'notif-unread-pill';
            pill.textContent = uc + ' new';
            headerTitle.appendChild(pill);
        }
        const markAllBtn = document.createElement('button');
        markAllBtn.className = 'notif-mark-all';
        markAllBtn.textContent = 'Mark all read';
        markAllBtn.addEventListener('click', () => window.__cgNotif.markAll());
        header.appendChild(headerTitle);
        header.appendChild(markAllBtn);
        frag.appendChild(header);

        // Tabs
        const tabsDiv = document.createElement('div');
        tabsDiv.className = 'notif-tabs';
        [['all', 'All'], ['threat', 'Threats'], ['scan', 'Scans'], ['system', 'System']].forEach(([val, label]) => {
            const tabBtn = document.createElement('button');
            tabBtn.className = 'notif-tab' + (filter === val ? ' active' : '');
            tabBtn.textContent = label;
            tabBtn.addEventListener('click', () => window.__cgNotif.setFilter(val));
            tabsDiv.appendChild(tabBtn);
        });
        frag.appendChild(tabsDiv);

        // List
        const listDiv = document.createElement('div');
        listDiv.className = 'notif-list';
        if (filtered.length) {
            filtered.forEach(n => listDiv.appendChild(buildNotifItem(n)));
        } else {
            const empty = document.createElement('div');
            empty.className = 'notif-empty';
            const emptyI = document.createElement('i');
            emptyI.className = 'fa-regular fa-bell-slash';
            empty.appendChild(emptyI);
            empty.appendChild(document.createTextNode('No notifications'));
            listDiv.appendChild(empty);
        }
        frag.appendChild(listDiv);

        // Footer
        const footerDiv = document.createElement('div');
        footerDiv.className = 'notif-footer';
        const footerLink = document.createElement('a');
        footerLink.href = 'alerts.html';
        footerLink.textContent = 'View All Alerts';
        const clearBtn = document.createElement('button');
        clearBtn.textContent = 'Clear All';
        clearBtn.addEventListener('click', () => window.__cgNotif.clearAll());
        footerDiv.appendChild(footerLink);
        footerDiv.appendChild(clearBtn);
        frag.appendChild(footerDiv);

        return frag;
    }

    // ---- Controller ----
    let currentFilter = 'all';

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
            const notifs = getNotifs();
            const uc = unreadCount(notifs);

            // Render on desktop dropdown if it exists
            const dd = document.getElementById('notifDropdown');
            if (dd) {
                dd.textContent = '';
                dd.appendChild(buildDropdown(notifs, currentFilter));
            }

            // Render on mobile dropdown if it exists
            const ddMobile = document.getElementById('notifDropdownMobile');
            if (ddMobile) {
                ddMobile.textContent = '';
                ddMobile.appendChild(buildDropdown(notifs, currentFilter));
            }

            // Update badges
            const badge = document.getElementById('notifBadge');
            if (badge) {
                badge.textContent = uc;
                badge.style.display = uc > 0 ? 'flex' : 'none';
            }
            const badgeMobile = document.getElementById('notifBadgeMobile');
            if (badgeMobile) {
                badgeMobile.textContent = uc;
                badgeMobile.style.display = uc > 0 ? 'flex' : 'none';
            }
        },
        toggle(dropdownEl) {
            if (!dropdownEl) return;
            // Close other dropdowns first
            document.querySelectorAll('.notif-dropdown').forEach(el => {
                if (el !== dropdownEl) el.classList.remove('open');
            });
            dropdownEl.classList.toggle('open');
            if (dropdownEl.classList.contains('open')) this.render();
        },
        close() {
            document.querySelectorAll('.notif-dropdown').forEach(el => el.classList.remove('open'));
        }
    };

    // ---- Inject into Navbar ----
    function inject() {
        // Desktop Anchor
        const anchor = document.getElementById('navBellLink');
        let wrapper = null;
        if (anchor) {
            const uc = unreadCount(getNotifs());
            wrapper = document.createElement('div');
            wrapper.className = 'notif-wrapper';

            const bellBtn = document.createElement('button');
            bellBtn.className = 'notif-bell-btn';
            bellBtn.id = 'notifBellBtn';
            bellBtn.setAttribute('aria-label', 'Notifications');
            bellBtn.title = 'Notifications';
            const bellI = document.createElement('i');
            bellI.className = 'fa-solid fa-bell';
            bellBtn.appendChild(bellI);
            const bellBadge = document.createElement('span');
            bellBadge.className = 'notif-badge';
            bellBadge.id = 'notifBadge';
            bellBadge.textContent = uc;
            bellBadge.style.display = uc > 0 ? 'flex' : 'none';
            bellBtn.appendChild(bellBadge);

            const dropdownDiv = document.createElement('div');
            dropdownDiv.className = 'notif-dropdown';
            dropdownDiv.id = 'notifDropdown';

            wrapper.appendChild(bellBtn);
            wrapper.appendChild(dropdownDiv);
            anchor.replaceWith(wrapper);

            bellBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                window.__cgNotif.toggle(document.getElementById('notifDropdown'));
            });
        }

        // Mobile Anchor
        const mobileAnchor = document.getElementById('mobileNavBellLink');
        let mobileWrapper = null;
        if (mobileAnchor) {
            const uc = unreadCount(getNotifs());
            mobileWrapper = document.createElement('div');
            mobileWrapper.className = 'notif-wrapper';

            const mobileBellBtn = document.createElement('button');
            mobileBellBtn.className = 'notif-bell-btn';
            mobileBellBtn.id = 'notifBellBtnMobile';
            mobileBellBtn.setAttribute('aria-label', 'Notifications');
            mobileBellBtn.title = 'Notifications';
            const mobileBellI = document.createElement('i');
            mobileBellI.className = 'fa-solid fa-bell';
            mobileBellBtn.appendChild(mobileBellI);
            const mobileBadge = document.createElement('span');
            mobileBadge.className = 'notif-badge';
            mobileBadge.id = 'notifBadgeMobile';
            mobileBadge.textContent = uc;
            mobileBadge.style.display = uc > 0 ? 'flex' : 'none';
            mobileBellBtn.appendChild(mobileBadge);

            const mobileDropdownDiv = document.createElement('div');
            mobileDropdownDiv.className = 'notif-dropdown';
            mobileDropdownDiv.id = 'notifDropdownMobile';

            mobileWrapper.appendChild(mobileBellBtn);
            mobileWrapper.appendChild(mobileDropdownDiv);
            mobileAnchor.replaceWith(mobileWrapper);

            mobileBellBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                window.__cgNotif.toggle(document.getElementById('notifDropdownMobile'));
            });
        }

        // Close on outside click
        document.addEventListener('click', (e) => {
            if ((wrapper && wrapper.contains(e.target)) || (mobileWrapper && mobileWrapper.contains(e.target))) {
                // Inside wrapper click
            } else {
                window.__cgNotif.close();
            }
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
            document.querySelectorAll('#notifBellBtn, #notifBellBtnMobile').forEach(btn => {
                btn.style.color = 'var(--color-danger)';
                setTimeout(() => btn.style.color = '', 2000);
            });
        }, 30000);

        // Dynamic load of Socket.io client script
        const socketScript = document.createElement('script');
        socketScript.src = '/socket.io/socket.io.js';
        socketScript.onload = () => {
            if (typeof io !== 'undefined') {
                const socket = io();
                socket.on('threat:alert', (data) => {
                    console.log("WebSocket Threat Notification Received:", data);
                    const notifs = getNotifs();
                    const isDuplicate = notifs.some(n => n.title === data.title && n.desc === data.explanation);
                    if (!isDuplicate) {
                        const newN = {
                            id: Date.now(),
                            type: data.risk_level === 'critical' || data.risk_level === 'high' ? 'danger' : 'warning',
                            icon: data.type === 'link' ? 'fa-link' : (data.type === 'sms' ? 'fa-message' : 'fa-triangle-exclamation'),
                            title: data.title,
                            desc: data.explanation || 'Anomaly flagged by active threat shield.',
                            time: 'Just now',
                            read: false,
                            cat: 'threat',
                            link: 'alerts.html'
                        };
                        notifs.unshift(newN);
                        saveNotifs(notifs);
                        window.__cgNotif.render();
                        
                        // Flash notifications bell red
                        document.querySelectorAll('#notifBellBtn, #notifBellBtnMobile').forEach(btn => {
                            btn.style.color = '#ef4444';
                            setTimeout(() => btn.style.color = '', 4000);
                        });
                        
                        // Dynamically render a floating safety toast at the bottom left
                        const floatToast = document.createElement('div');
                        floatToast.style.cssText = 'position:fixed;bottom:90px;left:20px;background:#ef4444;color:white;padding:0.9rem 1.4rem;border-radius:12px;box-shadow:0 10px 25px rgba(239,68,68,0.25);z-index:9999;font-weight:600;display:flex;align-items:center;gap:0.75rem;font-size:0.88rem;border:1px solid rgba(255,255,255,0.1);animation:slideIn 0.3s ease;';
                        const ftIcon = document.createElement('i');
                        ftIcon.className = 'fa-solid fa-triangle-exclamation';
                        ftIcon.style.fontSize = '1.1rem';
                        const ftSpan = document.createElement('span');
                        const ftStrong = document.createElement('strong');
                        ftStrong.textContent = data.title;
                        const ftBr = document.createElement('br');
                        const ftDesc = document.createElement('span');
                        ftDesc.style.cssText = 'font-size:0.78rem;font-weight:400;opacity:0.9;';
                        ftDesc.textContent = data.explanation;
                        ftSpan.appendChild(ftStrong);
                        ftSpan.appendChild(ftBr);
                        ftSpan.appendChild(ftDesc);
                        floatToast.appendChild(ftIcon);
                        floatToast.appendChild(ftSpan);
                        document.body.appendChild(floatToast);
                        setTimeout(() => { floatToast.style.opacity = '0'; floatToast.style.transition = 'opacity 0.5s'; setTimeout(() => floatToast.remove(), 500); }, 5000);
                    }
                });
            }
        };
        document.head.appendChild(socketScript);
    }

    // Run after DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', inject);
    } else {
        inject();
    }
})();
