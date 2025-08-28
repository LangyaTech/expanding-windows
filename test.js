// Two-Row Chatbot Input Layout JavaScript
// Ensure textarea expansion works with the new container layout
document.addEventListener('DOMContentLoaded', function() {
  const textarea = document.getElementById('chatbot-input-field');
  
  if (textarea) {
    // Override any conflicting styles that might prevent expansion
    textarea.style.height = 'auto';
    textarea.style.minHeight = '40px';
    textarea.style.maxHeight = '120px';
    
    // Function to handle expansion
    function handleExpansion() {
      // Reset height to get accurate scrollHeight
      textarea.style.height = 'auto';
      
      // Calculate new height
      const minHeight = 40;
      const maxHeight = 120;
      const scrollHeight = textarea.scrollHeight;
      
      let newHeight;
      if (textarea.value === '') {
        newHeight = minHeight;
      } else {
        newHeight = Math.max(minHeight, Math.min(scrollHeight, maxHeight));
      }
      
      textarea.style.height = newHeight + 'px';
    }
    
    // Add event listeners for expansion
    textarea.addEventListener('input', handleExpansion);
    textarea.addEventListener('paste', function() {
      setTimeout(handleExpansion, 0);
    });
    
    // Handle keydown events properly
    textarea.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' && e.shiftKey) {
        // Allow new line and trigger expansion
        setTimeout(handleExpansion, 0);
      } else if (e.key === 'Enter' && !e.shiftKey) {
        // Regular Enter should not expand (for form submission)
        return;
      } else {
        // Other keys should trigger expansion
        setTimeout(handleExpansion, 0);
      }
    });
    
    // Initial expansion
    handleExpansion();
  }
  
  // Handle storage mode selector changes to show/hide local folder display
  const storageModeSelector = document.getElementById('storage-mode-selector');
  const localFolderDisplay = document.getElementById('saveStatus');
  
  if (storageModeSelector && localFolderDisplay) {
    // Function to toggle local folder display visibility
    function toggleLocalFolderDisplay() {
      const selectedMode = storageModeSelector.value;
      if (selectedMode === 'local' || selectedMode === 'premiuml') {
        localFolderDisplay.style.display = 'flex';
      } else {
        localFolderDisplay.style.display = 'none';
      }
    }
    
    // Listen for storage mode changes
    storageModeSelector.addEventListener('change', toggleLocalFolderDisplay);
    
    // Initial check when page loads
    toggleLocalFolderDisplay();
  }
});
