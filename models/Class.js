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
