/**
 * Study Assist Web App - Authentication JavaScript
 * 
 * This file contains functionality for login and registration
 */

document.addEventListener('DOMContentLoaded', () => {
    // Get form elements
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const showRegisterLink = document.getElementById('showRegister');
    const showLoginLink = document.getElementById('showLogin');
    
    // Toggle between login and register forms
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
    
    // Handle login form submission
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const rememberMe = document.getElementById('remember') ? document.getElementById('remember').checked : false;
            
            // In a real application, this would validate credentials against a server
            // For this demo, we'll accept any credentials
            
            // Store user in local storage
            const userData = {
                email: email,
                name: email.split('@')[0] // Use part of email as name for demo
            };
            
            localStorage.setItem('studyAssistLoggedIn', 'true');
            localStorage.setItem('studyAssistUser', JSON.stringify(userData));
            
            // Redirect to dashboard
            window.location.href = 'dashboard.html';
        });
    }
    
    // Handle register form submission
    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const name = document.getElementById('reg-name').value;
            const email = document.getElementById('reg-email').value;
            const password = document.getElementById('reg-password').value;
            const confirmPassword = document.getElementById('reg-confirm-password').value;
            
            // Simple validation
            if (password !== confirmPassword) {
                alert('Passwords do not match');
                return;
            }
            
            // In a real application, this would create a new user account on the server
            // For this demo, we'll just store user data in local storage
            
            const userData = {
                name: name,
                email: email
            };
            
            localStorage.setItem('studyAssistLoggedIn', 'true');
            localStorage.setItem('studyAssistUser', JSON.stringify(userData));
            
            // Redirect to dashboard
            window.location.href = 'dashboard.html';
        });
    }
});z