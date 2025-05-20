// login manager

document.addEventListener('DOMContentLoaded', () => {
    console.log("loaded auth");

    // Get form elements
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const showRegisterLink = document.getElementById('showRegister');
    const showLoginLink = document.getElementById('showLogin');
    const skipLoginBtn = document.getElementById('skipLoginBtn');
    
    // Registration system toggle (disabled for now)
    if (showRegisterLink) {
        showRegisterLink.addEventListener('click', (e) => {
            e.preventDefault();
            loginForm.style.display = 'none';
            registerForm.style.display = 'block';
        });
    }
    
    if (showLoginLink) {
        showLoginLink.addEventListener('click', (e) => {
            e.preventDefault();
            registerForm.style.display = 'none';
            loginForm.style.display = 'block';
        });
    }
    
    // Skip login button for development/testing
    if (skipLoginBtn) {
        skipLoginBtn.addEventListener('click', (e) => {
            console.log("Skip pressed");
            e.preventDefault();
            
            // Admin mode for developing - just skips login
            const adminData = {
                name: 'Admin User',
                email: 'admin@studyassist.com',
            };
            
            localStorage.setItem('studyAssistLoggedIn', 'true');
            localStorage.setItem('studyAssistUser', JSON.stringify(adminData));
            window.location.href = 'dashboard.html';
        });
    }

    // Handle login form submission
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            console.log("login pressed");
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const rememberMe = document.getElementById('remember')?.checked || false;

            if (!email || !password) {
                alert('Please enter both email and password.');
                return;
            }
            
            // Store user in local storage
            const userData = {
                email: email,
                name: email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1)
            };
            
            localStorage.setItem('studyAssistLoggedIn', 'true');
            localStorage.setItem('studyAssistUser', JSON.stringify(userData));
            
            // Future feature for remember me
            // if (rememberMe) {
            //     localStorage.setItem('studyAssistRemember', 'true');
            // } else {
            //     localStorage.removeItem('studyAssisstRemember');
            // }
            
            window.location.href = 'dashboard.html';
        });
    }
});