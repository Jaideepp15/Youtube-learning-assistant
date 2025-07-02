const GROQ_API_KEY = "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";
const GROQ_ENDPOINT = "https://api.groq.com/openai/v1/chat/completions";
const MODEL = "deepseek-r1-distill-llama-70b";

function extractResponse(response) {
  if (response.includes('</think>')) {
    return response.split('</think>')[1];
  } else if (response.includes('<think>')) {
    return response.split('<think>')[1];
  } else {
    return response.trim() || "No result returned";
  }
}

async function callGroqAPI(prompt, systemMessage) {
  const res = await fetch(GROQ_ENDPOINT, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${GROQ_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        { role: "system", content: systemMessage },
        { role: "user", content: prompt }
      ],
    }),
  });

  const data = await res.json();
  const rawResponse = data.choices?.[0]?.message?.content || "";
  const result = extractResponse(rawResponse);
  return result;
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "summarize") {
    const prompt = `Summarize the YouTube video based on its transcript:\n\n${request.transcript}`;
    callGroqAPI(prompt, "You are an expert educator summarizing YouTube videos.").then(sendResponse);
    return true;
  }

  if (request.action === "questions") {
    const prompt = `Generate 5 questions to test a user (Q&A format) based on this transcript:\n\n${request.transcript}`;
    callGroqAPI(prompt, "You are a helpful tutor generating questions to help users asses themselves.").then(sendResponse);
    return true;
  }

  if (request.action === "ask_question") {
    const prompt = `Based on this video transcript:\n\n${request.transcript}\n\nAnswer the following question:\n${request.question}`;
    callGroqAPI(prompt, "You are an expert answering questions from video transcripts.").then(sendResponse);
    return true;
  }
});
