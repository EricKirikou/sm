const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema({
    name: String,
    staffID: String,
    role: String,
    phone: String,
    salary: Number,
    gender: String,
    education: String,
    experience: String,
    email: String,
    dob: Date,
    meddate: Date,
    reportday: String,
    address: String,
    photo: String
});

// Check if model already exists to avoid overwriting
const Employee = mongoose.models.Employee || mongoose.model("Employee", employeeSchema);

module.exports = Employee;
