const mongoose = require("mongoose")
const ObjectId = mongoose.Schema.Types.ObjectId

const StudentSchema = new mongoose.Schema({
    Studentname: {
        type: String,
        required: true
    },
    subject: {
        type: String,
    },
    marks: {
        type: Number
    },
    teacherId: {
        type: ObjectId,
        ref: "teacher",
        required: true
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    deletedAt: {
        type: Date,
        default: null
    }

}, { timestamps: true })

module.exports = mongoose.model("student", StudentSchema)
