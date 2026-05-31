document.addEventListener('DOMContentLoaded', async () => {
    // 1. Check if user is logged in
    const token = localStorage.getItem('cyberguard_token');
    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    try {
        // 2. Fetch User Profile for Name/Email
        const userRes = await fetch('/api/user/profile', {
            method: 'GET',
            headers: { 'x-auth-token': token }
        });
        
        if (userRes.ok) {
            const userData = await userRes.json();
            const firstName = userData.name ? userData.name.split(' ')[0] : 'User';
            
            // Update UI with real name
            if (document.getElementById('nav-user-name')) document.getElementById('nav-user-name').innerText = firstName;
            if (document.getElementById('dd-full-name')) document.getElementById('dd-full-name').innerText = userData.name || 'User';
            if (document.getElementById('dd-email')) document.getElementById('dd-email').innerText = userData.email || '';
            
            // Update Avatar
            const avatarImg = `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name || 'U')}&background=0d9488&color=fff`;
            if (document.getElementById('nav-avatar-img')) document.getElementById('nav-avatar-img').src = avatarImg;
        }

        // 3. Fetch Dashboard Data
        const res = await fetch('/api/dashboard', {
            method: 'GET',
            headers: { 'x-auth-token': token }
        });

        if (res.status === 401) {
            localStorage.removeItem('cyberguard_token');
            localStorage.removeItem('isLoggedIn');
            window.location.href = 'login.html';
            return;
        }

        const data = await res.json();
        
        // 4. Populate DOM Elements
        if (data.metrics) {
            // Metrics
            const updateMetric = (id, val) => {
                const el = document.getElementById(id);
                if (el) el.innerText = val;
                const bar = document.getElementById(`${id}-bar`);
                if (bar) bar.style.width = `${Math.min(val * 10, 100)}%`; // Simple scale for visualization
            };

            updateMetric('metric-sms', data.metrics.suspiciousMessages || 0);
            updateMetric('metric-links', data.metrics.riskyLinks || 0);
            updateMetric('metric-perms', data.metrics.permissionRisks || 0);
            updateMetric('metric-alerts', data.metrics.recentAlerts || 0);
            updateMetric('metric-score', data.metrics.score || 100);

            // Special handling for score circle
            const scoreCircle = document.getElementById('db-score-circle');
            if (scoreCircle) scoreCircle.innerHTML = `${data.metrics.score}<span>/100</span>`;
            
            const scorePath = document.getElementById('db-score-path');
            if (scorePath) {
                const totalLength = 326.7;
                const score = data.metrics.score !== undefined ? data.metrics.score : 100;
                const offset = totalLength - (totalLength * score) / 100;
                scorePath.style.strokeDashoffset = offset;
            }
            
            // Status Info
            const statusHeader = document.getElementById('db-status-header');
            const statusDesc = document.getElementById('db-status-desc');
            if (statusHeader && statusDesc) {
                if (data.metrics.score > 80) {
                    statusHeader.innerHTML = `<i class="fa-solid fa-shield-check text-safe" style="font-size: 1.5rem;"></i> Protected`;
                    statusDesc.innerText = `No critical threats detected in the last scan.`;
                } else if (data.metrics.score > 50) {
                    statusHeader.innerHTML = `<i class="fa-solid fa-shield-halved text-warning" style="font-size: 1.5rem;"></i> Needs Attention`;
                    statusDesc.innerText = `Moderate risks detected. Please review alerts.`;
                } else {
                    statusHeader.innerHTML = `<i class="fa-solid fa-triangle-exclamation text-danger" style="font-size: 1.5rem;"></i> High Risk`;
                    statusDesc.innerText = `Critical threats found! Immediate action required.`;
                }
            }

            // Last Scan Time
            const lastScanEl = document.getElementById('db-last-scan');
            if (lastScanEl) {
                if (data.metrics.lastScanTime) {
                    const date = new Date(data.metrics.lastScanTime);
                    lastScanEl.innerText = `Last scan: ${date.toLocaleString()}`;
                } else {
                    lastScanEl.innerText = `Last scan: Never`;
                }
            }
        }

        // 5. Render Timeline
        if (data.timeline) {
            const timelineEl = document.getElementById('db-timeline');
            if (timelineEl) {
                timelineEl.innerHTML = ''; 

                if (data.timeline.length === 0) {
                    timelineEl.innerHTML = `
                        <div class="db-timeline-item">
                            <div class="db-timeline-dot safe"></div>
                            <div class="db-timeline-content" style="cursor: default;">
                                <div class="db-timeline-title">System Secure</div>
                                <div class="db-timeline-desc">No recent threats recorded.</div>
                            </div>
                        </div>`;
                } else {
                    data.timeline.forEach(alert => {
                        let dotClass = 'warning';
                        if (alert.risk_level === 'high' || alert.risk_level === 'critical') dotClass = 'danger';
                        if (alert.risk_level === 'low') dotClass = 'safe';

                        const date = new Date(alert.createdAt);
                        const timeAgo = date.toLocaleDateString() + ' ' + date.toLocaleTimeString();

                        timelineEl.innerHTML += `
                            <div class="db-timeline-item">
                                <div class="db-timeline-dot ${dotClass}"></div>
                                <a href="threat-details.html" class="db-timeline-content">
                                    <div class="db-timeline-title">${alert.title}</div>
                                    <div class="db-timeline-desc">${alert.explanation || alert.type} • ${timeAgo}</div>
                                </a>
                            </div>
                        `;
                    });
                }
            }
        }

    } catch (err) {
        console.error("Dashboard data fetch error:", err);
    }
});
