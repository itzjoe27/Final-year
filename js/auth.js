// login manager

document.addEventListener('DOMContentLoaded', () => {
    // Get form elements
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const showRegisterLink = document.getElementById('showRegister');
    const showLoginLink = document.getElementById('showLogin');
    
    //  not working register system, login works fine
    // if (showRegisterLink) {
    //     showRegisterLink.addEventListener('click', (e) => {
    //         e.preventDefault();
    //         loginForm.style.display = 'none';
    //         registerForm.style.display = 'block';
    //     });
    // }
    
    if (showLoginLink) {
        showLoginLink.addEventListener('click', (e) => {
            e.preventDefault();
            registerForm.style.display = 'none';
            loginForm.style.display = 'block';
        });
    }
    
    // Handle login form submission
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const rememberMe = document.getElementById('remember')?.checked || false;

            if (!email || !password) {
                alert('Please enter both email and password.');
                return;
            }

    if (skipLoginBtn) {
        skipLoginBtn.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Create admin user data
            const adminData = {
                name: 'Admin User',
                email: 'admin@studyassist.com',
                isAdmin: true
            };
            
            // Set admin user in local storage
            localStorage.setItem('studyAssistLoggedIn', 'true');
            localStorage.setItem('studyAssistUser', JSON.stringify(adminData));
            
            // Redirect to dashboard
            window.location.href = 'dashboard.html';
        });
    }
            
           
            // Store user in local storage
            const userData = {
                email: email,
                name: email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1)
            };
            
            localStorage.setItem('studyAssistLoggedIn', 'true');
            localStorage.setItem('studyAssistUser', JSON.stringify(userData));
            
            // future feature maybe
            // if (rememberMe) {
            //     localStorage.setItem('studyAssistRemember', 'true');
            // } else {
            //     localStorage.removeItem('studyAssisstRemember');
            // }
            
            window.location.href = 'dashboard.html';
        });
    }
    
});
