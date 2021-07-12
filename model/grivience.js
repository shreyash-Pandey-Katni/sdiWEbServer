const { Schema } = require("mongoose");
const mongoose = require('mongoose')


const grievanceSchema = new Schema({
    anonymous: {
        type: Boolean,
        required: true,
        default: false,
    },
    name: {
        type: String,
    },
    email: {
        type: String
    },
    details: {
        type: String,
        required: true
    }
})

const grievance = mongoose.model('grievance', grievanceSchema);

module.exports = {
    grievance
}