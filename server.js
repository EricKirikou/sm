const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const employeeRoutes = require("./routes/employeeRoutes");


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = "mongodb+srv://erickirikou:pYiRPzLGhrIcQgtb@cluster0.9nlawri.mongodb.net/sukuu";

mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Could not connect to MongoDB", err));

app.use(cors());
app.use(express.json());

// Set base API route
const BASE_URL = "https://sukuu-backend.onrender.com/";


app.use(`${BASE_URL}/employee`, employeeRoutes);


// Employee routes for fetch, delete, and send
const Employee = require("./models/Employee");

// Fetch all employees
app.get(`/v1/api/employee/`, async (req, res) => {
  try {
    const employees = await Employee.find();
    res.status(200).json(employees);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch employees" });
  }
});

// Add a new employee
app.post(`/v1/api/employee/add`, async (req, res) => {
  try {
    const newEmployee = new Employee(req.body);
    await newEmployee.save();
    res.status(201).json(newEmployee);
  } catch (error) {
    res.status(500).json({ error: "Failed to add employee" });
  }
});

// Delete an employee by ID
app.delete(`/v1/api/employee/:id`, async (req, res) => {
  try {
    const { id } = req.params;
    await Employee.findByIdAndDelete(id);
    res.status(200).json({ message: "Employee deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete employee" });
  }
});

app.listen(PORT, () => {
  console.log(`https://sukuu-backend.onrender.com/`);
});
