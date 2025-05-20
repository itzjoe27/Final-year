/**
 * Study Assist Web App - Main App JavaScript
 * 
 * This file contains shared functionality used across the application
 */

// Check if user is logged in
function checkAuth() {
    const isLoggedIn = localStorage.getItem('studyAssistLoggedIn');
    const currentPage = window.location.pathname.split('/').pop();
    
    // If user is not logged in and not on login page or homepage, redirect to login
    if (!isLoggedIn && 
        !currentPage.includes('login.html') && 
        !currentPage.includes('index.html') && 
        currentPage !== '') {
        window.location.href = 'login.html';
        return false;
    }
    
    // If user is logged in and on login page, redirect to dashboard
    if (isLoggedIn && currentPage.includes('login.html')) {
        window.location.href = 'dashboard.html';
        return false;
    }
    
    return true;
}

// Handle logout
function handleLogout() {
    const logoutBtn = document.getElementById('logout-btn');
    
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            // Confirm logout
            if (confirm('Are you sure you want to log out?')) {
                // Clear local storage except for remember me setting and app settings
                const rememberMe = localStorage.getItem('studyAssistRemember');
                const darkMode = localStorage.getItem('darkMode');
                const showTips = localStorage.getItem('showTips');
                
                localStorage.clear();
                
                if (rememberMe) {
                    localStorage.setItem('studyAssistRemember', rememberMe);
                }
                
                // Preserve app settings
                if (darkMode) {
                    localStorage.setItem('darkMode', darkMode);
                }
                
                if (showTips) {
                    localStorage.setItem('showTips', showTips);
                }
                
                // Redirect to login page
                window.location.href = 'login.html';
            }
        });
    }
}

// Format time (converts seconds to MM:SS format)
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

// Load user data
function loadUserData() {
    const userNameElement = document.getElementById('user-name');
    const userEmailElement = document.getElementById('user-email');
    
    if (userNameElement || userEmailElement) {
        const userData = JSON.parse(localStorage.getItem('studyAssistUser') || '{}');
        
        if (userNameElement) {
            userNameElement.textContent = userData.name || 'Guest User';
        }
        
        if (userEmailElement) {
            userEmailElement.textContent = userData.email || 'guest@example.com';
        }
    }
}

// Apply dark mode
function applyDarkMode() {
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    document.body.classList.toggle('dark-mode', isDarkMode);
}

// Create a timer
function createTimer(durationInSeconds, displayElement, onComplete) {
    let timeRemaining = durationInSeconds;
    let timerId = null;
    let isPaused = false;
    
    // Update the display
    function updateDisplay() {
        if (displayElement) {
            displayElement.textContent = formatTime(timeRemaining);
        }
    }
    
    // Start the timer
    function start() {
        if (timerId) return; // Timer already running
        
        isPaused = false;
        updateDisplay(); // Update immediately before starting interval
        
        timerId = setInterval(() => {
            if (!isPaused) {
                timeRemaining--;
                updateDisplay();
                
                if (timeRemaining <= 0) {
                    stop();
                    if (onComplete && typeof onComplete === 'function') {
                        onComplete();
                    }
                }
            }
        }, 1000);
    }
    
    // Pause the timer
    function pause() {
        isPaused = true;
    }
    
    // Resume the timer
    function resume() {
        isPaused = false;
    }
    
    // Stop the timer
    function stop() {
        clearInterval(timerId);
        timerId = null;
    }
    
    // Reset the timer
    function reset() {
        stop();
        timeRemaining = durationInSeconds;
        updateDisplay();
    }
    
    // Get remaining time
    function getTimeRemaining() {
        return timeRemaining;
    }
    
    // Initialize display
    updateDisplay();
    
    // Return timer controls
    return {
        start,
        pause,
        resume,
        stop,
        reset,
        getTimeRemaining,
        isPaused: () => isPaused
    };
}

// Function to simulate blocking distractions
function blockDistractions(distractions) {
    console.log(`Blocking distractions: ${distractions.join(', ')}`);
    
    // In a real implementation, this would integrate with browser extensions
    // or other technologies to actually block websites and applications
    
    return {
        isBlocking: true,
        blockedItems: distractions,
        startTime: new Date()
    };
}

// Update active navigation links
function updateNavigation() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.sidebar-nav a');
    
    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href');
        link.parentElement.classList.remove('active');
        
        if (linkPage === currentPage) {
            link.parentElement.classList.add('active');
        }
    });
}

// Check if study tips should be shown
function shouldShowTips() {
    return localStorage.getItem('showTips') !== 'false'; // Default to true
}

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    // Apply dark mode
    applyDarkMode();
    
    // Check authentication
    if (!checkAuth()) return;
    
    // Handle logout button
    handleLogout();
    
    // Load user data
    loadUserData();
    
    // Update navigation
    updateNavigation();
    
    // Optional: Display welcome message on dashboard
    if (window.location.pathname.includes('dashboard.html')) {
        const userData = JSON.parse(localStorage.getItem('studyAssistUser') || '{}');
        const welcomeMessage = document.createElement('div');
        welcomeMessage.className = 'welcome-message';
        welcomeMessage.innerHTML = `<h3>Welcome back, ${userData.name || 'Student'}!</h3>`;
        
        const mainContent = document.querySelector('.main-content');
        if (mainContent && mainContent.firstChild) {
            mainContent.insertBefore(welcomeMessage, mainContent.firstChild);
            
            // Fade out welcome message after 5 seconds
            setTimeout(() => {
                welcomeMessage.style.opacity = '0';
                setTimeout(() => welcomeMessage.remove(), 1000);
            }, 5000);
        }
    }
});