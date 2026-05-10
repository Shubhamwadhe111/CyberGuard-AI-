document.addEventListener('DOMContentLoaded', () => {
    
    // Login Form Validation
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            let isValid = true;
            
            const email = document.getElementById('email');
            const password = document.getElementById('password');
            const emailGroup = document.getElementById('emailGroup');
            const passwordGroup = document.getElementById('passwordGroup');
            
            // Reset errors
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
                localStorage.setItem('isLoggedIn', 'true');
                window.location.href = 'dashboard.html';
            }
        });
    }

    // Signup Form Validation
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', (e) => {
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
            
            // Reset errors
            Object.values(groups).forEach(g => g.classList.remove('error'));
            
            if (!fullname.value.trim()) { groups.name.classList.add('error'); isValid = false; }
            if (!phone.value.trim()) { groups.phone.classList.add('error'); isValid = false; }
            if (!email.value.trim()) { groups.email.classList.add('error'); isValid = false; }
            if (password.value.length < 6) { groups.pass.classList.add('error'); isValid = false; }
            if (password.value !== confirm.value || !confirm.value) { groups.confirm.classList.add('error'); isValid = false; }
            if (!terms.checked) { groups.terms.classList.add('error'); isValid = false; }
            
            if (isValid) {
                window.location.href = 'otp.html';
            }
        });
    }

    // OTP Input Logic & Validation
    const otpForm = document.getElementById('otpForm');
    if (otpForm) {
        const inputs = document.querySelectorAll('.otp-input');
        
        inputs.forEach((input, index) => {
            input.addEventListener('keyup', (e) => {
                if (e.key >= 0 && e.key <= 9) {
                    if (index < inputs.length - 1) {
                        inputs[index + 1].focus();
                    }
                } else if (e.key === 'Backspace') {
                    if (index > 0) {
                        inputs[index - 1].focus();
                    }
                }
            });
        });

        otpForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const otpGroup = document.getElementById('otpGroup');
            otpGroup.classList.remove('error');
            
            let otpValue = '';
            inputs.forEach(input => otpValue += input.value);
            
            if (otpValue.length !== 6) {
                otpGroup.classList.add('error');
            } else {
                localStorage.setItem('isLoggedIn', 'true');
                window.location.href = 'dashboard.html';
            }
        });
    }
});
