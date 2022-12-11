const studentModel = require("../models/studentModel")
const teacherModel = require("../models/teacherModel")
const mongoose = require("mongoose")
let nameRegex = /^[A-Za-z]+$/
let numberRegex = /^\d+$/
const isValidObjectId = function (ObjectId) {
    return mongoose.Types.ObjectId.isValid(ObjectId)
}

const createStudent = async function (req, res) {
    try {
        let data = req.body

        if (Object.keys(data).length == 0) {
            return res.status(400).send({ status: false, message: "body should not be empty" })
        }

        if (!data.studentName) {
            return res.status(400).send({ status: false, message: "student name is mandatory" })
        }
        if (!nameRegex.test(data.studentName)) {
            return res.status(400).send({ status: false, message: "student name is not in the correct format" })
        }
        if (!data.subject) {
            return res.status(400).send({ status: false, message: "subject is mandatory" })
        }
        if (!nameRegex.test(data.subject)) {
            return res.status(400).send({ status: false, message: "subject name is not in the correct format" })
        }
        if (!data.marks) {
            return res.status(400).send({ status: false, message: "marks are mandatory" })
        }
        if (!numberRegex.test(data.marks)) {
            return res.status(400).send({ status: false, message: "marks are not in the correct format" })
        }

        if (!data.teacherId) {
            return res.status(400).send({ status: false, message: "teacher Id is mandatory" })
        }
        if (!isValidObjectId(data.teacherId)) {
            return res.status(400).send({ status: false, message: "teacher Id is not valid" })
        }
        if (req.teacherId != data.teacherId) {
            return res.status(403).send({ status: false, message: "Unauthorized person" })
        }

        let check = await studentModel.findOne({ subject: data.subject, studentName: data.studentName })
        if (check) {
            let result = await studentModel.findOneAndUpdate({ subject: data.subject, studentName: data.studentName }, { $inc: { marks: data.marks } }, { new: true })
            return res.status(201).send({ status: true, data: result })
        }

        let savedData = await studentModel.create(data)
        return res.status(201).send({ status: true, message: "student document created successfully", data: savedData })

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}



const getStudentsList = async function (req, res) {
    try {
        let teacherId = req.params.teacherId
        if (!isValidObjectId(teacherId)) {
            return res.status(400).send({ status: false, message: "teacher Id is not valid" })
        }
        if(req.teacherId != teacherId){
            return res.status(403).send({status:false,message:"Unauthorized access"})
        }

        let teacherDocument = await teacherModel.findOne({ _id: teacherId})
        if (!teacherDocument) {
            return res.status(404).send({ status: false, message: "teacher document not found" })
        }

        let students = await studentModel.find({ teacherId: teacherId, isDeleted: false })
        if (students.length == 0) {
            return res.status(404).send({ status: false, message: "students document not found" })
        }
        return res.status(200).send({ status: true, data: students })
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}




const getStudent = async function (req, res) {
    try {
        let studentId = req.params.studentId
        if (!isValidObjectId(studentId)) {
            return res.status(400).send({ status: false, message: "student Id is not valid" })
        }

        let studentDocument = await studentModel.findOne({ _id: studentId, isDeleted: false })
        if (!studentDocument) {
            return res.status(404).send({ status: false, message: "Student document not found" })
        }

        if(req.teacherId != studentDocument.teacherId){
            return res.status(403).send({status:false,message:"Unauthorized access"})
        }

        return res.status(200).send({ status: true, data: studentDocument })

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }

}




const studentsListByFilter = async function (req, res) {
    try {
        let query = req.query
        let teacherId = req.params.teacherId
        
        if (!isValidObjectId(teacherId)) {
            return res.status(400).send({ status: false, message: "teacher Id is not valid" })
        }

        let teacherExist = await teacherModel.findById(teacherId)
        if(!teacherExist){
            return res.status(404).send({status:false,message:"teacher document does not exists"})
        }
        
        if(req.teacherId != teacherId){
            return res.status(403).send({status:false,message:"Unauthorized access"})
        }

        if (Object.keys(query).length > 0) {
            let list = await studentModel.find({ $and: [query, { isDeleted: false }] })
            if (list.length == 0) {
                return res.status(404).send({ status: false, message: "list of students not found" })
            }

            return res.status(200).send({ status: true, data: list })

        } else {
            let studentList = await studentModel.find({ teacherId: teacherId, isDeleted: false })
            if (studentList.length == 0) {
                return res.status(404).send({ status: false, message: "student list not found" })
            }

            return res.status(200).send({ status: true, data: studentList })
        }

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}




const updateStudent = async function (req, res) {
    try {
        let data = req.body
        let studentId = req.params.studentId
        if (!isValidObjectId(studentId)) {
            return res.status(400).send({ status: false, message: "student Id is not valid" })
        }

        let studentExist = await studentModel.findOne({_id:studentId,isDeleted:false})
        if(!studentExist){
            return res.status(404).send({ status: false, message: "student document does not exist" })
        }

        if(req.teacherId != studentExist.teacherId){
            return res.status(403).send({ status: false, message: "Unauthorized access" })
        }

        if (data.studentName) {
            if (!nameRegex.test(data.studentName)) {
                return res.status(400).send({ status: false, message: "student name is not in the correct format" })
            }
        }

        if (data.subject) {
            if (!nameRegex.test(data.subject)) {
                return res.status(400).send({ status: false, message: "subject name is not in the correct format" })
            }
        }

        if (data.marks) {
            if (!numberRegex.test(data.marks)) {
                return res.status(400).send({ status: false, message: "marks are not in the correct format" })
            }
        }


        let updateData = await studentModel.findOneAndUpdate({ _id: studentId, isDeleted: false }, { $set: data }, { new: true })
        return res.status(200).send({ status: true, message: "Student document updated successfully", data: updateData })

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}



const deleteStudent = async function (req, res) {
    try {
        let studentId = req.params.studentId
        if (!isValidObjectId(studentId)) {
            return res.status(400).send({ status: false, message: "student Id is not valid" })
        }

        let studentExist = await studentModel.findOne({_id:studentId,isDeleted:false})
        if(!studentExist){
            return res.status(404).send({ status: false, message: "student document does not exist" })
        }

        if(req.teacherId != studentExist.teacherId){
            return res.status(403).send({ status: false, message: "Unauthorized access" })
        }

        let deleteStudent = await studentModel.findOneAndUpdate({ _id: studentId, isDeleted: false }, { $set: { isDeleted: true, deletedAt:Date.now() } })
        return res.status(200).send({ status: true, message: "student document deleted successfully" })

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

module.exports = { createStudent, updateStudent, deleteStudent, getStudentsList, getStudent, studentsListByFilter }