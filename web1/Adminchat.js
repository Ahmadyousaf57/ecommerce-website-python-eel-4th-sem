// DOM elements
const chatIcon = document.getElementById('chatIcon');
const chatContainer = document.getElementById('chatContainer');
const closeChat = document.getElementById('closeChat');
const customerList = document.getElementById('customerList');
const chatMessages = document.getElementById('chatMessages');
const noConversation = document.getElementById('noConversation');
const chatInputArea = document.getElementById('chatInputArea');
const messageInput = document.getElementById('messageInput');
const sendBtn = document.getElementById('sendBtn');
const unreadCount = document.getElementById('unreadCount');

// State
let currentUser = null;
let currentCustomer = null;
let chatOpen = false;
let pollInterval = null;
let unreadMessages = {};

// Update the initChat function to get admin details
async function initChat() {
    try {
        // Get admin details from database using stored email
        const adminEmail = localStorage.getItem('userEmail');
        if (!adminEmail) {
            console.error("Admin email not found");
            return;
        }
        
        const admin = await eel.get_user_by_email(adminEmail)();
        if (!admin) {
            console.error("Admin not found in database");
            return;
        }
        
        currentUser = {
            id: admin.SUserID,
            name: admin.SIGN_UP_Name,
            email: admin.SIGN_UP_Email
        };
        
        // Set admin name display
        if (adminNameDisplay) {
            adminNameDisplay.textContent = currentUser.name;
        }
        
        // Load initial conversations
        await loadConversations();
        
        // Start polling for new messages
        startPolling();
    } catch (error) {
        console.error("Error initializing chat:", error);
    }
}
const adminNameDisplay = document.getElementById('adminNameDisplay');
// Toggle chat window
function toggleChat() {
    chatOpen = !chatOpen;
    chatContainer.style.display = chatOpen ? 'flex' : 'none';
    
    if (chatOpen) {
        // Update unread counts when opening chat
        updateUnreadCounts();
    }
}

// Start polling for messages
function startPolling() {
    if (pollInterval) clearInterval(pollInterval);
    pollInterval = setInterval(async () => {
        await loadConversations();
        if (currentCustomer) {
            await loadMessages(currentCustomer.id);
        }
    }, 2000); // Poll every 2 seconds
}

// Load list of conversations
async function loadConversations() {
    if (!currentUser) return;
    
    try {
        const conversations = await eel.get_conversations(currentUser.id)();
        const counts = await eel.get_unread_counts(currentUser.id)();
        
        unreadMessages = counts || {};
        renderConversations(conversations);
        updateUnreadCounts();
    } catch (error) {
        console.error('Error loading conversations:', error);
    }
}

// Render conversations to sidebar
function renderConversations(conversations) {
    customerList.innerHTML = '';
    
    if (conversations.length === 0) {
        customerList.innerHTML = '<div class="no-conversations">No conversations yet</div>';
        return;
    }
    
    conversations.forEach(customer => {
        const customerItem = document.createElement('div');
        customerItem.classList.add('customer-item');
        customerItem.setAttribute('data-customer-id', customer.id);
        
        if (currentCustomer && currentCustomer.id === customer.id) {
            customerItem.classList.add('active');
        }
        
        const unread = unreadMessages[customer.id] || 0;
        
        customerItem.innerHTML = `
            <div class="customer-avatar">${customer.name.charAt(0).toUpperCase()}</div>
            <div class="customer-info">
                <div class="customer-name">${customer.name}</div>
                <div class="customer-last-msg">Click to chat</div>
            </div>
            ${unread > 0 ? `<div class="unread-badge">${unread}</div>` : ''}
        `;
        
        customerItem.addEventListener('click', () => selectCustomer(customer));
        customerList.appendChild(customerItem);
    });
}

// Select customer to chat with
function selectCustomer(customer) {
    currentCustomer = customer;
    
    // Update UI
    document.querySelectorAll('.customer-item').forEach(item => {
        item.classList.remove('active');
    });
    event.currentTarget.classList.add('active');
    
    // Load messages
    loadMessages(customer.id);
    
    // Show input area
    noConversation.style.display = 'none';
    chatInputArea.style.display = 'flex';
}

