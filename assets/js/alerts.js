document.addEventListener('DOMContentLoaded', () => {

    // Filter alerts by tab
    window.filterAlerts = function(status, btn) {
        document.querySelectorAll('.al-tab').forEach(t => t.classList.remove('active'));
        btn.classList.add('active');
        document.querySelectorAll('#alertsList .al-card').forEach(card => {
            if (status === 'all') {
                card.style.display = '';
            } else {
                card.style.display = card.dataset.status === status ? '' : 'none';
            }
        });
    };

    // Resolve a single alert
    window.resolveAlert = function(btn) {
        const card = btn.closest('.al-card');
        if (!card) return;
        card.dataset.status = 'resolved';
        card.classList.add('resolved');
        card.querySelector('.al-card-stripe').className = 'al-card-stripe safe';
        card.querySelector('.al-card-icon').className = 'al-card-icon safe';
        card.querySelector('.al-card-icon').innerHTML = '<i class="fa-solid fa-shield-check"></i>';
        const titleEl = card.querySelector('.al-card-title');
        if (titleEl) titleEl.style.textDecoration = 'line-through';
        const footer = card.querySelector('.al-card-footer');
        if (footer) footer.innerHTML = '<span style="font-size:0.82rem;color:var(--color-accent);font-weight:600;"><i class="fa-solid fa-check-circle"></i> Resolved just now</span>';
        updateCounts();
        showToast('Alert marked as resolved.', 'success');
    };

    // Mark all resolved
    window.markAllResolved = function() {
        document.querySelectorAll('#alertsList .al-card:not(.resolved)').forEach(card => {
            card.dataset.status = 'resolved';
            card.classList.add('resolved');
            const stripe = card.querySelector('.al-card-stripe');
            if (stripe) stripe.className = 'al-card-stripe safe';
            const icon = card.querySelector('.al-card-icon');
            if (icon) { icon.className = 'al-card-icon safe'; icon.innerHTML = '<i class="fa-solid fa-shield-check"></i>'; }
            const title = card.querySelector('.al-card-title');
            if (title) title.style.textDecoration = 'line-through';
            const footer = card.querySelector('.al-card-footer');
            if (footer) footer.innerHTML = '<span style="font-size:0.82rem;color:var(--color-accent);font-weight:600;"><i class="fa-solid fa-check-circle"></i> Resolved just now</span>';
        });
        updateCounts();
        showToast('All alerts marked as resolved!', 'success');
    };

    // Update KPI counts
    function updateCounts() {
        const cards = document.querySelectorAll('#alertsList .al-card');
        let high = 0, warn = 0, info = 0, resolved = 0;
        cards.forEach(c => {
            if (c.dataset.status === 'high')     high++;
            if (c.dataset.status === 'warning')  warn++;
            if (c.dataset.status === 'info')     info++;
            if (c.dataset.status === 'resolved') resolved++;
        });
        document.getElementById('cntHigh').textContent     = high;
        document.getElementById('cntWarn').textContent     = warn;
        document.getElementById('cntInfo').textContent     = info;
        document.getElementById('cntResolved').textContent = resolved;
    }

    // Sort alerts
    window.sortAlerts = function() {
        const val = document.getElementById('sortSelect').value;
        const list = document.getElementById('alertsList');
        const cards = Array.from(list.querySelectorAll('.al-card'));
        const order = { high: 0, warning: 1, info: 2, resolved: 3 };
        if (val === 'severity') {
            cards.sort((a, b) => (order[a.dataset.status] || 9) - (order[b.dataset.status] || 9));
            cards.forEach(c => list.appendChild(c));
        }
    };

    // Toast
    function showToast(message, type) {
        const container = document.getElementById('toastContainer') || (() => {
            const d = document.createElement('div');
            d.id = 'toastContainer';
            d.style.cssText = 'position:fixed;bottom:80px;right:20px;z-index:1000;display:flex;flex-direction:column;gap:10px;';
            document.body.appendChild(d);
            return d;
        })();
        const toast = document.createElement('div');
        const bg = type === 'success' ? '#10b981' : '#ef4444';
        toast.style.cssText = `background:${bg};color:white;padding:0.85rem 1.25rem;border-radius:10px;display:flex;align-items:center;gap:0.6rem;font-size:0.88rem;font-weight:500;`;
        toast.innerHTML = `<i class="fa-solid fa-check-circle"></i> ${message}`;
        container.appendChild(toast);
        setTimeout(() => { toast.style.opacity = '0'; toast.style.transition = 'opacity 0.3s'; setTimeout(() => toast.remove(), 300); }, 3000);
    }
});
