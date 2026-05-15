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

    // Login Form Validation
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
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
                try {
                    const res = await fetch('/api/auth/login', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ email: email.value.trim(), password: password.value })
                    });
                    
                    const data = await res.json();
                    
                    if (res.ok) {
                        localStorage.setItem('cyberguard_token', data.token);
                        localStorage.setItem('isLoggedIn', 'true');
                        window.location.href = 'home.html';
                    } else {
                        alert(data.message || 'Login failed');
                    }
                } catch (err) {
                    console.error(err);
                    alert('An error occurred during login.');
                }
            }
        });
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
            if (password.value.length < 6) { groups.pass.classList.add('error'); isValid = false; }
            if (password.value !== confirm.value || !confirm.value) { groups.confirm.classList.add('error'); isValid = false; }
            if (!terms.checked) { groups.terms.classList.add('error'); isValid = false; }
            
            if (isValid) {
                const btn = signupForm.querySelector('button[type="submit"]');
                const originalText = btn.innerHTML;
                btn.disabled = true;
                btn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Processing...';

                try {
                    // Start Firebase Phone Auth
                    let phoneNumber = phone.value.trim();
                    
                    // Simple auto-format for common mistakes (e.g. adding + if missing)
                    if (!phoneNumber.startsWith('+')) {
                        alert('Please include your country code (e.g. +91 for India, +1 for USA)');
                        btn.disabled = false;
                        btn.innerHTML = originalText;
                        return;
                    }

                    const appVerifier = recaptchaVerifier;
                    
                    const confirmationResult = await firebase.auth().signInWithPhoneNumber(phoneNumber, appVerifier);
                    
                    // Store the confirmationResult or verificationId
                    window.confirmationResult = confirmationResult;
                    sessionStorage.setItem('verificationId', confirmationResult.verificationId);
                    
                    // Store user details to save AFTER OTP verification
                    sessionStorage.setItem('pendingSignupData', JSON.stringify({
                        name: fullname.value.trim(),
                        email: email.value.trim(),
                        phone: phoneNumber,
                        password: password.value
                    }));

                    // Immediate redirect (No alert to block the flow)
                    window.location.href = 'otp.html';

                } catch (err) {
                    console.error("Firebase Auth Error:", err);
                    // Only show alert if there is a real error
                    alert('Error: ' + err.message);
                    btn.disabled = false;
                    btn.innerHTML = originalText;
                }
            } else {
                alert('Please fill in all fields correctly. Password must be at least 6 characters.');
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
                    inputs[index + 1].focus();
                }
            });
            input.addEventListener('keydown', (e) => {
                if (e.key === 'Backspace' && input.value.length === 0 && index > 0) {
                    inputs[index - 1].focus();
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
