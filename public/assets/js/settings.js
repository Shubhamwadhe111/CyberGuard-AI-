document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('cyberguard_token');
    
    const setMsgScan     = document.getElementById('setMsgScan');
    const setLinkCheck   = document.getElementById('setLinkCheck');
    const setAppPerms    = document.getElementById('setAppPerms');
    const setAutoScan    = document.getElementById('setAutoScan');
    const setScanFreq    = document.getElementById('setScanFreq');
    const setSensitivity = document.getElementById('setSensitivity');
    const setPrivacyMode = document.getElementById('setPrivacyMode');
    const setSaveHistory = document.getElementById('setSaveHistory');
    const setRetention   = document.getElementById('setRetention');
    const setHighRisk    = document.getElementById('setHighRisk');
    const setWeeklySummary = document.getElementById('setWeeklySummary');
    const setTipsAlerts  = document.getElementById('setTipsAlerts');
    
    const btnSaveBottom   = document.getElementById('btnSaveBottom');
    const btnExportReport = document.getElementById('btnExportReport');
    const btnClearData    = document.getElementById('btnClearData');

    // ─── LOAD SETTINGS ────────────────────────────────────────────────
    async function loadSettings() {
        if (!token) return;
        try {
            const res = await fetch('/api/settings', {
                method: 'GET',
                headers: { 'x-auth-token': token }
            });
            if (res.ok) {
                const data = await res.json();
                
                if (setMsgScan)     setMsgScan.checked     = data.message_scan;
                if (setLinkCheck)   setLinkCheck.checked   = data.link_check;
                if (setAppPerms)    setAppPerms.checked    = data.app_perms;
                if (setAutoScan)    setAutoScan.checked    = data.auto_scan;
                if (setScanFreq)    setScanFreq.value      = data.scan_frequency || 'weekly';
                if (setPrivacyMode) setPrivacyMode.checked = data.privacy_mode;
                if (setRetention)   setRetention.value     = data.data_retention || '90';
                
                // Load optional states from localStorage if available
                if (setSensitivity) setSensitivity.value = localStorage.getItem('settings_sensitivity') || 'standard';
                if (setSaveHistory) setSaveHistory.checked = localStorage.getItem('settings_save_history') !== 'false';
                if (setHighRisk)    setHighRisk.checked    = localStorage.getItem('settings_high_risk') !== 'false';
                if (setWeeklySummary) setWeeklySummary.checked = localStorage.getItem('settings_weekly_summary') === 'true';
                if (setTipsAlerts)  setTipsAlerts.checked  = localStorage.getItem('settings_tips_alerts') !== 'false';
            }
        } catch (err) {
            console.error("Error loading settings:", err);
        }
    }
    await loadSettings();

    // ─── SAVE SETTINGS ────────────────────────────────────────────────
    if (btnSaveBottom) {
        btnSaveBottom.addEventListener('click', async () => {
            btnSaveBottom.disabled = true;
            btnSaveBottom.textContent = '';
            const spinIcon = document.createElement('i');
            spinIcon.className = 'fa-solid fa-circle-notch fa-spin';
            btnSaveBottom.appendChild(spinIcon);
            btnSaveBottom.appendChild(document.createTextNode(' Saving...'));

            const payload = {
                message_scan: setMsgScan ? setMsgScan.checked : true,
                link_check: setLinkCheck ? setLinkCheck.checked : true,
                app_perms: setAppPerms ? setAppPerms.checked : true,
                auto_scan: setAutoScan ? setAutoScan.checked : true,
                scan_frequency: setScanFreq ? setScanFreq.value : 'weekly',
                privacy_mode: setPrivacyMode ? setPrivacyMode.checked : false,
                data_retention: setRetention ? setRetention.value : '90'
            };

            try {
                const res = await fetch('/api/settings', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-auth-token': token
                    },
                    body: JSON.stringify(payload)
                });

                if (res.ok) {
                    // Save client-only settings locally
                    if (setSensitivity) localStorage.setItem('settings_sensitivity', setSensitivity.value);
                    if (setSaveHistory) localStorage.setItem('settings_save_history', setSaveHistory.checked);
                    if (setHighRisk)    localStorage.setItem('settings_high_risk', setHighRisk.checked);
                    if (setWeeklySummary) localStorage.setItem('settings_weekly_summary', setWeeklySummary.checked);
                    if (setTipsAlerts)  localStorage.setItem('settings_tips_alerts', setTipsAlerts.checked);

                    showToast('Settings saved successfully!', 'success');
                } else {
                    showToast('Failed to save settings.', 'danger');
                }
            } catch (err) {
                console.error("Save settings error:", err);
                showToast('Network error while saving settings.', 'danger');
            } finally {
                btnSaveBottom.disabled = false;
                btnSaveBottom.textContent = '';
                const saveIcon = document.createElement('i');
                saveIcon.className = 'fa-solid fa-check';
                btnSaveBottom.appendChild(saveIcon);
                btnSaveBottom.appendChild(document.createTextNode(' Save All Settings'));
            }
        });
    }

    // ─── EXPORT REPORT ────────────────────────────────────────────────
    if (btnExportReport) {
        btnExportReport.addEventListener('click', () => {
            showToast('Compiling security report...', 'success');
            
            let report = `==================================================\n`;
            report += `           CYBERGUARD AI - SECURITY AUDIT          \n`;
            report += `==================================================\n`;
            report += `Generated On: ${new Date().toLocaleString()}\n`;
            report += `Device ID: CG-MOBILE-NODE-SECURE\n`;
            report += `System Status: SECURE\n\n`;
            report += `--- ACTIVE PROTECTIONS ---\n`;
            report += `SMS Message Scanning: ${setMsgScan && setMsgScan.checked ? 'ENABLED' : 'DISABLED'}\n`;
            report += `Phishing Link Checking: ${setLinkCheck && setLinkCheck.checked ? 'ENABLED' : 'DISABLED'}\n`;
            report += `App Permission Auditing: ${setAppPerms && setAppPerms.checked ? 'ENABLED' : 'DISABLED'}\n`;
            report += `Background Auto-Scan: ${setAutoScan && setAutoScan.checked ? 'ENABLED' : 'DISABLED'}\n`;
            report += `Scan Frequency: ${setScanFreq ? setScanFreq.value.toUpperCase() : 'WEEKLY'}\n`;
            report += `Privacy Shield Mode: ${setPrivacyMode && setPrivacyMode.checked ? 'STRICT' : 'STANDARD'}\n`;
            report += `Audit Logs Retention: ${setRetention ? setRetention.value : '90'} Days\n\n`;
            report += `--- RISK ENVIRONMENT ---\n`;
            report += `AI Model strictness: ${setSensitivity ? setSensitivity.value.toUpperCase() : 'STANDARD'}\n`;
            report += `Threat Feed Integration: ACTIVE (Updated: Just Now)\n\n`;
            report += `==================================================\n`;
            report += `This prototype report serves as a diagnostic audit. \n`;
            report += `Protect your mobile life 24/7 with CyberGuard AI.     \n`;
            report += `==================================================\n`;

            const blob = new Blob([report], { type: 'text/plain;charset=utf-8' });
            const a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = `cyberguard-security-report.txt`;
            a.click();
        });
    }

    // ─── CLEAR DEMO DATA ──────────────────────────────────────────────
    if (btnClearData) {
        btnClearData.addEventListener('click', () => {
            if (confirm('Are you sure you want to clear your local history and reset demo states? This cannot be undone.')) {
                // Clear demo flags from localStorage
                localStorage.removeItem('cyberguard_permissions_setup');
                localStorage.setItem('settings_sensitivity', 'standard');
                localStorage.setItem('settings_save_history', 'true');
                localStorage.setItem('settings_high_risk', 'true');
                localStorage.setItem('settings_weekly_summary', 'false');
                localStorage.setItem('settings_tips_alerts', 'true');
                
                showToast('Demo data cleared. Resetting settings...', 'success');
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            }
        });
    }

    // Toast Notification helper
    function showToast(message, type = 'success') {
        const container = document.getElementById('toastContainer') || (() => {
            const d = document.createElement('div');
            d.id = 'toastContainer';
            d.style.cssText = 'position:fixed;bottom:20px;right:20px;z-index:1000;display:flex;flex-direction:column;gap:10px;';
            document.body.appendChild(d);
            return d;
        })();
        
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
