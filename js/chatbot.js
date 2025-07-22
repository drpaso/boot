const API_URL = '/api/chat';

function toggleChat() {
    const chatWindow = document.getElementById('chatbotWindow');
    chatWindow.style.display = chatWindow.style.display === 'flex' ? 'none' : 'flex';
}

async function sendMessage() {
    const userInput = document.getElementById('userInput');
    const message = userInput.value.trim();
    if (message) {
        // Add user message
        addMessage(message, 'user');
        userInput.value = '';

        try {
            // Show loading indicator
            const loadingMessage = addMessage('Pensando...', 'bot');
            loadingMessage.style.opacity = '0.5';

            // Make API call to our backend
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ message })
            });

            // Remove loading indicator
            loadingMessage.remove();

            if (!response.ok) {
                throw new Error('Error en la respuesta del servidor');
            }

            const data = await response.json();
            addMessage(data.response, 'bot');
        } catch (error) {
            console.error('Error:', error);
            addMessage('Lo siento, ha ocurrido un error. Por favor, intenta nuevamente.', 'bot');
        }
    }
}

function addMessage(text, sender) {
    const messagesDiv = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;
    messageDiv.textContent = text;
    messagesDiv.appendChild(messageDiv);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
    return messageDiv;
}

// Allow sending message with Enter key
document.addEventListener('DOMContentLoaded', function() {
    const userInput = document.getElementById('userInput');
    if (userInput) {
        userInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }
}); 