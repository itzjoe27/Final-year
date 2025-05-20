// main file with functions used on multiple other files

// Check if user is logged in
function checkAuth() {
    const isLoggedIn = localStorage.getItem('studyAssistLoggedIn');
    const currentPage = window.location.pathname.split('/').pop();
    
    // If user is not logged in and not on login page or homepage, redirect to login
    if (!isLoggedIn && 
        !currentPage.includes('login.html') && 
        !currentPage.includes('index.html') && 
        currentPage !== '') {
        window.location.href = 'dashboard.html';
        return false;
    }
    
    // If user is logged in and on login page, redirect to dashboard
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

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    if (!checkAuth()) return;
});
