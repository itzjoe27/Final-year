// attempt at dynamically updating user on each screen, might not finish due to time constriction.
function updateUserDetails() {
    const userData = JSON.parse(localStorage.getItem('studyAssistUser') || '{}');
    
    const userNameElements = document.querySelectorAll('#user-name');
    userNameElements.forEach(el => {
        el.textContent = userData.name || 'User';
    });
    
    const userEmailElements = document.querySelectorAll('#user-email');
    userEmailElements.forEach(el => {
        el.textContent = userData.email || 'user@example.com';
    });
}

document.addEventListener('DOMContentLoaded', updateUserDetails);