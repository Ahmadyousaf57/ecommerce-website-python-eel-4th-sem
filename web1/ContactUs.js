document.addEventListener('DOMContentLoaded', function() {
    const feedbackForm = document.getElementById('feedbackForm');
    
    console.log("Feedback form element:", feedbackForm); // Debug
    
    feedbackForm.addEventListener('submit', function(e) {
        e.preventDefault();
        console.log("Form submitted"); // Debug
        
        const feedbackData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            subject: document.getElementById('subject').value,
            message: document.getElementById('message').value,
            rating: document.querySelector('input[name="rating"]:checked')?.value || 0
        };
        // Add this before the eel.submit_feedback call
        if (!feedbackData.name || !feedbackData.email || !feedbackData.subject || !feedbackData.message) {
            alert('Please fill in all required fields');
            return;
        }
        console.log("Feedback data to send:", feedbackData); // Debug
        
        eel.submit_feedback(feedbackData)(function(response) {
            console.log("Server response:", response); // Debug
            if (response.success) {
                alert('Thank you for your feedback!');
                feedbackForm.reset();
                document.querySelectorAll('input[name="rating"]').forEach(radio => {
                    radio.checked = false;
                });
            } else {
                alert('There was an error submitting your feedback. Please try again.');
            }
        });
    });
});
eel.test_connection()(function(response) { console.log(response); });