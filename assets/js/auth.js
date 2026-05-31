document.addEventListener('DOMContentLoaded', () => {
    
    // Initialize reCAPTCHA
    let recaptchaVerifier;
    try {
        if (document.getElementById('recaptcha-container')) {
            // Ensure Firebase is ready
            if (typeof firebase !== 'undefined' && firebase.apps.length > 0) {
                recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', {
                    'size': 'invisible',
                    'callback': (response) => {
                        console.log("reCAPTCHA solved");
                    }
                });
            } else {
                console.warn("Firebase not yet initialized or SDK missing.");
            }
        }
    } catch (e) {
        console.error("Recaptcha initialization failed:", e);
    }

    // Helper to toggle password visibility
    function initPasswordToggle(toggleId, inputId) {
        const toggleBtn = document.getElementById(toggleId);
        const input = document.getElementById(inputId);
        if (toggleBtn && input) {
            toggleBtn.addEventListener('click', (e) => {
                e.preventDefault();
                const isPassword = input.getAttribute('type') === 'password';
                input.setAttribute('type', isPassword ? 'text' : 'password');
                const icon = toggleBtn.querySelector('i');
                if (icon) {
                    icon.className = isPassword ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye';
                }
            });
        }
    }

    // Helper to detect Caps Lock
    function initCapsLockDetection(inputId, badgeId) {
        const input = document.getElementById(inputId);
        const badge = document.getElementById(badgeId);
        if (input && badge) {
            const checkCaps = (e) => {
                if (e.getModifierState && e.getModifierState('CapsLock')) {
                    badge.style.display = 'inline-flex';
                } else {
                    badge.style.display = 'none';
                }
            };
            input.addEventListener('keydown', checkCaps);
            input.addEventListener('keyup', checkCaps);
            input.addEventListener('focus', checkCaps);
            input.addEventListener('blur', () => badge.style.display = 'none');
        }
    }

    // Initialize password toggles & caps lock checks
    initPasswordToggle('togglePassword', 'password');
    initPasswordToggle('toggleSignupPassword', 'passSignup');
    initPasswordToggle('toggleConfirmPassword', 'confirmPass');
    
    initCapsLockDetection('password', 'capsWarning');
    initCapsLockDetection('passSignup', 'capsWarningSignup');
    initCapsLockDetection('confirmPass', 'capsWarningSignup');

    // Real-time Input validation helpers
    const emailInput = document.getElementById('email');
    if (emailInput) {
        const emailGroup = document.getElementById('emailGroup');
        emailInput.addEventListener('input', () => {
            const val = emailInput.value.trim();
            const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
            const isPhone = /^\+?[0-9\s-]{8,20}$/.test(val);
            if (isEmail || isPhone) {
                emailInput.classList.add('valid-input');
                emailGroup.classList.remove('error');
            } else {
                emailInput.classList.remove('valid-input');
            }
        });
    }

    const emailSignup = document.getElementById('emailSignup');
    if (emailSignup) {
        const emailSignupGroup = document.getElementById('emailSignupGroup');
        emailSignup.addEventListener('input', () => {
            const val = emailSignup.value.trim();
            if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
                emailSignup.classList.add('valid-input');
                emailSignupGroup.classList.remove('error');
            } else {
                emailSignup.classList.remove('valid-input');
            }
        });
    }

    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        const phoneGroup = document.getElementById('phoneGroup');
        phoneInput.addEventListener('input', () => {
            const val = phoneInput.value.trim();
            if (val.startsWith('+') && val.length >= 8) {
                phoneInput.classList.add('valid-input');
                phoneGroup.classList.remove('error');
            } else {
                phoneInput.classList.remove('valid-input');
            }
        });
    }

    // Real-time Password Strength Meter
    const passSignup = document.getElementById('passSignup');
    const confirmPass = document.getElementById('confirmPass');
    let isPasswordValid = false;

    if (passSignup) {
        const strengthBar = document.getElementById('strengthBar');
        const strengthLabel = document.getElementById('strengthLabel');
        const requirements = {
            length: { el: document.getElementById('req-length'), test: (val) => val.length >= 8 },
            upper: { el: document.getElementById('req-upper'), test: (val) => /[A-Z]/.test(val) },
            lower: { el: document.getElementById('req-lower'), test: (val) => /[a-z]/.test(val) },
            number: { el: document.getElementById('req-number'), test: (val) => /[0-9]/.test(val) },
            special: { el: document.getElementById('req-special'), test: (val) => /[^A-Za-z0-9]/.test(val) }
        };

        passSignup.addEventListener('input', () => {
            const value = passSignup.value;
            let metCount = 0;
            
            for (const [key, req] of Object.entries(requirements)) {
                if (req.el) {
                    const met = req.test(value);
                    const icon = req.el.querySelector('i');
                    if (met) {
                        req.el.classList.add('met');
                        if (icon) icon.className = 'fa-solid fa-circle-check';
                        metCount++;
                    } else {
                        req.el.classList.remove('met');
                        if (icon) icon.className = 'fa-solid fa-circle-xmark';
                    }
                }
            }

            let percentage = (metCount / 5) * 100;
            let color = '#ef4444';
            let label = 'Weak';
            
            if (value.length === 0) {
                percentage = 0;
                label = 'Too Short';
                color = '#ef4444';
            } else if (metCount === 5) {
                color = '#10b981';
                label = 'Strong';
            } else if (metCount >= 3) {
                color = '#f59e0b';
                label = 'Medium';
            }

            if (strengthBar) {
                strengthBar.style.width = `${percentage}%`;
                strengthBar.style.backgroundColor = color;
            }
            if (strengthLabel) {
                strengthLabel.innerText = label;
                strengthLabel.style.color = color;
            }

            isPasswordValid = (metCount === 5);
            if (isPasswordValid) {
                passSignup.classList.add('valid-input');
                document.getElementById('passSignupGroup').classList.remove('error');
            } else {
                passSignup.classList.remove('valid-input');
            }
        });
    }

    if (confirmPass && passSignup) {
        const confirmGroup = document.getElementById('confirmPassGroup');
        const checkMatch = () => {
            if (confirmPass.value && confirmPass.value === passSignup.value) {
                confirmPass.classList.add('valid-input');
                confirmGroup.classList.remove('error');
            } else {
                confirmPass.classList.remove('valid-input');
            }
        };
        confirmPass.addEventListener('input', checkMatch);
        passSignup.addEventListener('input', checkMatch);
    }

    // Login Form Validation & Lockout Simulation
    let failedAttempts = 0;
    let lockoutTimer = null;

    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            if (lockoutTimer) {
                alert('Account is temporarily locked out due to multiple failed login attempts.');
                return;
            }

            let isValid = true;
            const email = document.getElementById('email');
            const password = document.getElementById('password');
            const emailGroup = document.getElementById('emailGroup');
            const passwordGroup = document.getElementById('passwordGroup');
            
            emailGroup.classList.remove('error');
            passwordGroup.classList.remove('error');
            
            if (!email.value.trim()) {
                emailGroup.classList.add('error');
                isValid = false;
            }
            if (!password.value.trim()) {
                passwordGroup.classList.add('error');
                isValid = false;
            }
            
            if (isValid) {
                const btn = loginForm.querySelector('button[type="submit"]');
                const originalText = btn.textContent;
                btn.disabled = true;
                btn.textContent = ' Checking credentials...';
                const spinner = document.createElement('i');
                spinner.className = 'fa-solid fa-circle-notch fa-spin';
                btn.prepend(spinner);

                try {
                    const res = await fetch('/api/auth/login', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ email: email.value.trim(), password: password.value })
                    });
                    
                    const data = await res.json();
                    
                    if (res.ok) {
                        failedAttempts = 0;
                        localStorage.setItem('cyberguard_token', data.token);
                        localStorage.setItem('isLoggedIn', 'true');
                        window.location.href = 'home.html';
                    } else {
                        btn.disabled = false;
                        btn.textContent = originalText;
                        
                        failedAttempts++;
                        if (failedAttempts >= 3) {
                            triggerLockout();
                        } else {
                            alert(data.message || 'Login failed');
                        }
                    }
                } catch (err) {
                    console.error(err);
                    alert('An error occurred during login.');
                    btn.disabled = false;
                    btn.textContent = originalText;
                }
            }
        });

        function triggerLockout() {
            const noticeContainer = document.getElementById('bruteForceNotice');
            const submitBtn = loginForm.querySelector('button[type="submit"]');
            const emailField = document.getElementById('email');
            const passField = document.getElementById('password');
            const timerSpan = document.getElementById('lockoutCountdown');
            
            if (!noticeContainer || !submitBtn) return;
            
            submitBtn.disabled = true;
            if (emailField) emailField.disabled = true;
            if (passField) passField.disabled = true;
            
            let secondsLeft = 30;
            if (timerSpan) {
                timerSpan.textContent = secondsLeft.toString();
            }
            noticeContainer.style.display = 'block';
            
            lockoutTimer = setInterval(() => {
                secondsLeft--;
                if (timerSpan) {
                    timerSpan.textContent = secondsLeft.toString();
                }
                
                if (secondsLeft <= 0) {
                    clearInterval(lockoutTimer);
                    lockoutTimer = null;
                    failedAttempts = 0;
                    
                    submitBtn.disabled = false;
                    if (emailField) emailField.disabled = false;
                    if (passField) passField.disabled = false;
                    noticeContainer.style.display = 'none';
                }
            }, 1000);
        }
    }

    // Signup Form - Firebase OTP Integration
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            let isValid = true;
            
            const fullname = document.getElementById('fullname');
            const phone = document.getElementById('phone');
            const email = document.getElementById('emailSignup');
            const password = document.getElementById('passSignup');
            const confirm = document.getElementById('confirmPass');
            const terms = document.getElementById('terms');
            
            const groups = {
                name: document.getElementById('nameGroup'),
                phone: document.getElementById('phoneGroup'),
                email: document.getElementById('emailSignupGroup'),
                pass: document.getElementById('passSignupGroup'),
                confirm: document.getElementById('confirmPassGroup'),
                terms: document.getElementById('termsGroup')
            };
            
            Object.values(groups).forEach(g => g.classList.remove('error'));
            
            if (!fullname.value.trim()) { groups.name.classList.add('error'); isValid = false; }
            if (!phone.value.trim()) { groups.phone.classList.add('error'); isValid = false; }
            if (!email.value.trim()) { groups.email.classList.add('error'); isValid = false; }
            
            // Password strength check
            if (!isPasswordValid) { 
                groups.pass.classList.add('error'); 
                isValid = false; 
            }
            if (password.value !== confirm.value || !confirm.value) { 
                groups.confirm.classList.add('error'); 
                isValid = false; 
            }
            if (!terms.checked) { groups.terms.classList.add('error'); isValid = false; }
            
            if (isValid) {
                const btn = signupForm.querySelector('button[type="submit"]');
                const originalText = btn.textContent;
                btn.disabled = true;
                btn.textContent = ' Processing...';
                const spinner = document.createElement('i');
                spinner.className = 'fa-solid fa-circle-notch fa-spin';
                btn.prepend(spinner);

                try {
                    let phoneNumber = phone.value.trim();
                    if (!phoneNumber.startsWith('+')) {
                        alert('Please include your country code (e.g. +91 for India, +1 for USA)');
                        btn.disabled = false;
                        btn.textContent = originalText;
                        return;
                    }

                    const appVerifier = recaptchaVerifier;
                    const confirmationResult = await firebase.auth().signInWithPhoneNumber(phoneNumber, appVerifier);
                    
                    window.confirmationResult = confirmationResult;
                    sessionStorage.setItem('verificationId', confirmationResult.verificationId);
                    
                    sessionStorage.setItem('pendingSignupData', JSON.stringify({
                        name: fullname.value.trim(),
                        email: email.value.trim(),
                        phone: phoneNumber,
                        password: password.value
                    }));

                    window.location.href = 'otp.html';

                } catch (err) {
                    console.error("Firebase Auth Error:", err);
                    alert('Error: ' + err.message);
                    btn.disabled = false;
                    btn.textContent = originalText;
                }
            } else {
                alert('Please fill in all fields correctly and ensure the password is Strong.');
            }
        });
    }

    // OTP Verification Logic
    const otpForm = document.getElementById('otpForm');
    if (otpForm) {
        const inputs = document.querySelectorAll('.otp-input');
        
        inputs.forEach((input, index) => {
            input.addEventListener('input', (e) => {
                if (input.value.length === 1 && index < inputs.length - 1) {
                    const nextInput = inputs.item(index + 1);
                    if (nextInput) nextInput.focus();
                }
            });
            input.addEventListener('keydown', (e) => {
                if (e.key === 'Backspace' && input.value.length === 0 && index > 0) {
                    const prevInput = inputs.item(index - 1);
                    if (prevInput) prevInput.focus();
                }
            });
        });

        otpForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const otpGroup = document.getElementById('otpGroup');
            otpGroup.classList.remove('error');
            
            let otpValue = '';
            inputs.forEach(input => otpValue += input.value);
            
            if (otpValue.length !== 6) {
                otpGroup.classList.add('error');
                return;
            }

            try {
                // Verify OTP using Firebase
                const verificationId = sessionStorage.getItem('verificationId');
                
                if (!verificationId) {
                    alert('Session expired or Verification ID missing. Please go back to Signup and try again.');
                    window.location.href = 'signup.html';
                    return;
                }

                const credential = firebase.auth.PhoneAuthProvider.credential(verificationId, otpValue);
                
                await firebase.auth().signInWithCredential(credential);
                
                // On Success: Save user to our Backend
                const userDataString = sessionStorage.getItem('pendingSignupData');
                const userData = userDataString ? JSON.parse(userDataString) : null;
                
                if (userData) {
                    const res = await fetch('/api/auth/signup', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(userData)
                    });
                    
                    const data = await res.json();
                    if (res.ok) {
                        localStorage.setItem('cyberguard_token', data.token);
                        localStorage.setItem('isLoggedIn', 'true');
                        sessionStorage.removeItem('pendingSignupData');
                        sessionStorage.removeItem('verificationId');
                        window.location.href = 'permissions.html';
                    } else {
                        alert('Backend Error: ' + (data.message || 'Could not save account.'));
                    }
                } else {
                    // If session lost but Firebase signed in
                    localStorage.setItem('isLoggedIn', 'true');
                    window.location.href = 'dashboard.html';
                }

            } catch (err) {
                console.error("OTP Verification Error:", err);
                alert('Verification Failed: ' + err.message);
            }
        });
    }
});
