document.addEventListener('DOMContentLoaded', () => {
  const outputBox = document.getElementById('outputBox');
  const questionInput = document.getElementById('questionInput');

  function getTranscriptAndSend(action, extra = {}) {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { action: 'get_transcript' }, (response) => {
        if (chrome.runtime.lastError || !response) {
          outputBox.value = 'Transcript not found or content script not loaded.';
          return;
        }

        const message = { action, transcript: response.transcript, ...extra };

        chrome.runtime.sendMessage(message, (reply) => {
          outputBox.value = reply || 'No response from Groq API.';
        });
      });
    });
  }

  document.getElementById('summarizeBtn').onclick = () => getTranscriptAndSend('summarize');
  document.getElementById('flashcardsBtn').onclick = () => getTranscriptAndSend('flashcards');
  document.getElementById('askBtn').onclick = () => {
    const question = questionInput.value;
    if (!question) return;
    getTranscriptAndSend('ask_question', { question });
  };

  // Theme toggle functionality
  const themeToggle = document.getElementById('themeToggle');
  const body = document.body;
  const themeIcon = document.querySelector('.theme-icon');

  const currentTheme = localStorage.getItem('theme') || 'light';
  body.classList.add(currentTheme + '-theme');
  updateThemeIcon(currentTheme);

  themeToggle.addEventListener('click', () => {
    const isLight = body.classList.contains('light-theme');
    const newTheme = isLight ? 'dark' : 'light';

    body.classList.remove('light-theme', 'dark-theme');
    body.classList.add(newTheme + '-theme');

    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
  });

  function updateThemeIcon(theme) {
    themeIcon.textContent = theme === 'light' ? '🌙' : '☀️';
  }

  // Copy and clear functionality
  document.getElementById('copyBtn').addEventListener('click', () => {
    outputBox.select();
    document.execCommand('copy');

    const copyBtn = document.getElementById('copyBtn');
    const originalContent = copyBtn.innerHTML;
    copyBtn.innerHTML = '<span>✅</span>';
    setTimeout(() => {
      copyBtn.innerHTML = originalContent;
    }, 1000);
  });

  document.getElementById('clearBtn').addEventListener('click', () => {
    outputBox.value = '';
  });
});
