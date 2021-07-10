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
    usn: {
        type: String,
        unique: true,
        required: true
    },
    marks: {
        type: Number,
        default: 0
    },
    cgpa: {
        type: mongoose.Schema.Types.Decimal128,
        default: 0.0
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
}, {
    timestamps: true
});
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

//Schema of Question
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


//schema for mcq
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

//answers schema for stackoverflow
const answersSchemaStackOverFlow = new schema({
    answer: {
        type: String,
        required: true
    },
    upVotes: {
        type: Number,
        default: 0,
        // required: true
    },
    downVotes: {
        type: Number,
        default: 0
    },
    author: {
        type: String,
        required: true
    }
})

//question schema for stackoverflow
const questionSchemaStackOverFlow = new schema({
    question: {
        type: String,
        required: true
    },
    answer: {
        type: [answersSchemaStackOverFlow]
    },
    author: {
        type: String,
        required: true
    },
    subject: {
        type: String,
        default: 'misc'
    },
    branch: {
        type: String,
        required: true
    },
    year: {
        type: Number,
        required: true,
        default: 0
    }
})


const student = mongoose.model('Student', studentSchema);
const professor = mongoose.model('Professor', professorSchema);
const mcq = mongoose.model('MCQ', mcqSchema);
const stackOverFlowQuestion = mongoose.model('StackOverFlowQuestion', questionSchemaStackOverFlow);
const answersModelStackOverFlow = mongoose.model('StackOverFlowAnswer', answersSchemaStackOverFlow);


module.exports = {
    student,
    professor,
    mcq,
    stackOverFlowQuestion,
    answersModelStackOverFlow
};