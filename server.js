const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require("multer");
const path = require("path");
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 📂 Configure Multer for File Upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/"); // Ensure this folder exists in your project directory
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Unique filename with original extension
    }
});

const upload = multer({ dest: "uploads/" });

// 🔗 Serve Static Files (to access uploaded images)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// 📡 MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB Connected'))
.catch(err => console.error('❌ MongoDB Connection Error:', err));

// 📌 Employee Schema
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
    photo: String // Store filename only
});

const Employee = mongoose.model('Employee', employeeSchema);

// 🔥 API Routes

// 🟢 Add New Employee (with Image Upload)
app.post('/api/employees', upload.single('photo'), async (req, res) => {
    try {
        const { name, staffID, role, phone, salary, gender, education, experience, email, dob, address } = req.body;
        const photo = req.file ? req.file.filename : null; // Store filename only

        const employee = new Employee({ name, staffID, role, phone, salary, gender, education, experience, email, dob, address, photo });
        await employee.save();

        res.status(201).json(employee);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// 🟢 Get All Employees
// Route to get all employees
app.get("/api/employees", async (req, res) => {
  try {
      const employees = await Employee.find();
      res.json(employees);
  } catch (error) {
      res.status(500).json({ message: "Error fetching employees", error });
  }
});

// Route to get an employee by ID
app.get("/api/employees/:id", async (req, res) => {
  try {
      const employee = await Employee.findById(req.params.id);
      if (!employee) {
          return res.status(404).json({ message: "Employee not found" });
      }
      res.json(employee);
  } catch (error) {
      res.status(500).json({ message: "Error fetching employee", error });
  }
});



// PUT request to update employee (including image)
app.put('/api/employees/:id', upload.single('photo'), async (req, res) => {
  try {
      console.log("Updating employee:", req.params.id);
      console.log("Received Data:", req.body);

      let updateData = { ...req.body }; // Copy all text fields

      // If a new image is uploaded, update the `photo` field
      if (req.file) {
          updateData.photo = req.file.filename;
      }

      // Update employee in the database
      const updatedEmployee = await Employee.findByIdAndUpdate(
          req.params.id,
          updateData,
          { new: true }
      );

      if (!updatedEmployee) {
          console.log("Employee Not Found");
          return res.status(404).json({ message: "Employee not found" });
      }

      res.json(updatedEmployee);
  } catch (error) {
      console.error("Error updating employee:", error);
      res.status(500).json({ message: "Server error" });
  }
});



// 🟢 Update Employee (with optional image update)
app.put('/api/employees/:id', upload.single("photo"), async (req, res) => {
  try {
      // Extract updated data from request body
      let updatedData = { ...req.body };

      // Handle file upload for photo update
      if (req.file) {
          updatedData.photo = `/uploads/${req.file.filename}`; 
      }

      // Ensure proper parsing for number fields (e.g., salary)
      if (updatedData.salary) {
          updatedData.salary = Number(updatedData.salary);
      }

      // Find and update employee
      const employee = await Employee.findByIdAndUpdate(
          req.params.id, 
          updatedData, 
          { new: true, runValidators: true } // Ensure validation runs
      );

      if (!employee) {
          return res.status(404).json({ message: 'Employee not found' });
      }

      res.json({ message: "Employee updated successfully!", employee });

  } catch (error) {
      console.error("Update Error:", error);
      res.status(400).json({ error: error.message });
  }
});


// 🟢 Delete Employee
app.delete('/api/employees/:id', async (req, res) => {
    try {
        const employee = await Employee.findByIdAndDelete(req.params.id);
        if (!employee) return res.status(404).json({ message: 'Employee not found' });
        res.json({ message: 'Employee deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 🟢 Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
