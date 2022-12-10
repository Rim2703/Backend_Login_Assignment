const express = require('express')
const router = express.Router()
const teacherController = require('../controllers/teacherController')
const middlerware = require('../middleware/auth')
const studentController = require('../controllers/studentController')

router.post("/register/teacher", teacherController.createTeacher)
router.post("/login/teacher", teacherController.teacherLogin)

router.post("/create/student", middlerware.authentication, studentController.createStudent)
router.put("/update/student/:studentId", middlerware.authentication, studentController.updateStudent)

module.exports = router;