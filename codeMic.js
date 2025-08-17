const micButton = document.getElementById('mic-button');

//# Voice Recognition Setup
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let voiceSupported = false;

console.log('Voice button element:', micButton);
console.log('SpeechRecognition available:', !!SpeechRecognition);
console.log('Protocol:', window.location.protocol);
console.log('Browser:', navigator.userAgent);

function initVoiceRecognition() {
    if (SpeechRecognition) {
    voiceSupported = true;
    console.log('Voice recognition supported');
    
    try {
        recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';
        recognition.maxAlternatives = 1;
    
    recognition.onstart = function() {
        isRecording = true;
        micButton.classList.add('recording');
        micButton.innerHTML = '🔴';
        micButton.title = 'Recording... Click to stop';
        console.log('Started listening');
    };
    
    recognition.onresult = function(event) {
        let finalTranscript = '';
        let interimTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) { 
            finalTranscript += transcript;
            console.log('Final transcript:', transcript, 'Confidence:', event.results[i][0].confidence);
        } else {
            interimTranscript += transcript;
            console.log('Interim transcript:', transcript);
        }
        }
        
        if (finalTranscript) { 
        const currentText = userInput.value.trim();
        if (currentText) {
            userInput.value = currentText + ' ' + finalTranscript + ' ';
        } else {
            userInput.value = finalTranscript + ' ';
        }
        userInput.focus(); 
        }
    };
    
    recognition.onerror = function(event) {
        console.error('Voice recognition error:', event.error);
        resetMicButton();
        
        switch(event.error) {
        case 'not-allowed':
            alert('Microphone access denied. Please allow microphone access and try again.');
            break;
        case 'no-speech':
            // Don't show alert for no-speech, just reset silently
            console.log('No speech detected, resetting mic button');
            break;
        case 'aborted':
            // User stopped recording, don't show error
            return;
        case 'network':
            console.error('Network error details:', event);
            alert('Network error occurred. Please check your internet connection and try again.\n\nNote: Voice recognition requires an active internet connection.');
            break;
        case 'service-not-allowed':
            alert('Speech recognition service is not allowed. Please check your browser settings and internet connection.');
            break;
        case 'bad-grammar':
            alert('Speech recognition grammar error. Please try speaking again.');
            break;
        default:
            console.error('Unknown speech recognition error:', event.error, event);
            alert('Speech recognition error: ' + event.error + '\n\nPlease try again or check your internet connection.');
        }
    };
    
    recognition.onend = function() {
        if (isRecording) {
        resetMicButton();
        }
    };
    
    } catch (error) {
        console.error('Error initializing speech recognition:', error);
        voiceSupported = false;
        if (micButton) {
        micButton.style.display = 'none';
        }
    }
    } else {
    console.log('Speech recognition not supported in this browser');
    if (micButton) {
        micButton.style.display = 'none';
        console.log('Voice button hidden due to no support');
    }
    }
}

function startVoiceRecognition() {
    if (recognition && voiceSupported && !isRecording) {
    // Check if online
    if (!navigator.onLine) {
        alert('You are offline. Voice recognition requires an internet connection.');
        return;
    }
    
    // Prevent rapid successive calls
    const now = Date.now();
    if (now - lastStartTime < minInterval) {
        console.log('Too soon to restart voice recognition, waiting...');
        return;
    }
    lastStartTime = now;
    
    try {
        console.log('Starting voice recognition');
        recognition.start();
    } catch (error) {
        console.error('Could not start voice recognition:', error);
        if (error.name === 'InvalidStateError') {
        alert('Voice recognition is already active. Please wait a moment and try again.');
        } else {
        alert('Could not start voice recognition: ' + error.message);
        }
    }
    }
}

function stopVoiceRecognition() {
    if (recognition && isRecording) {
    console.log('Stopping voice recognition');
    recognition.stop();
    resetMicButton();
    }
}

function resetMicButton() {
    isRecording = false;
    micButton.classList.remove('recording');
    micButton.innerHTML = '🎤';
    micButton.title = 'Voice Input';
}

function toggleVoiceRecognition() {
    console.log('Voice button clicked! isRecording:', isRecording);
    if (!recognition || !voiceSupported) {
    alert('Speech recognition is not supported in your browser. Please use Chrome, Edge, or Safari.');
    return;
    }
    
    if (isRecording) {
    stopVoiceRecognition();
    } else {
    startVoiceRecognition();
    }
}

// Initialize voice recognition first
initVoiceRecognition();

// Add network status listeners
window.addEventListener('online', function() {
    console.log('Internet connection restored');
    if (micButton && voiceSupported) {
    micButton.style.opacity = '1';
    micButton.title = 'Voice Input';
    }
});

window.addEventListener('offline', function() {
    console.log('Internet connection lost');
    if (micButton) {
    micButton.style.opacity = '0.5';
    micButton.title = 'Voice Input (requires internet connection)';
    }
    if (isRecording) {
    stopVoiceRecognition();
    }
});

// Set up event listener
console.log('Setting up voice button event listener...');
console.log('Voice button exists:', !!micButton);
console.log('Voice supported:', voiceSupported);

if (micButton) {
    if (voiceSupported) {
    console.log('Adding click event listener to voice button');
    micButton.addEventListener('click', toggleVoiceRecognition);
    } else {
    console.log('Voice not supported, adding fallback handler');
    micButton.style.opacity = '0.5';
    micButton.title = 'Voice input not supported in this browser';
    micButton.style.cursor = 'not-allowed';
    micButton.addEventListener('click', function() {
        console.log('Voice button clicked but not supported');
        alert('Voice input is not supported in this browser. Please use Chrome, Edge, or Safari.');
    });
    }
} else {
    console.error('Mic button not found!');
}