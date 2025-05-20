// The javascript for making the settings work

document.addEventListener('DOMContentLoaded', () => {
// getting the settnings
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    const showTipsToggle = document.getElementById('show-tips-toggle');
    const clearDataBtn = document.getElementById('clear-data-btn');
        loadSettings();
    
    if (darkModeToggle) {
        darkModeToggle.addEventListener('change', () => {
            const isDarkMode = darkModeToggle.checked;
            document.body.classList.toggle('dark-mode', isDarkMode);
            localStorage.setItem('darkMode', isDarkMode);
        });
    }
    
    if (showTipsToggle) {
        showTipsToggle.addEventListener('change', () => {
            localStorage.setItem('showTips', showTipsToggle.checked);
        });
    }
    
    // clearing user data
    if (clearDataBtn) {
        clearDataBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to clear all your data? This action cannot be undone.')) {
                // For keeping user logged in after clearing
                const isLoggedIn = localStorage.getItem('studyAssistLoggedIn');
                const userData = localStorage.getItem('studyAssistUser');
                const darkModeSetting = localStorage.getItem('darkMode');
                const showTipsSetting = localStorage.getItem('showTips');
                
                // should be clearing all the data - not too sure
                localStorage.clear();
                
                // re-login and keep setting presets
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