const express = require("express");
const router = express.Router();
const Employee = require("../models/Employee"); // Ensure correct path

// 🟢 GET all employees
router.get("/", async (req, res) => {
    try {
        const employees = await Employee.find(); // Fetch all employees from MongoDB
        res.status(200).json(employees);
    } catch (err) {
        res.status(500).json({ error: "Server error", message: err.message });
    }
});

// 🟢 GET all employees with role "Teacher"
router.get("/teachers", async (req, res) => {
    try {
        const teachers = await Employee.find({ role: "Teacher" }); // Filter by role
        res.status(200).json(teachers);
    } catch (err) {
        res.status(500).json({ error: "Server error", message: err.message });
    }
});

// 🟢 GET a single employee by ID
router.get("/:id", async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id);
        if (!employee) {
            return res.status(404).json({ error: "Employee not found" });
        }
        res.status(200).json(employee);
    } catch (err) {
        res.status(500).json({ error: "Server error", message: err.message });
    }
});

// 🟢 POST - Add a new employee
router.post("/add", async (req, res) => {
    try {
        const newEmployee = new Employee(req.body);
        await newEmployee.save();
        res.status(201).json(newEmployee);
    } catch (err) {
        res.status(500).json({ error: "Failed to add employee", message: err.message });
    }
});

// 🟢 PUT - Update an existing employee
router.put("/edit/:id", async (req, res) => {
    try {
        const updatedEmployee = await Employee.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedEmployee) {
            return res.status(404).json({ error: "Employee not found" });
        }
        res.status(200).json(updatedEmployee);
    } catch (err) {
        res.status(500).json({ error: "Failed to update employee", message: err.message });
    }
});

// 🟢 DELETE - Remove an employee
router.delete("/:id", async (req, res) => {
    try {
        const deletedEmployee = await Employee.findByIdAndDelete(req.params.id);
        if (!deletedEmployee) {
            return res.status(404).json({ error: "Employee not found" });
        }
        res.status(200).json({ message: "Employee deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: "Failed to delete employee", message: err.message });
    }
});

module.exports = router;
