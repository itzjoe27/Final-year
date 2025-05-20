/**
 * Study Assist Web App - Settings JavaScript
 * 
 * This file contains functionality for the settings page
 */

document.addEventListener('DOMContentLoaded', () => {
    // Get settings elements
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    const showTipsToggle = document.getElementById('show-tips-toggle');
    const clearDataBtn = document.getElementById('clear-data-btn');
    
    // Load current settings
    loadSettings();
    
    // Handle dark mode toggle
    if (darkModeToggle) {
        darkModeToggle.addEventListener('change', () => {
            const isDarkMode = darkModeToggle.checked;
            document.body.classList.toggle('dark-mode', isDarkMode);
            localStorage.setItem('darkMode', isDarkMode);
        });
    }
    
    // Handle show tips toggle
    if (showTipsToggle) {
        showTipsToggle.addEventListener('change', () => {
            localStorage.setItem('showTips', showTipsToggle.checked);
        });
    }
    
    // Handle clear data
    if (clearDataBtn) {
        clearDataBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to clear all your data? This action cannot be undone.')) {
                // Store the login state and settings before clearing
                const isLoggedIn = localStorage.getItem('studyAssistLoggedIn');
                const userData = localStorage.getItem('studyAssistUser');
                const darkModeSetting = localStorage.getItem('darkMode');
                const showTipsSetting = localStorage.getItem('showTips');
                
                // Clear all data
                localStorage.clear();
                
                // Restore login state and settings
                if (isLoggedIn) {
                    localStorage.setItem('studyAssistLoggedIn', isLoggedIn);
                }
                if (userData) {
                    localStorage.setItem('studyAssistUser', userData);
                }
                if (darkModeSetting) {
                    localStorage.setItem('darkMode', darkModeSetting);
                }
                if (showTipsSetting) {
                    localStorage.setItem('showTips', showTipsSetting);
                }
                
                alert('All study session data has been cleared.');
            }
        });
    }
    
    // Load settings function
    function loadSettings() {
        // Load dark mode setting
        if (darkModeToggle) {
            const isDarkMode = localStorage.getItem('darkMode') === 'true';
            darkModeToggle.checked = isDarkMode;
        }
        
        // Load show tips setting
        if (showTipsToggle) {
            const showTips = localStorage.getItem('showTips') !== 'false'; // Default to true
            showTipsToggle.checked = showTips;
        }
    }
});