const mongoose = require('mongoose');
const schema = mongoose.Schema;

const studentSchema = new schema({
    name: {
        type: String,
    },
    phone: {
        type: String,
        unique: true,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String
    },
    usn : {
        type: String,
        unique: true,
        required: true
    },
    marks: {
        type: String
    },
    cgpa: {
        type: String,
    }
}, {timestamps:true})

const student = mongoose.model('Student', studentSchema);

module.exports = student;
