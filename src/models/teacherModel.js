const mongoose = require("mongoose")

const teacherSchema = new mongoose.Schema({
    Name: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
        unique: true
    },
    Email: {
        type: String,
        required: true,
        unique: true,
        lowerCase: true
    },
    password: {
        type: String,
        required: true,
        unique: true,
    }
}, { timestamps: true })

module.exports = mongoose.model("teacher", teacherSchema)
