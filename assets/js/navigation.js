document.addEventListener('DOMContentLoaded', () => {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    
    const publicPages = ['index.html', 'features.html', 'security-tips.html', 'support.html', ''];
    const authPages = ['login.html', 'signup.html', 'otp.html'];
    const appPages = ['home.html', 'permissions.html', 'dashboard.html', 'scan.html', 'alerts.html', 'ai-agent.html', 'profile.html', 'settings.html', 'threat-details.html'];
    
    let currentPage = window.location.pathname.split('/').pop() || 'index.html';
    if (currentPage === '/' || currentPage === '') currentPage = 'index.html';

    // 1. Authentication Redirects
    if (!isLoggedIn && appPages.includes(currentPage)) {
        window.location.href = 'login.html';
        return;
    }
    
    if (isLoggedIn && authPages.includes(currentPage)) {
        window.location.href = 'home.html';
        return;
    }

    // 2. Handle Public Navbar
    if (publicPages.includes(currentPage)) {
        const navActions = document.querySelector('.nav-actions');
        
        // If we are on the Home Page, we ALWAYS want to show Sign In / Get Started
        // as per the professional landing page design.
        if (currentPage === 'index.html' || currentPage === '') {
            // Keep original HTML (Sign In / Get Started)
            return;
        }

        if (navActions && isLoggedIn) {
            navActions.innerHTML = `
                <a href="home.html" class="btn btn-primary">Go to Home →</a>
            `;
        }
    }
        
        // Active state logic remains...
        
        // Active state
        const navItems = document.querySelectorAll('.desktop-nav .nav-item');
        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href') === currentPage) {
                item.classList.add('active');
            }
        });
        
        // Mobile menu toggle
        const mobileBtn = document.querySelector('.mobile-menu-btn');
        if (mobileBtn) {
            mobileBtn.addEventListener('click', () => {
                const desktopNav = document.querySelector('.desktop-nav');
                const actions = document.querySelector('.nav-actions');
                
                if (desktopNav.style.display === 'flex' && desktopNav.classList.contains('mobile-active')) {
                    desktopNav.style.display = '';
                    desktopNav.classList.remove('mobile-active');
                    actions.style.display = '';
                } else {
                    desktopNav.style.display = 'flex';
                    desktopNav.classList.add('mobile-active');
                    desktopNav.style.flexDirection = 'column';
                    desktopNav.style.position = 'absolute';
                    desktopNav.style.top = '64px';
                    desktopNav.style.left = '0';
                    desktopNav.style.width = '100%';
                    desktopNav.style.background = 'white';
                    desktopNav.style.padding = '1.5rem';
                    desktopNav.style.boxShadow = '0 10px 15px -3px rgba(0,0,0,0.1)';
                    desktopNav.style.gap = '1.5rem';
                    
                    // Fix text color for dropdown
                    const items = desktopNav.querySelectorAll('.nav-item');
                    items.forEach(i => i.style.color = 'var(--color-primary)');
                    
                    actions.style.display = 'flex';
                    actions.style.flexDirection = 'column';
                    actions.style.position = 'absolute';
                    actions.style.top = 'calc(64px + 200px)'; // Below nav
                    actions.style.left = '0';
                    actions.style.width = '100%';
                    actions.style.background = 'white';
                    actions.style.padding = '0 1.5rem 1.5rem 1.5rem';
                    actions.style.boxShadow = '0 10px 15px -3px rgba(0,0,0,0.1)';
                }
            });
        }

    // 3. Handle App Navigation
    if (appPages.includes(currentPage)) {
        // Desktop Sidebar Active State
        const sidebarItems = document.querySelectorAll('.sidebar-item');
        sidebarItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href') === currentPage) {
                item.classList.add('active');
            }
        });

        // Mobile Bottom Nav Active State
        const bottomNavItems = document.querySelectorAll('.bottom-nav-item, .bottom-nav-scan');
        bottomNavItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href') === currentPage) {
                item.classList.add('active');
            }
        });

        // Inject Logout functionality
        const sidebarFooter = document.querySelector('.sidebar-footer');
        if (sidebarFooter && !sidebarFooter.querySelector('.logout-btn')) {
            const logoutLink = document.createElement('a');
            logoutLink.href = '#';
            logoutLink.className = 'sidebar-item mt-2 logout-btn';
            logoutLink.innerHTML = '<i class="fa-solid fa-arrow-right-from-bracket"></i> Logout';
            logoutLink.addEventListener('click', (e) => {
                e.preventDefault();
                localStorage.removeItem('isLoggedIn');
                window.location.href = 'login.html';
            });
            sidebarFooter.appendChild(logoutLink);
        }
    }
    // 3. Global Identity Sync (Real Name/Avatar)
    const token = localStorage.getItem('cyberguard_token');
    async function syncIdentity() {
        if (!isLoggedIn || !token) return;

        try {
            const res = await fetch('/api/user/profile', {
                method: 'GET',
                headers: { 'x-auth-token': token }
            });

            if (res.ok) {
                const data = await res.json();
                const firstName = data.name ? data.name.split(' ')[0] : 'User';
                
                // Update all possible name/email/avatar fields globally
                document.querySelectorAll('#nav-user-name').forEach(el => el.innerText = firstName);
                document.querySelectorAll('#welcome-user-name').forEach(el => el.innerText = firstName);
                document.querySelectorAll('#dd-full-name').forEach(el => el.innerText = data.name || 'User');
                document.querySelectorAll('#dd-email').forEach(el => el.innerText = data.email || '');
                
                const avatarImg = `https://ui-avatars.com/api/?name=${encodeURIComponent(data.name || 'U')}&background=0d9488&color=fff`;
                document.querySelectorAll('#nav-avatar-img').forEach(el => el.src = avatarImg);
                
                // Also update profile-specific fields if they exist on the page
                const dispName = document.getElementById('displayUserName');
                const dispEmail = document.getElementById('displayEmail');
                if (dispName) dispName.innerText = data.name || 'User';
                if (dispEmail) dispEmail.innerText = data.email || '';
            }
        } catch (err) {
            console.error("Identity sync error:", err);
        }
    }
    syncIdentity();
});
