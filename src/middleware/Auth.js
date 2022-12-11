const jwt = require("jsonwebtoken")

const authentication = async function(req,res,next){
    try{
        let bearerToken = req.headers["authorization"]
        if(!bearerToken){
            return res.status(400).send({status:false,message:"bearer token is mandatory"})     
        }
       
        let token = bearerToken.split(" ")[1]
        jwt.verify(token,"backendsecretkey",async(err,valid) => {
            if(err){
                return res.status(401).send({status:false,message:"invalid token"})
            }
            if(valid){
                req["teacherId"] = valid.teacherId
                next()
            }
    
        })
    }catch(error){
        return res.status(500).send({status:false,message:error.message})
    }
}

module.exports = {authentication}