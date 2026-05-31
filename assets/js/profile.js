document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('cyberguard_token');
    
    // ===== FETCH AND POPULATE REAL USER DATA =====
    async function loadUserProfile() {
        if (!token) return;

        try {
            const res = await fetch('/api/user/profile', {
                method: 'GET',
                headers: { 'x-auth-token': token }
            });

            if (res.ok) {
                const data = await res.json();
                
                // 1. Update Navbar elements (Common Desktop & Mobile)
                const firstName = data.name ? data.name.split(' ')[0] : 'User';
                if (document.getElementById('nav-user-name')) document.getElementById('nav-user-name').innerText = firstName;
                if (document.getElementById('dd-full-name')) document.getElementById('dd-full-name').innerText = data.name || 'User';
                if (document.getElementById('dd-email')) document.getElementById('dd-email').innerText = data.email || '';
                
                if (document.getElementById('mobile-dd-full-name')) document.getElementById('mobile-dd-full-name').innerText = data.name || 'User';
                if (document.getElementById('mobile-dd-email')) document.getElementById('mobile-dd-email').innerText = data.email || '';
                
                const avatarImg = `https://ui-avatars.com/api/?name=${encodeURIComponent(data.name || 'U')}&background=0d9488&color=fff`;
                if (document.getElementById('nav-avatar-img')) document.getElementById('nav-avatar-img').src = avatarImg;
                if (document.getElementById('mobile-nav-avatar-img')) document.getElementById('mobile-nav-avatar-img').src = avatarImg;
                if (document.getElementById('mobile-dd-avatar-img')) document.getElementById('mobile-dd-avatar-img').src = avatarImg;

                // 2. Update Profile Page Specifics
                if (document.getElementById('displayUserName')) document.getElementById('displayUserName').innerText = data.name || 'User';
                if (document.getElementById('displayEmail')) document.getElementById('displayEmail').innerText = data.email || '';
                
                if (document.getElementById('profName')) document.getElementById('profName').value = data.name || '';
                if (document.getElementById('profEmail')) document.getElementById('profEmail').value = data.email || '';
                if (document.getElementById('profPhone')) document.getElementById('profPhone').value = data.phone || '';

                // Update Initials Badge
                if (document.getElementById('profInitials')) {
                    const initials = data.name ? data.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'U';
                    document.getElementById('profInitials').innerText = initials.substring(0, 2);
                }
            }
        } catch (err) {
            console.error("Profile load error:", err);
        }
    }
    loadUserProfile();

    // ===== PROFILE DROPDOWN (navbar & mobile top bar) =====
    function initProfileDropdowns() {
        const wrap = document.getElementById('profNavWrap');
        const btn  = document.getElementById('profNavBtn');
        if (wrap && btn) {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const mWrap = document.getElementById('mobileProfNavWrap');
                if (mWrap) mWrap.classList.remove('open');
                wrap.classList.toggle('open');
            });
        }

        const mWrap = document.getElementById('mobileProfNavWrap');
        const mBtn  = document.getElementById('mobileProfNavBtn');
        if (mWrap && mBtn) {
            mBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const dWrap = document.getElementById('profNavWrap');
                if (dWrap) dWrap.classList.remove('open');
                mWrap.classList.toggle('open');
            });
        }

        document.addEventListener('click', (e) => {
            if (wrap && !wrap.contains(e.target)) wrap.classList.remove('open');
            if (mWrap && !mWrap.contains(e.target)) mWrap.classList.remove('open');
        });
    }
    initProfileDropdowns();

    // ===== PROFILE EDIT LOGIC =====
    const profileForm = document.getElementById('profileForm');
    if (profileForm) {
        const btnEdit    = document.getElementById('btnEditProfile');
        const btnSave    = document.getElementById('btnSaveProfile');
        const btnCancel  = document.getElementById('btnCancelEdit');
        const inputs     = profileForm.querySelectorAll('.prof-input');
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

        profileForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const newName = document.getElementById('profName').value.trim();
            const newPhone = document.getElementById('profPhone').value.trim();
            
            if (!newName || !newPhone) {
                showToast('Name and phone number are required.', 'danger');
                return;
            }

            try {
                const res = await fetch('/api/user/profile', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-auth-token': token
                    },
                    body: JSON.stringify({ name: newName, phone: newPhone })
                });

                if (res.ok) {
                    const data = await res.json();
                    
                    // Update layout values immediately
                    document.getElementById('displayUserName').textContent = data.name;
                    document.getElementById('displayEmail').textContent    = data.email;
                    
                    const firstName = data.name ? data.name.split(' ')[0] : 'User';
                    if (document.getElementById('nav-user-name')) document.getElementById('nav-user-name').innerText = firstName;
                    if (document.getElementById('dd-full-name')) document.getElementById('dd-full-name').innerText = data.name || 'User';
                    if (document.getElementById('dd-email')) document.getElementById('dd-email').innerText = data.email || '';
                    
                    if (document.getElementById('mobile-dd-full-name')) document.getElementById('mobile-dd-full-name').innerText = data.name || 'User';
                    if (document.getElementById('mobile-dd-email')) document.getElementById('mobile-dd-email').innerText = data.email || '';
                    
                    const avatarImg = `https://ui-avatars.com/api/?name=${encodeURIComponent(data.name || 'U')}&background=0d9488&color=fff`;
                    if (document.getElementById('nav-avatar-img')) document.getElementById('nav-avatar-img').src = avatarImg;
                    if (document.getElementById('mobile-nav-avatar-img')) document.getElementById('mobile-nav-avatar-img').src = avatarImg;
                    if (document.getElementById('mobile-dd-avatar-img')) document.getElementById('mobile-dd-avatar-img').src = avatarImg;

                    if (document.getElementById('profInitials')) {
                        const initials = data.name ? data.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'U';
                        document.getElementById('profInitials').innerText = initials.substring(0, 2);
                    }

                    showToast('Profile updated successfully!', 'success');
                } else {
                    const errorData = await res.json();
                    showToast(errorData.message || 'Failed to update profile.', 'danger');
                }
            } catch (err) {
                console.error("Profile save error:", err);
                showToast('Network error while saving profile.', 'danger');
            } finally {
                inputs.forEach(i => { i.disabled = true; i.style.borderColor = ''; });
                btnEdit.style.display   = '';
                btnSave.style.display   = 'none';
                btnCancel.style.display = 'none';
            }
        });
    }

    // Dark mode toggle
    const dm = document.getElementById('darkModeToggle');
    if (dm) {
        dm.checked = localStorage.getItem('darkMode') === 'enabled';
        dm.addEventListener('change', () => {
            const enabled = dm.checked;
            document.body.classList.toggle('dark', enabled);
            if (enabled) {
                localStorage.setItem('darkMode', 'enabled');
                document.documentElement.classList.add('dark');
            } else {
                localStorage.setItem('darkMode', 'disabled');
                document.documentElement.classList.remove('dark');
            }
            showToast(`Dark mode ${enabled ? 'enabled' : 'disabled'}`, 'info');
        });
    }

    function showToast(msg, type) {
        const c = document.getElementById('toastContainer') || document.body;
        const t = document.createElement('div');
        const bg = type === 'success' ? '#10b981' : '#3b82f6';
        t.style.cssText = `background:${bg};color:white;padding:0.75rem 1.1rem;border-radius:10px;font-size:0.85rem;font-weight:500;display:flex;align-items:center;gap:0.5rem;`;
        const icon = document.createElement('i');
        icon.className = 'fa-solid fa-circle-check';
        t.appendChild(icon);
        t.appendChild(document.createTextNode(' ' + msg));
        c.appendChild(t);
        setTimeout(() => { t.style.opacity='0';t.style.transition='opacity 0.3s';setTimeout(()=>t.remove(),300); }, 3000);
    }
});
