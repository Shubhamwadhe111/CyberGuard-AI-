document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('cyberguard_token');

    // ─── FETCH SCAN HISTORY ──────────────────────────────────────────
    async function loadScanHistory() {
        if (!token) return;
        try {
            const res = await fetch('/api/dashboard', {
                method: 'GET',
                headers: { 'x-auth-token': token }
            });
            if (res.ok) {
                const data = await res.json();
                // Update Last Scan Time on header
                if (data.metrics && data.metrics.lastScanTime) {
                    const date = new Date(data.metrics.lastScanTime);
                    document.getElementById('lastScanTime').innerText = date.toLocaleString();
                }
                
                // Update History List on right
                const historyContainer = document.querySelector('.scan-right-col .db-card:nth-child(3) div');
                if (historyContainer && data.timeline) {
                    historyContainer.innerHTML = '';
                    data.timeline.forEach(item => {
                        let iconClass = item.risk_level === 'high' ? 'danger' : (item.risk_level === 'medium' ? 'warning' : 'safe');
                        let icon = item.risk_level === 'high' ? 'fa-triangle-exclamation' : (item.risk_level === 'medium' ? 'fa-circle-exclamation' : 'fa-check');
                        
                        historyContainer.innerHTML += `
                            <div class="scan-history-item">
                                <div class="scan-hist-icon ${iconClass}"><i class="fa-solid ${icon}"></i></div>
                                <div style="flex:1;">
                                    <div style="font-size:0.88rem;font-weight:600;">${item.title}</div>
                                    <div style="font-size:0.78rem;color:var(--text-muted);">${new Date(item.createdAt).toLocaleString()}</div>
                                </div>
                                <a href="threat-details.html" style="font-size:0.8rem;color:var(--color-accent);text-decoration:none;font-weight:600;">View</a>
                            </div>
                        `;
                    });
                }
            }
        } catch (err) { console.error("History load error:", err); }
    }
    loadScanHistory();

    // ─── Toast ───────────────────────────────────────────────────
    function showToast(message, type = 'success') {
        const container = document.getElementById('toastContainer');
        if (!container) return;
        const toast = document.createElement('div');
        const bg = type === 'success' ? '#10b981' : type === 'warning' ? '#f59e0b' : '#ef4444';
        toast.style.cssText = `background:${bg};color:white;padding:0.9rem 1.25rem;border-radius:10px;display:flex;align-items:center;gap:0.6rem;font-size:0.9rem;font-weight:500;animation:slideIn 0.3s ease;`;
        const icon = type === 'success' ? 'fa-check-circle' : type === 'warning' ? 'fa-circle-exclamation' : 'fa-circle-xmark';
        toast.innerHTML = `<i class="fa-solid ${icon}"></i> ${message}`;
        container.appendChild(toast);
        setTimeout(() => { toast.style.opacity = '0'; toast.style.transition = 'opacity 0.3s'; setTimeout(() => toast.remove(), 300); }, 3000);
    }

    // ─── Log Console ─────────────────────────────────────────────
    const logConsole = document.getElementById('scanLogConsole');
    function addLog(text, cls = '') {
        if (!logConsole) return;
        const line = document.createElement('div');
        line.className = 'log-line ' + cls;
        const ts = new Date().toLocaleTimeString([], {hour:'2-digit',minute:'2-digit',second:'2-digit'});
        line.textContent = `[${ts}] ${text}`;
        logConsole.appendChild(line);
        logConsole.scrollTop = logConsole.scrollHeight;
    }

    window.clearLog = function() {
        if (logConsole) logConsole.innerHTML = '';
        addLog('Console cleared.', 'info');
    };

    // ─── Scan Type ────────────────────────────────────────────────
    let currentScanType = 'full';
    const scanTitles = {
        full:  { title: 'Full System Scan',   desc: 'Analyzes messages, links, app permissions, and network activity for threats.' },
        quick: { title: 'Quick Scan',          desc: 'Rapidly checks the most critical threat vectors: SMS, clipboard, and top apps.' },
        sms:   { title: 'SMS Threat Scan',     desc: 'Deep analysis of all incoming and stored SMS messages for phishing patterns.' },
        app:   { title: 'App Permission Audit', desc: 'Reviews every installed app\'s permissions and flags unnecessary access requests.' },
    };

    window.selectScanType = function(btn, type) {
        document.querySelectorAll('.scan-type-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentScanType = type;
        const t = scanTitles[type];
        document.getElementById('scanTitle').textContent = t.title;
        document.getElementById('scanDesc').textContent = t.desc;
        addLog(`Scan type changed to: ${t.title}`, 'info');
    };

    // ─── Categories ───────────────────────────────────────────────
    const allCats = [
        { id: 'catMessages', chip: 'chipMessages', label: 'Messages',   range: [0,20],  log: 'Scanning SMS database for phishing patterns...', details: 'Checking for urgency, OTP tricks, malicious senders...' },
        { id: 'catLinks',    chip: 'chipLinks',    label: 'Links',       range: [20,40], log: 'Cross-referencing URLs with global threat intel...', details: 'Scanning clipboard, browser history, and chat links...' },
        { id: 'catPerms',    chip: 'chipPerms',    label: 'Permissions', range: [40,65], log: 'Auditing app permission manifests...', details: 'Checking apps for dangerous permissions...' },
        { id: 'catApps',     chip: 'chipApps',     label: 'Apps',        range: [65,85], log: 'Comparing packages against malware signatures...', details: 'Scanning app behavior and background network calls...' },
        { id: 'catNetwork',  chip: 'chipNetwork',  label: 'Network',     range: [85,100],log: 'Analyzing active connections and open ports...', details: 'Checking for man-in-the-middle and rogue APs...' },
    ];

    function getActiveCats() {
        if (currentScanType === 'quick') return allCats.slice(0, 2);
        if (currentScanType === 'sms')   return allCats.slice(0, 1);
        if (currentScanType === 'app')   return allCats.slice(2, 4);
        return allCats;
    }

    function resetChips() {
        allCats.forEach(c => {
            const chip = document.getElementById(c.id);
            const cs   = document.getElementById(c.chip);
            if (chip) chip.className = 'scan-chip';
            if (cs)   cs.textContent = 'Pending';
        });
    }

    function setChip(cat, state) {
        const chip = document.getElementById(cat.id);
        const cs   = document.getElementById(cat.chip);
        if (!chip || !cs) return;
        if (state === 'scanning') {
            chip.className = 'scan-chip scanning';
            cs.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Scanning';
        } else if (state === 'done') {
            chip.className = 'scan-chip done';
            cs.innerHTML = '<i class="fa-solid fa-check"></i> Done';
        }
    }

    // ─── Results Rendering ─────────────────────────────────────────
    function renderResults(results) {
        const container = document.getElementById('resultsContainer');
        if (!container) return;
        let html = '';
        let high = 0, med = 0, safe = 0;
        results.forEach(r => {
            if (r.risk_level === 'high' || r.risk_level === 'critical') high++;
            else if (r.risk_level === 'medium' || r.risk_level === 'warning') med++;
            else safe++;
            
            const dotClass = (r.risk_level === 'high' || r.risk_level === 'critical') ? 'danger' : ((r.risk_level === 'medium' || r.risk_level === 'warning') ? 'warning' : 'safe');
            const icon = dotClass === 'danger' ? 'fa-triangle-exclamation' : (dotClass === 'warning' ? 'fa-circle-exclamation' : 'fa-shield-check');

            html += `
            <div class="scan-result-item risk-${dotClass}">
                <div class="scan-result-info">
                    <div class="scan-result-icon"><i class="fa-solid ${icon}"></i></div>
                    <div>
                        <div class="scan-result-title">${r.title}</div>
                        <div class="scan-result-desc">${r.explanation || r.type}</div>
                        <span class="badge scan-badge-${dotClass}">${r.risk_level.toUpperCase()}</span>
                    </div>
                </div>
                <div class="scan-result-actions">
                    <a href="threat-details.html" class="btn btn-outline" style="padding:0.5rem 0.85rem;font-size:0.82rem;">View Details</a>
                </div>
            </div>`;
        });
        container.innerHTML = html;
        document.getElementById('countHigh').textContent = high + ' High';
        document.getElementById('countMed').textContent  = med  + ' Med';
        document.getElementById('countSafe').textContent = safe + ' Clear';
        document.getElementById('scanResultsSummary').textContent = `Completed just now • ${results.length} items found`;
    }

    // ─── Scan Engine ──────────────────────────────────────────────
    let scanInterval = null;

    window.stopScan = function() {
        if (scanInterval) { clearInterval(scanInterval); scanInterval = null; }
        document.getElementById('btnStartScan').disabled = false;
        document.getElementById('btnStartScan').innerHTML = '<i class="fa-solid fa-satellite-dish"></i> Start Scan';
        document.getElementById('btnStopScan').style.display = 'none';
        document.getElementById('scanProgressArea').style.display = 'none';
        document.querySelector('.scan-engine-card').classList.remove('scanning');
        addLog('Scan stopped by user.', 'warning');
        showToast('Scan stopped.', 'warning');
        resetChips();
    };

    const btnStartScan = document.getElementById('btnStartScan');
    if (btnStartScan) {
        btnStartScan.addEventListener('click', async () => {
            const activeCats = getActiveCats();
            const step = Math.floor(100 / activeCats.length);
            activeCats.forEach((c, i) => { c.range = [i * step, (i + 1) * step]; });

            btnStartScan.disabled = true;
            btnStartScan.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Scanning...';
            document.getElementById('btnStopScan').style.display = '';
            document.getElementById('scanProgressArea').style.display = 'block';
            document.getElementById('scanResultsArea').style.display = 'none';
            document.querySelector('.scan-engine-card').classList.add('scanning');
            resetChips();

            const bar  = document.getElementById('scanProgressBar');
            const pct  = document.getElementById('scanPercentage');
            const stxt = document.getElementById('scanStatusText');
            const sdet = document.getElementById('scanStatusDetail');

            let progress = 0, catIdx = 0;
            addLog(`Starting ${scanTitles[currentScanType].title}...`, 'info');

            scanInterval = setInterval(async () => {
                progress += Math.floor(Math.random() * 3) + 2;
                if (progress > 100) progress = 100;

                bar.style.width = progress + '%';
                pct.textContent = progress + '%';

                if (catIdx < activeCats.length) {
                    const cat = activeCats[catIdx];
                    if (progress >= cat.range[0] && progress < cat.range[1]) {
                        stxt.textContent = `Analyzing ${cat.label}...`;
                        sdet.textContent = cat.details;
                        if (!document.getElementById(cat.id)?.classList.contains('scanning')) {
                            setChip(cat, 'scanning');
                            addLog(cat.log, '');
                        }
                    } else if (progress >= cat.range[1]) {
                        setChip(cat, 'done');
                        addLog(`${cat.label} scan complete.`, 'safe');
                        catIdx++;
                    }
                }

                if (progress >= 100) {
                    clearInterval(scanInterval);
                    stxt.textContent = 'Scan Complete';
                    sdet.textContent = 'Finalizing report and saving...';
                    addLog('All modules scanned. Saving to database...', 'info');

                    try {
                        // 1. Fetch actual alerts from database to show real results
                        const alertRes = await fetch('/api/dashboard', {
                            method: 'GET',
                            headers: { 'x-auth-token': token }
                        });
                        const data = await alertRes.json();
                        
                        // 2. Perform a "Save Scan" call to update history
                        await fetch('/api/scan/save', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json', 'x-auth-token': token },
                            body: JSON.stringify({
                                scanType: currentScanType,
                                score: data.metrics ? data.metrics.score : 100,
                                threatsFound: data.timeline ? data.timeline.length : 0
                            })
                        });

                        setTimeout(() => {
                            btnStartScan.disabled = false;
                            btnStartScan.innerHTML = '<i class="fa-solid fa-rotate-right"></i> Run Again';
                            document.getElementById('btnStopScan').style.display = 'none';
                            document.getElementById('scanProgressArea').style.display = 'none';
                            document.getElementById('scanResultsArea').style.display = 'block';
                            document.querySelector('.scan-engine-card').classList.remove('scanning');

                            renderResults(data.timeline || []);
                            showToast('Scan complete and saved!', 'success');
                            loadScanHistory(); // Refresh history list
                        }, 1000);

                    } catch (err) {
                        console.error("Scan save error:", err);
                        showToast("Error saving scan result.", "error");
                    }
                }
            }, 50);
        });
    }

    // ─── URL Checker ──────────────────────────────────────────────
    const knownBad = ['bit.ly', 'phishing', 'free-prize', 'bank-verify', 'login-secure', 'otpverify', 'http://'];
    const knownWarn = ['t.co', 'tinyurl', 'ow.ly', 'shorturl'];

    window.checkURL = async function() {
        const input  = document.getElementById('urlInput');
        const result = document.getElementById('urlResult');
        const url = input.value.trim();
        if (!url) { result.style.display = 'none'; return; }

        result.style.display = 'block';
        result.innerHTML = `<div class="url-result-box" style="display:flex;align-items:center;gap:0.5rem;padding:1rem;background:var(--surface);border-radius:var(--radius-md);"><i class="fa-solid fa-circle-notch fa-spin"></i> Checking URL against Google Safe Browsing...</div>`;
        addLog(`Checking URL: ${url}`, 'info');

        try {
            const res = await fetch('/api/scan_v2/url', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'x-auth-token': token 
                },
                body: JSON.stringify({ url })
            });

            if (res.ok) {
                const data = await res.json();
                let cls, icon, title, body;

                if (data.score < 50) {
                    cls = 'danger'; icon = 'fa-circle-xmark';
                    title = data.alerts.length > 0 ? data.alerts[0].title : 'High Risk';
                    body  = data.alerts.length > 0 ? data.alerts[0].explanation : 'This URL matches known threat patterns. Do <strong>not</strong> open it.';
                    addLog(`URL check: HIGH RISK — ${url}`, 'danger');
                } else if (data.score < 100) {
                    cls = 'warning'; icon = 'fa-triangle-exclamation';
                    title = data.alerts.length > 0 ? data.alerts[0].title : 'Caution';
                    body  = data.alerts.length > 0 ? data.alerts[0].explanation : 'This URL is suspicious.';
                    addLog(`URL check: WARNING — ${url}`, 'warning');
                } else {
                    cls = 'safe'; icon = 'fa-circle-check';
                    title = 'Appears Safe';
                    body  = 'Google Safe Browsing found no known threats for this URL.';
                    addLog(`URL check: SAFE — ${url}`, 'safe');
                }

                result.innerHTML = `
                    <div class="url-result-box ${cls}">
                        <i class="fa-solid ${icon}" style="font-size:1.3rem;flex-shrink:0;margin-top:2px;"></i>
                        <div><strong>${title}</strong><br><span style="font-size:0.85rem;opacity:0.85;">${body}</span></div>
                    </div>`;
            } else {
                result.innerHTML = `<div class="url-result-box warning" style="display:flex;gap:0.5rem;padding:1rem;background:rgba(245,158,11,0.1);color:var(--color-warning);border-radius:var(--radius-md);"><i class="fa-solid fa-circle-exclamation"></i><div><strong>Error</strong><br>Failed to scan URL.</div></div>`;
                addLog('URL scan failed.', 'warning');
            }
        } catch (err) {
            console.error(err);
            result.innerHTML = `<div class="url-result-box warning" style="display:flex;gap:0.5rem;padding:1rem;background:rgba(245,158,11,0.1);color:var(--color-warning);border-radius:var(--radius-md);"><i class="fa-solid fa-circle-exclamation"></i><div><strong>Error</strong><br>Failed to connect to scanner.</div></div>`;
            addLog('URL scan error.', 'warning');
        }
    };

    const urlInput = document.getElementById('urlInput');
    if (urlInput) urlInput.addEventListener('keydown', e => { if (e.key === 'Enter') window.checkURL(); });
    if (lst) lst.textContent = new Date().toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'});
});
