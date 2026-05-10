document.addEventListener('DOMContentLoaded', () => {

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
        { id: 'catPerms',    chip: 'chipPerms',    label: 'Permissions', range: [40,65], log: 'Auditing app permission manifests...', details: 'Checking 34 installed apps for dangerous permissions...' },
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

    // ─── Results Data ─────────────────────────────────────────────
    const allResults = [
        { risk: 'high',   icon: 'fa-triangle-exclamation', title: 'Suspicious bank verification SMS',     desc: 'Detected urgent language requesting OTP from unknown sender.',       badge: 'High Risk',  tag: 'SMS Message' },
        { risk: 'high',   icon: 'fa-triangle-exclamation', title: 'Phishing link in chat message',        desc: 'URL masquerades as a banking login page. Domain registered 2 days ago.', badge: 'High Risk',  tag: 'Phishing Link' },
        { risk: 'medium', icon: 'fa-circle-exclamation',   title: 'Unknown shortened payment URL',        desc: 'Clipboard link matches known URL-masking patterns (bit.ly redirect).', badge: 'Medium Risk', tag: 'Clipboard' },
        { risk: 'medium', icon: 'fa-circle-exclamation',   title: 'Calculator App requests Contacts + Mic', desc: 'App has no functional need for microphone or contact access.',   badge: 'Warning',    tag: 'App Permission' },
        { risk: 'medium', icon: 'fa-circle-exclamation',   title: 'Flashlight App requests Location',     desc: '"Super Flashlight" accesses GPS in the background.',               badge: 'Warning',    tag: 'App Permission' },
        { risk: 'safe',   icon: 'fa-shield-check',         title: 'OS Security Patches Up-to-date',       desc: 'Device is running the latest security patch level.',                badge: 'Clear',      tag: 'System' },
        { risk: 'safe',   icon: 'fa-shield-check',         title: 'No open network ports detected',       desc: 'Network scan found no suspicious listening services.',              badge: 'Clear',      tag: 'Network' },
    ];

    function renderResults(results) {
        const container = document.getElementById('resultsContainer');
        if (!container) return;
        let html = '';
        let high = 0, med = 0, safe = 0;
        results.forEach(r => {
            if (r.risk === 'high')   high++;
            if (r.risk === 'medium') med++;
            if (r.risk === 'safe')   safe++;
            const badgeClass = r.risk === 'high' ? 'scan-badge-high' : r.risk === 'medium' ? 'scan-badge-medium' : 'scan-badge-safe';
            const actionBtn  = r.risk === 'safe'
                ? `<button class="btn btn-outline" style="opacity:0.5;cursor:default;padding:0.5rem 0.85rem;font-size:0.82rem;">No Action Needed</button>`
                : `<a href="threat-details.html" class="btn btn-outline" style="padding:0.5rem 0.85rem;font-size:0.82rem;">View Details</a>`;
            html += `
            <div class="scan-result-item risk-${r.risk}">
                <div class="scan-result-info">
                    <div class="scan-result-icon"><i class="fa-solid ${r.icon}"></i></div>
                    <div>
                        <div class="scan-result-title">${r.title}</div>
                        <div class="scan-result-desc">${r.desc}</div>
                        <span class="badge ${badgeClass}">${r.badge}</span>
                        <span class="badge" style="background:var(--bg-main);color:var(--text-muted);border:1px solid var(--border-color);margin-left:0.4rem;">${r.tag}</span>
                    </div>
                </div>
                <div class="scan-result-actions">${actionBtn}</div>
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
        btnStartScan.addEventListener('click', () => {
            const activeCats = getActiveCats();
            // Remap ranges across active cats
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
            bar.style.width = '0%';
            pct.textContent = '0%';

            scanInterval = setInterval(() => {
                progress += Math.floor(Math.random() * 3) + 1;
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
                    sdet.textContent = 'Finalizing report...';
                    addLog('All modules scanned. Compiling results...', 'info');

                    setTimeout(() => {
                        btnStartScan.disabled = false;
                        btnStartScan.innerHTML = '<i class="fa-solid fa-rotate-right"></i> Run Again';
                        document.getElementById('btnStopScan').style.display = 'none';
                        document.getElementById('scanProgressArea').style.display = 'none';
                        document.getElementById('scanResultsArea').style.display = 'block';
                        document.querySelector('.scan-engine-card').classList.remove('scanning');

                        const results = currentScanType === 'sms'   ? allResults.slice(0,1) :
                                        currentScanType === 'quick'  ? allResults.slice(0,3) :
                                        currentScanType === 'app'    ? allResults.slice(3,5) :
                                        allResults;
                        renderResults(results);

                        const high = results.filter(r => r.risk === 'high').length;
                        addLog(`Report ready: ${high} high-risk item(s) detected.`, high > 0 ? 'danger' : 'safe');
                        showToast(high > 0 ? `Scan complete — ${high} threat(s) found!` : 'Scan complete — No critical threats found!', high > 0 ? 'error' : 'success');
                    }, 800);
                }
            }, 80);
        });
    }

    // ─── URL Checker ──────────────────────────────────────────────
    const knownBad = ['bit.ly', 'phishing', 'free-prize', 'bank-verify', 'login-secure', 'otpverify', 'http://'];
    const knownWarn = ['t.co', 'tinyurl', 'ow.ly', 'shorturl'];

    window.checkURL = function() {
        const input  = document.getElementById('urlInput');
        const result = document.getElementById('urlResult');
        const url = input.value.trim();
        if (!url) { result.style.display = 'none'; return; }

        let cls, icon, title, body;
        const lower = url.toLowerCase();

        if (knownBad.some(k => lower.includes(k))) {
            cls = 'danger'; icon = 'fa-circle-xmark';
            title = 'High Risk — Likely Phishing';
            body  = 'This URL matches known phishing patterns. Do <strong>not</strong> open it. Report to your carrier immediately.';
            addLog(`URL check: HIGH RISK — ${url}`, 'danger');
        } else if (knownWarn.some(k => lower.includes(k))) {
            cls = 'warning'; icon = 'fa-triangle-exclamation';
            title = 'Caution — Shortened URL';
            body  = 'This is a shortened link. Destination unknown. Avoid clicking unless you trust the source.';
            addLog(`URL check: WARNING — ${url}`, 'warning');
        } else {
            cls = 'safe'; icon = 'fa-circle-check';
            title = 'Appears Safe';
            body  = 'No known threat patterns detected. Always be cautious before entering credentials on any site.';
            addLog(`URL check: SAFE — ${url}`, 'safe');
        }

        result.style.display = 'block';
        result.innerHTML = `
            <div class="url-result-box ${cls}">
                <i class="fa-solid ${icon}" style="font-size:1.3rem;flex-shrink:0;margin-top:2px;"></i>
                <div><strong>${title}</strong><br><span style="font-size:0.85rem;opacity:0.85;">${body}</span></div>
            </div>`;
    };

    // Enter key on URL input
    const urlInput = document.getElementById('urlInput');
    if (urlInput) urlInput.addEventListener('keydown', e => { if (e.key === 'Enter') window.checkURL(); });

    // Update last scan time
    const lst = document.getElementById('lastScanTime');
    if (lst) lst.textContent = new Date().toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'});
});
