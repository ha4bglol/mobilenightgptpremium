let currentSeed = Math.floor(Math.random() * 10000);
let isGenerating = false; // Flag to track image generation status

if (localStorage.getItem('termsConfirmed')) {
    document.getElementById('content').style.filter = 'none';
    document.getElementById('content').style.pointerEvents = 'auto';
    document.getElementById('overlay').style.display = 'none';
    document.getElementById('sendButton').disabled = false;
}

document.getElementById('imageForm').addEventListener('submit', function(event) {
    event.preventDefault();
    if (!isGenerating) {
        handleUserMessage();
    }
});

document.getElementById('confirmButton').addEventListener('click', function() {
    document.getElementById('content').style.filter = 'none';
    document.getElementById('content').style.pointerEvents = 'auto';
    document.getElementById('overlay').style.display = 'none';
    document.getElementById('sendButton').disabled = false;
    localStorage.setItem('termsConfirmed', 'true');
});

document.getElementById('menuButton').addEventListener('click', () => {
    const menu = document.getElementById('menu');
    const username = localStorage.getItem('username');
    menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
    if (username) {
        document.getElementById('userSection').innerHTML = `<p>Welcome, ${username}</p>`;
    }
});

document.getElementById('loginButton').addEventListener('click', () => {
    document.getElementById('loginForm').style.display = 'block';
});

document.getElementById('signupButton').addEventListener('click', () => {
    const username = generateRandomUsername();
    const password = generateStrongPassword();
    document.getElementById('generatedAccount').innerText = `Username: ${username}\nPassword: ${password}`;
    document.getElementById('signupInfo').style.display = 'block';
    localStorage.setItem('generatedUsername', username);
    localStorage.setItem('generatedPassword', password);
});

document.getElementById('confirmAccount').addEventListener('click', () => {
    document.getElementById('signupInfo').style.display = 'none';
});

document.getElementById('submitLogin').addEventListener('click', () => {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const storedUsername = localStorage.getItem('generatedUsername');
    const storedPassword = localStorage.getItem('generatedPassword');
    
    if (username === storedUsername && password === storedPassword) {
        localStorage.setItem('username', username);
        document.getElementById('loginForm').style.display = 'none';
    } else {
        alert('Invalid login credentials');
    }
});

function handleUserMessage() {
    const promptInput = document.getElementById('prompt');
    const prompt = promptInput.value.trim(); // Trim spaces
    if (prompt) {
        addMessage(prompt, 'user');
        promptInput.value = '';
        // Simulate bot response delay
        setTimeout(() => {
            startImageGeneration(prompt);
        }, 1000);
    }
}

function addMessage(message, sender) {
    const chatContainer = document.getElementById('chatContainer');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;
    messageDiv.textContent = message;
    chatContainer.appendChild(messageDiv);
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

function startImageGeneration(prompt) {
    isGenerating = true; // Set the flag to indicate generation in progress
    document.getElementById('sendButton').disabled = true; // Disable the send button

    const randomDelay = Math.floor(Math.random() * 0) + 5; // Random delay between 10 and 50 seconds

    const countdownTimer = document.createElement('div');
    countdownTimer.className = 'timer';
    let timeLeft = randomDelay;
    countdownTimer.textContent = `Image will be ready in ${timeLeft} seconds...`;

    const countdownInterval = setInterval(() => {
        timeLeft--;
        if (timeLeft <= 0) {
            clearInterval(countdownInterval);
            countdownTimer.textContent = 'Image is ready please wait...';
            generateImage(prompt);
        } else {
            countdownTimer.textContent = `Image will be ready in ${timeLeft} seconds...`;
        }
    }, 1000);

    addMessage('Generating image...', 'bot');
    const chatContainer = document.getElementById('chatContainer');
    chatContainer.appendChild(countdownTimer);
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

function generateImage(prompt) {
    currentSeed = Math.floor(Math.random() * 10000); // Change seed before generating image
    const width = document.getElementById('width').value || '1024';
    const height = document.getElementById('height').value || '1024';

    const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=${width}&height=${height}&seed=${currentSeed}&nologo=true`;

    const image = new Image();
    image.src = imageUrl;
    image.alt = prompt;
    image.onload = () => {
        const chatContainer = document.getElementById('chatContainer');
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message bot-message';
        messageDiv.appendChild(image);

        const regenerateButton = document.createElement('button');
        regenerateButton.textContent = 'Regenerate (10 seconds)';
        regenerateButton.className = 'regenerate-button';
        regenerateButton.addEventListener('click', function() {
            if (!isGenerating) {
                currentSeed = Math.floor(Math.random() * 10000); // Change seed before regenerating image
                generateImage(prompt);
            }
        });

        messageDiv.appendChild(regenerateButton);
        chatContainer.appendChild(messageDiv);
        chatContainer.scrollTop = chatContainer.scrollHeight;

        // Reset the flag and re-enable the send button after image is loaded
        isGenerating = false;
        document.getElementById('sendButton').disabled = false;
    };
}

function generateRandomUsername() {
    const adjectives = ['Swift', 'Silent', 'Crimson', 'Golden', 'Mighty'];
    const nouns = ['Falcon', 'Tiger', 'Dragon', 'Phoenix', 'Leopard'];
    return adjectives[Math.floor(Math.random() * adjectives.length)] + nouns[Math.floor(Math.random() * nouns.length)];
}

function generateStrongPassword() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
    let password = '';
    for (let i = 0; i < 12; i++) {
        password += chars[Math.floor(Math.random() * chars.length)];
    }
    return password;
}





