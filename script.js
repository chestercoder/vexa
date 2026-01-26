const messagesDiv = document.getElementById("messages");
const input = document.getElementById("input");

input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    sendMessage();
  }
});

function addMessageBubble(text, sender) {
  const bubble = document.createElement("div");
  bubble.classList.add("message", sender);
  bubble.textContent = text;
  messagesDiv.appendChild(bubble);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

let conversation = [
  {
    role: "system",
    content: "You are Vexa, a fast, friendly, helpful AI assistant."
  }
];

async function sendMessage() {
    const text = input.value.trim();
    if (!text) return;

    addMessageBubble(text, "user");
    input.value = "";

    conversation.push({ role: "user", content: text });

    if (conversation.length > 30) {
        conversation = [conversation[0], ...conversation.slice(-18)];
    }

    try {
        const response = await fetch("https://vexa.chestertgardiner.workers.dev/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: conversation })
    });

    const data = await response.json();
    console.log("Worker returned:", data);

    if (data.error) {
      addMessageBubble("⚠️ " + data.error, "bot");
      return;
    }

    conversation.push({ role: "assistant", content: data.reply });

    addMessageBubble(data.reply, "bot");

  } catch (err) {
    console.error(err);
    addMessageBubble("⚠️ Network error. Try again.", "bot");
  }
}