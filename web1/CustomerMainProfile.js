document.addEventListener('DOMContentLoaded', async function() {
    // Get the email from localStorage that was set during login
    const userEmail = localStorage.getItem('userEmail');
    
    if (userEmail) {
        try {
            // Get user details from database
            const userData = await eel.get_user_by_email1(userEmail)();
            
            if (userData) {
                // Display user name
                const userNameDisplay = document.getElementById('userNameDisplay');
                if (userNameDisplay) {
                    userNameDisplay.textContent = userData.SIGN_UP_Name;
                }
                
                // Handle profile picture
                const userProfilePic = document.getElementById('userProfilePic');
                if (userProfilePic && userData.profilePic) {
                    userProfilePic.src = userData.profilePic;
                }
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    }
    
    // Add logout functionality
    const logoutLink = document.getElementById('logoutLink');
    if (logoutLink) {
        logoutLink.addEventListener('click', function(e) {
            e.preventDefault();
            localStorage.removeItem('userEmail');
            window.location.href = 'Main.html';
        });
    }
});