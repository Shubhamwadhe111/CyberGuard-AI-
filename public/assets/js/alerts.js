document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('cyberguard_token');
    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    let allAlerts = [];

    // Fetch and render alerts from Database
    async function loadAlerts() {
        try {
            const res = await fetch('/api/alerts', {
                method: 'GET',
                headers: {
                    'x-auth-token': token
                }
            });

            if (res.ok) {
                allAlerts = await res.json();
                renderAlerts(allAlerts);
            } else {
                console.error('Failed to load alerts');
                showToast('Error loading alerts from database.', 'danger');
            }
        } catch (err) {
            console.error('Alert load error:', err);
            showToast('Could not connect to server for alerts.', 'danger');
        }
    }

    function renderAlerts(alertsList) {
        const container = document.getElementById('alertsList');
        if (!container) return;

        if (alertsList.length === 0) {
            container.innerHTML = `
                <div class="al-card" style="text-align: center; padding: 2rem; width: 100%;">
                    <div style="font-size: 2.5rem; color: var(--color-accent); margin-bottom: 0.5rem;"><i class="fa-solid fa-shield-check"></i></div>
                    <div style="font-weight: 700; font-size: 1.1rem; margin-bottom: 0.25rem;">Your Device is Clear</div>
                    <div style="color: var(--text-muted); font-size: 0.9rem;">No active threat alerts recorded in your database.</div>
                </div>`;
            updateCounts([]);
            return;
        }

        container.innerHTML = '';
        alertsList.forEach(alert => {
            const isResolved = alert.status === 'resolved';
            const risk = alert.risk_level.toLowerCase();
            const stripeClass = isResolved ? 'safe' : (risk === 'critical' || risk === 'high' ? 'danger' : (risk === 'medium' ? 'warning' : 'info'));
            const iconClass = stripeClass;
            const icon = isResolved ? 'fa-shield-check' : (risk === 'critical' || risk === 'high' ? 'fa-triangle-exclamation' : (risk === 'medium' ? 'fa-circle-exclamation' : 'fa-circle-info'));
            const badgeClass = isResolved ? 'safe' : (risk === 'critical' || risk === 'high' ? 'danger' : (risk === 'medium' ? 'warning' : 'info'));
            const riskLabel = isResolved ? 'Resolved' : alert.risk_level.toUpperCase();

            const date = new Date(alert.createdAt);
            const timeStr = date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});

            const card = document.createElement('div');
            card.className = `al-card ${isResolved ? 'resolved' : ''}`;
            card.dataset.status = alert.status;
            card.dataset.id = alert._id;

            card.innerHTML = `
                <div class="al-card-stripe ${stripeClass}"></div>
                <div class="al-card-icon ${iconClass}"><i class="fa-solid ${icon}"></i></div>
                <div class="al-card-body" ${isResolved ? 'style="opacity:0.6;"' : ''}>
                    <div class="al-card-top">
                        <div>
                            <span class="al-badge ${badgeClass}">${riskLabel}</span>
                            <span class="al-badge tag">${alert.type.toUpperCase()}</span>
                        </div>
                        <span class="al-time"><i class="fa-regular fa-clock"></i> ${timeStr}</span>
                    </div>
                    <h3 class="al-card-title" ${isResolved ? 'style="text-decoration:line-through;"' : ''}>${alert.title}</h3>
                    <p class="al-card-desc">${alert.explanation || 'No detailed explanation provided.'}</p>
                    <div class="al-card-footer">
                        ${isResolved ? `
                            <span style="font-size:0.82rem;color:var(--color-accent);font-weight:600;">
                                <i class="fa-solid fa-check-circle"></i> Resolved by user
                            </span>
                        ` : `
                            <div style="display:flex;gap:0.5rem;flex-wrap:wrap;">
                                <a href="threat-details.html?id=${alert._id}" class="btn btn-primary" style="padding:0.4rem 0.9rem;font-size:0.82rem;"><i class="fa-solid fa-eye"></i> View Details</a>
                                <a href="ai-agent.html" class="btn btn-outline" style="padding:0.4rem 0.9rem;font-size:0.82rem;"><i class="fa-solid fa-robot"></i> Ask AI</a>
                                <button class="btn btn-outline al-resolve-btn" style="padding:0.4rem 0.9rem;font-size:0.82rem;" onclick="resolveAlert(this)"><i class="fa-solid fa-check"></i> Resolve</button>
                            </div>
                        `}
                    </div>
                </div>
            `;
            container.appendChild(card);
        });

        updateCounts(alertsList);
    }

    // Filter alerts by tab
    window.filterAlerts = function(status, btn) {
        document.querySelectorAll('.al-tab').forEach(t => t.classList.remove('active'));
        btn.classList.add('active');
        document.querySelectorAll('#alertsList .al-card').forEach(card => {
            if (status === 'all') {
                card.style.display = '';
            } else {
                card.style.display = card.dataset.status === status ? '' : 'none';
            }
        });
    };

    // Resolve a single alert
    window.resolveAlert = async function(btn) {
        const card = btn.closest('.al-card');
        if (!card) return;
        const alertId = card.dataset.id;
        if (!alertId) return;

        try {
            const res = await fetch(`/api/alerts/${alertId}/resolve`, {
                method: 'POST',
                headers: {
                    'x-auth-token': token
                }
            });

            if (res.ok) {
                card.dataset.status = 'resolved';
                card.classList.add('resolved');
                card.querySelector('.al-card-stripe').className = 'al-card-stripe safe';
                card.querySelector('.al-card-icon').className = 'al-card-icon safe';
                card.querySelector('.al-card-icon').innerHTML = '<i class="fa-solid fa-shield-check"></i>';
                const titleEl = card.querySelector('.al-card-title');
                if (titleEl) titleEl.style.textDecoration = 'line-through';
                const bodyEl = card.querySelector('.al-card-body');
                if (bodyEl) bodyEl.style.opacity = '0.6';
                const footer = card.querySelector('.al-card-footer');
                if (footer) footer.innerHTML = '<span style="font-size:0.82rem;color:var(--color-accent);font-weight:600;"><i class="fa-solid fa-check-circle"></i> Resolved just now</span>';
                
                // Refresh local values
                const alertIndex = allAlerts.findIndex(a => a._id === alertId);
                if (alertIndex !== -1) allAlerts[alertIndex].status = 'resolved';
                updateCounts(allAlerts);
                
                showToast('Alert marked as resolved in database.', 'success');
            } else {
                showToast('Could not resolve alert on backend.', 'danger');
            }
        } catch (err) {
            console.error('Resolve error:', err);
            showToast('Server connection error.', 'danger');
        }
    };

    // Mark all resolved
    window.markAllResolved = async function() {
        const unresolvedCards = document.querySelectorAll('#alertsList .al-card:not(.resolved)');
        if (unresolvedCards.length === 0) {
            showToast('No unresolved alerts found.', 'success');
            return;
        }

        let successCount = 0;
        for (let card of unresolvedCards) {
            const alertId = card.dataset.id;
            if (alertId) {
                try {
                    const res = await fetch(`/api/alerts/${alertId}/resolve`, {
                        method: 'POST',
                        headers: { 'x-auth-token': token }
                    });
                    if (res.ok) {
                        card.dataset.status = 'resolved';
                        card.classList.add('resolved');
                        card.querySelector('.al-card-stripe').className = 'al-card-stripe safe';
                        card.querySelector('.al-card-icon').className = 'al-card-icon safe';
                        card.querySelector('.al-card-icon').innerHTML = '<i class="fa-solid fa-shield-check"></i>';
                        const title = card.querySelector('.al-card-title');
                        if (title) title.style.textDecoration = 'line-through';
                        const bodyEl = card.querySelector('.al-card-body');
                        if (bodyEl) bodyEl.style.opacity = '0.6';
                        const footer = card.querySelector('.al-card-footer');
                        if (footer) footer.innerHTML = '<span style="font-size:0.82rem;color:var(--color-accent);font-weight:600;"><i class="fa-solid fa-check-circle"></i> Resolved just now</span>';
                        
                        const alertIndex = allAlerts.findIndex(a => a._id === alertId);
                        if (alertIndex !== -1) allAlerts[alertIndex].status = 'resolved';
                        successCount++;
                    }
                } catch (e) {
                    console.error("Bulk resolve error:", e);
                }
            }
        }

        updateCounts(allAlerts);
        showToast(`Resolved ${successCount} alerts successfully!`, 'success');
    };

    // Update KPI counts
    function updateCounts(alerts) {
        let high = 0, warn = 0, info = 0, resolved = 0;
        alerts.forEach(a => {
            if (a.status === 'resolved') resolved++;
            else {
                const r = a.risk_level.toLowerCase();
                if (r === 'critical' || r === 'high') high++;
                else if (r === 'medium' || r === 'warning') warn++;
                else info++;
            }
        });
        if (document.getElementById('cntHigh')) document.getElementById('cntHigh').textContent = high;
        if (document.getElementById('cntWarn')) document.getElementById('cntWarn').textContent = warn;
        if (document.getElementById('cntInfo')) document.getElementById('cntInfo').textContent = info;
        if (document.getElementById('cntResolved')) document.getElementById('cntResolved').textContent = resolved;
        
        // Update tab counts
        const tabs = document.querySelectorAll('.al-tab');
        if (tabs.length >= 5) {
            tabs[0].querySelector('.al-tab-count').textContent = alerts.length;
            tabs[1].querySelector('.al-tab-count').textContent = high;
            tabs[2].querySelector('.al-tab-count').textContent = warn;
            tabs[3].querySelector('.al-tab-count').textContent = info;
            tabs[4].querySelector('.al-tab-count').textContent = resolved;
        }
    }

    // Sort alerts
    window.sortAlerts = function() {
        const val = document.getElementById('sortSelect').value;
        const list = document.getElementById('alertsList');
        const cards = Array.from(list.querySelectorAll('.al-card'));
        const order = { critical: 0, high: 1, warning: 2, medium: 2, info: 3, resolved: 4 };
        
        if (val === 'severity') {
            cards.sort((a, b) => {
                const statusA = a.dataset.status === 'resolved' ? 'resolved' : allAlerts.find(x => x._id === a.dataset.id)?.risk_level.toLowerCase() || 'info';
                const statusB = b.dataset.status === 'resolved' ? 'resolved' : allAlerts.find(x => x._id === b.dataset.id)?.risk_level.toLowerCase() || 'info';
                return (order[statusA] || 9) - (order[statusB] || 9);
            });
            cards.forEach(c => list.appendChild(c));
        } else if (val === 'newest') {
            loadAlerts(); // Just reload in original chronological order from DB
        }
    };

    // Toast
    function showToast(message, type = 'success') {
        const container = document.getElementById('toastContainer') || (() => {
            const d = document.createElement('div');
            d.id = 'toastContainer';
            d.style.cssText = 'position:fixed;bottom:80px;right:20px;z-index:1000;display:flex;flex-direction:column;gap:10px;';
            document.body.appendChild(d);
            return d;
        })();
        const toast = document.createElement('div');
        const bg = type === 'success' ? '#10b981' : '#ef4444';
        toast.style.cssText = `background:${bg};color:white;padding:0.85rem 1.25rem;border-radius:10px;display:flex;align-items:center;gap:0.6rem;font-size:0.88rem;font-weight:500;animation:slideIn 0.3s ease;`;
        toast.innerHTML = `<i class="fa-solid fa-check-circle"></i> ${message}`;
        container.appendChild(toast);
        setTimeout(() => { toast.style.opacity = '0'; toast.style.transition = 'opacity 0.3s'; setTimeout(() => toast.remove(), 300); }, 3000);
    }

    // Initial Execution
    loadAlerts();
});