// Load messages for specific customer
async function loadMessages(customerId) {
    if (!currentUser || !customerId) return;
    
    try {
        const messages = await eel.get_messages(currentUser.id, customerId)();
        renderMessages(messages);
        
        // Clear unread count for this customer
        if (unreadMessages[customerId]) {
            delete unreadMessages[customerId];
            updateUnreadCounts();
        }
    } catch (error) {
        console.error('Error loading messages:', error);
    }
}
// Modify the renderMessages function to always show admin name for admin messages
function renderMessages(messages) {
    chatMessages.innerHTML = '';
    
    if (messages.length === 0) {
        chatMessages.innerHTML = '<div class="no-messages">No messages yet</div>';
        return;
    }
    
    messages.forEach(msg => {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message');
        
        // Determine if message is from admin (current user) or customer
        if (msg.sender_id === currentUser.id) {
            messageDiv.classList.add('admin-message');
            // Use admin's actual name from currentUser
            msg.sender_name = currentUser.name;
        } else {
            messageDiv.classList.add('customer-message');
        }
        
        messageDiv.innerHTML = `
            <div class="message-info">
                <span class="sender-name">${msg.sender_name}</span>
                <span class="message-time">${formatTime(msg.timestamp)}</span>
            </div>
            <div class="message-text">${msg.text}</div>
        `;
        
        chatMessages.appendChild(messageDiv);
    });
    
    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
}
// // Render messages to chat area
// function renderMessages(messages) {
//     chatMessages.innerHTML = '';
    
//     if (messages.length === 0) {
//         chatMessages.innerHTML = '<div class="no-messages">No messages yet</div>';
//         return;
//     }
    
//     messages.forEach(msg => {
//         const messageDiv = document.createElement('div');
//         messageDiv.classList.add('message');
//         messageDiv.classList.add(msg.sender_id === currentUser.id ? 'admin-message' : 'customer-message');
        
//         messageDiv.innerHTML = `
//             <div class="message-info">
//                 <span class="sender-name">${msg.sender_name}</span>
//                 <span class="message-time">${formatTime(msg.timestamp)}</span>
//             </div>
//             <div class="message-text">${msg.text}</div>
//         `;
        
//         chatMessages.appendChild(messageDiv);
//     });
    
//     // Scroll to bottom
//     chatMessages.scrollTop = chatMessages.scrollHeight;
// }

// Format time for display
function formatTime(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
}

// Send message to customer
async function sendMessage() {
    const message = messageInput.value.trim();
    
    if (message && currentUser && currentCustomer) {
        try {
            const success = await eel.send_message(currentUser.id, currentCustomer.id, message)();
            
            if (success) {
                messageInput.value = '';
                await loadMessages(currentCustomer.id); // Refresh messages
            }
        } catch (error) {
            console.error('Error sending message:', error);
        }
    }
}

// Update unread message counts
function updateUnreadCounts() {
    // Update sidebar badges
    document.querySelectorAll('.customer-item').forEach(item => {
        const customerId = item.getAttribute('data-customer-id');
        if (customerId && unreadMessages[customerId]) {
            const badge = item.querySelector('.unread-badge') || document.createElement('div');
            badge.className = 'unread-badge';
            badge.textContent = unreadMessages[customerId];
            if (!item.querySelector('.unread-badge')) {
                item.appendChild(badge);
            }
        } else {
            const badge = item.querySelector('.unread-badge');
            if (badge) badge.remove();
        }
    });
    
    // Update main unread count
    const totalUnread = Object.values(unreadMessages).reduce((sum, count) => sum + count, 0);
    if (totalUnread > 0 && !chatOpen) {
        unreadCount.textContent = totalUnread;
        unreadCount.style.display = 'flex';
    } else {
        unreadCount.style.display = 'none';
    }
}

// Event listeners
chatIcon.addEventListener('click', toggleChat);
closeChat.addEventListener('click', toggleChat);
sendBtn.addEventListener('click', sendMessage);
messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
});

// Initialize when admin logs in
// Call this after admin logs in with the admin user object
// Example: 
 const adminUser = { id: adminIdFromDatabase, name: "Admin" };
 initChat(adminUser);