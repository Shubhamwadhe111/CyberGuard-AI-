document.addEventListener('DOMContentLoaded', () => {
    // Reusable Toast Function
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
        
        const icon = type === 'success' ? 'fa-check-circle' : 'fa-circle-info';
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

    // FAQ Accordion Logic
    const faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const item = question.closest('.faq-item');
            
            // Close other open items
            document.querySelectorAll('.faq-item.active').forEach(openItem => {
                if (openItem !== item) {
                    openItem.classList.remove('active');
                }
            });

            // Toggle current item
            item.classList.toggle('active');
        });
    });

    // Search Logic
    const searchInput = document.getElementById('supportSearch');
    const faqItems = document.querySelectorAll('.faq-item');
    const categoryCards = document.querySelectorAll('.support-category-card');

    searchInput.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();

        // Filter FAQs
        faqItems.forEach(item => {
            const tags = item.getAttribute('data-tags').toLowerCase();
            const text = item.textContent.toLowerCase();
            
            if (tags.includes(term) || text.includes(term)) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
                item.classList.remove('active'); // Close if hidden
            }
        });

        // Optional: Filter Categories
        categoryCards.forEach(card => {
            const title = card.querySelector('.support-category-title').textContent.toLowerCase();
            if (title.includes(term) || term === '') {
                card.style.opacity = '1';
                card.style.transform = 'scale(1)';
            } else {
                card.style.opacity = '0.3';
                card.style.transform = 'scale(0.95)';
            }
        });
    });

    // Contact Form Logic
    const contactForm = document.getElementById('contactForm');
    const ticketDemoPanel = document.getElementById('ticketDemoPanel');

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault(); // Prevent page reload

        // Basic validation happens via HTML5 'required' attributes automatically
        const name = document.getElementById('contactName').value;
        const btn = contactForm.querySelector('button[type="submit"]');

        // Loading state
        const originalText = btn.innerHTML;
        btn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Submitting...';
        btn.disabled = true;

        setTimeout(() => {
            showToast(`Thank you ${name.split(' ')[0]}, your ticket has been submitted.`, 'success');
            
            // Show Demo Panel
            ticketDemoPanel.style.display = 'block';
            
            // Reset form
            contactForm.reset();
            btn.innerHTML = originalText;
            btn.disabled = false;
        }, 1200);
    });

    // Category Card Click Smooth Scroll to FAQ
    const categoryLinks = document.querySelectorAll('.category-filter');
    categoryLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            // Smooth scroll is handled by href="#faq", but we can also pre-filter if desired
            // Currently just acting as quick links
            const cat = link.getAttribute('data-cat');
            if (searchInput) {
                searchInput.value = cat;
                searchInput.dispatchEvent(new Event('input'));
            }
        });
    });
});
