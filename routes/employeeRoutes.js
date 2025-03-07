const express = require("express");
const router = express.Router();
const Employee = require("../models/Employee"); // Correct the path


// 🟢 GET all employees
router.get('/', async (req, res) => {
    try {
        const employees = await Employee.find(); // Fetch all employees from MongoDB
        res.json(employees);
    } catch (err) {
        res.status(500).json({ error: 'Server error', message: err.message });
    }
});

// 🟢 GET all employees with role "Teacher"
router.get('/teachers', async (req, res) => {
    try {
        const teachers = await Employee.find({ role: "Teacher" }); // Filter by role
        res.json(teachers);
    } catch (err) {
        res.status(500).json({ error: 'Server error', message: err.message });
    }
});
module.exports = router;
