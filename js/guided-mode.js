/**
 * Study Assist Web App - Guided Study Mode JavaScript
 * 
 * This file contains functionality for the guided study mode
 */

document.addEventListener('DOMContentLoaded', () => {
    // Get step elements
    const steps = document.querySelectorAll('.step');
    const stepContents = document.querySelectorAll('.step-content');
    
    // Get navigation buttons
    const nextStep1Btn = document.getElementById('next-step-1');
    const prevStep2Btn = document.getElementById('prev-step-2');
    const nextStep2Btn = document.getElementById('next-step-2');
    const endSessionBtn = document.getElementById('end-session-btn');
    const saveGuidedBtn = document.getElementById('save-guided-btn');
    const newGuidedBtn = document.getElementById('new-guided-btn');
    
    // Get form elements
    const studyMethodSelect = document.getElementById('study-method');
    const methodInfo = document.getElementById('method-info');
    const totalTimeSelect = document.getElementById('total-time');
    const customTimeGroup = document.getElementById('custom-time-group');
    const customTime = document.getElementById('custom-time');
    
    // Session variables
    let sessionTimer = null;
    let sessionData = {
        subject: '',
        topic: '',
        objective: '',
        activityType: '',
        totalTime: 0,
        studyMethod: '',
        materials: [],
        distractions: [],
        startTime: null,
        endTime: null,
        currentStep: 0,
        currentBlock: 0,
        totalBlocks: 0,
        isBreak: false
    };
    
    // Study method descriptions
    const methodDescriptions = {
        pomodoro: '<strong>Pomodoro Technique:</strong> Work for 25 minutes, then take a 5-minute break. After 4 pomodoros, take a longer 15-30 minute break.',
        blocks: '<strong>Study Blocks:</strong> Work for 50 minutes, then take a 10-minute break. Great for deep focus on complex topics.',
        spaced: '<strong>Spaced Repetition:</strong> Study material with increasing intervals between reviews. Ideal for memorization and long-term retention.',
        flowtime: '<strong>Flowtime Technique:</strong> Work until your focus naturally wanes, then take a break proportional to your work time. Great for creative work.'
    };
    
    // Study method configurations (work/break times in minutes)
    const methodConfigs = {
        pomodoro: { workTime: 25, breakTime: 5, longBreakTime: 15, blocksBeforeLongBreak: 4 },
        blocks: { workTime: 50, breakTime: 10, longBreakTime: 20, blocksBeforeLongBreak: 2 },
        spaced: { workTime: 20, breakTime: 5, longBreakTime: 15, blocksBeforeLongBreak: 3 },
        flowtime: { workTime: 35, breakTime: 7, longBreakTime: 15, blocksBeforeLongBreak: 3 }
    };
    
    // Activity-specific study tips
    const activityTips = {
        reading: [
            'Take notes in your own words to improve understanding',
            'Use the SQ3R method: Survey, Question, Read, Recite, Review',
            'Highlight key concepts, but don\'t overdo it',
            'Try to summarize each section after reading it'
        ],
        practice: [
            'Start with easier problems before tackling difficult ones',
            'Work through examples step-by-step',
            'If stuck, take a short break then return with fresh eyes',
            'Try to explain your solution process out loud'
        ],
        memorization: [
            'Create flashcards for key concepts',
            'Use mnemonic devices for complex information',
            'Test yourself regularly rather than just reviewing',
            'Space out your review sessions for better retention'
        ],
        project: [
            'Break down your project into smaller, manageable tasks',
            'Set specific goals for this study session',
            'Keep track of questions or roadblocks to resolve later',
            'Take brief notes on your progress for next time'
        ]
    };
    
    // Initialize method info
    if (studyMethodSelect && methodInfo) {
        updateMethodInfo();
        
        studyMethodSelect.addEventListener('change', updateMethodInfo);
    }
    
    // Show custom time field if 'custom' is selected
    if (totalTimeSelect) {
        totalTimeSelect.addEventListener('change', () => {
            if (totalTimeSelect.value === 'custom') {
                customTimeGroup.style.display = 'block';
                customTime.required = true;
            } else {
                customTimeGroup.style.display = 'none';
                customTime.required = false;
            }
        });
    }
    
    // Handle step navigation
    if (nextStep1Btn) {
        nextStep1Btn.addEventListener('click', () => {
            // Validate step 1 form
            const subject = document.getElementById('subject').value;
            const topic = document.getElementById('topic').value;
            const objective = document.getElementById('learning-objective').value;
            const activityType = document.querySelector('input[name="activity-type"]:checked').value;
            
            if (!subject || !topic || !objective) {
                alert('Please fill out all required fields');
                return;
            }
            
            // Store step 1 data
            sessionData.subject = subject;
            sessionData.topic = topic;
            sessionData.objective = objective;
            sessionData.activityType = activityType;
            
            // Move to step 2
            goToStep(2);
        });
    }
    
    if (prevStep2Btn) {
        prevStep2Btn.addEventListener('click', () => {
            goToStep(1);
        });
    }
    
    if (nextStep2Btn) {
        nextStep2Btn.addEventListener('click', () => {
            // Validate step 2 form
            let totalTime = parseInt(totalTimeSelect.value);
            
            if (totalTimeSelect.value === 'custom') {
                totalTime = parseInt(customTime.value);
                if (!totalTime || totalTime < 15) {
                    alert('Please enter a valid time (minimum 15 minutes)');
                    return;
                }
            }
            
            const studyMethod = studyMethodSelect.value;
            
            // Get materials
            const materials = [];
            document.querySelectorAll('input[name="materials"]:checked').forEach(input => {
                materials.push(input.value);
            });
            
            // Get distractions
            const distractions = [];
            const distractionsSelect = document.getElementById('distractions');
            for (let i = 0; i < distractionsSelect.options.length; i++) {
                if (distractionsSelect.options[i].selected) {
                    distractions.push(distractionsSelect.options[i].text);
                }
            }
            
            // Store step 2 data
            sessionData.totalTime = totalTime;
            sessionData.studyMethod = studyMethod;
            sessionData.materials = materials;
            sessionData.distractions = distractions;
            
            // Calculate study blocks based on method and total time
            const methodConfig = methodConfigs[studyMethod];
            sessionData.totalBlocks = Math.floor(totalTime / (methodConfig.workTime + methodConfig.breakTime));
            sessionData.currentBlock = 1;
            sessionData.isBreak = false;
            sessionData.startTime = new Date();
            
            // Update UI for step 3
            document.getElementById('session-subject-display').textContent = `${sessionData.subject} - ${sessionData.topic}`;
            document.getElementById('status-message').textContent = `Study Block 1 of ${sessionData.totalBlocks}`;
            document.getElementById('current-task').textContent = sessionData.objective;
            
            // Start timer with work time
            const timerElement = document.getElementById('session-timer');
            const workTimeInSeconds = methodConfig.workTime * 60;
            sessionTimer = createTimer(workTimeInSeconds, timerElement, onTimerComplete);
            sessionTimer.start();
            
            // Show study tips based on activity type
            updateStudyTips(sessionData.activityType);
            
            // Block distractions
            blockDistractions(sessionData.distractions);
            
            // Update progress bar
            updateProgress();
            
            // Move to step 3
            goToStep(3);
        });
    }
    
    // Handle pause/resume timer
    const pauseTimerBtn = document.getElementById('pause-timer-btn');
    if (pauseTimerBtn) {
        pauseTimerBtn.addEventListener('click', () => {
            if (!sessionTimer) return;
            
            if (sessionTimer.isPaused()) {
                sessionTimer.resume();
                pauseTimerBtn.textContent = '⏸️';
            } else {
                sessionTimer.pause();
                pauseTimerBtn.textContent = '▶️';
            }
        });
    }
    
    // Handle skip break
    const skipBreakBtn = document.getElementById('skip-break-btn');
    if (skipBreakBtn) {
        skipBreakBtn.addEventListener('click', () => {
            if (!sessionData.isBreak) return;
            
            onTimerComplete();
        });
    }
    
    // Handle end session early
    if (endSessionBtn) {
        endSessionBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to end this session early?')) {
                completeSession();
            }
        });
    }
    
    // Handle save session
    if (saveGuidedBtn) {
        saveGuidedBtn.addEventListener('click', () => {
            // Get session data
            const accomplishment = document.getElementById('accomplishment').value;
            const effectiveness = document.querySelector('input[name="effectiveness"]:checked').value;
            const nextSteps = document.getElementById('next-steps').value;
            
            // In a real application, this would save to a server
            // For this demo, we'll just store in local storage
            
            const previousSessions = JSON.parse(localStorage.getItem('guidedSessions') || '[]');
            
            const sessionToSave = {
                ...sessionData,
                accomplishment,
                effectiveness,
                nextSteps,
                endTime: new Date()
            };
            
            previousSessions.push(sessionToSave);
            localStorage.setItem('guidedSessions', JSON.stringify(previousSessions));
            
            alert('Session saved successfully!');
            
            // Return to dashboard
            window.location.href = 'dashboard.html';
        });
    }
    
    // Handle new session
    if (newGuidedBtn) {
        newGuidedBtn.addEventListener('click', () => {
            // Reset forms
            document.getElementById('goals-form').reset();
            document.getElementById('plan-form').reset();
            
            // Go back to step 1
            goToStep(1);
        });
    }
    
    // Helper functions
    function goToStep(stepNumber) {
        // Update step indicators
        steps.forEach(step => {
            const stepNum = parseInt(step.getAttribute('data-step'));
            
            if (stepNum < stepNumber) {
                step.classList.add('completed');
                step.classList.remove('active');
            } else if (stepNum === stepNumber) {
                step.classList.add('active');
                step.classList.remove('completed');
            } else {
                step.classList.remove('active', 'completed');
            }
        });
        
        // Show appropriate step content
        stepContents.forEach((content, index) => {
            if (index + 1 === stepNumber) {
                content.style.display = 'block';
            } else {
                content.style.display = 'none';
            }
        });
    }
    
    function updateMethodInfo() {
        const selectedMethod = studyMethodSelect.value;
        methodInfo.innerHTML = methodDescriptions[selectedMethod];
    }
    
    function updateStudyTips(activityType) {
        const studyTipsElement = document.getElementById('study-tips');
        if (!studyTipsElement) return;
        
        const tipsHTML = activityTips[activityType].map(tip => `<li>${tip}</li>`).join('');
        studyTipsElement.querySelector('ul').innerHTML = tipsHTML;
    }
    
    function onTimerComplete() {
        const methodConfig = methodConfigs[sessionData.studyMethod];
        
        if (sessionData.isBreak) {
            // Finished a break, start next study block
            sessionData.isBreak = false;
            sessionData.currentBlock++;
            
            if (sessionData.currentBlock > sessionData.totalBlocks) {
                // All blocks complete
                completeSession();
                return;
            }
            
            // Update UI for study block
            document.getElementById('status-icon').textContent = '⏱️';
            document.getElementById('status-message').textContent = `Study Block ${sessionData.currentBlock} of ${sessionData.totalBlocks}`;
            document.getElementById('study-tips').style.display = 'block';
            document.getElementById('break-tips').style.display = 'none';
            
            // Update skip break button
            document.getElementById('skip-break-btn').style.display = 'none';
            
            // Start timer with work time
            const timerElement = document.getElementById('session-timer');
            const workTimeInSeconds = methodConfig.workTime * 60;
            sessionTimer = createTimer(workTimeInSeconds, timerElement, onTimerComplete);
            sessionTimer.start();
        } else {
            // Finished a study block, start break
            sessionData.isBreak = true;
            
            // Determine if this is a long break
            const isLongBreak = sessionData.currentBlock % methodConfig.blocksBeforeLongBreak === 0;
            const breakTimeInSeconds = (isLongBreak ? methodConfig.longBreakTime : methodConfig.breakTime) * 60;
            
            // Update UI for break
            document.getElementById('status-icon').textContent = '☕';
            document.getElementById('status-message').textContent = isLongBreak ? 
                `Long Break (${methodConfig.longBreakTime} min)` : 
                `Short Break (${methodConfig.breakTime} min)`;
            document.getElementById('study-tips').style.display = 'none';
            document.getElementById('break-tips').style.display = 'block';
            
            // Update skip break button
            document.getElementById('skip-break-btn').style.display = 'inline-block';
            
            // Start timer with break time
            const timerElement = document.getElementById('session-timer');
            sessionTimer = createTimer(breakTimeInSeconds, timerElement, onTimerComplete);
            sessionTimer.start();
        }
        
        // Update progress
        updateProgress();
    }
    
    function updateProgress() {
        const progressBar = document.querySelector('.progress');
        const progressStats = document.querySelector('.progress-stats');
        
        if (!progressBar || !progressStats) return;
        
        // Calculate progress percentage
        let progressPercentage = 0;
        
        if (sessionData.totalBlocks > 0) {
            const completedBlocks = sessionData.currentBlock - 1;
            const currentProgress = sessionData.isBreak ? 1 : 0.5;
            progressPercentage = ((completedBlocks + currentProgress) / sessionData.totalBlocks) * 100;
        }
        
        // Update progress bar
        progressBar.style.width = `${progressPercentage}%`;
        
        // Update progress stats
        const completionText = document.createElement('span');
        completionText.textContent = `${Math.round(progressPercentage)}% Complete`;
        
        const remainingText = document.createElement('span');
        const remainingMinutes = Math.round((sessionData.totalBlocks - sessionData.currentBlock + (sessionData.isBreak ? 0 : 1)) * 
            (methodConfigs[sessionData.studyMethod].workTime + methodConfigs[sessionData.studyMethod].breakTime));
        remainingText.textContent = `${remainingMinutes} minutes remaining`;
        
        progressStats.innerHTML = '';
        progressStats.appendChild(completionText);
        progressStats.appendChild(remainingText);
    }
    
    function completeSession() {
        // Stop timer
        if (sessionTimer) {
            sessionTimer.stop();
        }
        
        // Record end time
        sessionData.endTime = new Date();
        
        // Update summary UI
        document.getElementById('summary-subject').textContent = sessionData.subject;
        document.getElementById('summary-topic').textContent = sessionData.topic;
        document.getElementById('summary-duration').textContent = `${sessionData.totalTime} minutes`;
        document.getElementById('summary-method').textContent = studyMethodSelect.options[studyMethodSelect.selectedIndex].text;
        
        // Go to step 4
        goToStep(4);
    }
});
