const mongoose = require('mongoose');
const schema = mongoose.Schema;

const studentSchema = new schema({
    name: {
        type: String
    },
    phone: {
        type: String,
    },
    email: {
        type: String,
    },
    password: {
        type: String
    },
    usn : {
        String
    }
}, {timestamps:true})

const student = mongoose.model('Student', studentSchema);

module.exports = student;
