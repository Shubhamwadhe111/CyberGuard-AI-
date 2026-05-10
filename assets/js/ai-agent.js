document.addEventListener('DOMContentLoaded', () => {
    const chatInput = document.getElementById('chatInput');
    const sendBtn = document.getElementById('sendBtn');
    const chatMessages = document.getElementById('chatMessages');
    const quickActionChips = document.querySelectorAll('.quick-action-chip');
    const riskContextPanel = document.getElementById('riskContextPanel');
    const riskContextContent = document.getElementById('riskContextContent');

    // Handle context passed from other pages (e.g., threat-details)
    const pendingContext = localStorage.getItem('cg_ai_context');
    if (pendingContext) {
        setTimeout(() => {
            addUserMessage(pendingContext);
            processMessage(pendingContext);
            localStorage.removeItem('cg_ai_context');
        }, 500);
    }

    // Quick Action Chips
    quickActionChips.forEach(chip => {
        chip.addEventListener('click', () => {
            const text = chip.textContent;
            let prompt = "";
            if (text === 'Check a link') prompt = "Can you check this link: http://suspicious-site.com/login";
            else if (text === 'Analyze message') prompt = "Analyze this message: 'URGENT: Your account is blocked. Verify now.'";
            else if (text === 'Explain alert') prompt = "What does the 'Permission Risk' alert mean?";
            else if (text === 'Safety tips') prompt = "Give me 3 mobile safety tips.";
            
            chatInput.value = prompt;
            chatInput.focus();
        });
    });

    // Send Message
    const handleSend = () => {
        const text = chatInput.value.trim();
        if (!text) return;

        addUserMessage(text);
        chatInput.value = '';
        
        // Simulate typing delay
        setTimeout(() => {
            processMessage(text);
        }, 800 + Math.random() * 500);
    };

    sendBtn.addEventListener('click', handleSend);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSend();
    });

    function addUserMessage(text) {
        const wrapper = document.createElement('div');
        wrapper.className = 'message-wrapper user';
        wrapper.innerHTML = `
            <div class="message-avatar user"><i class="fa-solid fa-user"></i></div>
            <div class="message-bubble">${escapeHTML(text)}</div>
        `;
        chatMessages.appendChild(wrapper);
        scrollToBottom();
    }

    function addAIMessage(text, riskType = null) {
        const wrapper = document.createElement('div');
        wrapper.className = 'message-wrapper ai';
        
        let riskHtml = '';
        if (riskType) {
            let icon, title, cssClass;
            if (riskType === 'high') { icon = 'fa-triangle-exclamation'; title = 'High Risk Detected'; cssClass = 'high'; }
            else if (riskType === 'medium') { icon = 'fa-circle-exclamation'; title = 'Medium Risk Detected'; cssClass = 'medium'; }
            else { icon = 'fa-shield-check'; title = 'Appears Safe'; cssClass = 'safe'; }
            
            riskHtml = `
                <div class="ai-risk-card ${cssClass}">
                    <strong><i class="fa-solid ${icon}"></i> ${title}</strong>
                </div>
            `;
            
            // Update Context Panel on Desktop
            updateContextPanel(riskType, title);
        }

        wrapper.innerHTML = `
            <div class="message-avatar ai"><i class="fa-solid fa-robot"></i></div>
            <div class="message-bubble">
                ${text}
                ${riskHtml}
            </div>
        `;
        chatMessages.appendChild(wrapper);
        scrollToBottom();
    }

    function processMessage(text) {
        const lowerText = text.toLowerCase();
        const highRiskWords = ['bank', 'otp', 'password', 'urgent', 'blocked', 'verify', 'payment', 'login', 'http', 'link'];
        const mediumRiskWords = ['prize', 'reward', 'winner', 'free'];

        const isHighRisk = highRiskWords.some(word => lowerText.includes(word));
        const isMediumRisk = mediumRiskWords.some(word => lowerText.includes(word));

        if (isHighRisk) {
            addAIMessage(`I have analyzed the provided content. This exhibits classic signs of a phishing or social engineering attack. It is attempting to create a false sense of urgency to steal sensitive information. **Do not click any links or share your OTP/password.**`, 'high');
        } else if (isMediumRisk) {
            addAIMessage(`This content appears highly suspicious. Scammers often use the promise of prizes or free rewards to trick users into providing personal data or paying hidden fees. Proceed with extreme caution.`, 'medium');
        } else if (lowerText.includes('tips')) {
            addAIMessage(`Here are some quick mobile safety tips:<br>1. Never share OTPs.<br>2. Don't click unknown links in SMS.<br>3. Review app permissions regularly.`, null);
        } else {
            addAIMessage(`I've reviewed the text. I don't detect any immediate malicious patterns or known threat signatures in this specific content. However, always remain vigilant.`, 'safe');
        }
    }

    function updateContextPanel(riskType, title) {
        riskContextPanel.style.display = 'block';
        let color = riskType === 'high' ? 'var(--color-danger)' : (riskType === 'medium' ? 'var(--color-warning)' : 'var(--color-success)');
        let icon = riskType === 'high' ? 'fa-triangle-exclamation' : (riskType === 'medium' ? 'fa-circle-exclamation' : 'fa-shield-check');
        
        riskContextContent.innerHTML = `
            <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.5rem; color: ${color}; font-weight: 600;">
                <i class="fa-solid ${icon}"></i> ${title}
            </div>
            <p style="font-size: 0.85rem; color: var(--text-muted); margin: 0;">Context updated based on recent chat analysis. Threat prevention active.</p>
        `;
    }

    function scrollToBottom() {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function escapeHTML(str) {
        return str.replace(/[&<>'"]/g, 
            tag => ({
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                "'": '&#39;',
                '"': '&quot;'
            }[tag] || tag)
        );
    }
});
