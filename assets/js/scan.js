document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('cyberguard_token');

    function formatRelativeTime(dateInput) {
        if (!dateInput) return 'Never';
        const date = new Date(dateInput);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        
        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins} min ago`;
        if (diffHours < 24) return `${diffHours} hours ago`;
        return date.toLocaleDateString();
    }

    let lastScanDate = null;

    function updateLastScanTimeDisplay() {
        const lst = document.getElementById('lastScanTime');
        if (lst && lastScanDate) {
            lst.textContent = formatRelativeTime(lastScanDate);
        }
    }

    // Auto-refresh the relative time every 10 seconds
    setInterval(updateLastScanTimeDisplay, 10000);

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
                    lastScanDate = new Date(data.metrics.lastScanTime);
                    updateLastScanTimeDisplay();
                }
                
                // Update History List on right
                const historyContainer = document.getElementById('scanHistoryContainer');
                if (historyContainer && data.timeline) {
                    historyContainer.textContent = '';
                    data.timeline.forEach(item => {
                        let iconClass = item.risk_level === 'high' ? 'danger' : (item.risk_level === 'medium' ? 'warning' : 'safe');
                        let icon = item.risk_level === 'high' ? 'fa-triangle-exclamation' : (item.risk_level === 'medium' ? 'fa-circle-exclamation' : 'fa-check');
                        
                        const historyItem = document.createElement('div');
                        historyItem.className = 'scan-history-item';
                        
                        const iconDiv = document.createElement('div');
                        iconDiv.className = `scan-hist-icon ${iconClass}`;
                        const iconEl = document.createElement('i');
                        iconEl.className = `fa-solid ${icon}`;
                        iconDiv.appendChild(iconEl);
                        
                        const contentDiv = document.createElement('div');
                        contentDiv.style.flex = '1';
                        
                        const titleEl = document.createElement('div');
                        titleEl.style.fontSize = '0.88rem';
                        titleEl.style.fontWeight = '600';
                        titleEl.textContent = item.title;
                        
                        const dateEl = document.createElement('div');
                        dateEl.style.fontSize = '0.78rem';
                        dateEl.style.color = 'var(--text-muted)';
                        dateEl.textContent = new Date(item.createdAt).toLocaleString();
                        
                        contentDiv.appendChild(titleEl);
                        contentDiv.appendChild(dateEl);
                        
                        const viewLink = document.createElement('a');
                        viewLink.href = 'threat-details.html';
                        viewLink.style.fontSize = '0.8rem';
                        viewLink.style.color = 'var(--color-accent)';
                        viewLink.style.textDecoration = 'none';
                        viewLink.style.fontWeight = '600';
                        viewLink.textContent = 'View';
                        
                        historyItem.appendChild(iconDiv);
                        historyItem.appendChild(contentDiv);
                        historyItem.appendChild(viewLink);
                        
                        historyContainer.appendChild(historyItem);
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
        
        const icon = document.createElement('i');
        const iconClass = type === 'success' ? 'fa-check-circle' : type === 'warning' ? 'fa-circle-exclamation' : 'fa-circle-xmark';
        icon.className = `fa-solid ${iconClass}`;
        
        toast.appendChild(icon);
        toast.appendChild(document.createTextNode(' ' + message));
        
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
        if (logConsole) logConsole.textContent = '';
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
        const VALID_SCAN_TYPES = ['full', 'quick', 'sms', 'app'];
        if (!VALID_SCAN_TYPES.includes(type)) return;
        
        // Remove active class from all buttons and add to the clicked one
        document.querySelectorAll('.scan-type-btn').forEach(b => b.classList.remove('active'));
        if (btn) {
            btn.classList.add('active');
        } else {
            const matchBtn = document.querySelector(`.scan-type-btn[data-type="${type}"]`);
            if (matchBtn) matchBtn.classList.add('active');
        }
        
        currentScanType = type;

        let scanTitle, scanDesc;
        switch (type) {
            case 'full':
                scanTitle = 'Full System Scan';
                scanDesc = 'Analyzes messages, links, app permissions, and network activity for threats.';
                break;
            case 'quick':
                scanTitle = 'Quick Scan';
                scanDesc = 'Rapidly checks the most critical threat vectors: SMS, clipboard, and top apps.';
                break;
            case 'sms':
                scanTitle = 'SMS Threat Scan';
                scanDesc = 'Deep analysis of all incoming and stored SMS messages for phishing patterns.';
                break;
            default:
                scanTitle = 'App Permission Audit';
                scanDesc = 'Reviews every installed app\'s permissions and flags unnecessary access requests.';
        }

        const scanTitleEl = document.getElementById('scanTitle');
        const scanDescEl = document.getElementById('scanDesc');
        if (scanTitleEl) scanTitleEl.textContent = scanTitle;
        if (scanDescEl) scanDescEl.textContent = scanDesc;
        addLog(`Scan type changed to: ${scanTitle}`, 'info');

        // Reset the chips visually and textually to match the selected scan type
        resetChips();
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
        const activeCats = getActiveCats();
        allCats.forEach(c => {
            const chip = document.getElementById(c.id);
            const cs   = document.getElementById(c.chip);
            if (chip) {
                chip.className = 'scan-chip';
                if (activeCats.some(ac => ac.id === c.id)) {
                    chip.style.opacity = '1';
                } else {
                    chip.style.opacity = '0.4';
                }
            }
            if (cs) {
                cs.textContent = activeCats.some(ac => ac.id === c.id) ? 'Pending' : 'Skipped';
            }
        });
    }

    function setChip(cat, state) {
        const chip = document.getElementById(cat.id);
        const cs   = document.getElementById(cat.chip);
        if (!chip || !cs) return;
        if (state === 'scanning') {
            chip.className = 'scan-chip scanning';
            cs.textContent = '';
            const spinIcon = document.createElement('i');
            spinIcon.className = 'fa-solid fa-circle-notch fa-spin';
            cs.appendChild(spinIcon);
            cs.appendChild(document.createTextNode(' Scanning'));
        } else if (state === 'done') {
            chip.className = 'scan-chip done';
            cs.textContent = '';
            const checkIcon = document.createElement('i');
            checkIcon.className = 'fa-solid fa-check';
            cs.appendChild(checkIcon);
            cs.appendChild(document.createTextNode(' Done'));
        }
    }

    // ─── Results Rendering ─────────────────────────────────────────
    function renderResults(results) {
        const container = document.getElementById('resultsContainer');
        if (!container) return;
        container.textContent = '';
        let high = 0, med = 0, safe = 0;
        
        results.forEach(r => {
            if (r.risk_level === 'high' || r.risk_level === 'critical') high++;
            else if (r.risk_level === 'medium' || r.risk_level === 'warning') med++;
            else safe++;
            
            const dotClass = (r.risk_level === 'high' || r.risk_level === 'critical') ? 'danger' : ((r.risk_level === 'medium' || r.risk_level === 'warning') ? 'warning' : 'safe');
            const iconClass = dotClass === 'danger' ? 'fa-triangle-exclamation' : (dotClass === 'warning' ? 'fa-circle-exclamation' : 'fa-shield-check');

            const item = document.createElement('div');
            item.className = `scan-result-item risk-${dotClass}`;
            
            const infoDiv = document.createElement('div');
            infoDiv.className = 'scan-result-info';
            
            const iconDiv = document.createElement('div');
            iconDiv.className = 'scan-result-icon';
            const iconEl = document.createElement('i');
            iconEl.className = `fa-solid ${iconClass}`;
            iconDiv.appendChild(iconEl);
            
            const detailsDiv = document.createElement('div');
            
            const titleEl = document.createElement('div');
            titleEl.className = 'scan-result-title';
            titleEl.textContent = r.title;
            
            const descEl = document.createElement('div');
            descEl.className = 'scan-result-desc';
            descEl.textContent = r.explanation || r.type;
            
            const badgeEl = document.createElement('span');
            badgeEl.className = `badge scan-badge-${dotClass}`;
            badgeEl.textContent = r.risk_level.toUpperCase();
            
            detailsDiv.appendChild(titleEl);
            detailsDiv.appendChild(descEl);
            detailsDiv.appendChild(badgeEl);
            
            infoDiv.appendChild(iconDiv);
            infoDiv.appendChild(detailsDiv);
            
            const actionsDiv = document.createElement('div');
            actionsDiv.className = 'scan-result-actions';
            
            const actionLink = document.createElement('a');
            actionLink.href = 'threat-details.html';
            actionLink.className = 'btn btn-outline';
            actionLink.style.padding = '0.5rem 0.85rem';
            actionLink.style.fontSize = '0.82rem';
            actionLink.textContent = 'View Details';
            
            actionsDiv.appendChild(actionLink);
            
            item.appendChild(infoDiv);
            item.appendChild(actionsDiv);
            
            container.appendChild(item);
        });
        
        document.getElementById('countHigh').textContent = high + ' High';
        document.getElementById('countMed').textContent  = med  + ' Med';
        document.getElementById('countSafe').textContent = safe + ' Clear';
        document.getElementById('scanResultsSummary').textContent = `Completed just now • ${results.length} items found`;
    }

    // ─── Scan Engine ──────────────────────────────────────────────
    let scanInterval = null;
    let isScanCancelled = false;

    window.stopScan = function() {
        isScanCancelled = true;
        if (scanInterval) { clearInterval(scanInterval); scanInterval = null; }
        
        // Restore start button state
        document.getElementById('btnStartScan').disabled = false;
        document.getElementById('btnStartScan').innerHTML = '<i class="fa-solid fa-satellite-dish"></i> Start Scan';
        document.getElementById('btnStopScan').style.display = 'none';
        document.getElementById('scanProgressArea').style.display = 'none';
        document.querySelector('.scan-engine-card').classList.remove('scanning');
        
        // Re-enable and restore styling of scan type selection buttons
        document.querySelectorAll('.scan-type-btn').forEach(btn => {
            btn.removeAttribute('disabled');
            btn.style.pointerEvents = '';
            btn.style.opacity = '';
        });

        addLog('Scan stopped by user.', 'warning');
        showToast('Scan stopped.', 'warning');
        resetChips();
    };

    const btnStartScan = document.getElementById('btnStartScan');
    if (btnStartScan) {
        btnStartScan.addEventListener('click', async () => {
            isScanCancelled = false;
            const activeCats = getActiveCats();
            const step = Math.floor(100 / activeCats.length);
            activeCats.forEach((c, i) => { c.range = [i * step, (i + 1) * step]; });

            btnStartScan.disabled = true;
            btnStartScan.textContent = '';
            const startSpin = document.createElement('i');
            startSpin.className = 'fa-solid fa-circle-notch fa-spin';
            btnStartScan.appendChild(startSpin);
            btnStartScan.appendChild(document.createTextNode(' Scanning...'));

            document.getElementById('btnStopScan').style.display = '';
            document.getElementById('scanProgressArea').style.display = 'block';
            document.getElementById('scanResultsArea').style.display = 'none';
            document.querySelector('.scan-engine-card').classList.add('scanning');
            resetChips();

            // Disable and dim the scan type buttons during scan
            document.querySelectorAll('.scan-type-btn').forEach(btn => {
                btn.setAttribute('disabled', 'true');
                btn.style.pointerEvents = 'none';
                btn.style.opacity = '0.5';
            });

            const bar  = document.getElementById('scanProgressBar');
            const pct  = document.getElementById('scanPercentage');
            const stxt = document.getElementById('scanStatusText');
            const sdet = document.getElementById('scanStatusDetail');

            // Update status at top header
            const statusHeader = document.getElementById('scanStatusHeader');
            if (statusHeader) {
                statusHeader.textContent = 'Scanning...';
                statusHeader.style.color = 'var(--color-warning)';
            }

            let progress = 0, catIdx = 0;
            const scanTypeLabel = scanTitles[currentScanType].title;
            addLog(`Starting ${scanTypeLabel}...`, 'info');

            // Dispatch calls to the correct endpoint depending on scan type
            let realScanPromise = null;
            let endpoint = '';
            if (currentScanType === 'full') {
                endpoint = '/api/scan/start';
            } else if (currentScanType === 'quick') {
                endpoint = '/api/scan/quick';
            } else if (currentScanType === 'sms') {
                endpoint = '/api/scan/sms';
            } else if (currentScanType === 'app') {
                endpoint = '/api/scan/app-audit';
            }

            if (endpoint) {
                addLog(`Contacting scanning engine endpoint: ${endpoint}...`, 'info');
                realScanPromise = fetch(endpoint, {
                    method: 'POST',
                    headers: { 'x-auth-token': token }
                }).then(res => {
                    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
                    return res.json();
                }).catch(err => {
                    console.error(`${scanTypeLabel} backend call failed:`, err);
                    addLog(`Error contacting backend: ${err.message}`, 'danger');
                    return null;
                });
            }

            scanInterval = setInterval(async () => {
                if (isScanCancelled) {
                    clearInterval(scanInterval);
                    return;
                }

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
                    if (isScanCancelled) return;

                    stxt.textContent = 'Scan Complete';
                    sdet.textContent = 'Finalizing report and saving...';
                    addLog('All modules scanned. Saving to database...', 'info');

                    try {
                        let data = null;
                        
                        // Resolve the backend promise if it exists
                        if (realScanPromise) {
                            const scanResult = await realScanPromise;
                            if (isScanCancelled) return;

                            if (scanResult && scanResult.newAlerts) {
                                addLog(`${scanTypeLabel} backend finished. Found ${scanResult.alertsFound} issue(s).`, 'info');
                                
                                // Print alerts in console logs
                                scanResult.newAlerts.forEach(alert => {
                                    const logClass = alert.risk_level === 'critical' || alert.risk_level === 'high' ? 'danger' : (alert.risk_level === 'medium' || alert.risk_level === 'warning' ? 'warning' : 'safe');
                                    addLog(`[Threat Found] ${alert.title} - ${alert.explanation || alert.type}`, logClass);
                                });

                                data = {
                                    timeline: scanResult.newAlerts,
                                    metrics: { score: scanResult.score }
                                };
                            }
                        }
                        
                        if (isScanCancelled) return;

                        // Fallback to active alerts in dashboard if backend call failed or was empty
                        if (!data) {
                            addLog('Loading active alerts timeline as fallback...', 'warning');
                            const alertRes = await fetch('/api/dashboard', {
                                method: 'GET',
                                headers: { 'x-auth-token': token }
                            });
                            if (isScanCancelled) return;
                            data = await alertRes.json();
                        }

                        // Update status at top header
                        const statusHeader = document.getElementById('scanStatusHeader');
                        if (statusHeader) {
                            const threatsCount = data.timeline ? data.timeline.length : 0;
                            if (threatsCount > 0) {
                                statusHeader.textContent = 'Threats Found';
                                statusHeader.style.color = 'var(--color-danger)';
                            } else {
                                statusHeader.textContent = 'System Protected';
                                statusHeader.style.color = 'var(--color-success)';
                            }
                        }
                        
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

                        if (isScanCancelled) return;

                        setTimeout(() => {
                            if (isScanCancelled) return;

                            btnStartScan.disabled = false;
                            btnStartScan.textContent = '';
                            const rotateIcon = document.createElement('i');
                            rotateIcon.className = 'fa-solid fa-rotate-right';
                            btnStartScan.appendChild(rotateIcon);
                            btnStartScan.appendChild(document.createTextNode(' Run Again'));

                            document.getElementById('btnStopScan').style.display = 'none';
                            document.getElementById('scanProgressArea').style.display = 'none';
                            document.getElementById('scanResultsArea').style.display = 'block';
                            document.querySelector('.scan-engine-card').classList.remove('scanning');

                            // Re-enable and restore scan type buttons
                            document.querySelectorAll('.scan-type-btn').forEach(btn => {
                                btn.removeAttribute('disabled');
                                btn.style.pointerEvents = '';
                                btn.style.opacity = '';
                            });

                            renderResults(data.timeline || []);
                            showToast('Scan complete and saved!', 'success');
                            lastScanDate = new Date();
                            updateLastScanTimeDisplay();
                            loadScanHistory(); // Refresh history list
                        }, 1000);

                    } catch (err) {
                        console.error("Scan save error:", err);
                        showToast("Error saving scan result.", "error");

                        // UI Safety recovery (never leave UI permanently disabled)
                        btnStartScan.disabled = false;
                        btnStartScan.innerHTML = '<i class="fa-solid fa-satellite-dish"></i> Start Scan';
                        document.getElementById('btnStopScan').style.display = 'none';
                        document.getElementById('scanProgressArea').style.display = 'none';
                        document.querySelector('.scan-engine-card').classList.remove('scanning');

                        document.querySelectorAll('.scan-type-btn').forEach(btn => {
                            btn.removeAttribute('disabled');
                            btn.style.pointerEvents = '';
                            btn.style.opacity = '';
                        });
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
        result.textContent = '';
        
        const loadingBox = document.createElement('div');
        loadingBox.className = 'url-result-box';
        loadingBox.style.display = 'flex';
        loadingBox.style.alignItems = 'center';
        loadingBox.style.gap = '0.5rem';
        loadingBox.style.padding = '1rem';
        loadingBox.style.background = 'var(--bg-surface)';
        loadingBox.style.borderRadius = 'var(--radius-md)';
        
        const spinIcon = document.createElement('i');
        spinIcon.className = 'fa-solid fa-circle-notch fa-spin';
        
        loadingBox.appendChild(spinIcon);
        loadingBox.appendChild(document.createTextNode(' Checking URL against Google Safe Browsing...'));
        result.appendChild(loadingBox);

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
                let cls, iconClass, title, body;

                if (data.score < 50) {
                    cls = 'danger'; iconClass = 'fa-circle-xmark';
                    title = data.alerts.length > 0 ? data.alerts[0].title : 'High Risk';
                    body  = data.alerts.length > 0 ? data.alerts[0].explanation : 'This URL matches known threat patterns. Do not open it.';
                    addLog(`URL check: HIGH RISK — ${url}`, 'danger');
                } else if (data.score < 100) {
                    cls = 'warning'; iconClass = 'fa-triangle-exclamation';
                    title = data.alerts.length > 0 ? data.alerts[0].title : 'Caution';
                    body  = data.alerts.length > 0 ? data.alerts[0].explanation : 'This URL is suspicious.';
                    addLog(`URL check: WARNING — ${url}`, 'warning');
                } else {
                    cls = 'safe'; iconClass = 'fa-circle-check';
                    title = 'Appears Safe';
                    body  = 'Google Safe Browsing found no known threats for this URL.';
                    addLog(`URL check: SAFE — ${url}`, 'safe');
                }

                result.textContent = '';
                
                const resultBox = document.createElement('div');
                resultBox.className = `url-result-box ${cls}`;
                
                const iconEl = document.createElement('i');
                iconEl.className = `fa-solid ${iconClass}`;
                iconEl.style.fontSize = '1.3rem';
                iconEl.style.flexShrink = '0';
                iconEl.style.marginTop = '2px';
                
                const contentDiv = document.createElement('div');
                
                const titleStrong = document.createElement('strong');
                titleStrong.textContent = title;
                
                const brEl = document.createElement('br');
                
                const bodySpan = document.createElement('span');
                bodySpan.style.fontSize = '0.85rem';
                bodySpan.style.opacity = '0.85';
                bodySpan.textContent = body;
                
                contentDiv.appendChild(titleStrong);
                contentDiv.appendChild(brEl);
                contentDiv.appendChild(bodySpan);
                
                resultBox.appendChild(iconEl);
                resultBox.appendChild(contentDiv);
                
                result.appendChild(resultBox);
            } else {
                result.textContent = '';
                const errorBox = document.createElement('div');
                errorBox.className = 'url-result-box warning';
                errorBox.style.display = 'flex';
                errorBox.style.gap = '0.5rem';
                errorBox.style.padding = '1rem';
                errorBox.style.background = 'rgba(245,158,11,0.1)';
                errorBox.style.color = 'var(--color-warning)';
                errorBox.style.borderRadius = 'var(--radius-md)';
                
                const warnIcon = document.createElement('i');
                warnIcon.className = 'fa-solid fa-circle-exclamation';
                
                const textDiv = document.createElement('div');
                const errStrong = document.createElement('strong');
                errStrong.textContent = 'Error';
                const errBr = document.createElement('br');
                const errMsg = document.createTextNode('Failed to scan URL.');
                
                textDiv.appendChild(errStrong);
                textDiv.appendChild(errBr);
                textDiv.appendChild(errMsg);
                
                errorBox.appendChild(warnIcon);
                errorBox.appendChild(textDiv);
                result.appendChild(errorBox);
                
                addLog('URL scan failed.', 'warning');
            }
        } catch (err) {
            console.error(err);
            result.textContent = '';
            const errorBox = document.createElement('div');
            errorBox.className = 'url-result-box warning';
            errorBox.style.display = 'flex';
            errorBox.style.gap = '0.5rem';
            errorBox.style.padding = '1rem';
            errorBox.style.background = 'rgba(245,158,11,0.1)';
            errorBox.style.color = 'var(--color-warning)';
            errorBox.style.borderRadius = 'var(--radius-md)';
            
            const warnIcon = document.createElement('i');
            warnIcon.className = 'fa-solid fa-circle-exclamation';
            
            const textDiv = document.createElement('div');
            const errStrong = document.createElement('strong');
            errStrong.textContent = 'Error';
            const errBr = document.createElement('br');
            const errMsg = document.createTextNode('Failed to connect to scanner.');
            
            textDiv.appendChild(errStrong);
            textDiv.appendChild(errBr);
            textDiv.appendChild(errMsg);
            
            errorBox.appendChild(warnIcon);
            errorBox.appendChild(textDiv);
            result.appendChild(errorBox);
            
            addLog('URL scan error.', 'warning');
        }
    };

    // Bind Quick URL Checker button dynamically
    const checkBtn = document.querySelector('button[onclick="checkURL()"]');
    if (checkBtn) {
        checkBtn.removeAttribute('onclick'); // remove inline onclick to prevent double execution
        checkBtn.addEventListener('click', window.checkURL);
    }

    // Bind scan type buttons dynamically to guarantee clicks always work
    document.querySelectorAll('.scan-type-btn').forEach(btn => {
        btn.removeAttribute('onclick'); // remove inline onclick
        btn.addEventListener('click', function(e) {
            if (this.getAttribute('disabled') === 'true' || this.style.pointerEvents === 'none') {
                return;
            }
            const type = this.getAttribute('data-type');
            window.selectScanType(this, type);
        });
    });

    const urlInput = document.getElementById('urlInput');
    if (urlInput) {
        urlInput.addEventListener('keydown', e => {
            if (e.key === 'Enter') {
                e.preventDefault();
                window.checkURL();
            }
        });
    }
});
