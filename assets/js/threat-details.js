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
            badge.innerHTML = `<i class="fa-solid ${icon}"></i> ${alert.risk_level.toUpperCase()} RISK`;
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
            detTime.innerHTML = `<i class="fa-regular fa-clock"></i> Detected: ${date.toLocaleString()}`;
        }

        // 5. Source
        const sourceText = document.getElementById('threatSourceText');
        if (sourceText) {
            const sources = {
                sms: '<i class="fa-solid fa-message"></i> Source: Messages/SMS',
                link: '<i class="fa-solid fa-link"></i> Source: Browser Links',
                permission: '<i class="fa-solid fa-list-check"></i> Source: Installed Apps',
                system: '<i class="fa-solid fa-microchip"></i> Source: Core System'
            };
            sourceText.innerHTML = sources[alert.type] || `<i class="fa-solid fa-shield"></i> Source: ${alert.type}`;
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

        // 8. Risk Factors List
        const factorsList = document.querySelector('.risk-factors-list');
        if (factorsList && details && details.risk_factors) {
            factorsList.innerHTML = '';
            details.risk_factors.forEach(factor => {
                factorsList.innerHTML += `
                    <li>
                        <i class="fa-solid fa-circle-exclamation" style="color:var(--color-warning);"></i>
                        <div>
                            <strong>${factor}</strong>
                        </div>
                    </li>
                `;
            });
        }

        // 9. Recommended Actions List
        const actionsList = document.querySelector('.recommended-actions-list');
        if (actionsList && details && details.recommended_actions) {
            actionsList.innerHTML = '';
            details.recommended_actions.forEach(action => {
                actionsList.innerHTML += `
                    <li>
                        <i class="fa-solid fa-shield-check" style="color:var(--color-success);"></i>
                        <div><strong>${action}</strong></div>
                    </li>
                `;
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

    const markReviewedBtn = document.getElementById('markReviewedBtn');
    if (markReviewedBtn) markReviewedBtn.addEventListener('click', resolveThreat);

    const ignoreBtn = document.getElementById('ignoreBtn');
    if (ignoreBtn) ignoreBtn.addEventListener('click', resolveThreat);

    // ─── ACTION: REPORT PHISHING ──────────────────────────────────────
    const reportBtn = document.getElementById('reportBtn');
    if (reportBtn) {
        reportBtn.addEventListener('click', () => {
            showToast('Threat reported to CyberGuard Global Database!', 'success');
            reportBtn.disabled = true;
            reportBtn.innerHTML = '<i class="fa-solid fa-flag"></i> Reported';
            reportBtn.style.opacity = '0.7';
        });
    }

    // ─── ACTION: ASK AI AGENT ─────────────────────────────────────────
    const askAgentBtn = document.getElementById('askAgentBtn');
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
        toast.innerHTML = `<i class="fa-solid fa-${type === 'success' ? 'check-circle' : 'circle-xmark'}"></i> ${message}`;
        
        container.appendChild(toast);
        setTimeout(() => { 
            toast.style.opacity = '0'; 
            toast.style.transition = 'opacity 0.3s'; 
            setTimeout(() => toast.remove(), 300); 
        }, 3000);
    }
});
