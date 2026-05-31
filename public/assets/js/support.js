document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('cyberguard_token');

    // 1. FAQ Accordion Toggle
    const faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach(q => {
        q.addEventListener('click', () => {
            const item = q.parentElement;
            const isActive = item.classList.contains('active');
            
            // Close all first
            document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));
            
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });

    // 2. Search Box Filter
    const searchInput = document.getElementById('supportSearch');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const val = e.target.value.toLowerCase().trim();
            const faqItems = document.querySelectorAll('.faq-item');
            
            faqItems.forEach(item => {
                const questionText = item.querySelector('.faq-question span').textContent.toLowerCase();
                const answerText = item.querySelector('.faq-answer p').textContent.toLowerCase();
                const tags = item.dataset.tags ? item.dataset.tags.toLowerCase() : '';
                
                if (questionText.includes(val) || answerText.includes(val) || tags.includes(val)) {
                    item.style.display = '';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    }

    // 3. Category Filter Click Handling
    const catCards = document.querySelectorAll('.category-filter');
    catCards.forEach(card => {
        card.addEventListener('click', (e) => {
            e.preventDefault();
            const category = card.dataset.cat;
            const faqItems = document.querySelectorAll('.faq-item');
            
            faqItems.forEach(item => {
                const tags = item.dataset.tags ? item.dataset.tags.toLowerCase() : '';
                if (tags.includes(category)) {
                    item.style.display = '';
                } else {
                    item.style.display = 'none';
                }
            });

            // Smooth scroll to FAQs
            const faqSection = document.getElementById('faq');
            if (faqSection) {
                faqSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // 4. Ticket Form Submission
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const category = document.getElementById('contactIssue').value;
            const message = document.getElementById('contactMessage').value;
            const name = document.getElementById('contactName').value;
            const email = document.getElementById('contactEmail').value;
            
            if (!category || !message) {
                showToast('Please fill in all fields.', 'danger');
                return;
            }

            const btn = contactForm.querySelector('button[type="submit"]');
            const originalText = btn.innerHTML;
            btn.disabled = true;
            btn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Submitting...';

            try {
                // If user is not logged in, they can still submit mock ticket (bypass token auth)
                const headers = { 'Content-Type': 'application/json' };
                if (token) headers['x-auth-token'] = token;

                const res = await fetch('/api/support/ticket', {
                    method: 'POST',
                    headers: headers,
                    body: JSON.stringify({ category, message, name, email })
                });

                const data = await res.json();

                if (res.ok) {
                    showToast('Support request submitted successfully!', 'success');
                    contactForm.reset();
                    
                    // Reveal the ticket status demo panel
                    const statusPanel = document.getElementById('ticketDemoPanel');
                    if (statusPanel) {
                        statusPanel.style.display = 'block';
                        statusPanel.querySelector('h4').textContent = `Investigating your ${category} issue`;
                        statusPanel.querySelector('p').textContent = `We received your request: "${message.substring(0, 80)}...". The support team is on it!`;
                        statusPanel.querySelector('.badge').textContent = `Ticket #${data.ticket ? data.ticket._id.substring(18) : '1024'}`;
                    }
                } else {
                    showToast(data.message || 'Error submitting request.', 'danger');
                }
            } catch (err) {
                console.error("Support submission error:", err);
                showToast('Network error, please try again.', 'danger');
            } finally {
                btn.disabled = false;
                btn.innerHTML = originalText;
            }
        });
    }

    // Dynamic Toast Loader
    function showToast(message, type = 'success') {
        const container = document.getElementById('toastContainer') || (() => {
            const d = document.createElement('div');
            d.id = 'toastContainer';
            d.style.cssText = 'position:fixed;bottom:20px;right:20px;z-index:1000;display:flex;flex-direction:column;gap:10px;';
            document.body.appendChild(d);
            return d;
        })();
        
        const toast = document.createElement('div');
        const bg = type === 'success' ? '#10b981' : '#ef4444';
        toast.style.cssText = `background:${bg};color:white;padding:0.85rem 1.25rem;border-radius:10px;display:flex;align-items:center;gap:0.6rem;font-size:0.88rem;font-weight:500;animation:slideIn 0.3s ease;`;
        toast.innerHTML = `<i class="fa-solid fa-${type === 'success' ? 'check-circle' : 'circle-xmark'}"></i> ${message}`;
        
        container.appendChild(toast);
        setTimeout(() => { 
            toast.style.opacity = '0'; 
            toast.style.transition = 'opacity 0.3s'; 
            setTimeout(() => toast.remove(), 300); 
        }, 3000);
    }
});
