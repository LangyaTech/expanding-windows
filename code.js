 // 20250816-v2: add adilk expanding window
    let userInput = document.getElementById('chatbot-input-field');
    function autoExpandTextarea() {
      console.log('autoExpandTextarea called, userInput:', userInput);
      if (!userInput) {
        console.error('userInput is not defined');
        return;
      }
      console.log('Current height:', userInput.style.height);
      console.log('ScrollHeight:', userInput.scrollHeight);
      userInput.style.height = 'auto';
      const newHeight = Math.min(userInput.scrollHeight, 150); // Max height of 150px
      userInput.style.height = newHeight + 'px';
      console.log('New height set to:', newHeight + 'px');
    }

    // Initialize textarea height
    autoExpandTextarea();    
    
    // Add a test button to manually trigger auto-expansion (for debugging)
    const testButton = document.createElement('button');
    testButton.textContent = 'Test Auto-Expand';
    testButton.style.position = 'fixed';
    testButton.style.top = '10px';
    testButton.style.right = '10px';
    testButton.style.zIndex = '9999';
    testButton.style.backgroundColor = 'red';
    testButton.style.color = 'white';
    testButton.addEventListener('click', function() {
      console.log('Manual test button clicked');
      autoExpandTextarea();
    });
    document.body.appendChild(testButton);    
    
    // Add debugging to check if userInput is properly selected
    console.log('userInput element:', userInput);
    console.log('userInput tagName:', userInput ? userInput.tagName : 'undefined');
    console.log('userInput is connected to DOM:', userInput ? userInput.isConnected : 'undefined');
    console.log('userInput value:', userInput ? userInput.value : 'undefined');
    
    // Verify the element exists and has the right properties
    if (!userInput) {
      console.error('ERROR: userInput element not found!');
    }
    
    // Test if event listeners can be attached at all
    userInput.addEventListener('focus', function() {
      console.log('Focus event triggered - event listeners are working!');
    });
    
    userInput.addEventListener('blur', function() {
      console.log('Blur event triggered');
    });

    console.log("AAAA");
    
    // Add event listeners for auto-expansion
    userInput.addEventListener('input', function() {
      console.log('Input event triggered');
      autoExpandTextarea();
      // Reset to initial size when empty
      if (this.value === '') {
        this.style.height = '20px';
      }
    });

    // Add keydown event listener (more reliable than keypress)
    userInput.addEventListener('keydown', function (e) {
      console.log('Keydown event triggered, key:', e.key, 'code:', e.code);
        // Allow auto-expansion for other keys and Shift+Enter
        console.log('Other key down, will auto-expand after delay:', e.key);
        setTimeout(function() {
          autoExpandTextarea();
        }, 0);
        autoExpandTextarea();
    });

    // Also add keyup event listener as backup
    userInput.addEventListener('keyup', function (e) {
      console.log('Keyup event triggered, key:', e.key);
      // Auto-expand on keyup for all keys
      setTimeout(function() {
        autoExpandTextarea();
      }, 0);
    });

    // Add paste event listener for auto-expansion
    userInput.addEventListener('paste', function() {
      console.log('Paste event triggered');
      setTimeout(function() {
        autoExpandTextarea();
      }, 0);
    });