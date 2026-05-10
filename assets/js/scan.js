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

    // Elements
    const btnStartScan = document.getElementById('btnStartScan');
    const scanProgressArea = document.getElementById('scanProgressArea');
    const scanProgressBar = document.getElementById('scanProgressBar');
    const scanPercentage = document.getElementById('scanPercentage');
    const scanStatusText = document.getElementById('scanStatusText');
    const scanStatusDetail = document.getElementById('scanStatusDetail');
    const scanResultsArea = document.getElementById('scanResultsArea');

    // Categories
    const categories = [
        { id: 'Messages', card: document.getElementById('catMessages'), status: document.getElementById('catStatusMessages'), range: [0, 25], details: "Scanning local SMS database for phishing patterns..." },
        { id: 'Links', card: document.getElementById('catLinks'), status: document.getElementById('catStatusLinks'), range: [25, 50], details: "Cross-referencing clipboard URLs with threat intel..." },
        { id: 'Perms', card: document.getElementById('catPerms'), status: document.getElementById('catStatusPerms'), range: [50, 75], details: "Auditing application permission manifests..." },
        { id: 'Apps', card: document.getElementById('catApps'), status: document.getElementById('catStatusApps'), range: [75, 100], details: "Checking installed packages against known malware signatures..." }
    ];

    function setCategoryStatus(cat, state) {
        if (!cat.card || !cat.status) return;

        if (state === 'scanning') {
            cat.card.classList.add('active');
            cat.status.className = 'scan-cat-status status-scanning';
            cat.status.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Scanning';
        } else if (state === 'completed') {
            cat.card.classList.remove('active');
            cat.status.className = 'scan-cat-status status-completed';
            cat.status.innerHTML = '<i class="fa-solid fa-check"></i> Completed';
        } else {
            cat.card.classList.remove('active');
            cat.status.className = 'scan-cat-status status-pending';
            cat.status.innerHTML = '<i class="fa-regular fa-clock"></i> Pending';
        }
    }

    if (btnStartScan) {
        btnStartScan.addEventListener('click', () => {
            // Reset UI
            btnStartScan.disabled = true;
            btnStartScan.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Scan in Progress';
            
            scanProgressArea.style.display = 'block';
            scanResultsArea.style.display = 'none';
            
            scanProgressBar.style.width = '0%';
            scanPercentage.textContent = '0%';
            
            categories.forEach(cat => setCategoryStatus(cat, 'pending'));

            // Simulation variables
            let progress = 0;
            let currentCatIndex = 0;

            const scanInterval = setInterval(() => {
                progress += Math.floor(Math.random() * 4) + 1; // Random increment
                if (progress >= 100) progress = 100;

                scanProgressBar.style.width = `${progress}%`;
                scanPercentage.textContent = `${progress}%`;

                // Handle Categories
                if (currentCatIndex < categories.length) {
                    const activeCat = categories[currentCatIndex];
                    
                    if (progress >= activeCat.range[0] && progress < activeCat.range[1]) {
                        scanStatusText.textContent = `Analyzing ${activeCat.id}...`;
                        scanStatusDetail.textContent = activeCat.details;
                        
                        if (activeCat.status.textContent.includes('Pending')) {
                            setCategoryStatus(activeCat, 'scanning');
                        }
                    } else if (progress >= activeCat.range[1]) {
                        setCategoryStatus(activeCat, 'completed');
                        currentCatIndex++;
                    }
                }

                // Completion
                if (progress >= 100) {
                    clearInterval(scanInterval);
                    
                    scanStatusText.textContent = "Scan Complete";
                    scanStatusDetail.textContent = "Finalizing results and compiling report...";
                    
                    setTimeout(() => {
                        btnStartScan.disabled = false;
                        btnStartScan.innerHTML = '<i class="fa-solid fa-rotate-right"></i> Run Another Scan';
                        
                        scanProgressArea.style.display = 'none';
                        scanResultsArea.style.display = 'block';
                        
                        showToast('Device scan completed successfully.', 'success');
                    }, 1000);
                }

            }, 100); // Update every 100ms
        });
    }
});
