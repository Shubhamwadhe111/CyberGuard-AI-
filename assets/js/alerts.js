document.addEventListener('DOMContentLoaded', () => {
    const filterTabs = document.querySelectorAll('.filter-tab');
    const alerts = document.querySelectorAll('.alert-list-card');
    
    // Stats elements
    const countHigh = document.getElementById('countHigh');
    const countWarning = document.getElementById('countWarning');
    const countResolved = document.getElementById('countResolved');
    const countTotal = document.getElementById('countTotal');

    // Update summary counts based on DOM elements
    function updateStats() {
        let high = 0, warning = 0, resolved = 0;
        
        alerts.forEach(alert => {
            const status = alert.getAttribute('data-status');
            if (status === 'high') high++;
            else if (status === 'warning') warning++;
            else if (status === 'resolved') resolved++;
        });

        if (countHigh) countHigh.textContent = high;
        if (countWarning) countWarning.textContent = warning;
        if (countResolved) countResolved.textContent = resolved;
        if (countTotal) countTotal.textContent = alerts.length;
    }

    // Initialize stats
    updateStats();

    // Filter Logic
    filterTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Update active state
            filterTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            const filter = tab.getAttribute('data-filter');

            alerts.forEach(alert => {
                if (filter === 'all' || alert.getAttribute('data-status') === filter) {
                    alert.style.display = 'grid'; // because mobile overrides use grid
                    // Force mobile flex-direction logic check
                    if (window.innerWidth <= 768) {
                        alert.style.display = 'grid'; // mobile is 1fr grid
                    }
                } else {
                    alert.style.display = 'none';
                }
            });
        });
    });

    // Mark Resolved Logic
    const resolveBtns = document.querySelectorAll('.btn-resolve');
    resolveBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const card = this.closest('.alert-list-card');
            
            // Change appearance to resolved
            card.className = 'alert-list-card resolved-status';
            card.setAttribute('data-status', 'resolved');
            
            // Update Header
            const headerBadge = card.querySelector('.badge');
            headerBadge.style.background = 'rgba(16, 185, 129, 0.1)';
            headerBadge.style.color = 'var(--color-success)';
            headerBadge.innerHTML = '<i class="fa-solid fa-shield-check"></i> Resolved';
            
            const title = card.querySelector('.alert-card-title');
            title.style.textDecoration = 'line-through';
            title.style.opacity = '0.7';

            const meta = card.querySelector('.alert-card-meta');
            meta.style.opacity = '0.7';

            const p = card.querySelector('p');
            p.style.opacity = '0.7';

            // Update Action Buttons
            const actionsContainer = card.querySelector('.alert-card-actions');
            actionsContainer.innerHTML = '<button class="btn btn-outline" disabled style="padding: 0.5rem 1rem; font-size: 0.85rem; opacity: 0.5;">Resolved</button>';

            // Refresh stats summary
            updateStats();
        });
    });
});
