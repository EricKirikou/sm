const messageInput = document.querySelector("#chat-input");
const chatBody = document.querySelector(".chat-body");
const sendBtn = document.querySelector("#send-btn");
const fileInput = document.querySelector("#file-input");
const fileBtn = document.querySelector("#file-btn");

const API_KEY = "AIzaSyCME2DWVrAAPmJjzh63Jqj-NOzFVrSOgWo";  
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

let imageBase64 = "";
let selectedImagePreview = null;

const createMessageElement = (content, isUser = true, imageURL = null) => {
    const div = document.createElement("div");
    div.classList.add("flex", "gap-2", "items-start", isUser ? "justify-end" : "justify-start");

    let messageContent = `
        <div class="message-text bg-gray-800 text-white p-3 rounded-lg max-w-sm shadow">
            <p>${content}</p>
        </div>`;

    if (imageURL) {
        messageContent = `
            <div class="message-text bg-gray-800 text-white p-3 rounded-lg max-w-sm shadow">
                <p>${content}</p>
                <img src="${imageURL}" class="w-[150px] h-[150px] object-cover mt-2 rounded-lg">
            </div>`;
    }

    div.innerHTML = isUser
        ? `${messageContent}
           <div class="w-10 h-10 bg-gray-300 flex items-center justify-center rounded-full">
               <i class="bi bi-person-circle text-gray-800 text-xl"></i>
           </div>`
        : `<div class="w-8 h-8 flex items-center justify-center rounded-full">
               <i class="bi bi-robot text-gray-800 text-xl"></i>
           </div>
           ${messageContent}`;

    chatBody.appendChild(div);
    div.scrollIntoView({ behavior: "smooth", block: "end" });
};

const convertImageToBase64 = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result.split(",")[1]);
        reader.onerror = (error) => reject(error);
    });
};

fileInput.addEventListener("change", async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (file.type.startsWith("image/")) {
        imageBase64 = await convertImageToBase64(file);

        const fileURL = URL.createObjectURL(file);
        if (selectedImagePreview) {
            chatBody.removeChild(selectedImagePreview);
        }

        selectedImagePreview = document.createElement("div");
        selectedImagePreview.classList.add("flex", "gap-2", "items-center", "mt-2");

        selectedImagePreview.innerHTML = `
            <div class="relative">
                <img src="${fileURL}" alt="Selected Image" class="w-[60px] h-[60px] object-cover rounded-lg shadow">
                <i class="bi bi-x-circle-fill text-red-600 text-lg absolute -top-2 -right-2 cursor-pointer hover:text-red-800" id="cancel-upload"></i>
            </div>
        `;

        chatBody.appendChild(selectedImagePreview);

        document.querySelector("#cancel-upload").addEventListener("click", cancelFile);
    }
});

const cancelFile = () => {
    imageBase64 = "";
    fileInput.value = "";
    if (selectedImagePreview) {
        chatBody.removeChild(selectedImagePreview);
        selectedImagePreview = null;
    }
};

const generateBotResponse = async (userMessage, imageURL = null) => {
    const requestBody = {
        contents: [{ role: "user", parts: [{ text: userMessage }] }]
    };

    if (imageBase64) {
        requestBody.contents[0].parts.push({
            inline_data: { mime_type: "image/png", data: imageBase64 }
        });
    }

    const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
    };

    try {
        const response = await fetch(API_URL, requestOptions);
        const data = await response.json();
        if (!response.ok) throw new Error(data.error?.message || "API Error");

        let botMessage = data.candidates?.[0]?.content?.parts?.[0]?.text || "I'm not sure how to respond.";

        // **Remove unnecessary asterisks**
        botMessage = botMessage.replace(/\*/g, "");

        createMessageElement(botMessage, false, imageURL);
    } catch (error) {
        console.error("Error:", error);
        createMessageElement("⚠️ Error getting response. Please try again.", false);
    }

    cancelFile(); // Remove file preview after sending the message
};


const handleOutgoingMessage = (e) => {
    if (e.type === "keydown" && e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
    }

    const userMessage = messageInput.value.trim();
    if (userMessage === "" && !imageBase64) return;

    let imageURL = selectedImagePreview ? selectedImagePreview.querySelector("img").src : null;

    if (userMessage) {
        createMessageElement(userMessage, true, imageURL);
    }

    messageInput.value = "";
    sendBtn.classList.add("opacity-0", "pointer-events-none");

    const typingIndicator = document.createElement("div");
    typingIndicator.classList.add("flex", "gap-2", "items-center");
    typingIndicator.innerHTML = `
        <div class="w-8 h-8 bg-gray-600 flex items-center justify-center rounded-full">
            <i class="bi bi-robot text-white text-xl"></i>
        </div>
        <div class="bg-gray-200 px-3 py-3 rounded-lg max-w-sm flex items-center gap-1">
            <span class="dot bg-gray-500 w-2 h-2 rounded-full animate-bounce"></span>
            <span class="dot bg-gray-500 w-2 h-2 rounded-full animate-bounce delay-100"></span>
            <span class="dot bg-gray-500 w-2 h-2 rounded-full animate-bounce delay-200"></span>
        </div>
    `;
    chatBody.appendChild(typingIndicator);
    typingIndicator.scrollIntoView({ behavior: "smooth", block: "end" });

    setTimeout(async () => {
        chatBody.removeChild(typingIndicator);
        await generateBotResponse(userMessage, imageURL);
    }, 1500);
};

messageInput.addEventListener("input", () => {
    if (messageInput.value.trim() !== "" || imageBase64) {
        sendBtn.classList.remove("opacity-0", "pointer-events-none");
    } else {
        sendBtn.classList.add("opacity-0", "pointer-events-none");
    }
});

messageInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
        handleOutgoingMessage(e);
    }
});

sendBtn.addEventListener("click", handleOutgoingMessage);
fileBtn.addEventListener("click", () => fileInput.click());

document.addEventListener("DOMContentLoaded", function () {
    // Select elements
    const emojiBtn = document.getElementById("emoji-btn");
    const emojiContainer = document.getElementById("emoji-picker-container");
    const chatInput = document.getElementById("chat-input");

    // Initialize Emoji Picker
    const picker = new EmojiMart.Picker({
        theme: "light",
        skinTonePosition: "none",
        previewPosition: "none",
        onEmojiSelect: (emoji) => {
            chatInput.value += emoji.native; // Append emoji to text area
        }
    });

    // Append Picker to Container
    emojiContainer.appendChild(picker);

    // Toggle Emoji Picker on Button Click
    emojiBtn.addEventListener("click", function (event) {
        emojiContainer.classList.toggle("hidden"); // Show/Hide Picker
    });

    // Hide Emoji Picker when clicking outside
    document.addEventListener("click", function (event) {
        if (!emojiBtn.contains(event.target) && !emojiContainer.contains(event.target)) {
            emojiContainer.classList.add("hidden");
        }
    });
});
