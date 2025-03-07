const mongoose = require("mongoose");

const classSchema = new mongoose.Schema({
    className: { type: String, required: true, unique: true },
    section: { type: String },
    classTeacher: { type: String },
    subjects: [{ type: String }],
    createdAt: { type: Date, default: Date.now }
});

const Class = mongoose.model("Class", classSchema);

module.exports = Class;

router.post("/add", async (req, res) => {
    try {
        console.log("📩 Received data:", req.body); // Debugging log
        const { className, section, classTeacher, capacity } = req.body;

        if (!className || !section || !classTeacher || !capacity) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const newClass = new Class({ className, section, classTeacher, capacity });
        await newClass.save();

        res.status(201).json({ message: "Class added successfully!", newClass });
    } catch (error) {
        console.error("❌ Error saving class:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
