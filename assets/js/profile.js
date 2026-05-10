document.addEventListener('DOMContentLoaded', () => {

    // ===== PROFILE DROPDOWN (navbar) — works on all pages =====
    function initProfileDropdown() {
        const wrap = document.getElementById('profNavWrap');
        const btn  = document.getElementById('profNavBtn');
        const dd   = document.getElementById('profNavDropdown');
        if (!wrap || !btn || !dd) return;

        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            wrap.classList.toggle('open');
        });
        document.addEventListener('click', (e) => {
            if (!wrap.contains(e.target)) wrap.classList.remove('open');
        });
    }
    initProfileDropdown();

    // ===== PROFILE PAGE ONLY =====
    if (!document.getElementById('profileForm')) return;

    // Edit / Save / Cancel profile form
    const form       = document.getElementById('profileForm');
    const btnEdit    = document.getElementById('btnEditProfile');
    const btnSave    = document.getElementById('btnSaveProfile');
    const btnCancel  = document.getElementById('btnCancelEdit');
    const inputs     = form.querySelectorAll('.prof-input');
    let original = {};

    btnEdit.addEventListener('click', () => {
        inputs.forEach(i => {
            original[i.id] = i.value;
            i.disabled = false;
            i.style.borderColor = 'var(--color-accent)';
        });
        btnEdit.style.display   = 'none';
        btnSave.style.display   = '';
        btnCancel.style.display = '';
    });

    btnCancel.addEventListener('click', () => {
        inputs.forEach(i => { i.value = original[i.id]; i.disabled = true; i.style.borderColor = ''; });
        btnEdit.style.display   = '';
        btnSave.style.display   = 'none';
        btnCancel.style.display = 'none';
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        inputs.forEach(i => { i.disabled = true; i.style.borderColor = ''; });
        document.getElementById('displayUserName').textContent = document.getElementById('profName').value;
        document.getElementById('displayEmail').textContent    = document.getElementById('profEmail').value;
        btnEdit.style.display   = '';
        btnSave.style.display   = 'none';
        btnCancel.style.display = 'none';
        showToast('Profile updated successfully!', 'success');
    });

    // Dark mode toggle
    const dm = document.getElementById('darkModeToggle');
    if (dm) {
        dm.checked = document.body.classList.contains('dark');
        dm.addEventListener('change', () => {
            document.body.classList.toggle('dark', dm.checked);
            showToast(`Dark mode ${dm.checked ? 'enabled' : 'disabled'}`, 'info');
        });
    }

    function showToast(msg, type) {
        const c = document.getElementById('toastContainer') || document.body;
        const t = document.createElement('div');
        const bg = type === 'success' ? '#10b981' : '#3b82f6';
        t.style.cssText = `background:${bg};color:white;padding:0.75rem 1.1rem;border-radius:10px;font-size:0.85rem;font-weight:500;display:flex;align-items:center;gap:0.5rem;`;
        t.innerHTML = `<i class="fa-solid fa-circle-check"></i> ${msg}`;
        c.appendChild(t);
        setTimeout(() => { t.style.opacity='0';t.style.transition='opacity 0.3s';setTimeout(()=>t.remove(),300); }, 3000);
    }
});
