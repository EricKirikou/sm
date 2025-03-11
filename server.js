// 🚀 server.js - Express Server with AI Chatbot Integration
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const multer = require('multer');
const path = require('path');
const { OpenAI } = require("openai");



// 📌 Load Environment Variables
dotenv.config();

// 📡 Initialize Express App
const app = express();

// 🔹 Middleware
app.use(cors());
app.use(express.json()); // Use express.json() instead of body-parser
app.use(express.urlencoded({ extended: true }));


// 📂 Configure Multer for File Upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, "uploads/"),
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

// 🔗 Serve Static Files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// 📡 MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB Connected'))
.catch(err => console.error('❌ MongoDB Connection Error:', err));

// ✅ Initialize OpenAI
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

/* ==================== ROUTES ==================== */

// 🗂️ Import Routes
const employeeRoutes = require("./routes/employeeRoutes");
const classRoutes = require('./routes/classRoutes');

// 🔹 Use Routes
app.use("/api/employees", employeeRoutes);
app.use("/api/classes", classRoutes);


// ✅ AI Chatbot Route
app.post("/chat", async (req, res) => {
    try {
        const { message } = req.body;

        if (!message) {
            return res.status(400).json({ error: "Message is required" });
        }

        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: message }],
        });

        res.json({ response: response.choices[0].message.content });
    } catch (error) {
        console.error("❌ OpenAI API Error:", error);
        res.status(500).json({ error: "AI is unavailable. Try again later!" });
    }
});

// 🟢 Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
