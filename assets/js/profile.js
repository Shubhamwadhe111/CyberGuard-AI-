document.addEventListener('DOMContentLoaded', () => {
    // Reusable Toast Function
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

    if (!document.getElementById('toastStyles')) {
        const style = document.createElement('style');
        style.id = 'toastStyles';
        style.textContent = `
            @keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
            @keyframes slideOut { from { transform: translateX(0); opacity: 1; } to { transform: translateX(100%); opacity: 0; } }
        `;
        document.head.appendChild(style);
    }

    // Elements
    const btnEditProfile = document.getElementById('btnEditProfile');
    const btnSaveProfile = document.getElementById('btnSaveProfile');
    const profileForm = document.getElementById('profileForm');
    const inputs = profileForm.querySelectorAll('.form-control');
    const displayUserName = document.getElementById('displayUserName');

    const profName = document.getElementById('profName');
    const profEmail = document.getElementById('profEmail');
    const profPhone = document.getElementById('profPhone');
    const profCompany = document.getElementById('profCompany');

    // Load data from LocalStorage
    const savedName = localStorage.getItem('cg_profile_name');
    const savedEmail = localStorage.getItem('cg_profile_email');
    const savedPhone = localStorage.getItem('cg_profile_phone');
    const savedCompany = localStorage.getItem('cg_profile_company');

    if (savedName) {
        profName.value = savedName;
        displayUserName.textContent = savedName;
    }
    if (savedEmail) profEmail.value = savedEmail;
    if (savedPhone) profPhone.value = savedPhone;
    if (savedCompany) profCompany.value = savedCompany;

    // Edit Logic
    btnEditProfile.addEventListener('click', () => {
        inputs.forEach(input => input.disabled = false);
        profName.focus();
        btnEditProfile.style.display = 'none';
        btnSaveProfile.style.display = 'block';
    });

    // Save Logic
    profileForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Basic validation
        if (!profName.value.trim() || !profEmail.value.trim()) {
            showToast('Name and Email are required.', 'error');
            return;
        }

        // Save to LocalStorage
        localStorage.setItem('cg_profile_name', profName.value.trim());
        localStorage.setItem('cg_profile_email', profEmail.value.trim());
        localStorage.setItem('cg_profile_phone', profPhone.value.trim());
        localStorage.setItem('cg_profile_company', profCompany.value.trim());

        // Update Display
        displayUserName.textContent = profName.value.trim();

        // UI State Revert
        inputs.forEach(input => input.disabled = true);
        btnEditProfile.style.display = 'block';
        btnSaveProfile.style.display = 'none';

        showToast('Profile updated successfully!', 'success');
    });

    // Logout Logic
    const btnLogoutHeader = document.getElementById('btnLogoutHeader');
    const btnLogoutMobile = document.getElementById('btnLogoutMobile');

    function handleLogout() {
        localStorage.removeItem('isLoggedIn');
        window.location.href = 'login.html';
    }

    if (btnLogoutHeader) btnLogoutHeader.addEventListener('click', handleLogout);
    if (btnLogoutMobile) btnLogoutMobile.addEventListener('click', handleLogout);
});
