document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('cyberguard_token');
    
    // Parse URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const alertId = urlParams.get('id');

    if (!alertId) {
        showToast('No threat ID provided. Redirecting...', 'danger');
        setTimeout(() => {
            window.location.href = 'alerts.html';
        }, 2000);
        return;
    }

    let alertData = null;
    const markReviewedBtn = document.getElementById('markReviewedBtn');
    const ignoreBtn = document.getElementById('ignoreBtn');
    const reportBtn = document.getElementById('reportBtn');
    const askAgentBtn = document.getElementById('askAgentBtn');

    // Load Threat Details from Backend
    async function loadThreatDetails() {
        if (!token) return;
        try {
            const res = await fetch(`/api/threats/${alertId}`, {
                method: 'GET',
                headers: { 'x-auth-token': token }
            });

            if (res.ok) {
                const data = await res.json();
                alertData = data.alert;
                renderDetails(data.alert, data.details);
            } else {
                showToast('Failed to load threat details.', 'danger');
            }
        } catch (err) {
            console.error("Load details error:", err);
            showToast('Network error loading details.', 'danger');
        }
    }
    await loadThreatDetails();

    function renderDetails(alert, details) {
        // Dynamic class on header card border & accent stripe
        const headerCard = document.querySelector('.threat-header-card');
        if (headerCard) {
            headerCard.className = 'threat-header-card';
            headerCard.classList.add(`risk-${alert.risk_level}`);
        }

        // 1. Risk Badge
        const badge = document.getElementById('threatRiskBadge');
        if (badge) {
            let color = '#ef4444'; // Red for high/critical
            let icon = 'fa-triangle-exclamation';
            if (alert.risk_level === 'medium' || alert.risk_level === 'warning') {
                color = '#f59e0b';
                icon = 'fa-circle-exclamation';
            } else if (alert.risk_level === 'low' || alert.risk_level === 'info') {
                color = '#0d9488';
                icon = 'fa-shield-check';
            }
            badge.style.background = color;
            badge.style.color = 'white';
            
            badge.textContent = '';
            const badgeIcon = document.createElement('i');
            badgeIcon.className = `fa-solid ${icon}`;
            badge.appendChild(badgeIcon);
            badge.appendChild(document.createTextNode(` ${alert.risk_level.toUpperCase()} RISK`));
        }

        // 2. Category / Header
        const catHeader = document.getElementById('threatCategoryHeader');
        if (catHeader) {
            const typeLabels = {
                sms: 'SMS Smishing Threat',
                link: 'Phishing Link Alert',
                permission: 'Excessive App Permissions',
                system: 'OS Integrity Event'
            };
            catHeader.textContent = typeLabels[alert.type] || `${alert.type.toUpperCase()} Security Event`;
        }

        // 3. Title
        const title = document.getElementById('threatTitle');
        if (title) title.textContent = alert.title;

        // 4. Detected Date
        const detTime = document.getElementById('threatDetectedTime');
        if (detTime) {
            const date = new Date(alert.createdAt);
            detTime.textContent = '';
            const clockIcon = document.createElement('i');
            clockIcon.className = 'fa-regular fa-clock';
            detTime.appendChild(clockIcon);
            detTime.appendChild(document.createTextNode(` Detected: ${date.toLocaleString()}`));
        }

        // 5. Source
        const sourceText = document.getElementById('threatSourceText');
        if (sourceText) {
            sourceText.textContent = '';
            const sourceIcons = {
                sms: 'fa-message',
                link: 'fa-link',
                permission: 'fa-list-check',
                system: 'fa-microchip'
            };
            const sourceLabels = {
                sms: 'Source: Messages/SMS',
                link: 'Source: Browser Links',
                permission: 'Source: Installed Apps',
                system: 'Source: Core System'
            };
            const iconClass = sourceIcons[alert.type] || 'fa-shield';
            const labelText = sourceLabels[alert.type] || `Source: ${alert.type}`;

            const iconEl = document.createElement('i');
            iconEl.className = `fa-solid ${iconClass}`;
            sourceText.appendChild(iconEl);
            sourceText.appendChild(document.createTextNode(` ${labelText}`));
        }

        // 6. Overview Description
        const overview = document.getElementById('threatOverviewText');
        if (overview) overview.textContent = alert.explanation;

        // 7. Status Badge
        const statusBadge = document.getElementById('statusBadge');
        if (statusBadge) {
            statusBadge.className = 'status-badge';
            if (alert.status === 'resolved') {
                statusBadge.textContent = 'Resolved';
                statusBadge.style.background = 'rgba(16, 185, 129, 0.15)';
                statusBadge.style.color = 'var(--color-success)';
            } else {
                statusBadge.textContent = 'Requires Review';
                statusBadge.style.background = 'rgba(239, 68, 68, 0.15)';
                statusBadge.style.color = 'var(--color-danger)';
            }
        }

        // Disable buttons if resolved
        if (alert.status === 'resolved') {
            if (markReviewedBtn) {
                markReviewedBtn.disabled = true;
                markReviewedBtn.style.opacity = '0.5';
            }
            if (reportBtn) {
                reportBtn.disabled = true;
                reportBtn.style.opacity = '0.5';
            }
            if (ignoreBtn) {
                ignoreBtn.disabled = true;
                ignoreBtn.style.opacity = '0.5';
            }
        }

        // 8. Risk Factors List
        const factorsList = document.querySelector('.risk-factors-list');
        if (factorsList && details && details.risk_factors) {
            factorsList.textContent = '';
            details.risk_factors.forEach(factor => {
                const li = document.createElement('li');
                const icon = document.createElement('i');
                icon.className = 'fa-solid fa-circle-exclamation';
                icon.style.color = 'var(--color-warning)';
                
                const textDiv = document.createElement('div');
                const strong = document.createElement('strong');
                strong.textContent = factor;
                
                textDiv.appendChild(strong);
                li.appendChild(icon);
                li.appendChild(textDiv);
                factorsList.appendChild(li);
            });
        }

        // 9. Recommended Actions List
        const actionsList = document.querySelector('.recommended-actions-list');
        if (actionsList && details && details.recommended_actions) {
            actionsList.textContent = '';
            details.recommended_actions.forEach(action => {
                const li = document.createElement('li');
                const icon = document.createElement('i');
                icon.className = 'fa-solid fa-shield-check';
                icon.style.color = 'var(--color-success)';
                
                const textDiv = document.createElement('div');
                const strong = document.createElement('strong');
                strong.textContent = action;
                
                textDiv.appendChild(strong);
                li.appendChild(icon);
                li.appendChild(textDiv);
                actionsList.appendChild(li);
            });
        }
    }

    // ─── ACTION: MARK AS REVIEWED / RESOLVE ───────────────────────────
    async function resolveThreat() {
        if (!token) return;
        try {
            const res = await fetch(`/api/alerts/${alertId}/resolve`, {
                method: 'POST',
                headers: { 'x-auth-token': token }
            });

            if (res.ok) {
                showToast('Threat marked as resolved!', 'success');
                setTimeout(() => {
                    window.location.href = 'alerts.html';
                }, 1000);
            } else {
                showToast('Failed to resolve threat.', 'danger');
            }
        } catch (err) {
            console.error(err);
            showToast('Network error resolving threat.', 'danger');
        }
    }

    if (markReviewedBtn) markReviewedBtn.addEventListener('click', resolveThreat);
    if (ignoreBtn) ignoreBtn.addEventListener('click', resolveThreat);

    // ─── ACTION: REPORT PHISHING ──────────────────────────────────────
    if (reportBtn) {
        reportBtn.addEventListener('click', () => {
            showToast('Threat reported to CyberGuard Global Database!', 'success');
            reportBtn.disabled = true;
            reportBtn.textContent = '';
            const flagIcon = document.createElement('i');
            flagIcon.className = 'fa-solid fa-flag';
            reportBtn.appendChild(flagIcon);
            reportBtn.appendChild(document.createTextNode(' Reported'));
            reportBtn.style.opacity = '0.7';
        });
    }

    // ─── ACTION: ASK AI AGENT ─────────────────────────────────────────
    if (askAgentBtn) {
        askAgentBtn.addEventListener('click', () => {
            if (!alertData) return;
            const queryText = `Explain why the alert titled "${alertData.title}" of type "${alertData.type}" is a security risk, and tell me how I can protect myself.`;
            window.location.href = `ai-agent.html?query=${encodeURIComponent(queryText)}`;
        });
    }

    function showToast(message, type = 'success') {
        const container = document.getElementById('toastContainer');
        if (!container) return;
        const toast = document.createElement('div');
        const bg = type === 'success' ? '#10b981' : '#ef4444';
        toast.style.cssText = `background:${bg};color:white;padding:0.85rem 1.25rem;border-radius:10px;display:flex;align-items:center;gap:0.6rem;font-size:0.88rem;font-weight:500;animation:slideIn 0.3s ease;`;
        
        const toastIcon = document.createElement('i');
        toastIcon.className = `fa-solid fa-${type === 'success' ? 'check-circle' : 'circle-xmark'}`;
        toast.appendChild(toastIcon);
        toast.appendChild(document.createTextNode(' ' + message));
        
        container.appendChild(toast);
        setTimeout(() => { 
            toast.style.opacity = '0'; 
            toast.style.transition = 'opacity 0.3s'; 
            setTimeout(() => toast.remove(), 300); 
        }, 3000);
    }
});
