const studentModel = require('../models/studentModel')

const createStudent = async function (req, res) {
    try {
        let data = req.body
        let teacherId = req.teacherId
        data["teacherId"] = teacherId
        // console.log(teacherId)

        let createStudent = await studentModel.create(data)
        return res.send({ status: true, message: "student khana kha raha hai", data: createStudent })

    }
    catch (err) {
        return res.send({ status: false, message: err.message })
    }
}

const updateStudent = async function (req, res) {
    try {
        let studentId = req.params.studentId
        let data = req.body
        let updateStudent = await studentModel.findOneAndUpdate({_id: studentId}, {$set: data},{new: true})
        return res.send({status: true,message:"Uptade student successfully", data: updateStudent})
    }
    catch (err) {
        return res.send({ status: false, message: err.message })
    }
}

module.exports = { createStudent, updateStudent }