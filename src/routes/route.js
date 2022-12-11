const express = require("express")
const router = express.Router()

const teacherController = require("../controllers/teacherController")
const studentController = require("../controllers/studentController")
const middleware = require("../middleware/Auth")



router.post("/createTeacher",teacherController.createTeacher)

router.post("/teacherLogin",teacherController.loginTeacher)

router.get("/getTeacher/:teacherId",middleware.authentication,teacherController.getTeacher)

router.post("/createStudent", middleware.authentication, studentController.createStudent)

router.get("/getStudentsList/:teacherId", middleware.authentication, studentController.getStudentsList)
router.get("/getStudent/:studentId", middleware.authentication, studentController.getStudent)
router.get("/studentsListByFilter/:teacherId", middleware.authentication, studentController.studentsListByFilter)

router.put("/updateStudent/:studentId", middleware.authentication, studentController.updateStudent)

router.delete("/deleteStudent/:studentId", middleware.authentication, studentController.deleteStudent)





router.all("/*", function(req, res) {
    res.status(404).send({ msg: "No such Api found" })
})


module.exports = router