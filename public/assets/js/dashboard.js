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
            if (scoreCircle) {
                scoreCircle.textContent = '';
                scoreCircle.appendChild(document.createTextNode(data.metrics.score));
                const spanEl = document.createElement('span');
                spanEl.textContent = '/100';
                scoreCircle.appendChild(spanEl);
            }
            
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
                statusHeader.textContent = '';
                const shIcon = document.createElement('i');
                shIcon.style.fontSize = '1.5rem';
                if (data.metrics.score > 80) {
                    shIcon.className = 'fa-solid fa-shield-check text-safe';
                    statusHeader.appendChild(shIcon);
                    statusHeader.appendChild(document.createTextNode(' Protected'));
                    statusDesc.innerText = 'No critical threats detected in the last scan.';
                } else if (data.metrics.score > 50) {
                    shIcon.className = 'fa-solid fa-shield-halved text-warning';
                    statusHeader.appendChild(shIcon);
                    statusHeader.appendChild(document.createTextNode(' Needs Attention'));
                    statusDesc.innerText = 'Moderate risks detected. Please review alerts.';
                } else {
                    shIcon.className = 'fa-solid fa-triangle-exclamation text-danger';
                    statusHeader.appendChild(shIcon);
                    statusHeader.appendChild(document.createTextNode(' High Risk'));
                    statusDesc.innerText = 'Critical threats found! Immediate action required.';
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
                timelineEl.textContent = '';

                if (data.timeline.length === 0) {
                    const emptyItem = document.createElement('div');
                    emptyItem.className = 'db-timeline-item';
                    const emptyDot = document.createElement('div');
                    emptyDot.className = 'db-timeline-dot safe';
                    const emptyContent = document.createElement('div');
                    emptyContent.className = 'db-timeline-content';
                    emptyContent.style.cursor = 'default';
                    const emptyTitle = document.createElement('div');
                    emptyTitle.className = 'db-timeline-title';
                    emptyTitle.textContent = 'System Secure';
                    const emptyDesc = document.createElement('div');
                    emptyDesc.className = 'db-timeline-desc';
                    emptyDesc.textContent = 'No recent threats recorded.';
                    emptyContent.appendChild(emptyTitle);
                    emptyContent.appendChild(emptyDesc);
                    emptyItem.appendChild(emptyDot);
                    emptyItem.appendChild(emptyContent);
                    timelineEl.appendChild(emptyItem);
                } else {
                    data.timeline.forEach(alert => {
                        let dotClass = 'warning';
                        if (alert.risk_level === 'high' || alert.risk_level === 'critical') dotClass = 'danger';
                        if (alert.risk_level === 'low') dotClass = 'safe';

                        const date = new Date(alert.createdAt);
                        const timeAgo = date.toLocaleDateString() + ' ' + date.toLocaleTimeString();

                        const item = document.createElement('div');
                        item.className = 'db-timeline-item';
                        const dot = document.createElement('div');
                        dot.className = `db-timeline-dot ${dotClass}`;
                        const link = document.createElement('a');
                        link.href = `threat-details.html?id=${alert._id || ''}`;
                        link.className = 'db-timeline-content';
                        const titleDiv = document.createElement('div');
                        titleDiv.className = 'db-timeline-title';
                        titleDiv.textContent = alert.title;
                        const descDiv = document.createElement('div');
                        descDiv.className = 'db-timeline-desc';
                        descDiv.textContent = (alert.explanation || alert.type) + ' \u2022 ' + timeAgo;
                        link.appendChild(titleDiv);
                        link.appendChild(descDiv);
                        item.appendChild(dot);
                        item.appendChild(link);
                        timelineEl.appendChild(item);
                    });
                }
            }
        }

    } catch (err) {
        console.error("Dashboard data fetch error:", err);
    }
});
