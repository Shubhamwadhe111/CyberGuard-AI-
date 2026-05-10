document.addEventListener('DOMContentLoaded', () => {
    const markReviewedBtn = document.getElementById('markReviewedBtn');
    const reportBtn = document.getElementById('reportBtn');
    const ignoreBtn = document.getElementById('ignoreBtn');
    const askAgentBtn = document.getElementById('askAgentBtn');
    const statusBadge = document.getElementById('statusBadge');
    
    function showToast(message, type = 'success') {
        const container = document.getElementById('toastContainer');
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        let bgColor = type === 'success' ? '#10b981' : '#ef4444';
        
        toast.style.cssText = `
            background: ${bgColor};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
            display: flex;
            align-items: center;
            gap: 0.75rem;
            animation: slideIn 0.3s ease forwards;
            font-weight: 500;
        `;
        
        const icon = type === 'success' ? 'fa-check-circle' : 'fa-circle-exclamation';
        toast.innerHTML = `<i class="fa-solid ${icon}"></i> ${message}`;
        
        container.appendChild(toast);
        
        setTimeout(() => {
            toast.style.animation = 'slideOut 0.3s ease forwards';
            setTimeout(() => {
                toast.remove();
            }, 300);
        }, 3000);
    }
    
    // Add toast animations to style if not exists
    if (!document.getElementById('toastStyles')) {
        const style = document.createElement('style');
        style.id = 'toastStyles';
        style.textContent = `
            @keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
            @keyframes slideOut { from { transform: translateX(0); opacity: 1; } to { transform: translateX(100%); opacity: 0; } }
        `;
        document.head.appendChild(style);
    }

    if (markReviewedBtn) {
        markReviewedBtn.addEventListener('click', () => {
            statusBadge.className = 'status-badge status-reviewed';
            statusBadge.innerHTML = '<i class="fa-solid fa-check-circle"></i> Reviewed';
            markReviewedBtn.innerHTML = '<i class="fa-solid fa-check"></i> Marked as Reviewed';
            markReviewedBtn.disabled = true;
            markReviewedBtn.style.opacity = '0.7';
            showToast('Threat marked as reviewed successfully.');
        });
    }

    if (reportBtn) {
        reportBtn.addEventListener('click', () => {
            showToast('Phishing URL reported to global security network.', 'success');
        });
    }

    if (ignoreBtn) {
        ignoreBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to ignore this high-risk threat?')) {
                statusBadge.className = 'status-badge status-reviewed';
                statusBadge.style.background = 'rgba(255,255,255,0.1)';
                statusBadge.style.color = 'var(--text-muted)';
                statusBadge.innerHTML = '<i class="fa-solid fa-eye-slash"></i> Ignored';
                showToast('Threat added to ignore list.');
            }
        });
    }

    if (askAgentBtn) {
        askAgentBtn.addEventListener('click', () => {
            const title = document.getElementById('threatTitle')?.textContent || "this threat";
            localStorage.setItem('cg_ai_context', `Explain this specific threat: "${title}"`);
            window.location.href = 'ai-agent.html';
        });
    }

    // Dynamic Data Fetching
    const urlParams = new URLSearchParams(window.location.search);
    const alertId = urlParams.get('id');

    async function loadThreatDetails() {
        if (!alertId) {
            document.querySelector('.dashboard-content').innerHTML = `
                <div style="text-align:center; padding: 4rem; color: var(--text-muted);">
                    <h2>No Threat ID Provided</h2>
                    <a href="alerts.html" class="btn btn-primary" style="margin-top:1rem;">Back to Alerts</a>
                </div>`;
            return;
        }

        try {
            const token = localStorage.getItem('cyberguard_token');
            const res = await fetch(`/api/threats/${alertId}`, {
                headers: { 'x-auth-token': token }
            });

            if (res.ok) {
                const data = await res.json();
                const { alert, details } = data;

                // Populate Header
                document.getElementById('threatTitle').textContent = alert.title;
                const timeStr = new Date(alert.createdAt).toLocaleString();
                document.getElementById('threatTime').innerHTML = `<i class="fa-regular fa-clock"></i> ${timeStr}`;

                // Update Status Badge if resolved
                if (alert.status === 'resolved') {
                    statusBadge.className = 'status-badge status-reviewed';
                    statusBadge.innerHTML = '<i class="fa-solid fa-check-circle"></i> Resolved';
                    if(markReviewedBtn) {
                        markReviewedBtn.style.display = 'none';
                    }
                    if(ignoreBtn) {
                        ignoreBtn.style.display = 'none';
                    }
                }

                // Populate Risk Factors
                const riskFactorsList = document.getElementById('riskFactorsList');
                if (riskFactorsList && details.risk_factors.length > 0) {
                    riskFactorsList.innerHTML = details.risk_factors.map(factor => `<li>${factor}</li>`).join('');
                }

                // Populate Recommendations
                const recommendationsList = document.getElementById('recommendationsList');
                if (recommendationsList && details.recommended_actions.length > 0) {
                    recommendationsList.innerHTML = details.recommended_actions.map(action => `
                        <div class="action-item">
                            <div class="action-icon"><i class="fa-solid fa-shield-halved"></i></div>
                            <div style="flex:1;">
                                <h4 style="margin:0 0 0.25rem 0;">Recommended Action</h4>
                                <p style="margin:0; font-size: 0.9rem; color: var(--text-muted);">${action}</p>
                            </div>
                        </div>
                    `).join('');
                }

            } else {
                document.querySelector('.dashboard-content').innerHTML = `
                    <div style="text-align:center; padding: 4rem; color: var(--text-muted);">
                        <h2>Threat Not Found</h2>
                        <a href="alerts.html" class="btn btn-primary" style="margin-top:1rem;">Back to Alerts</a>
                    </div>`;
            }
        } catch (err) {
            console.error('Failed to load threat details:', err);
        }
    }

    loadThreatDetails();
});
