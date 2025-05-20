// session history page javascript

document.addEventListener('DOMContentLoaded', () => {
    const historyFilter = document.getElementById('history-filter');
    const sessionList = document.getElementById('session-list');
    const sessionDetails = document.getElementById('session-details');
    const noSessionsMessage = document.getElementById('no-sessions-message');
    const backToListBtn = document.getElementById('back-to-list');
    
    loadSessions('all');
    if (historyFilter) {
        historyFilter.addEventListener('change', () => {
            loadSessions(historyFilter.value);
        });
    }
    
    if (backToListBtn) {
        backToListBtn.addEventListener('click', () => {
            sessionDetails.style.display = 'none';
            sessionList.style.display = 'block';
        });
    }
    
   function loadSessions(filter) {
    const allSessions = SessionData.getSessions();
    
    let sessions = [];
    if (filter === 'all' || filter === 'self') {
        sessions = [...sessions, ...allSessions.filter(session => session.type === 'self')];
    }
    if (filter === 'all' || filter === 'guided') {
        sessions = [...sessions, ...allSessions.filter(session => session.type === 'guided')];
    }
        
        // Sorts sessions by date
        sessions.sort((a, b) => {
            const dateA = a.startTime ? new Date(a.startTime) : new Date(0);
            const dateB = b.startTime ? new Date(b.startTime) : new Date(0);
            return dateB - dateA;
        });
        
        if (sessions.length === 0) {
            sessionList.style.display = 'none';
            noSessionsMessage.style.display = 'block';
            return;
        }
        noSessionsMessage.style.display = 'none';
        sessionList.style.display = 'block';
        sessionDetails.style.display = 'none';
        sessionList.innerHTML = '';
        sessions.forEach((session, index) => {
            const sessionItem = createSessionListItem(session, index);
            sessionList.appendChild(sessionItem);
        });
    }

    function createSessionListItem(session, index) {
        const sessionItem = document.createElement('div');
        sessionItem.className = 'session-list-item';
        sessionItem.setAttribute('data-index', index);

        const sessionDate = session.startTime ? new Date(session.startTime) : new Date();
        const formattedDate = formatDate(sessionDate);
        let duration = 'N/A';
        if (session.duration) {
            duration = `${session.duration} minutes`;
        } else if (session.startTime && session.endTime) {
            const durationMinutes = Math.round((new Date(session.endTime) - new Date(session.startTime)) / (1000 * 60));
            duration = `${durationMinutes} minutes`;
        }
        
        const badgeClass = session.type === 'self-study' ? 'badge-self-study' : 'badge-guided';
        const badgeText = session.type === 'self-study' ? 'Self-Study' : 'Guided Study';
        
        const sessionTitle = session.title || (session.subject && session.topic ? `${session.subject} - ${session.topic}` : 'Untitled Session');
        
        // HTML structure
        sessionItem.innerHTML = `
            <div class="session-list-header">
                <h3 class="session-list-title">${sessionTitle}</h3>
                <span class="session-list-badge ${badgeClass}">${badgeText}</span>
            </div>
            <div class="session-list-date">${formattedDate}</div>
            <div class="session-list-info">
                <div class="session-info-item">
                    <span class="info-icon">⏱️</span>
                    ${duration}
                </div>
                ${session.focusScore ? `
                <div class="session-info-item">
                    <span class="info-icon">🎯</span>
                    Focus Score: ${session.focusScore}%
                </div>
                ` : ''}
            </div>
        `;

        sessionItem.addEventListener('click', () => {
            showSessionDetails(session);
        });
        
        return sessionItem;
    }
    
    // Function to show session details
    function showSessionDetails(session) {
        const sessionDetailsContent = document.querySelector('.session-details-content');
        if (!sessionDetailsContent) return;
        sessionList.style.display = 'none';
        sessionDetails.style.display = 'block';

        const sessionDate = session.startTime ? new Date(session.startTime) : new Date();
        const formattedDate = formatDate(sessionDate);

        let duration = 'N/A';
        if (session.duration) {
            duration = `${session.duration} minutes`;
        } else if (session.startTime && session.endTime) {
            const durationMinutes = Math.round((new Date(session.endTime) - new Date(session.startTime)) / (1000 * 60));
            duration = `${durationMinutes} minutes`;
        }
        const sessionTitle = session.title || (session.subject && session.topic ? `${session.subject} - ${session.topic}` : 'Untitled Session');

        const sessionTypeText = session.type === 'self-study' ? 'Self-Study Session' : 'Guided Study Session';

        let detailsHTML = `
            <div class="session-detail-header">
                <h2 class="session-detail-title">${sessionTitle}</h2>
                <span class="session-list-badge ${session.type === 'self-study' ? 'badge-self-study' : 'badge-guided'}">${sessionTypeText}</span>
            </div>
            
            <div class="session-detail-section">
                <h3>Session Overview</h3>
                <div class="session-stats-grid">
                    <div class="session-stat-item">
                        <div class="stat-value">${duration}</div>
                        <div class="stat-label">Duration</div>
                    </div>
                    
                    <div class="session-stat-item">
                        <div class="stat-value">${formattedDate}</div>
                        <div class="stat-label">Date</div>
                    </div>
                    
                    ${session.focusScore ? `
                    <div class="session-stat-item">
                        <div class="stat-value">${session.focusScore}%</div>
                        <div class="stat-label">Focus Score</div>
                    </div>
                    ` : ''}
                </div>
            </div>
        `;
        
        // Add session-specific details based on session type
        if (session.type === 'self-study') {
            // Self-study specific details
            detailsHTML += `
                <div class="session-detail-section">
                    <h3>Blocked Distractions</h3>
                    ${session.blockedDistractions && session.blockedDistractions.length > 0 ? 
                        `<p>${session.blockedDistractions.join(', ')}</p>` : 
                        '<p>No distractions were blocked for this session.</p>'}
                    
                    ${session.customWebsites && session.customWebsites.length > 0 ? 
                        `<p>Custom blocked websites: ${session.customWebsites.join(', ')}</p>` : ''}
                </div>
            `;
            
            if (session.notes) {
                detailsHTML += `
                    <div class="session-detail-section">
                        <h3>Session Notes</h3>
                        <p>${session.notes}</p>
                    </div>
                `;
            }
        } else if (session.type === 'guided') {
            // Guided study specific details
            detailsHTML += `
                <div class="session-detail-section">
                    <h3>Study Details</h3>
                    ${session.subject ? `<p><strong>Subject:</strong> ${session.subject}</p>` : ''}
                    ${session.topic ? `<p><strong>Topic:</strong> ${session.topic}</p>` : ''}
                    ${session.objective ? `<p><strong>Learning Objective:</strong> ${session.objective}</p>` : ''}
                    ${session.studyMethod ? `<p><strong>Study Method:</strong> ${getStudyMethodName(session.studyMethod)}</p>` : ''}
                </div>
            `;
            
            if (session.materials && session.materials.length > 0) {
                detailsHTML += `
                    <div class="session-detail-section">
                        <h3>Study Materials</h3>
                        <p>${session.materials.join(', ')}</p>
                    </div>
                `;
            }
            
            if (session.distractions && session.distractions.length > 0) {
                detailsHTML += `
                    <div class="session-detail-section">
                        <h3>Blocked Distractions</h3>
                        <p>${session.distractions.join(', ')}</p>
                    </div>
                `;
            }
            
            if (session.accomplishment || session.nextSteps) {
                detailsHTML += `
                    <div class="session-detail-section">
                        <h3>Reflection</h3>
                        ${session.accomplishment ? `<p><strong>Accomplishments:</strong> ${session.accomplishment}</p>` : ''}
                        ${session.nextSteps ? `<p><strong>Next Steps:</strong> ${session.nextSteps}</p>` : ''}
                        ${session.effectiveness ? `<p><strong>Effectiveness Rating:</strong> ${session.effectiveness}/5</p>` : ''}
                    </div>
                `;
            }
        }

        sessionDetailsContent.innerHTML = detailsHTML;
    }

    function formatDate(date) {
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

    function getStudyMethodName(methodKey) {
        const methodNames = {
            'pomodoro': 'Pomodoro Technique',
            'blocks': 'Study Blocks',
            'spaced': 'Spaced Repetition',
            'flowtime': 'Flowtime Technique'
        };
        
        return methodNames[methodKey] || methodKey;
    }
});