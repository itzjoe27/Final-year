/**
 * Study Assist Web App - Main App JavaScript
 * 
 * This file contains shared functionality used across the application
 */

// Check if user is logged in
function checkAuth() {
    const isLoggedIn = localStorage.getItem('studyAssistLoggedIn');
    
    // If user is not logged in and not on login page, redirect to login page
    if (!isLoggedIn && !window.location.href.includes('login.html') && !window.location.href.includes('index.html')) {
        window.location.href = 'login.html';
    }
    
    // If user is logged in and on login page, redirect to dashboard
    if (isLoggedIn && window.location.href.includes('login.html')) {
        window.location.href = 'dashboard.html';
    }
}

// Handle logout
function handleLogout() {
    const logoutBtn = document.getElementById('logout-btn');
    
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            // Clear local storage
            localStorage.removeItem('studyAssistLoggedIn');
            localStorage.removeItem('studyAssistUser');
            
            // Redirect to login page
            window.location.href = 'login.html';
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
    
    if (userNameElement && userEmailElement) {
        const userData = JSON.parse(localStorage.getItem('studyAssistUser') || '{}');
        
        userNameElement.textContent = userData.name || 'John Doe';
        userEmailElement.textContent = userData.email || 'john@example.com';
    }
}

// Create a timer
function createTimer(durationInSeconds, displayElement, onComplete) {
    let timeRemaining = durationInSeconds;
    let timerId = null;
    let isPaused = false;
    
    // Update the display
    function updateDisplay() {
        displayElement.textContent = formatTime(timeRemaining);
    }
    
    // Start the timer
    function start() {
        if (timerId) return; // Timer already running
        
        isPaused = false;
        timerId = setInterval(() => {
            if (!isPaused) {
                timeRemaining--;
                updateDisplay();
                
                if (timeRemaining <= 0) {
                    stop();
                    if (onComplete) onComplete();
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
    
    // Initialize display
    updateDisplay();
    
    // Return timer controls
    return {
        start,
        pause,
        resume,
        stop,
        reset,
        isPaused: () => isPaused
    };
}

// Function to simulate blocking distractions
function blockDistractions(distractions) {
    console.log(`Blocking distractions: ${distractions.join(', ')}`);
    
    // In a real implementation, this would integrate with browser extensions
    // or other technologies to actually block websites and applications
    
    // For demo purposes, we'll just log the blocked distractions
    return {
        isBlocking: true,
        blockedItems: distractions
    };
}

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    // Check authentication
    checkAuth();
    
    // Handle logout button
    handleLogout();
    
    // Load user data
    loadUserData();
});
