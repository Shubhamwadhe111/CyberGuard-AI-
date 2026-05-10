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
            localStorage.setItem('cg_ai_context', 'Explain this specific phishing message: "Suspicious bank verification"');
            window.location.href = 'ai-agent.html';
        });
    }
});
