// Main file with functions used on multiple other files

// Check if user is logged in
function checkAuth() {
    const isLoggedIn = localStorage.getItem('studyAssistLoggedIn');
    const currentPage = window.location.pathname.split('/').pop();

    if (!isLoggedIn && 
        !currentPage.includes('login.html') && 
        !currentPage.includes('index.html') && 
        currentPage !== '') {
        window.location.href = 'dashboard.html';
        return false;
    }

    if (isLoggedIn && currentPage.includes('login.html')) {
        window.location.href = 'dashboard.html';
        return false;
    }
    
    return true;
}
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

function formatDateTime(date) {
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    return date.toLocaleDateString('en-US', options);
}

function formatDateRelative(date) {
    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    
    if (isSameDay(date, now)) {
        return `Today, ${formatTimeOfDay(date)}`;
    } else if (isSameDay(date, yesterday)) {
        return `Yesterday, ${formatTimeOfDay(date)}`;
    } else {
        return `${date.toLocaleDateString()}, ${formatTimeOfDay(date)}`;
    }
}

function formatTimeOfDay(date) {
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    
    hours = hours % 12;
    hours = hours ? hours : 12; // Convert 0 to 12
    
    return `${hours}:${minutes.toString().padStart(2, '0')} ${ampm}`;
}

