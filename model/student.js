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
    },
    semester: {
        type: Number,
        required: true
    },
    section: {
        type: String,
        required: true,
    },
    batch: {
        type: String,
        required: true
    }
}, {timestamps:true});
const professorSchema = new schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    semesters: {
        type: [String],
        required: true,
    },
});
const questionSchema = new schema({
    question: {
        type: String,
        required: true,
    },
    answer: {
        type: [String],
        required: true,
    }
})

const mcqSchema = new schema({
    title: {
        type: String,
        required: true,
    },
    duration: {
        type: String,
        required: true
    },
    questions: {
        type: [questionSchema],
        required: true,
    },
    startDate: {
        type: String,
        required: true
    },
    endDate: {
        type: String,
        required: true
    }
})

const student = mongoose.model('Student', studentSchema);
const professor = mongoose.model('Professor', professorSchema);
const mcq = mongoose.model('MCQ', mcqSchema);

module.exports = {student, professor, mcq};
