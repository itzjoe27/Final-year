// login manager

document.addEventListener('DOMContentLoaded', () => {
console.log("loaded auth"); // troubleshooting
    

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

            //skip button to make demo easier - login is not working all the time. Neither is skip for some reason, use whatever works.
    if (skipLoginBtn) {
        skipLoginBtn.addEventListener('click', (e) => {
            console.log("Skip pressed");
            e.preventDefault();
            
            // unfinished attempt at an admin mode for developing.
            const adminData = {
                name: 'Admin User',
                email: 'admin@studyassist.com',
            };
            
            localStorage.setItem('studyAssistLoggedIn', 'true');
            localStorage.setItem('studyAssistUser', JSON.stringify(adminData));
            
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
