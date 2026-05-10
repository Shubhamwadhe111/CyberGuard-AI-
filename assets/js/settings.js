document.addEventListener('DOMContentLoaded', () => {
    // Reusable Toast Function
    function showToast(message, type = 'success') {
        const container = document.getElementById('toastContainer');
        if (!container) return;
        
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

    if (!document.getElementById('toastStyles')) {
        const style = document.createElement('style');
        style.id = 'toastStyles';
        style.textContent = `
            @keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
            @keyframes slideOut { from { transform: translateX(0); opacity: 1; } to { transform: translateX(100%); opacity: 0; } }
        `;
        document.head.appendChild(style);
    }

    // Setting IDs
    const settingsControls = {
        'setMsgScan': 'checkbox',
        'setLinkCheck': 'checkbox',
        'setAppPerms': 'checkbox',
        'setAutoScan': 'checkbox',
        'setScanFreq': 'select',
        'setSensitivity': 'select',
        'setPrivacyMode': 'checkbox',
        'setSaveHistory': 'checkbox',
        'setRetention': 'select',
        'setHighRisk': 'checkbox',
        'setWeeklySummary': 'checkbox',
        'setTipsAlerts': 'checkbox'
    };

    // Load existing settings
    for (const [id, type] of Object.entries(settingsControls)) {
        const el = document.getElementById(id);
        if (!el) continue;
        
        const savedVal = localStorage.getItem(`cg_set_${id}`);
        if (savedVal !== null) {
            if (type === 'checkbox') {
                el.checked = (savedVal === 'true');
            } else if (type === 'select') {
                el.value = savedVal;
            }
        }
    }

    // Save Settings Function
    function saveSettings() {
        let btn1 = document.getElementById('btnSaveTop');
        let btn2 = document.getElementById('btnSaveBottom');
        
        const originalText1 = btn1 ? btn1.innerHTML : '';
        const originalText2 = btn2 ? btn2.innerHTML : '';
        
        if (btn1) { btn1.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Saving...'; btn1.disabled = true; }
        if (btn2) { btn2.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Saving...'; btn2.disabled = true; }

        setTimeout(() => {
            for (const [id, type] of Object.entries(settingsControls)) {
                const el = document.getElementById(id);
                if (el) {
                    if (type === 'checkbox') {
                        localStorage.setItem(`cg_set_${id}`, el.checked);
                    } else if (type === 'select') {
                        localStorage.setItem(`cg_set_${id}`, el.value);
                    }
                }
            }

            if (btn1) { btn1.innerHTML = originalText1; btn1.disabled = false; }
            if (btn2) { btn2.innerHTML = originalText2; btn2.disabled = false; }

            showToast('Settings saved successfully!');
        }, 600);
    }

    const btnSaveTop = document.getElementById('btnSaveTop');
    const btnSaveBottom = document.getElementById('btnSaveBottom');
    
    if (btnSaveTop) btnSaveTop.addEventListener('click', saveSettings);
    if (btnSaveBottom) btnSaveBottom.addEventListener('click', saveSettings);

    // Export Report Logic
    const btnExportReport = document.getElementById('btnExportReport');
    if (btnExportReport) {
        btnExportReport.addEventListener('click', () => {
            showToast('Generating report...', 'success');
            
            setTimeout(() => {
                const text = "CyberGuard AI - Security Report\n" + 
                             "Date: " + new Date().toLocaleString() + "\n\n" +
                             "Device Status: Protected\n" +
                             "Threats Blocked: 5\n" +
                             "Last Scan: Today\n\n" +
                             "Settings Snapshot:\n" +
                             "Message Scan: " + document.getElementById('setMsgScan').checked + "\n" +
                             "Auto Scan: " + document.getElementById('setAutoScan').checked;
                             
                const blob = new Blob([text], { type: 'text/plain' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'cyberguard_report.txt';
                a.click();
                URL.revokeObjectURL(url);
                
                showToast('Report downloaded!');
            }, 1000);
        });
    }

    // Clear Data Logic
    const btnClearData = document.getElementById('btnClearData');
    if (btnClearData) {
        btnClearData.addEventListener('click', () => {
            if (confirm("Are you sure you want to clear all local application data? This will reset all your preferences and alert history.")) {
                // Keep auth token to prevent sudden logout if desired, or clear everything
                const isLoggedIn = localStorage.getItem('isLoggedIn');
                localStorage.clear();
                if (isLoggedIn) localStorage.setItem('isLoggedIn', isLoggedIn);
                
                showToast('Demo data cleared successfully.');
                
                // Reload page to reflect default settings
                setTimeout(() => {
                    window.location.reload();
                }, 1500);
            }
        });
    }

    // Logout Logic
    const btnLogout = document.getElementById('btnLogout');
    if (btnLogout) {
        btnLogout.addEventListener('click', () => {
            localStorage.removeItem('isLoggedIn');
            window.location.href = 'login.html';
        });
    }
});
