const mongoose = require("mongoose")
const ObjectId = mongoose.Schema.Types.ObjectId

const studentSchema = new mongoose.Schema({
    studentName: {
        type: String,
        required: true,
        trim: true
    },
    subject: {
        type: String,
        required: true,
    },
    marks: {
        type: Number,
        required : true
    },
    teacherId: {
        type: ObjectId,
        ref: "Teacher",
        required: true
    },
    isDeleted: {
        type : Boolean,
        default : false
    },
    deletedAt: {
        type: Date,
        default: null
    }
}, { timestamps: true })

module.exports = mongoose.model("Student", studentSchema)