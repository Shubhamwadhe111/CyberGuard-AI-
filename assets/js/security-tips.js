document.addEventListener('DOMContentLoaded', () => {
    const TOTAL = 12;
    let readSet = new Set(), savedSet = new Set();

    function updateStats() {
        const r = readSet.size, s = savedSet.size;
        const pct = Math.round((r / TOTAL) * 100);
        const score = Math.min(100, 42 + r * 4 + s * 2);
        document.getElementById('readCount').textContent   = r;
        document.getElementById('savedKpi').textContent    = s;
        document.getElementById('savedCount').textContent  = s;
        document.getElementById('scoreVal').textContent    = pct + '%';
        document.getElementById('progressLabel').textContent = `${r} of ${TOTAL} tips read`;
        document.getElementById('progressBar').style.width  = pct + '%';
        document.getElementById('secScore').textContent     = score;
        document.getElementById('secScoreBar').style.width  = score + '%';
        const bar = document.getElementById('secScoreBar');
        bar.style.background = score >= 70 ? 'var(--color-accent)' : score >= 45 ? 'var(--color-warning)' : 'var(--color-danger)';
    }

    window.markRead = function(btn) {
        const card = btn.closest('.tip-card');
        const id   = Array.from(document.querySelectorAll('.tip-card')).indexOf(card);
        if (readSet.has(id)) return;
        readSet.add(id);
        card.classList.add('read');
        btn.classList.add('done');
        btn.innerHTML = '<i class="fa-solid fa-check-double"></i> Read';
        btn.disabled = true;
        updateStats();
        showToast('Tip marked as read!', 'success');
    };

    window.toggleSave = function(btn) {
        const card = btn.closest('.tip-card');
        const id   = Array.from(document.querySelectorAll('.tip-card')).indexOf(card);
        if (savedSet.has(id)) {
            savedSet.delete(id);
            btn.classList.remove('saved');
            btn.innerHTML = '<i class="fa-regular fa-bookmark"></i>';
            showToast('Tip removed from saved.', 'info');
        } else {
            savedSet.add(id);
            btn.classList.add('saved');
            btn.innerHTML = '<i class="fa-solid fa-bookmark"></i>';
            showToast('Tip saved!', 'success');
        }
        updateStats();
    };

    window.filterTips = function(cat, btn) {
        document.querySelectorAll('.tips-tab').forEach(t => t.classList.remove('active'));
        btn.classList.add('active');
        document.querySelectorAll('.tip-card').forEach(card => {
            card.style.display = (cat === 'all' || card.dataset.cat === cat) ? '' : 'none';
        });
    };

    window.sortTips = function(val) {
        const grid = document.getElementById('tipsGrid');
        const cards = Array.from(grid.querySelectorAll('.tip-card'));
        const order = { critical: 0, high: 1, medium: 2, low: 3 };
        if (val === 'priority') {
            cards.sort((a, b) => (order[a.dataset.priority] || 9) - (order[b.dataset.priority] || 9));
        } else if (val === 'unread') {
            cards.sort((a, b) => (a.classList.contains('read') ? 1 : 0) - (b.classList.contains('read') ? 1 : 0));
        }
        cards.forEach(c => grid.appendChild(c));
    };

    window.showSaved = function() {
        filterTips('saved-view', { classList: { add: () => {}, remove: () => {} } });
        const cards = document.querySelectorAll('.tip-card');
        cards.forEach((card, i) => {
            card.style.display = savedSet.has(i) ? '' : 'none';
        });
        showToast(savedSet.size > 0 ? `Showing ${savedSet.size} saved tips` : 'No saved tips yet.', 'info');
    };

    // Daily challenges rotation
    const challenges = [
        { text: 'Check all your app permissions today', desc: 'Go to Settings → Apps and revoke any permission that seems unnecessary for each app.' },
        { text: 'Enable 2FA on one new account today', desc: 'Pick one account (email, banking, social) and enable two-factor authentication right now.' },
        { text: 'Update all pending apps on your device', desc: 'Go to Play Store → My Apps and update everything. Security patches are often bundled in updates.' },
        { text: 'Review your saved passwords for weak ones', desc: 'Use your password manager or phone settings to identify and change any weak or reused passwords.' },
        { text: 'Run a full CyberGuard device scan', desc: 'Open the Scan page and run a full scan to check for threats on your device right now.' },
    ];
    const today = new Date().getDay();
    const ch = challenges[today % challenges.length];
    document.getElementById('challengeText').textContent = ch.text;
    document.getElementById('challengeDesc').textContent = ch.desc;

    window.completeChallenge = function(btn) {
        btn.innerHTML = '<i class="fa-solid fa-check-double"></i> Completed!';
        btn.disabled = true;
        btn.style.opacity = '0.7';
        showToast('Daily challenge completed! +10 security score 🎉', 'success');
        document.getElementById('secScore').textContent = Math.min(100, parseInt(document.getElementById('secScore').textContent) + 10);
    };

    function showToast(msg, type) {
        const c = document.getElementById('toastContainer') || document.body;
        const t = document.createElement('div');
        const bg = type === 'success' ? '#10b981' : type === 'info' ? '#3b82f6' : '#ef4444';
        t.style.cssText = `background:${bg};color:white;padding:0.75rem 1.1rem;border-radius:10px;font-size:0.85rem;font-weight:500;display:flex;align-items:center;gap:0.5rem;`;
        t.innerHTML = `<i class="fa-solid fa-circle-check"></i> ${msg}`;
        c.appendChild(t);
        setTimeout(() => { t.style.opacity = '0'; t.style.transition = 'opacity 0.3s'; setTimeout(() => t.remove(), 300); }, 3000);
    }
});
