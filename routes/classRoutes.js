const express = require('express');
const router = express.Router();
const Class = require("../models/Class");

// ✅ Create a new class
router.post("/add", async (req, res) => {
    try {
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

module.exports = router;
