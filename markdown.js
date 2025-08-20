// Lines 78-109: Main markdown rendering function
function renderMarkdownWithHighlighting(content) {
  try {
    if (typeof marked === 'undefined') return content;
    // Line 81: Configure marked.js with options
    marked.setOptions({ breaks: true, gfm: true, sanitize: false, smartLists: true, smartypants: true, headerIds: false, mangle: false });
    
    // Line 83: Parse markdown to HTML
    const rendered = marked.parse(content);
    const temp = document.createElement('div');
    temp.innerHTML = rendered;
    
    // Lines 87-103: Apply syntax highlighting and copy buttons
    if (typeof Prism !== 'undefined') {
      temp.querySelectorAll('pre code').forEach(block => {
        Prism.highlightElement(block);  // Line 89: Apply syntax highlighting
        // Lines 90-102: Add copy-to-clipboard buttons
      });
    }
    
    return temp.innerHTML;  // Line 105: Return processed HTML
  } catch (error) {
    return content;  // Line 107: Fallback to plain text
  }
}

function addMessage(content, isUser = false, timestamp = null, model, isImage = false, skipHistory = false) {
      const message = document.createElement('div');
      message.classList.add('chatbot-message', isUser ? 'user' : 'bot');

      if (!isImage) {
        if (!isUser && typeof content === 'string') {
          message.innerHTML = renderMarkdownWithHighlighting(content);
        } else {
          message.textContent = content;
        }
      }

      const isErrorMsg = typeof content === 'string' && content.trim().startsWith('Sorry, an error occurred');

      if (isImage && !isUser && !isErrorMsg) {
        const img = document.createElement('img');
        img.src = `data:image/png;base64,${content}`;
        img.alt = 'Generated image';
        img.classList.add('chatbot-image');
        img.style.maxWidth = '100%';
        img.style.marginTop = '10px';
        message.appendChild(img);
      } else if (isImage){
        message.textContent = "Image generation failed. Please try again.";
      }

      if (timestamp) {
        const date = new Date(timestamp);
        const timeString = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
        const dateString = formatDateYYYYMMDD(date);//formatSmartDate(date);
        let info = `${timeString}, ${dateString}`;
        if (model) {
          info += `, ${model}`;
        }

        const timeDiv = document.createElement('div');
        timeDiv.classList.add('chatbot-message-time');
        timeDiv.textContent = info;
        message.appendChild(timeDiv);
      }

      messagesDiv.appendChild(message);
      messagesDiv.scrollTop = messagesDiv.scrollHeight;

      if (!isImage && !skipHistory) {
        if (!isUser) {
          chatHistory.push(content);
        } else {
          userHistory.push(content);
        }
      }
    }

    setTimeout(() => {
      const welcomeMessage = `# 🎉 TEST

This chatbot now supports **full markdown rendering** for AI responses. Here are some examples:

## ✨ Text Formatting
- **Bold text** and *italic text*
- ~~Strikethrough~~ and \`inline code\`
- [Links work too!](https://example.com)

## 📋 Lists & Organization
1. **Numbered lists** work perfectly
2. You can have nested items:
   - Bullet points
   - Sub-items with **formatting**
   - Multiple levels

## 💻 Code Examples
Here's some JavaScript:
\`\`\`javascript
function greetUser(name) {
  console.log(\`Hello, \${name}! 👋\`);
  return { success: true };
}
\`\`\`

## 📊 Tables
| Feature | Status | Notes |
|---------|--------|-------|
| Headers | ✅ | All 6 levels |
| Lists | ✅ | Ordered & unordered |
| Code | ✅ | Syntax highlighting |
| Tables | ✅ | Full support |
| Links | ✅ | Clickable |

## 💡 Tips
> **Try asking the AI to respond with markdown!** 
> 
> Example: "Create a markdown guide for JavaScript basics"

Ready to chat with markdown support! 🚀`;

      addMessage(welcomeMessage, false, new Date(), 'System', false, true);
    }, 1000);