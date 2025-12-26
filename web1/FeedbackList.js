// JS/FeedbackList.js

document.addEventListener('DOMContentLoaded', function() {
    const feedbackTable = document.getElementById('feedbackTable').getElementsByTagName('tbody')[0];
    const refreshBtn = document.getElementById('refreshBtn');
    
    function loadFeedback() {
        eel.get_feedback()(function(feedbackList) {
            feedbackTable.innerHTML = '';
            
            feedbackList.forEach(feedback => {
                const row = feedbackTable.insertRow();
                
                // Create star rating display
                let stars = '';
                for (let i = 0; i < 5; i++) {
                    stars += i < feedback.rating ? '★' : '☆';
                }
                
                row.innerHTML = `
                    <td>${feedback.id}</td>
                    <td>${feedback.name}</td>
                    <td>${feedback.email}</td>
                    <td>${feedback.subject}</td>
                    <td>${feedback.message}</td>
                    <td class="star-rating" title="${feedback.rating} stars">${stars}</td>
                    <td>${new Date(feedback.date).toLocaleDateString()}</td>
                `;
            });
        });
    }
    
    refreshBtn.addEventListener('click', loadFeedback);
    
    // Load data on page load
    loadFeedback();
});