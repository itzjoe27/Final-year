/**
 * Study Assist Web App - Session Data Management
 * 
 * This file contains functionality for managing study session data
 * across different study modes
 */

// Session data management object
const SessionData = {
    // Save a session to local storage
    saveSession(sessionType, sessionData) {
        // Get existing sessions
        const sessions = this.getSessions();
        
        // Add new session with common metadata
        const newSession = {
            ...sessionData,
            id: this.generateSessionId(),
            timestamp: new Date().toISOString(),
            type: sessionType // 'self' or 'guided'
        };
        
        // Add to the beginning of the array (newest first)
        sessions.unshift(newSession);
        
        // Save back to localStorage
        localStorage.setItem('studyAssistSessions', JSON.stringify(sessions));
        
        return newSession;
    },
    
    // Get all sessions
    getSessions() {
        const sessionsJson = localStorage.getItem('studyAssistSessions');
        return sessionsJson ? JSON.parse(sessionsJson) : [];
    },
    
    // Get most recent sessions, optionally filtered by type
    getRecentSessions(limit = 5, type = null) {
        const sessions = this.getSessions();
        
        if (type) {
            return sessions.filter(session => session.type === type).slice(0, limit);
        }
        
        return sessions.slice(0, limit);
    },
    
    // Get statistics about sessions
    getStats() {
        const sessions = this.getSessions();
        const today = new Date();
        const thisWeekStart = new Date(today);
        thisWeekStart.setDate(today.getDate() - today.getDay()); // Start of current week (Sunday)
        thisWeekStart.setHours(0, 0, 0, 0);
        
        // Calculate total study time this week
        let weeklyStudyTimeMinutes = 0;
        let weeklySessionCount = 0;
        let averageFocusScore = 0;
        let totalFocusScores = 0;
        
        // Current streak calculation
        let streak = 0;
        let lastSessionDate = null;
        
        // Track days with sessions
        const daysWithSessions = new Set();
        
        sessions.forEach(session => {
            const sessionDate = new Date(session.endTime || session.timestamp);
            
            // Add to weekly totals if session was this week
            if (sessionDate >= thisWeekStart) {
                weeklySessionCount++;
                
                // Add duration to weekly study time
                if (session.duration) {
                    weeklyStudyTimeMinutes += parseInt(session.duration);
                } else if (session.startTime && session.endTime) {
                    const duration = (new Date(session.endTime) - new Date(session.startTime)) / (1000 * 60);
                    weeklyStudyTimeMinutes += duration;
                }
            }
            
            // Add to focus score average if available
            if (session.focusScore) {
                const score = parseInt(session.focusScore);
                if (!isNaN(score)) {
                    averageFocusScore += score;
                    totalFocusScores++;
                }
            }
            
            // Track days with sessions for streak calculation
            const dateString = sessionDate.toDateString();
            daysWithSessions.add(dateString);
            
            // Update last session date
            if (!lastSessionDate || sessionDate > lastSessionDate) {
                lastSessionDate = sessionDate;
            }
        });
        
        // Calculate streak (consecutive days including today or yesterday)
        const checkDate = new Date(today);
        checkDate.setHours(0, 0, 0, 0);
        
        // Check if there's a session today
        let hasTodaySession = daysWithSessions.has(checkDate.toDateString());
        
        // If no session today, check if there was one yesterday before starting streak count
        if (!hasTodaySession) {
            checkDate.setDate(checkDate.getDate() - 1);
            const hasYesterdaySession = daysWithSessions.has(checkDate.toDateString());
            
            if (!hasYesterdaySession) {
                // No streak if neither today nor yesterday had sessions
                streak = 0;
            } else {
                // Start counting from yesterday
                streak = 1;
                checkDate.setDate(checkDate.getDate() - 1);
            }
        } else {
            // Start counting from today
            streak = 1;
            checkDate.setDate(checkDate.getDate() - 1);
        }
        
        // Count backwards until we find a day without a session
        while (daysWithSessions.has(checkDate.toDateString())) {
            streak++;
            checkDate.setDate(checkDate.getDate() - 1);
        }
        
        // Calculate average focus score
        if (totalFocusScores > 0) {
            averageFocusScore = Math.round(averageFocusScore / totalFocusScores);
        } else {
            averageFocusScore = 0;
        }
        
        // Format weekly study time as hours and minutes
        const studyTimeHours = Math.floor(weeklyStudyTimeMinutes / 60);
        const studyTimeMinutes = Math.round(weeklyStudyTimeMinutes % 60);
        const formattedStudyTime = `${studyTimeHours}h ${studyTimeMinutes}m`;
        
        return {
            weeklyStudyTime: formattedStudyTime,
            weeklySessionCount,
            averageFocusScore,
            streak
        };
    },
    
    // Generate a unique session ID
    generateSessionId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
    },
    
    // Delete a session by ID
    deleteSession(sessionId) {
        const sessions = this.getSessions();
        const updatedSessions = sessions.filter(session => session.id !== sessionId);
        localStorage.setItem('studyAssistSessions', JSON.stringify(updatedSessions));
    },
    
    // Clear all sessions (mainly for testing)
    clearAllSessions() {
        localStorage.removeItem('studyAssistSessions');
    }
};

// Export the SessionData object for use in other files
window.SessionData = SessionData;