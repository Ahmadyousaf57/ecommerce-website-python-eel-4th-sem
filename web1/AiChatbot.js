document.addEventListener('DOMContentLoaded', function() {
    const chatContainer = document.getElementById('chat-container');
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button');
    const typingIndicator = document.getElementById('typing-indicator');
    const aiChatContainer = document.getElementById('aiChatContainer');
    const aiChatbotIcon = document.getElementById('aiChatbotIcon');
    const closeAIChat = document.getElementById('closeAIChat');

    // Initialize with welcome message
    addMessage('bot', "Hello! I'm your AI shopping assistant. How can I help you today?");

    // Toggle chat visibility
    aiChatbotIcon.addEventListener('click', function() {
        aiChatContainer.classList.toggle('active');
    });

    closeAIChat.addEventListener('click', function() {
        aiChatContainer.classList.remove('active');
    });

    // Function to add a message to the chat
    function addMessage(role, content) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message');
        messageDiv.classList.add(role + '-message');
        messageDiv.textContent = content;
        chatContainer.insertBefore(messageDiv, typingIndicator);
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }

    // Function to send message to backend
    async function sendMessage() {
        const message = userInput.value.trim();
        if (!message) return;

        // Add user message to chat
        addMessage('user', message);
        userInput.value = '';

        // Show typing indicator
        typingIndicator.style.display = 'flex';
        chatContainer.scrollTop = chatContainer.scrollHeight;

        try {
            // Send message to Python backend via Eel
            const response = await eel.handle_chat_message(message)();
            
            if (response.status === 'success') {
                addMessage('bot', response.response);
            } else {
                throw new Error(response.response);
            }
        } catch (error) {
            console.error('Error:', error);
            addMessage('bot', 'Sorry, there was an error processing your request: ' + error.message);
        } finally {
            // Hide typing indicator
            typingIndicator.style.display = 'none';
        }
    }

    // Event listeners
    sendButton.addEventListener('click', sendMessage);
    userInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
});