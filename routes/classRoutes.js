const express = require("express");
const router = express.Router();
const Class = require("../models/Class"); // Ensure correct path

// Get all classes
router.get("/", async (req, res) => {
    try {
        const classes = await Class.find();
        res.json(classes);
    } catch (error) {
        res.status(500).json({ message: "Error fetching classes", error });
    }
});

module.exports = router;
