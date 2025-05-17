/**
 * Study Assist Web App - Self-Study Mode JavaScript
 * 
 * This file contains functionality for the self-study mode
 */

document.addEventListener('DOMContentLoaded', () => {
    // Get elements
    const setupSection = document.getElementById('setup-section');
    const studySession = document.getElementById('study-session');
    const sessionComplete = document.getElementById('session-complete');
    const setupForm = document.getElementById('setup-form');
    const sessionDurationSelect = document.getElementById('session-duration');
    const customDurationGroup = document.getElementById('custom-duration-group');
    const customDuration = document.getElementById('custom-duration');
    const sessionTitleDisplay = document.getElementById('session-title-display');
    const sessionTimer = document.getElementById('session-timer');
    const pauseTimerBtn = document.getElementById('pause-timer-btn');
    const stopSessionBtn = document.getElementById('stop-session-btn');
    const endSessionBtn = document.getElementById('end-session-btn');
    const blockedSitesList = document.getElementById('blocked-sites-list');
    const completedDuration = document.getElementById('completed-duration');
    const focusScore = document.getElementById('focus-score');
    const saveSessionBtn = document.getElementById('save-session-btn');
    const newSessionBtn = document.getElementById('new-session-btn');
    
    // Session data
    let sessionData = {
        title: '',
        duration: 0,
        blockedDistractions: [],
        customWebsites: [],
        startTime: null,
        endTime: null,
        isPaused: false,
        pauseTime: 0
    };
    
    let timer = null;
    let distractionBlocker = null;
    
    // Show custom duration field if 'custom' is selected
    if (sessionDurationSelect) {
        sessionDurationSelect.addEventListener('change', () => {
            if (sessionDurationSelect.value === 'custom') {
                customDurationGroup.style.display = 'block';
                customDuration.required = true;
            } else {
                customDurationGroup.style.display = 'none';
                customDuration.required = false;
            }
        });
    }
    
    // Handle setup form submission
    if (setupForm) {
        setupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Get form values
            const sessionTitle = document.getElementById('session-title').value;
            let sessionDuration = parseInt(sessionDurationSelect.value);
            
            if (sessionDurationSelect.value === 'custom') {
                sessionDuration = parseInt(customDuration.value);
            }
            
            // Get blocked distractions
            const blockedDistractions = [];
            if (document.getElementById('block-social').checked) blockedDistractions.push('Social Media');
            if (document.getElementById('block-video').checked) blockedDistractions.push('Video Platforms');
            if (document.getElementById('block-news').checked) blockedDistractions.push('News Websites');
            if (document.getElementById('block-shopping').checked) blockedDistractions.push('Shopping Websites');
            
            // Get custom websites
            const customWebsitesInput = document.getElementById('custom-websites').value;
            const customWebsites = customWebsitesInput ? customWebsitesInput.split(',').map(site => site.trim()) : [];
            
            // Store session data
            sessionData = {
                title: sessionTitle,
                duration: sessionDuration,
                blockedDistractions: blockedDistractions,
                customWebsites: customWebsites,
                startTime: new Date(),
                endSession();
            }
        });
    }
    
    // Handle end session
    if (endSessionBtn) {
        endSessionBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to end this session early?')) {
                endSession();
            }
        });
    }
    
    // Handle save session
    if (saveSessionBtn) {
        saveSessionBtn.addEventListener('click', () => {
            // Get session notes
            const sessionNotes = document.getElementById('session-notes').value;
            
            // In a real application, this would save the session data to a server
            // For this demo, we'll just store the data in local storage
            
            const previousSessions = JSON.parse(localStorage.getItem('studySessions') || '[]');
            
            const sessionToSave = {
                ...sessionData,
                notes: sessionNotes,
                focusScore: calculateFocusScore()
            };
            
            previousSessions.push(sessionToSave);
            localStorage.setItem('studySessions', JSON.stringify(previousSessions));
            
            alert('Session saved successfully!');
            
            // Return to dashboard
            window.location.href = 'dashboard.html';
        });
    }
    
    // Handle new session
    if (newSessionBtn) {
        newSessionBtn.addEventListener('click', () => {
            // Reset the form and UI
            setupForm.reset();
            customDurationGroup.style.display = 'none';
            
            // Show setup section
            sessionComplete.style.display = 'none';
            setupSection.style.display = 'block';
        });
    }
    
    // Complete session function
    function completeSession() {
        // Stop the timer
        if (timer) {
            timer.stop();
        }
        
        // Record end time
        sessionData.endTime = new Date();
        
        // Unblock distractions
        distractionBlocker = null;
        
        // Update UI
        completedDuration.textContent = `${sessionData.duration} minutes`;
        focusScore.textContent = `${calculateFocusScore()}%`;
        
        // Show completion section
        studySession.style.display = 'none';
        sessionComplete.style.display = 'block';
    }
    
    // End session function
    function endSession() {
        // Stop the timer
        if (timer) {
            timer.stop();
        }
        
        // Record end time
        sessionData.endTime = new Date();
        
        // Unblock distractions
        distractionBlocker = null;
        
        // Update UI
        const actualDuration = Math.floor((sessionData.endTime - sessionData.startTime) / (1000 * 60));
        completedDuration.textContent = `${actualDuration} minutes (ended early)`;
        focusScore.textContent = `${calculateFocusScore()}%`;
        
        // Show completion section
        studySession.style.display = 'none';
        sessionComplete.style.display = 'block';
    }
    
    // Calculate focus score (simulated for demo)
    function calculateFocusScore() {
        // In a real application, this would be based on actual focus metrics
        // For this demo, we'll generate a random score between 70-100,
        // reduced by the number of times the user paused the timer
        
        const baseScore = Math.floor(Math.random() * 30) + 70; // 70-100
        const pausePenalty = sessionData.pauseTime * 5; // -5 points per pause
        
        const finalScore = Math.max(baseScore - pausePenalty, 50); // Minimum score of 50
        
        return finalScore;
    }
});dTime: null,
                isPaused: false,
                pauseTime: 0
            };
            
            // Update UI
            sessionTitleDisplay.textContent = sessionData.title;
            blockedSitesList.textContent = sessionData.blockedDistractions.join(', ');
            if (sessionData.customWebsites.length > 0) {
                blockedSitesList.textContent += ', ' + sessionData.customWebsites.join(', ');
            }
            
            // Start timer
            timer = createTimer(sessionDuration * 60, sessionTimer, completeSession);
            timer.start();
            
            // Block distractions
            const allBlockedItems = [...sessionData.blockedDistractions, ...sessionData.customWebsites];
            distractionBlocker = blockDistractions(allBlockedItems);
            
            // Show study session
            setupSection.style.display = 'none';
            studySession.style.display = 'block';
        });
    }
    
    // Handle pause/resume timer
    if (pauseTimerBtn) {
        pauseTimerBtn.addEventListener('click', () => {
            if (!timer) return;
            
            if (timer.isPaused()) {
                timer.resume();
                pauseTimerBtn.textContent = '⏸️';
                sessionData.isPaused = false;
            } else {
                timer.pause();
                pauseTimerBtn.textContent = '▶️';
                sessionData.isPaused = true;
                sessionData.pauseTime += 1; // Increment pause time (in a real app, track actual pause duration)
            }
        });
    }
    
    // Handle stop session
    if (stopSessionBtn) {
        stopSessionBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to stop the session?')) {
                en