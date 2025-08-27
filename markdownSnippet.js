function renderMarkdownWithHighlighting(content) {
      try {
        if (typeof marked === 'undefined') return content;
        marked.setOptions({ breaks: true, gfm: true, sanitize: false, smartLists: true, smartypants: true, headerIds: false, mangle: false });
        
        const rendered = marked.parse(content);
        const temp = document.createElement('div');
        temp.innerHTML = rendered;
        if (typeof Prism !== 'undefined') {
          temp.querySelectorAll('pre code').forEach(block => {
            Prism.highlightElement(block);
            const pre = block.parentElement;
            if (!pre.querySelector('.copy-code-btn')) {
              const btn = document.createElement('button');
              btn.className = 'copy-code-btn';
              btn.textContent = 'Copy';
              btn.onclick = async () => {
                try {
                  await navigator.clipboard.writeText(block.textContent);
                  btn.textContent = 'Copied!';
                  setTimeout(() => btn.textContent = 'Copy', 2000);
                } catch { btn.textContent = 'Failed'; setTimeout(() => btn.textContent = 'Copy', 2000); }
              };
              pre.style.position = 'relative';
              pre.appendChild(btn);
            }
          });
        }
        
        return temp.innerHTML;
      } catch (error) {
        return content;
      }
    }