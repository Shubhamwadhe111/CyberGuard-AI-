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

    async function processMessage(text) {
        // Add a temporary typing indicator
        const typingWrapper = document.createElement('div');
        typingWrapper.className = 'message-wrapper ai typing-indicator';
        typingWrapper.id = 'aiTypingIndicator';
        typingWrapper.innerHTML = `
            <div class="message-avatar ai"><i class="fa-solid fa-robot"></i></div>
            <div class="message-bubble"><i class="fa-solid fa-ellipsis fa-fade"></i></div>
        `;
        chatMessages.appendChild(typingWrapper);
        scrollToBottom();

        try {
            const token = localStorage.getItem('cyberguard_token');
            const response = await fetch('/api/agent/analyze', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'x-auth-token': token 
                },
                body: JSON.stringify({ message: text })
            });
            
            const data = await response.json();
            
            // Remove typing indicator
            const indicator = document.getElementById('aiTypingIndicator');
            if(indicator) indicator.remove();

            if (response.ok) {
                // To keep it simple, we don't return riskType from backend yet, so pass null
                addAIMessage(data.reply, null);
            } else {
                addAIMessage("I'm sorry, I encountered a system error while processing your request.", null);
            }
        } catch (err) {
            console.error(err);
            const indicator = document.getElementById('aiTypingIndicator');
            if(indicator) indicator.remove();
            addAIMessage("I'm sorry, I couldn't reach the server.", null);
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
