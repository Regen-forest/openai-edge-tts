const API_URL = 'http://localhost:5050';

// Load saved API key on startup
document.addEventListener('DOMContentLoaded', () => {
    chrome.storage.local.get(['apiKey'], (result) => {
        if (result.apiKey) {
            document.getElementById('apiKey').value = result.apiKey;
        }
    });

    // Update speed value display
    const speedSlider = document.getElementById('speedSlider');
    const speedValue = document.getElementById('speedValue');
    speedSlider.addEventListener('input', () => {
        speedValue.textContent = speedSlider.value;
    });
});

// Save API key
document.getElementById('saveKey').addEventListener('click', () => {
    const apiKey = document.getElementById('apiKey').value;
    chrome.storage.local.set({ apiKey }, () => {
        showStatus('API key saved!', 'success');
    });
});

// Generate speech
document.getElementById('generateBtn').addEventListener('click', async () => {
    const textInput = document.getElementById('textInput').value.trim();
    
    if (!textInput) {
        showStatus('Please enter some text', 'error');
        return;
    }

    const apiKey = document.getElementById('apiKey').value;
    const voice = document.getElementById('voiceSelect').value;
    const speed = parseFloat(document.getElementById('speedSlider').value);
    
    const generateBtn = document.getElementById('generateBtn');
    const audioPlayer = document.getElementById('audioPlayer');
    
    // Disable button and show loading
    generateBtn.disabled = true;
    showStatus('Generating speech...', 'loading');
    audioPlayer.style.display = 'none';

    try {
        const headers = {
            'Content-Type': 'application/json'
        };
        
        if (apiKey) {
            headers['Authorization'] = `Bearer ${apiKey}`;
        }

        const response = await fetch(`${API_URL}/v1/audio/speech`, {
            method: 'POST',
            headers: headers,            body: JSON.stringify({
                input: textInput,
                voice: voice,
                response_format: 'mp3',
                speed: speed
            })
        });

        if (response.ok) {
            const blob = await response.blob();
            const audioUrl = URL.createObjectURL(blob);
            
            audioPlayer.src = audioUrl;
            audioPlayer.style.display = 'block';
            audioPlayer.play();
            
            showStatus('Speech generated successfully!', 'success');
        } else {
            let errorMessage = 'Failed to generate speech';
            try {
                const errorData = await response.json();
                errorMessage = errorData.error || errorMessage;
            } catch (e) {
                // If response is not JSON, use default error message
            }
            showStatus(errorMessage, 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showStatus(`Error: ${error.message}`, 'error');
    } finally {
        generateBtn.disabled = false;
    }
});

// Show status message
function showStatus(message, type) {
    const statusDiv = document.getElementById('status');
    statusDiv.textContent = message;
    statusDiv.className = `status show ${type}`;
    
    if (type !== 'loading') {
        setTimeout(() => {
            statusDiv.className = 'status';
        }, 3000);
    }
}

// Optional: Add keyboard shortcut (Ctrl/Cmd + Enter to generate)
document.getElementById('textInput').addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        document.getElementById('generateBtn').click();
    }
});