function isSameDay(date1, date2) {
    return date1.getDate() === date2.getDate() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getFullYear() === date2.getFullYear();
}
//timer functionality
function createTimer(durationInSeconds, displayElement, onComplete) {
    let timeRemaining = durationInSeconds;
    let timerId = null;
    let isPaused = false;
    
    function updateDisplay() {
        if (displayElement) {
            displayElement.textContent = formatTime(timeRemaining);
        }
    }
    
    function start() {
        if (timerId) return;
        
        isPaused = false;
        updateDisplay(); 
        
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
    
    function pause() {
        isPaused = true;
    }
    
    function resume() {
        isPaused = false;
    }
    
    function stop() {
        clearInterval(timerId);
        timerId = null;
    }
    
    function reset() {
        stop();
        timeRemaining = durationInSeconds;
        updateDisplay();
    }
    
    function getTimeRemaining() {
        return timeRemaining;
    }
    
    updateDisplay();
    
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

// Function to simulate blocking distractions - does not actually block anything
function blockDistractions(distractions) {
    console.log(`Blocking distractions: ${distractions.join(', ')}`);

    return {
        isBlocking: true,
        blockedItems: distractions,
        startTime: new Date()
    };
}

// Calculate focus score (simulated for demo)
function calculateFocusScore(pauseCount) {
    // In a real application, this would be based on actual focus metrics
    // For this demo, we'll generate a random score between 70-100,
    // reduced by the number of times the user paused the timer
    
    const baseScore = Math.floor(Math.random() * 30) + 70; // 70-100
    const pausePenalty = pauseCount * 5; // -5 points per pause
    
    return Math.max(baseScore - pausePenalty, 50); // Minimum score of 50
}

// Function to save a study session (generic for both study modes)
function saveStudySession(sessionType, sessionData, additionalData = {}) {
    // Combine the sessionData with any additional data
    const completeSessionData = {
        ...sessionData,
        ...additionalData
    };
    
    // Save using the SessionData module
    if (window.SessionData) {
        window.SessionData.saveSession(sessionType, completeSessionData);
        alert('Session saved successfully!');
        
        // Return to dashboard
        window.location.href = 'dashboard.html';
        return true;
    } else {
        console.error('SessionData module not found');
        alert('Error saving session. Please try again.');
        return false;
    }
}

// Settings Management
function getStudyAssistSettings() {
    return {
        darkMode: localStorage.getItem('darkMode') === 'true',
        showTips: localStorage.getItem('showTips') !== 'false' // Default to true
    };
}

function applySettings() {
    const settings = getStudyAssistSettings();
    
    // Apply dark mode
    document.body.classList.toggle('dark-mode', settings.darkMode);
    
    return settings;
}

// Study tips for welcome message
function getRandomStudyTip() {
    const studyTips = [
        "Break your study sessions into 25-minute chunks with 5-minute breaks (the Pomodoro Technique).",
        "Create a dedicated study space with minimal distractions.",
        "Start with the most difficult subject when your mind is freshest.",
        "Use active recall - test yourself instead of just re-reading material.",
        "Explain concepts out loud as if teaching someone else to reinforce understanding.",
        "Create mind maps or visual diagrams to connect related concepts.",
        "Use spaced repetition - review material at increasing intervals over time.",
        "Stay hydrated and take short movement breaks to maintain focus.",
        "Set specific, achievable goals for each study session.",
        "Review your notes within 24 hours of taking them to improve retention.",
        "Use mnemonic devices to remember complex information.",
        "Study similar subjects at different times to avoid confusion.",
        "Get enough sleep - your brain consolidates memories during sleep.",
        "Try changing study locations occasionally to improve memory.",
        "Limit social media and phone usage during study sessions.",
        "Use the 'chunking' technique to break down complex information.",
        "Create a study schedule and stick to it to build a routine.",
        "Use flashcards for facts, definitions, and concepts you need to memorize.",
        "Prioritize understanding concepts over memorizing facts.",
        "Review past mistakes on tests or assignments to avoid repeating them."
    ];
    
    return studyTips[Math.floor(Math.random() * studyTips.length)];
}

// Function to add welcome message with study tip
function addWelcomeMessage(containerSelector = '.main-content') {
    // Check if tips should be shown
    const settings = getStudyAssistSettings();
    if (!settings.showTips) return;
    
    const userData = JSON.parse(localStorage.getItem('studyAssistUser') || '{}');
    const welcomeMessage = document.createElement('div');
    welcomeMessage.className = 'welcome-message';
    
    // Get random study tip
    const studyTip = getRandomStudyTip();
    
    welcomeMessage.innerHTML = `
        <h3>Welcome back, ${userData.name || 'Student'}!</h3>
        <div class="study-tip">
            <h4>Study Tip:</h4>
            <p>${studyTip}</p>
        </div>
    `;
    
    const mainContent = document.querySelector(containerSelector);
    if (mainContent && mainContent.firstChild) {
        mainContent.insertBefore(welcomeMessage, mainContent.firstChild);
        
        // Fade out welcome message after 10 seconds
        setTimeout(() => {
            welcomeMessage.classList.add('fade-out');
            setTimeout(() => welcomeMessage.remove(), 1000);
        }, 10000);
    }
}

// User information functions
function getUserInfo() {
    const userDataString = localStorage.getItem('studyAssistUser');
    if (!userDataString) return null;
    
    try {
        return JSON.parse(userDataString);
    } catch (e) {
        console.error('Error parsing user data', e);
        return null;
    }
}

function updateUserProfile() {
    const userData = getUserInfo();
    if (!userData) return;
    
    const userNameElements = document.querySelectorAll('#user-name');
    const userEmailElements = document.querySelectorAll('#user-email');
    
    userNameElements.forEach(el => {
        if (el) el.textContent = userData.name || 'User';
    });
    
    userEmailElements.forEach(el => {
        if (el) el.textContent = userData.email || '';
    });
}

// Function to handle logout
function setupLogout() {
    const logoutBtns = document.querySelectorAll('#logout-btn');
    
    logoutBtns.forEach(btn => {
        if (btn) {
            btn.addEventListener('click', () => {
                if (confirm('Are you sure you want to log out?')) {
                    localStorage.removeItem('studyAssistLoggedIn');
                    window.location.href = 'login.html';
                }
            });
        }
    });
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    if (!checkAuth()) return;
    
    // Apply theme settings
    applySettings();
    
    // Update user profile information
    updateUserProfile();
    
    // Setup logout functionality
    setupLogout();
});