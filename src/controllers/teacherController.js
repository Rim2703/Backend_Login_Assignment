const mongoose = require("mongoose")
const teacherModel = require("../models/teacherModel")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")

let nameRegex = /^[A-Za-z]+$/
const emailRegex = /^\s*[a-zA-Z0-9]+([\.\-\_\+][a-zA-Z0-9]+)*@[a-zA-Z]+([\.\-\_][a-zA-Z]+)*(\.[a-zA-Z]{2,3})+\s*$/
const passwordRegex = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,15}$/

const isValidObjectId = function (ObjectId) {
    return mongoose.Types.ObjectId.isValid(ObjectId)
}



const createTeacher = async function(req,res){
    try{
    let data = req.body

    if(Object.keys(data).length == 0){
        return res.status(400).send({status:false,message:"body should not be empty"})
    }
    if(!data.name){
        return res.status(400).send({status:false,message:"name is mandatory"})  
    }

    if(!nameRegex.test(data.name)){
        return res.status(400).send({status:false,message:"name is not in the correct format"})  
    }
    
    if(!data.surname){
        return res.status(400).send({status:false,message:"surname is mandatory"})  
    }
    if(!nameRegex.test(data.surname)){
        return res.status(400).send({status:false,message:"surname is not in the correct format"})  
    }

    if(!data.email){
        return res.status(400).send({status:false,message:"email is mandatory"})  
    }
    if(!emailRegex.test(data.email)){
        return res.status(400).send({status:false,message:"email is not in the correct format"})  
    }
    let checkEmail = await teacherModel.findOne({email:data.email})
    if(checkEmail){
        return res.status(409).send({status:false,message:"email already exist"})
    }

    if(!data.password){
        return res.status(400).send({status:false,message:"password is mandatory"})  
    }
    if(!passwordRegex.test(data.password)){
        return res.status(400).send({status:false,message:"password is not in the correct format"})  
    }
    
    let hashedPass = await bcrypt.hash(data.password, 10)
    data["password"] = hashedPass 

    let savedData = await teacherModel.create(data)
    return res.status(201).send({status:true,message:"teacher document created successfully",data:savedData})

}catch(error){
    return res.status(500).send({status:false,message:error.message})
}
}



const getTeacher = async function(req,res){
    try{
        let teacherId = req.params.teacherId
        if (!isValidObjectId(teacherId)) {
            return res.status(400).send({ status: false, message: "teacher Id is not valid" })
        }

        let teacherDocument = await teacherModel.findById(teacherId)

        if (!teacherDocument) {
            return res.status(404).send({ status: false, message: "teacher document not found" })
        }

        return res.status(200).send({status:true,data:teacherDocument})

    }catch(error){
    return res.status(500).send({status:false,message:error.message})
}
}

const loginTeacher = async function(req,res){
    try{
    let data = req.body

    if(Object.keys(data).length == 0){
        return res.status(400).send({status:false,message:"body should not be empty"})
    }

    if(!data.email){
        return res.status(400).send({status:false,message:"email is mandatory"})
    }
    if(!emailRegex.test(data.email)){
        return res.status(400).send({status:false,message:"email is not in the correct format"})  
    }
   
    if(!data.password){
        return res.status(400).send({status:false,message:"password is mandatory"})
    }
    if(!passwordRegex.test(data.password)){
        return res.status(400).send({status:false,message:"password is not in the correct format"})  
    }

    let teacher = await teacherModel.findOne({email:data.email})
    if(!teacher){
        return res.status(404).send({status:false,message:"entered wrong email"})
    }

    let comparePass = await bcrypt.compare(data.password, teacher.password)
    if(!comparePass){
        return res.status(400).send({status:false,message:"entered wrong password"})
    }

    let token = jwt.sign({
        teacherId : teacher._id
    },"backendsecretkey")

    return res.status(200).send({status:true,message:"token created successfully",data:token})

}catch(error){
    return res.status(500).send({status:false,message:error.message})
}
}

module.exports = {createTeacher,loginTeacher,getTeacher}