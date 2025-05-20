// Functionality for the dashboard

document.addEventListener('DOMContentLoaded', () => {
    console.log("initialising dashboard...");
    if (!window.SessionData) {
        console.error('SessionData module not found');
        return;
    }
    
    const settings = applySettings();
    if (settings.showTips) {
        addWelcomeMessage();
    }
    
    loadDashboardStats();
    loadRecentActivity();
    
    function loadDashboardStats() {
        const stats = SessionData.getStats();
        
        document.getElementById('study-time-stat').textContent = stats.weeklyStudyTime;
        document.getElementById('focus-score-stat').textContent = `${stats.averageFocusScore}%`;
        document.getElementById('sessions-stat').textContent = stats.weeklySessionCount;
        document.getElementById('streak-stat').textContent = `${stats.streak} days`;
    }
    
    function loadRecentActivity() {
        const activityList = document.getElementById('activity-list');
        const noActivity = document.getElementById('no-activity');
        const recentSessions = SessionData.getRecentSessions(5);
        
        if (recentSessions.length === 0) {
            if (noActivity) noActivity.style.display = 'block';
            return;
        }
        
        if (noActivity) noActivity.style.display = 'none';
        
        activityList.innerHTML = '';
        
        recentSessions.forEach(session => {
            const activityItem = createActivityItem(session);
            activityList.appendChild(activityItem);
        });
    }
    
    function createActivityItem(session) {
        const activityItem = document.createElement('div');
        activityItem.className = 'activity-item';
        const icon = session.type === 'self' ? '📚' : '🧠';
        const sessionTitle = session.title || session.subject || 'Study Session';
        const sessionDate = new Date(session.timestamp || session.endTime || session.startTime);
        const formattedDate = formatDateRelative(sessionDate);
        const sessionDuration = session.duration ? `${session.duration} minutes` : 'Duration not recorded';
        
        let description = '';
        if (session.type === 'self') {
            description = `${sessionDuration} of focused study`;
        } else if (session.type === 'guided') {
            description = `Completed ${session.currentBlock || '?'} of ${session.totalBlocks || '?'} study blocks`;
        }
        
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
});