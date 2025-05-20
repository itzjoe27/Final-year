// File functionality for saving study data

const SessionData = {
    saveSession(sessionType, sessionData) {
        const sessions = this.getSessions();
        
        const newSession = {
            ...sessionData,
            id: this.generateSessionId(),
            timestamp: new Date().toISOString(),
            type: sessionType // 'self' or 'guided'
        };
        sessions.unshift(newSession);
        localStorage.setItem('studyAssistSessions', JSON.stringify(sessions));
        
        return newSession;
    },
    getSessions() {
        const sessionsJson = localStorage.getItem('studyAssistSessions');
        return sessionsJson ? JSON.parse(sessionsJson) : [];
    },

    getRecentSessions(limit = 5, type = null) {
        const sessions = this.getSessions();
        
        if (type) {
            return sessions.filter(session => session.type === type).slice(0, limit);
        }
        
        return sessions.slice(0, limit);
    },

    getStats() {
        const sessions = this.getSessions();
        const today = new Date();
        const thisWeekStart = new Date(today);
        thisWeekStart.setDate(today.getDate() - today.getDay());
        thisWeekStart.setHours(0, 0, 0, 0);

        let weeklyStudyTimeMinutes = 0;
        let weeklySessionCount = 0;
        let averageFocusScore = 0;
        let totalFocusScores = 0;
        let streak = 0;
        let lastSessionDate = null;
        const daysWithSessions = new Set();
        sessions.forEach(session => {
            const sessionDate = new Date(session.endTime || session.timestamp);
            
            if (sessionDate >= thisWeekStart) {
                weeklySessionCount++;
                if (session.duration) {
                    weeklyStudyTimeMinutes += parseInt(session.duration);
                } else if (session.startTime && session.endTime) {
                    const duration = (new Date(session.endTime) - new Date(session.startTime)) / (1000 * 60);
                    weeklyStudyTimeMinutes += duration;
                }
            }
            if (session.focusScore) {
                const score = parseInt(session.focusScore);
                if (!isNaN(score)) {
                    averageFocusScore += score;
                    totalFocusScores++;
                }
            }
            const dateString = sessionDate.toDateString();
            daysWithSessions.add(dateString);
            if (!lastSessionDate || sessionDate > lastSessionDate) {
                lastSessionDate = sessionDate;
            }
        });
        const checkDate = new Date(today);
        checkDate.setHours(0, 0, 0, 0);
        let hasTodaySession = daysWithSessions.has(checkDate.toDateString());
        if (!hasTodaySession) {
            checkDate.setDate(checkDate.getDate() - 1);
            const hasYesterdaySession = daysWithSessions.has(checkDate.toDateString());
            
            if (!hasYesterdaySession) {
                streak = 0;
            } else {
                streak = 1;
                checkDate.setDate(checkDate.getDate() - 1);
            }
        } else {
            streak = 1;
            checkDate.setDate(checkDate.getDate() - 1);
        }

        while (daysWithSessions.has(checkDate.toDateString())) {
            streak++;
            checkDate.setDate(checkDate.getDate() - 1);
        }

        if (totalFocusScores > 0) {
            averageFocusScore = Math.round(averageFocusScore / totalFocusScores);
        } else {
            averageFocusScore = 0;
        }

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

    deleteSession(sessionId) {
        const sessions = this.getSessions();
        const updatedSessions = sessions.filter(session => session.id !== sessionId);
        localStorage.setItem('studyAssistSessions', JSON.stringify(updatedSessions));
    },

    clearAllSessions() {
        localStorage.removeItem('studyAssistSessions');
    }
};
//exporting data to use elsewhere
window.SessionData = SessionData;