const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const multer = require('multer');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const uploadPath = path.join(__dirname, 'uploads');
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadPath),
  filename: (req, file, cb) => cb(null, `${Date.now()}${path.extname(file.originalname)}`),
});
const upload = multer({ storage });

const mongoURI = process.env.MONGODB_URI;
if (!mongoURI) {
  console.error('Missing MONGODB_URI in .env');
  process.exit(1);
}

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

const studentSchema = new mongoose.Schema({
  username: String,
  firstName: String,
  otherName: String,
  lastName: String,
  dateOfAdmission: Date,
  classGroup: String,
  registrationID: String,
  mobileNumber: String,
  gender: String,
  dateOfBirth: Date,
  fatherName: String,
  fatherNumber: String,
  motherName: String,
  motherNumber: String,
  medicalCondition: String,
  studentFormID: String,
  password: String,
  image: String,
}, { timestamps: true });

const employeeSchema = new mongoose.Schema({
  username: String,
  nameOfEmployee: String,
  mobileNumber: String,
  dateOfBirth: Date,
  role: String,
  idNumber: String,
  monthlySalary: Number,
  imageOfEmployee: String,
  legalContactName: String,
  gender: String,
  email: String,
  experience: String,
  education: String,
  address: String,
  password: String,
}, { timestamps: true });

const examSchema = new mongoose.Schema({
  title: String,
  subject: String,
  date: Date,
}, { timestamps: true });

const payrollSchema = new mongoose.Schema({
  employeeId: mongoose.Schema.Types.ObjectId,
  amount: Number,
  date: Date,
}, { timestamps: true });

const classSchema = new mongoose.Schema({
  name: String,
  teacherId: mongoose.Schema.Types.ObjectId,
}, { timestamps: true });

const subjectSchema = new mongoose.Schema({
  name: String,
  teacherId: mongoose.Schema.Types.ObjectId,
  classId: mongoose.Schema.Types.ObjectId,
}, { timestamps: true });

const Student = mongoose.model('Student', studentSchema);
const Employee = mongoose.model('Employee', employeeSchema);
const Exam = mongoose.model('Exam', examSchema);
const Payroll = mongoose.model('Payroll', payrollSchema);
const ClassModel = mongoose.model('Class', classSchema);
const Subject = mongoose.model('Subject', subjectSchema);

app.get('/', (req, res) => {
  res.json({ message: 'SUKUU backend is running' });
});

app.post('/v1/api/auth/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await Student.findOne({ username, password }) || await Employee.findOne({ username, password });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });
    res.json({ message: 'Login successful', token: 'jwt_token_here', user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/v1/api/auth/signup', async (req, res) => {
  try {
    const { username, password, email, role } = req.body;
    const newUser = new Employee({ username, password, email, role });
    await newUser.save();
    res.json({ message: 'Signup successful' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/v1/api/student/add', upload.single('image'), async (req, res) => {
  try {
    const studentData = req.body;
    if (req.file) studentData.image = `/uploads/${req.file.filename}`;
    const newStudent = new Student(studentData);
    await newStudent.save();
    res.json({ message: 'Student added successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/v1/api/student/', async (req, res) => {
  try {
    const students = await Student.find();
    res.json({ data: students });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/v1/api/student/:id', async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    res.json(student);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.put('/v1/api/student/edit/:id', async (req, res) => {
  try {
    const updatedStudent = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ message: 'Student edited successfully', data: updatedStudent });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.delete('/v1/api/student/delete/:id', async (req, res) => {
  try {
    await Student.findByIdAndDelete(req.params.id);
    res.json({ message: 'Student deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/v1/api/employee/add', upload.single('image'), async (req, res) => {
  try {
    const employeeData = req.body;
    if (req.file) employeeData.imageOfEmployee = `/uploads/${req.file.filename}`;
    const newEmployee = new Employee(employeeData);
    await newEmployee.save();
    res.json({ message: 'Employee added successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/v1/api/employee/', async (req, res) => {
  try {
    const employees = await Employee.find();
    res.json({ data: employees });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/v1/api/employee/:id', async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    res.json(employee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.put('/v1/api/employee/edit/:id', async (req, res) => {
  try {
    const updatedEmployee = await Employee.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ message: 'Employee edited successfully', data: updatedEmployee });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.delete('/v1/api/employee/delete/:id', async (req, res) => {
  try {
    await Employee.findByIdAndDelete(req.params.id);
    res.json({ message: 'Employee deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/v1/api/exams/add', async (req, res) => {
  try {
    const newExam = new Exam(req.body);
    await newExam.save();
    res.json({ message: 'Exam added successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/v1/api/exams/', async (req, res) => {
  try {
    const exams = await Exam.find();
    res.json(exams);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/v1/api/exams/:id', async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id);
    res.json(exam);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.put('/v1/api/exams/edit/:id', async (req, res) => {
  try {
    const updatedExam = await Exam.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ message: 'Exam edited successfully', data: updatedExam });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.delete('/v1/api/exams/delete/:id', async (req, res) => {
  try {
    await Exam.findByIdAndDelete(req.params.id);
    res.json({ message: 'Exam deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/v1/api/payroll/add', async (req, res) => {
  try {
    const newPayroll = new Payroll(req.body);
    await newPayroll.save();
    res.json({ message: 'Payroll added successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/v1/api/payroll/', async (req, res) => {
  try {
    const payrolls = await Payroll.find();
    res.json(payrolls);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/v1/api/payroll/:id', async (req, res) => {
  try {
    const payroll = await Payroll.findById(req.params.id);
    res.json(payroll);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.put('/v1/api/payroll/edit/:id', async (req, res) => {
  try {
    const updatedPayroll = await Payroll.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ message: 'Payroll edited successfully', data: updatedPayroll });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.delete('/v1/api/payroll/delete/:id', async (req, res) => {
  try {
    await Payroll.findByIdAndDelete(req.params.id);
    res.json({ message: 'Payroll deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/classes', async (req, res) => {
  try {
    const newClass = new ClassModel(req.body);
    await newClass.save();
    res.json({ message: 'Class added successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/api/classes', async (req, res) => {
  try {
    const classes = await ClassModel.find();
    res.json(classes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/api/classes/:id', async (req, res) => {
  try {
    const classItem = await ClassModel.findById(req.params.id);
    res.json(classItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.put('/api/classes/:id', async (req, res) => {
  try {
    const updatedClass = await ClassModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ message: 'Class updated successfully', data: updatedClass });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.delete('/api/classes/:id', async (req, res) => {
  try {
    await ClassModel.findByIdAndDelete(req.params.id);
    res.json({ message: 'Class deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/subjects/add', async (req, res) => {
  try {
    const newSubject = new Subject(req.body);
    await newSubject.save();
    res.json({ message: 'Subject added successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/api/subjects', async (req, res) => {
  try {
    const subjects = await Subject.find();
    res.json(subjects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/api/subjects/:id', async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id);
    res.json(subject);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.put('/api/subjects/:id', async (req, res) => {
  try {
    const updatedSubject = await Subject.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ message: 'Subject updated successfully', data: updatedSubject });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.delete('/api/subjects/:id', async (req, res) => {
  try {
    await Subject.findByIdAndDelete(req.params.id);
    res.json({ message: 'Subject deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/api/employees/teachers', async (req, res) => {
  try {
    const teachers = await Employee.find({ role: 'teacher' });
    res.json(teachers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.use('/uploads', express.static(uploadPath));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});