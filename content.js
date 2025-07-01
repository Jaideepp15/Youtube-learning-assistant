console.log("✅ content.js is loaded");

function extractTranscript() {
  const segments = Array.from(document.querySelectorAll('ytd-transcript-segment-renderer'));
  console.log(`[Transcript Debug] Found ${segments.length} segments`);

  const transcript = segments.map((seg, i) => {
    const timestampEl = seg.querySelector('.segment-timestamp');
    const textEl = seg.querySelector('.segment-text');

    const timestamp = timestampEl?.innerText?.trim() || '[no timestamp]';
    const text = textEl?.innerText?.trim() || '[no text]';

    console.log(`[Segment ${i + 1}] ${timestamp} - ${text}`);
    return `${timestamp} ${text}`;
  }).join('\n');

  return transcript;
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'get_transcript') {
    const transcript = extractTranscript();
    sendResponse({ transcript });
  }
});


chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'get_transcript') {
    const transcript = extractTranscript();
    sendResponse({ transcript });
  }
});
