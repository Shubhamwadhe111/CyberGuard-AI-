(function() {
    // 1. Immediate Dark Mode check to prevent white flash
    const darkMode = localStorage.getItem('darkMode');
    if (darkMode === 'enabled') {
        document.documentElement.classList.add('dark');
        // If body is already parsed, apply to body too
        if (document.body) {
            document.body.classList.add('dark');
        }
    }

    document.addEventListener('DOMContentLoaded', () => {
        // Ensure body has the dark class if enabled
        if (localStorage.getItem('darkMode') === 'enabled') {
            document.body.classList.add('dark');
        }

        // 2. Mobile Responsive Shell Sidebar toggles
        const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        if (mobileMenuBtn) {
            mobileMenuBtn.addEventListener('click', () => {
                const navLinks = document.querySelector('.desktop-nav');
                if (navLinks) {
                    navLinks.classList.toggle('active');
                }
            });
        }
        
        // 3. Keep top app bar notifications alert synchronized
        const navBell = document.getElementById('navBellLink');
        if (navBell) {
            navBell.innerHTML = `
                <a href="alerts.html" class="icon-btn position-relative" style="color:var(--text-main); font-size:1.15rem; margin-right: 0.5rem;">
                    <i class="fa-solid fa-bell"></i>
                    <span class="notification-dot" style="display:none; position:absolute; top:2px; right:2px; width:8px; height:8px; background:var(--color-danger); border-radius:50%;"></span>
                </a>
            `;
        }
    });
})();
