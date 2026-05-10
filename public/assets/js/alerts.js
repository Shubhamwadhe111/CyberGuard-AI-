document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('cyberguard_token');
    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    const filterTabs = document.querySelectorAll('.filter-tab');
    const alertsContainer = document.getElementById('alertsContainer'); // I'll inject this ID in HTML
    
    // Stats elements
    const countHigh = document.getElementById('countHigh');
    const countWarning = document.getElementById('countWarning');
    const countResolved = document.getElementById('countResolved');
    const countTotal = document.getElementById('countTotal');

    let allAlertsData = [];

    // Fetch Alerts
    try {
        const res = await fetch('/api/alerts', {
            headers: { 'x-auth-token': token }
        });
        if (res.ok) {
            allAlertsData = await res.json();
            renderAlerts('all');
            updateStats();
        }
    } catch (err) {
        console.error("Failed to load alerts", err);
    }

    function renderAlerts(filter) {
        if (!alertsContainer) return;
        alertsContainer.innerHTML = '';

        if (allAlertsData.length === 0) {
            alertsContainer.innerHTML = `
                <div style="text-align: center; padding: 3rem; color: var(--text-muted);">
                    <div style="font-size: 3rem; margin-bottom: 1rem;"><i class="fa-solid fa-shield-check text-safe"></i></div>
                    <h3>No Alerts Found</h3>
                    <p>Your device is completely secure. No threats detected.</p>
                </div>
            `;
            return;
        }

        allAlertsData.forEach(alert => {
            // Determine status for filtering
            let domStatus = alert.status === 'resolved' ? 'resolved' : 
                            (alert.risk_level === 'high' || alert.risk_level === 'critical' ? 'high' : 'warning');
            
            if (filter !== 'all' && domStatus !== filter) return;

            let badgeHtml = '';
            let riskClass = '';
            let titleStyle = '';

            if (alert.status === 'resolved') {
                riskClass = 'resolved-status';
                titleStyle = 'text-decoration: line-through; opacity: 0.7;';
                badgeHtml = `<span class="badge" style="background: rgba(16, 185, 129, 0.1); color: var(--color-success);"><i class="fa-solid fa-shield-check"></i> Resolved</span>`;
            } else if (alert.risk_level === 'high' || alert.risk_level === 'critical') {
                riskClass = 'risk-high';
                badgeHtml = `<span class="badge alert-badge-high"><i class="fa-solid fa-triangle-exclamation"></i> High Risk</span>`;
            } else {
                riskClass = 'risk-warning';
                badgeHtml = `<span class="badge alert-badge-warning"><i class="fa-solid fa-circle-exclamation"></i> Warning</span>`;
            }

            const date = new Date(alert.createdAt);
            const timeStr = date.toLocaleDateString() + ' ' + date.toLocaleTimeString();

            // Actions
            let actionBtns = `
                <a href="threat-details.html?id=${alert._id}" class="btn ${alert.status === 'resolved' ? 'btn-outline' : 'btn-primary'}" style="padding: 0.5rem 1rem; font-size: 0.85rem;">View Details</a>
            `;
            
            if (alert.status === 'resolved') {
                actionBtns += `<button class="btn btn-outline" disabled style="padding: 0.5rem 1rem; font-size: 0.85rem; opacity: 0.5;">Resolved</button>`;
            } else {
                actionBtns += `<button class="btn btn-outline btn-resolve" data-id="${alert._id}" style="padding: 0.5rem 1rem; font-size: 0.85rem; border-color: var(--border-color);"><i class="fa-solid fa-check"></i> Mark Resolved</button>`;
            }

            const html = `
                <div class="alert-list-card ${riskClass}" data-status="${domStatus}">
                    <div class="alert-card-header">
                        ${badgeHtml}
                        <div class="alert-card-meta"><i class="fa-regular fa-clock"></i> ${timeStr} • ${alert.type.toUpperCase()}</div>
                    </div>
                    <div class="alert-card-title" style="${titleStyle}">${alert.title}</div>
                    <p style="margin: 0; font-size: 0.95rem; color: var(--text-muted); line-height: 1.5; ${alert.status==='resolved'?'opacity:0.7':''}">${alert.explanation}</p>
                    <div class="alert-card-actions">
                        ${actionBtns}
                    </div>
                </div>
            `;
            alertsContainer.innerHTML += html;
        });

        // Attach listeners to new resolve buttons
        document.querySelectorAll('.btn-resolve').forEach(btn => {
            btn.addEventListener('click', async function() {
                const id = this.getAttribute('data-id');
                try {
                    const r = await fetch(`/api/alerts/${id}/resolve`, {
                        method: 'POST',
                        headers: { 'x-auth-token': token }
                    });
                    if(r.ok) {
                        // update local data
                        const a = allAlertsData.find(x => x._id === id);
                        if(a) a.status = 'resolved';
                        
                        // re-render current filter
                        const activeFilter = document.querySelector('.filter-tab.active').getAttribute('data-filter');
                        renderAlerts(activeFilter);
                        updateStats();
                    }
                } catch(e) {
                    console.error('Resolve error', e);
                }
            });
        });
    }

    // Update summary counts based on raw data
    function updateStats() {
        let high = 0, warning = 0, resolved = 0;
        
        allAlertsData.forEach(alert => {
            if (alert.status === 'resolved') resolved++;
            else if (alert.risk_level === 'high' || alert.risk_level === 'critical') high++;
            else warning++;
        });

        if (countHigh) countHigh.textContent = high;
        if (countWarning) countWarning.textContent = warning;
        if (countResolved) countResolved.textContent = resolved;
        if (countTotal) countTotal.textContent = allAlertsData.length;
    }

    // Filter Logic
    filterTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            filterTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            renderAlerts(tab.getAttribute('data-filter'));
        });
    });
});
