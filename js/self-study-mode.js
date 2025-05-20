// Functionality for the self hosted study sessions.

document.addEventListener('DOMContentLoaded', () => {
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
    
    let sessionData = {
        title: '',
        duration: 0,
        blockedDistractions: [],
        customWebsites: [],
        startTime: null,
        endTime: null,
        isPaused: false,
        pauseCount: 0
    };
    
    let timer = null;
    
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
    
    if (setupForm) {
        setupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const sessionTitle = document.getElementById('session-title').value;
            let sessionDuration = parseInt(sessionDurationSelect.value);
            
            if (sessionDurationSelect.value === 'custom') {
                sessionDuration = parseInt(customDuration.value);
            }
            
            const blockedDistractions = [];
            if (document.getElementById('block-social').checked) blockedDistractions.push('Social Media');
            if (document.getElementById('block-video').checked) blockedDistractions.push('Video Platforms');
            if (document.getElementById('block-news').checked) blockedDistractions.push('News Websites');
            if (document.getElementById('block-shopping').checked) blockedDistractions.push('Shopping Websites');
            
            const customWebsitesInput = document.getElementById('custom-websites').value;
            const customWebsites = customWebsitesInput ? customWebsitesInput.split(',').map(site => site.trim()) : [];
            
            sessionData = {
                title: sessionTitle,
                duration: sessionDuration,
                blockedDistractions: blockedDistractions,
                customWebsites: customWebsites,
                startTime: new Date(),
                endTime: null,
                isPaused: false,
                pauseCount: 0
            };
            
            sessionTitleDisplay.textContent = sessionData.title;
            blockedSitesList.textContent = sessionData.blockedDistractions.join(', ');
            if (sessionData.customWebsites.length > 0) {
                blockedSitesList.textContent += ', ' + sessionData.customWebsites.join(', ');
            }
            
            timer = createTimer(sessionDuration * 60, sessionTimer, completeSession);
            timer.start();
            
            blockDistractions([...sessionData.blockedDistractions, ...sessionData.customWebsites]);
            
            setupSection.style.display = 'none';
            studySession.style.display = 'block';
        });
    }
    
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
                sessionData.pauseCount += 1;
            }
        });
    }
    
    if (stopSessionBtn) {
        stopSessionBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to stop the session?')) {
                endSession();
            }
        });
    }
    
    if (endSessionBtn) {
        endSessionBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to end this session early?')) {
                endSession();
            }
        });
    }
    
    if (saveSessionBtn) {
        saveSessionBtn.addEventListener('click', () => {
            const sessionNotes = document.getElementById('session-notes').value;
            const calculatedFocusScore = calculateFocusScore(sessionData.pauseCount);            
            saveStudySession('self', sessionData, {
                notes: sessionNotes,
                focusScore: calculatedFocusScore
            });
        });
    }
    
    if (newSessionBtn) {
        newSessionBtn.addEventListener('click', () => {
            setupForm.reset();
            customDurationGroup.style.display = 'none';            
            sessionComplete.style.display = 'none';
            setupSection.style.display = 'block';
        });
    }
    
    function completeSession() {
        if (timer) {
            timer.stop();
        }        
        sessionData.endTime = new Date();        
        completedDuration.textContent = `${sessionData.duration} minutes`;
        focusScore.textContent = `${calculateFocusScore(sessionData.pauseCount)}%`;        
        studySession.style.display = 'none';
        sessionComplete.style.display = 'block';
    }
    
    function endSession() {
        if (timer) {
            timer.stop();
        }
        
        sessionData.endTime = new Date();        
        const actualDuration = Math.floor((sessionData.endTime - sessionData.startTime) / (1000 * 60));
        completedDuration.textContent = `${actualDuration} minutes (ended early)`;
        focusScore.textContent = `${calculateFocusScore(sessionData.pauseCount)}%`;
        studySession.style.display = 'none';
        sessionComplete.style.display = 'block';
    }
});