document.addEventListener("DOMContentLoaded", function () {
    const chatWindow = document.getElementById("chat-window");
    const chatInput = document.getElementById("chat-input");
    const sendBtn = document.getElementById("send-btn");
    const clearBtn = document.getElementById("clear-btn");
    const typingIndicator = document.getElementById("typing-indicator");

    const API_URL = "http://localhost:5000/chat";

    function addMessage(text, sender) {
        const messageDiv = document.createElement("div");
        messageDiv.classList.add("p-2", "rounded-lg", "mt-2", "max-w-xs", "text-white");
        
        if (sender === "bot") {
            messageDiv.classList.add("bg-gray-600", "self-start");
        } else {
            messageDiv.classList.add("bg-blue-600", "self-end", "ml-auto");
        }

        messageDiv.innerText = text;
        chatWindow.appendChild(messageDiv);
        chatWindow.scrollTop = chatWindow.scrollHeight;
        saveChatHistory();
    }

    async function fetchAIResponse(userInput) {
        typingIndicator.classList.remove("hidden");

        try {
            const response = await fetch(API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: userInput }),
            });

            const data = await response.json();
            typingIndicator.classList.add("hidden");

            addMessage(data.response || "⚠️ AI is unavailable. Try again!", "bot");
        } catch (error) {
            console.error("AI Error:", error);
            typingIndicator.classList.add("hidden");
            addMessage("⚠️ AI is not responding. Please try later!", "bot");
        }
    }

    sendBtn.addEventListener("click", function () {
        const userText = chatInput.value.trim();
        if (userText) {
            addMessage(userText, "user");
            chatInput.value = "";
            fetchAIResponse(userText);
        }
    });

    chatInput.addEventListener("keypress", function (e) {
        if (e.key === "Enter") sendBtn.click();
    });

    clearBtn.addEventListener("click", function () {
        chatWindow.innerHTML = "";
        localStorage.removeItem("chatHistory");
    });

    function saveChatHistory() {
        localStorage.setItem("chatHistory", chatWindow.innerHTML);
    }

    function loadChatHistory() {
        chatWindow.innerHTML = localStorage.getItem("chatHistory") || "";
    }

    loadChatHistory();
});
