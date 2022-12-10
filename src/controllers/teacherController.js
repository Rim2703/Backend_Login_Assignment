const teacherModel = require('../models/teacherModel')
const jwt = require('jsonwebtoken')

const createTeacher = async (req, res) => {
    try {
        let data = req.body
        let createTeacher = await teacherModel.create(data)
        return res.send({ status: true, message: "teacher created", data: createTeacher })
    }
    catch (err) {
        return res.send({ status: false, message: err.message })
    }
}

const teacherLogin = async function (req, res) {
    try {
        let data = req.body;
        // if (!isValidreqbody(data)) {
        //     return res.status(400).send({ statua: false, message: "Please provide login details!!" })
        // }

        const { Email, password } = data

        if (!(Email)) {
            return res.status(400).send({ status: false, message: "Email is required!!" })
        }

        // check email for user
        let teacher = await teacherModel.findOne({ Email: Email });
        if (!teacher) return res.status(400).send({ status: false, message: "Email is not correct, Please provide valid email" });

        if (!(password)) {
            return res.status(400).send({ status: false, message: "Password is required!!" })
        }

        // check password of existing user
        let pass = await teacherModel.findOne({ password: password });
        if (!pass) return res.status(400).send({ status: false, message: "Password is not correct, Please provide valid password" });

        let teachers = await teacherModel.findOne({ Email: Email, password: password })

        // using jwt for creating token
        let token = jwt.sign(
            {
                teacherId: teachers._id.toString(),
            },
            "BackendKaTeacher"
        );

        return res.status(200).send({ status: true, message: "The token is created Successfully", token: token });
    }
    catch (err) {
        return res.status(500).send({ status: false, Error: err.message });
    }
}

module.exports = { createTeacher ,teacherLogin}