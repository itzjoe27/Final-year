// Functionality for a guided study mode

document.addEventListener('DOMContentLoaded', () => {
    const steps = document.querySelectorAll('.step');
    const stepContents = document.querySelectorAll('.step-content');
    
    const nextStep1Btn = document.getElementById('next-step-1');
    const prevStep2Btn = document.getElementById('prev-step-2');
    const nextStep2Btn = document.getElementById('next-step-2');
    const endSessionBtn = document.getElementById('end-session-btn');
    const saveGuidedBtn = document.getElementById('save-guided-btn');
    const newGuidedBtn = document.getElementById('new-guided-btn');
    
    const studyMethodSelect = document.getElementById('study-method');
    const methodInfo = document.getElementById('method-info');
    const totalTimeSelect = document.getElementById('total-time');
    const customTimeGroup = document.getElementById('custom-time-group');
    const customTime = document.getElementById('custom-time');
    
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
    
    const methodDescriptions = {
        pomodoro: '<strong>Pomodoro Technique:</strong> Work for 25 minutes, then take a 5-minute break. After 4 pomodoros, take a longer 15-30 minute break.',
        blocks: '<strong>Study Blocks:</strong> Work for 50 minutes, then take a 10-minute break. Great for deep focus on complex topics.',
        spaced: '<strong>Spaced Repetition:</strong> Study material with increasing intervals between reviews. Ideal for memorization and long-term retention.',
        flowtime: '<strong>Flowtime Technique:</strong> Work until your focus naturally wanes, then take a break proportional to your work time. Great for creative work.'
    };
    
    const methodConfigs = {
        pomodoro: { workTime: 25, breakTime: 5, longBreakTime: 15, blocksBeforeLongBreak: 4 },
        blocks: { workTime: 50, breakTime: 10, longBreakTime: 20, blocksBeforeLongBreak: 2 },
        spaced: { workTime: 20, breakTime: 5, longBreakTime: 15, blocksBeforeLongBreak: 3 },
        flowtime: { workTime: 35, breakTime: 7, longBreakTime: 15, blocksBeforeLongBreak: 3 }
    };
    
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
    
    if (studyMethodSelect && methodInfo) {
        updateMethodInfo();
        
        studyMethodSelect.addEventListener('change', updateMethodInfo);
    }
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
    
    if (nextStep1Btn) {
        nextStep1Btn.addEventListener('click', () => {
            const subject = document.getElementById('subject').value;
            const topic = document.getElementById('topic').value;
            const objective = document.getElementById('learning-objective').value;
            const activityTypeRadios = document.querySelectorAll('input[name="activity-type"]');
            let activityType = '';
            
            for (let radio of activityTypeRadios) {
                if (radio.checked) {
                    activityType = radio.value;
                    break;
                }
            }
            
            if (!subject || !topic || !objective || !activityType) {
                alert('Please fill out all required fields');
                return;
            }
            sessionData.subject = subject;
            sessionData.topic = topic;
            sessionData.objective = objective;
            sessionData.activityType = activityType;
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
            let totalTime = parseInt(totalTimeSelect.value);
            
            if (totalTimeSelect.value === 'custom') {
                totalTime = parseInt(customTime.value);
                if (!totalTime || totalTime < 15) {
                    alert('Please enter a valid time (minimum 15 minutes)');
                    return;
                }
            }
            
            const studyMethod = studyMethodSelect.value;
            const materials = [];
            document.querySelectorAll('input[name="materials"]:checked').forEach(input => {
                materials.push(input.value);
            });
            const distractions = [];
            const distractionsSelect = document.getElementById('distractions');
            if (distractionsSelect) {
                for (let i = 0; i < distractionsSelect.options.length; i++) {
                    if (distractionsSelect.options[i].selected) {
                        distractions.push(distractionsSelect.options[i].text);
                    }
                }
            }
            if (materials.length === 0) {
                alert('Please select at least one study material');
                return;
            }

            sessionData.totalTime = totalTime;
            sessionData.studyMethod = studyMethod;
            sessionData.materials = materials;
            sessionData.distractions = distractions;

            const methodConfig = methodConfigs[studyMethod];
            sessionData.totalBlocks = Math.floor(totalTime / (methodConfig.workTime + methodConfig.breakTime));
            if (sessionData.totalBlocks < 1) sessionData.totalBlocks = 1;
            sessionData.currentBlock = 1;
            sessionData.isBreak = false;
            sessionData.startTime = new Date();
            const sessionSubjectDisplay = document.getElementById('session-subject-display');
            const statusMessage = document.getElementById('status-message');
            const currentTask = document.getElementById('current-task');
            
            if (sessionSubjectDisplay) {
                sessionSubjectDisplay.textContent = `${sessionData.subject} - ${sessionData.topic}`;
            }
            
            if (statusMessage) {
                statusMessage.textContent = `Study Block 1 of ${sessionData.totalBlocks}`;
            }
            
            if (currentTask) {
                currentTask.textContent = sessionData.objective;
            }
            const timerElement = document.getElementById('session-timer');
            const workTimeInSeconds = methodConfig.workTime * 60;
            if (timerElement) {
                sessionTimer = createTimer(workTimeInSeconds, timerElement, onTimerComplete);
                sessionTimer.start();
            }
    
            updateStudyTips(sessionData.activityType);

            if (distractions.length > 0) {
                console.log(`Blocking distractions: ${distractions.join(', ')}`);
            }

            updateProgress();

            goToStep(3);
        });
    }

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

    const skipBreakBtn = document.getElementById('skip-break-btn');
    if (skipBreakBtn) {
        skipBreakBtn.addEventListener('click', () => {
            if (!sessionData.isBreak || !sessionTimer) return;
            
            onTimerComplete();
        });
    }

    if (endSessionBtn) {
        endSessionBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to end this session early?')) {
                completeSession();
            }
        });
    }

    if (saveGuidedBtn) {
        saveGuidedBtn.addEventListener('click', () => {
            const accomplishment = document.getElementById('accomplishment')?.value || '';
            const effectivenessRadios = document.querySelectorAll('input[name="effectiveness"]');
            let effectiveness = '3'; 
            
            for (let radio of effectivenessRadios) {
                if (radio.checked) {
                    effectiveness = radio.value;
                    break;
                }
            }
            
            const nextSteps = document.getElementById('next-steps')?.value || '';

            const startTime = sessionData.startTime || new Date();
            const endTime = sessionData.endTime || new Date();
            const durationMinutes = Math.round((endTime - startTime) / (1000 * 60));

            const fullSessionData = {
                ...sessionData,
                accomplishment,
                effectiveness: parseInt(effectiveness),
                nextSteps,
                endTime,
                duration: durationMinutes,
                focusScore: effectiveness * 20  // Convert 1-5 rating to percentage
            };

            if (window.SessionData) {
                window.SessionData.saveSession('guided', fullSessionData);
                alert('Session saved successfully!');

                window.location.href = 'dashboard.html';
            } else {
                console.error('SessionData module not found');
                alert('Error saving session. Please try again.');
            }
        });
    }

    if (newGuidedBtn) {
        newGuidedBtn.addEventListener('click', () => {
            const goalsForm = document.getElementById('goals-form');
            const planForm = document.getElementById('plan-form');
            
            if (goalsForm) goalsForm.reset();
            if (planForm) planForm.reset();

            goToStep(1);
        });
    }

    function goToStep(stepNumber) {
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

        stepContents.forEach((content, index) => {
            if (index + 1 === stepNumber) {
                content.style.display = 'block';
            } else {
                content.style.display = 'none';
            }
        });
    }
    
    function updateMethodInfo() {
        if (!methodInfo || !studyMethodSelect) return;
        
        const selectedMethod = studyMethodSelect.value;
        methodInfo.innerHTML = methodDescriptions[selectedMethod] || '';
    }
    
    function updateStudyTips(activityType) {
        const studyTipsElement = document.getElementById('study-tips');
        if (!studyTipsElement) return;
        
        const tipsList = studyTipsElement.querySelector('ul');
        if (!tipsList) return;
        
        const tips = activityTips[activityType] || activityTips['reading']; 
        tipsList.innerHTML = tips.map(tip => `<li>${tip}</li>`).join('');
    }
    
    function onTimerComplete() {
        if (!sessionData || !methodConfigs) return;
        
        const methodConfig = methodConfigs[sessionData.studyMethod];
        if (!methodConfig) return;
        
        if (sessionData.isBreak) {
            // End of break period
            sessionData.isBreak = false;
            sessionData.currentBlock++;
            
            if (sessionData.currentBlock > sessionData.totalBlocks) {
                // Session complete
                completeSession();
                return;
            }

            const statusIcon = document.getElementById('status-icon');
            const statusMessage = document.getElementById('status-message');
            const studyTips = document.getElementById('study-tips');
            const breakTips = document.getElementById('break-tips');
            const skipBreakBtn = document.getElementById('skip-break-btn');
            
            if (statusIcon) statusIcon.textContent = '⏱️';
            if (statusMessage) statusMessage.textContent = `Study Block ${sessionData.currentBlock} of ${sessionData.totalBlocks}`;
            if (studyTips) studyTips.style.display = 'block';
            if (breakTips) breakTips.style.display = 'none';
            if (skipBreakBtn) skipBreakBtn.style.display = 'none';

            const timerElement = document.getElementById('session-timer');
            const workTimeInSeconds = methodConfig.workTime * 60;
            
            if (timerElement && typeof createTimer === 'function') {
                sessionTimer = createTimer(workTimeInSeconds, timerElement, onTimerComplete);
                sessionTimer.start();
            }
        } else {
            // End of study period
            sessionData.isBreak = true;

            const isLongBreak = sessionData.currentBlock % methodConfig.blocksBeforeLongBreak === 0;
            const breakTimeInSeconds = (isLongBreak ? methodConfig.longBreakTime : methodConfig.breakTime) * 60;

            const statusIcon = document.getElementById('status-icon');
            const statusMessage = document.getElementById('status-message');
            const studyTips = document.getElementById('study-tips');
            const breakTips = document.getElementById('break-tips');
            const skipBreakBtn = document.getElementById('skip-break-btn');
            
            if (statusIcon) statusIcon.textContent = '☕';
            if (statusMessage) {
                statusMessage.textContent = isLongBreak ? 
                    `Long Break (${methodConfig.longBreakTime} min)` : 
                    `Short Break (${methodConfig.breakTime} min)`;
            }
            if (studyTips) studyTips.style.display = 'none';
            if (breakTips) breakTips.style.display = 'block';
            if (skipBreakBtn) skipBreakBtn.style.display = 'inline-block';

            const timerElement = document.getElementById('session-timer');
            
            if (timerElement && typeof createTimer === 'function') {
                sessionTimer = createTimer(breakTimeInSeconds, timerElement, onTimerComplete);
                sessionTimer.start();
            }
        }

        updateProgress();
    }
    
    function updateProgress() {
        const progressBar = document.querySelector('.progress');
        const progressStats = document.querySelector('.progress-stats');
        
        if (!progressBar || !progressStats || !sessionData) return;

        let progressPercentage = 0;
        
        if (sessionData.totalBlocks > 0) {
            const completedBlocks = sessionData.currentBlock - 1;
            const currentProgress = sessionData.isBreak ? 1 : 0.5;
            progressPercentage = ((completedBlocks + currentProgress) / sessionData.totalBlocks) * 100;
        }

        progressBar.style.width = `${progressPercentage}%`;

        if (methodConfigs && sessionData.studyMethod) {
            progressStats.innerHTML = '';            
            const completionText = document.createElement('span');
            completionText.textContent = `${Math.round(progressPercentage)}% Complete`;
            progressStats.appendChild(completionText);            
            const remainingText = document.createElement('span');
            const methodConfig = methodConfigs[sessionData.studyMethod];
            
            if (methodConfig) {
                const remainingMinutes = Math.round(
                    (sessionData.totalBlocks - sessionData.currentBlock + (sessionData.isBreak ? 0 : 1)) * 
                    (methodConfig.workTime + methodConfig.breakTime)
                );
                remainingText.textContent = `${remainingMinutes} minutes remaining`;
            }
            progressStats.appendChild(remainingText);
        }
    }
    
    function completeSession() {
        if (sessionTimer) {
            sessionTimer.stop();
        }
        
        sessionData.endTime = new Date();
        
        const summarySubject = document.getElementById('summary-subject');
        const summaryTopic = document.getElementById('summary-topic');
        const summaryDuration = document.getElementById('summary-duration');
        const summaryMethod = document.getElementById('summary-method');
        
        if (summarySubject) summarySubject.textContent = sessionData.subject;
        if (summaryTopic) summaryTopic.textContent = sessionData.topic;
        if (summaryDuration) summaryDuration.textContent = `${sessionData.totalTime} minutes`;
        
        if (summaryMethod && studyMethodSelect) {
            const selectedOption = studyMethodSelect.options[studyMethodSelect.selectedIndex];
            summaryMethod.textContent = selectedOption ? selectedOption.text : sessionData.studyMethod;
        }
        
        goToStep(4);
    }
});