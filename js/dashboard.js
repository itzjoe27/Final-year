/**
 * Study Assist Web App - Dashboard JavaScript
 * 
 * This file contains functionality for the dashboard page
 */

document.addEventListener('DOMContentLoaded', () => {
    // Check if SessionData is available
    if (!window.SessionData) {
        console.error('SessionData module not found');
        return;
    }
    
    // Get settings
    const settings = window.getStudyAssistSettings ? window.getStudyAssistSettings() : { showTips: true };
    
    // Load dashboard data
    loadDashboardStats();
    loadRecentActivity();
    
    // Add optional welcome message with study tip
    if (settings.showTips) {
        addWelcomeMessage();
    }
    
    // Function to load dashboard statistics
    function loadDashboardStats() {
        const stats = SessionData.getStats();
        
        // Update the stats on the dashboard
        document.getElementById('study-time-stat').textContent = stats.weeklyStudyTime;
        document.getElementById('focus-score-stat').textContent = `${stats.averageFocusScore}%`;
        document.getElementById('sessions-stat').textContent = stats.weeklySessionCount;
        document.getElementById('streak-stat').textContent = `${stats.streak} days`;
    }
    
    // Function to load recent activity
    function loadRecentActivity() {
        const activityList = document.getElementById('activity-list');
        const noActivity = document.getElementById('no-activity');
        const recentSessions = SessionData.getRecentSessions(5);
        
        // Show "no activity" message if no sessions are found
        if (recentSessions.length === 0) {
            if (noActivity) noActivity.style.display = 'block';
            return;
        }
        
        // Hide "no activity" message
        if (noActivity) noActivity.style.display = 'none';
        
        // Clear existing content
        activityList.innerHTML = '';
        
        // Add session items
        recentSessions.forEach(session => {
            const activityItem = createActivityItem(session);
            activityList.appendChild(activityItem);
        });
    }
    
    // Function to create an activity item
    function createActivityItem(session) {
        const activityItem = document.createElement('div');
        activityItem.className = 'activity-item';
        
        // Determine icon based on session type
        const icon = session.type === 'self' ? '📚' : '🧠';
        const sessionTitle = session.title || session.subject || 'Study Session';
        const sessionDate = new Date(session.timestamp || session.endTime || session.startTime);
        const formattedDate = formatDate(sessionDate);
        const sessionDuration = session.duration ? `${session.duration} minutes` : 'Duration not recorded';
        
        // Create activity details
        let description = '';
        if (session.type === 'self') {
            description = `${sessionDuration} of focused study`;
        } else if (session.type === 'guided') {
            description = `Completed ${session.currentBlock || '?'} of ${session.totalBlocks || '?'} study blocks`;
        }
        
        // Build HTML
        activityItem.innerHTML = `
            <div class="activity-icon">${icon}</div>
            <div class="activity-details">
                <h4>${session.type === 'self' ? 'Self-Study Session' : 'Guided Study Session'}: ${sessionTitle}</h4>
                <p>${description}</p>
                <span class="activity-time">${formattedDate}</span>
            </div>
        `;
        
        return activityItem;
    }
    
    // Function to format date
    function formatDate(date) {
        const now = new Date();
        const yesterday = new Date(now);
        yesterday.setDate(now.getDate() - 1);
        
        if (isSameDay(date, now)) {
            return `Today, ${formatTime(date)}`;
        } else if (isSameDay(date, yesterday)) {
            return `Yesterday, ${formatTime(date)}`;
        } else {
            return `${date.toLocaleDateString()}, ${formatTime(date)}`;
        }
    }
    
    // Helper function to check if two dates are the same day
    function isSameDay(date1, date2) {
        return date1.getDate() === date2.getDate() &&
               date1.getMonth() === date2.getMonth() &&
               date1.getFullYear() === date2.getFullYear();
    }
    
    // Helper function to format time
    function formatTime(date) {
        let hours = date.getHours();
        const minutes = date.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        
        hours = hours % 12;
        hours = hours ? hours : 12; // Convert 0 to 12
        
        return `${hours}:${minutes.toString().padStart(2, '0')} ${ampm}`;
    }
    
    // Function to add welcome message with study tip
    function addWelcomeMessage() {
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
        
        const mainContent = document.querySelector('.main-content');
        if (mainContent && mainContent.firstChild) {
            mainContent.insertBefore(welcomeMessage, mainContent.firstChild);
            
            // Fade out welcome message after 10 seconds
            setTimeout(() => {
                welcomeMessage.classList.add('fade-out');
                setTimeout(() => welcomeMessage.remove(), 1000);
            }, 10000);
        }
    }
    
    // Function to get a random study tip
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
});
