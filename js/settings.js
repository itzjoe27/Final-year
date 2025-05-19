/**
 * Study Assist Web App - Settings JavaScript
 * 
 * This file contains functionality for managing user settings
 */

document.addEventListener('DOMContentLoaded', () => {
    // Default settings
    const defaultSettings = {
        showTips: true,
        darkMode: false,
        defaultDuration: '30',
        defaultMethod: 'pomodoro',
        autoStartTimers: false,
        pomodoroWork: 25,
        pomodoroBreak: 5,
        pomodoroLongBreak: 15,
        soundNotifications: true,
        desktopNotifications: true,
        saveHistory: true
    };
    
    // Load settings
    loadSettings();
    
    // Get form elements
    const saveSettingsBtn = document.getElementById('save-settings-btn');
    const clearDataBtn = document.getElementById('clear-data-btn');
    
    // Handle save settings
    if (saveSettingsBtn) {
        saveSettingsBtn.addEventListener('click', () => {
            saveSettings();
            alert('Settings saved successfully!');
        });
    }
    
    // Handle clear all data
    if (clearDataBtn) {
        clearDataBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to clear all your data? This action cannot be undone.')) {
                if (confirm('This will delete all your session history and settings. Are you absolutely sure?')) {
                    clearAllData();
                    alert('All data has been cleared. The page will now reload.');
                    window.location.reload();
                }
            }
        });
    }
    
    // Function to load settings
    function loadSettings() {
        const settings = getSettings();
        
        // Apply settings to form elements
        document.getElementById('show-tips').checked = settings.showTips;
        document.getElementById('dark-mode').checked = settings.darkMode;
        
        // Set select values
        const defaultDurationSelect = document.getElementById('default-duration');
        if (defaultDurationSelect) {
            defaultDurationSelect.value = settings.defaultDuration;
        }
        
        const defaultMethodSelect = document.getElementById('default-method');
        if (defaultMethodSelect) {
            defaultMethodSelect.value = settings.defaultMethod;
        }
        
        // Set other checkboxes
        document.getElementById('auto-start-timers').checked = settings.autoStartTimers;
        document.getElementById('sound-notifications').checked = settings.soundNotifications;
        document.getElementById('desktop-notifications').checked = settings.desktopNotifications;
        document.getElementById('save-history').checked = settings.saveHistory;
        
        // Set number inputs
        document.getElementById('pomodoro-work').value = settings.pomodoroWork;
        document.getElementById('pomodoro-break').value = settings.pomodoroBreak;
        document.getElementById('pomodoro-long-break').value = settings.pomodoroLongBreak;
        
        // Apply dark mode if enabled
        if (settings.darkMode) {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
    }
    
    // Function to save settings
    function saveSettings() {
        const settings = {
            showTips: document.getElementById('show-tips').checked,
            darkMode: document.getElementById('dark-mode').checked,
            defaultDuration: document.getElementById('default-duration').value,
            defaultMethod: document.getElementById('default-method').value,
            autoStartTimers: document.getElementById('auto-start-timers').checked,
            pomodoroWork: parseInt(document.getElementById('pomodoro-work').value),
            pomodoroBreak: parseInt(document.getElementById('pomodoro-break').value),
            pomodoroLongBreak: parseInt(document.getElementById('pomodoro-long-break').value),
            soundNotifications: document.getElementById('sound-notifications').checked,
            desktopNotifications: document.getElementById('desktop-notifications').checked,
            saveHistory: document.getElementById('save-history').checked
        };
        
        // Save to localStorage
        localStorage.setItem('studyAssistSettings', JSON.stringify(settings));
        
        // Apply dark mode if changed
        if (settings.darkMode) {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
    }
    
    // Function to get settings
    function getSettings() {
        const storedSettings = localStorage.getItem('studyAssistSettings');
        
        if (storedSettings) {
            try {
                const parsedSettings = JSON.parse(storedSettings);
                // Return stored settings with defaults for any missing properties
                return { ...defaultSettings, ...parsedSettings };
            } catch (error) {
                console.error('Error parsing settings:', error);
                return defaultSettings;
            }
        }
        
        return defaultSettings;
    }
    
    // Function to clear all data
    function clearAllData() {
        // Clear session history
        if (window.SessionData) {
            window.SessionData.clearAllSessions();
        } else {
            localStorage.removeItem('studyAssistSessions');
            localStorage.removeItem('studySessions'); // For legacy data
            localStorage.removeItem('guidedSessions'); // For legacy data
        }
        
        // Clear settings
        localStorage.removeItem('studyAssistSettings');
        
        // Do not clear login information
    }
});

// Add a global function to get settings from other JS files
window.getStudyAssistSettings = function() {
    const defaultSettings = {
        showTips: true,
        darkMode: false,
        defaultDuration: '30',
        defaultMethod: 'pomodoro',
        autoStartTimers: false,
        pomodoroWork: 25,
        pomodoroBreak: 5,
        pomodoroLongBreak: 15,
        soundNotifications: true,
        desktopNotifications: true,
        saveHistory: true
    };
    
    const storedSettings = localStorage.getItem('studyAssistSettings');
    
    if (storedSettings) {
        try {
            const parsedSettings = JSON.parse(storedSettings);
            return { ...defaultSettings, ...parsedSettings };
        } catch (error) {
            console.error('Error parsing settings:', error);
            return defaultSettings;
        }
    }
    
    return defaultSettings;
};
