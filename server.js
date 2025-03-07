const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require("multer");
const path = require("path");
require('dotenv').config();

const app = express();
const router = express.Router();

const Employee = require("./models/Employee");
const employeeRoutes = require("./routes/employeeRoutes");
const classRoutes = require("./routes/classRoutes");

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 📂 Configure Multer for File Upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
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

// Import and use routes
app.use("/api/employees", employeeRoutes);
app.use("/api/classes", classRoutes);

// ✅ Create a new class
router.post("/add", async (req, res) => {
    try {
        const { className, section, classTeacher, capacity } = req.body;

        // Ensure required fields are provided
        if (!className || !section || !classTeacher || !capacity) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Create and save the new class
        const newClass = new Class({ className, section, classTeacher, capacity });
        await newClass.save();

        res.status(201).json({ message: "Class added successfully!", newClass });
    } catch (error) {
        console.error("❌ Error saving class:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

module.exports = router;


// 🟢 Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
