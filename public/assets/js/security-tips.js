document.addEventListener('DOMContentLoaded', () => {
    // Reusable Toast Function (similar to threat-details)
    function showToast(message, type = 'success') {
        const container = document.getElementById('toastContainer');
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        let bgColor = type === 'success' ? '#10b981' : '#0d9488';
        
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
        
        const icon = type === 'success' ? 'fa-check-circle' : 'fa-bookmark';
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

    // Filter Logic
    const filterTabs = document.querySelectorAll('.filter-tab');
    const tips = document.querySelectorAll('.tip-card');

    filterTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Update active state
            filterTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            const filter = tab.getAttribute('data-filter');

            tips.forEach(tip => {
                if (filter === 'all' || tip.getAttribute('data-category') === filter) {
                    tip.style.display = 'flex';
                } else {
                    tip.style.display = 'none';
                }
            });
        });
    });

    // Save Button Logic
    const saveBtns = document.querySelectorAll('.btn-save');
    saveBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            if (this.classList.contains('saved')) {
                this.classList.remove('saved');
                this.innerHTML = '<i class="fa-regular fa-bookmark"></i> Save';
            } else {
                this.classList.add('saved');
                this.innerHTML = '<i class="fa-solid fa-bookmark"></i> Saved';
                showToast('Security tip saved to your bookmarks.', 'info');
            }
        });
    });

    // Mark as Read Logic
    const readBtns = document.querySelectorAll('.btn-read');
    readBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            if (this.classList.contains('read')) return;

            this.classList.add('read');
            this.innerHTML = '<i class="fa-solid fa-check-double"></i> Read';
            
            // Visually dim the card slightly
            const card = this.closest('.tip-card');
            card.style.opacity = '0.7';
            card.style.boxShadow = 'none';
        });
    });
});
