const express = require('express')
const route = require('./route/route')
const mongoose = require('mongoose')
const app = express()

app.use(express.json())
mongoose.set('strictQuery', false);
mongoose.connect("mongodb+srv://khushi123456789:khushi123456789@cluster0.xcf6vy2.mongodb.net/BackendTask?retryWrites=true&w=majority"
) .then(()=> console.log("MongoDB is connected"))
.catch(err => console.log(err))

app.use("/",route)

app.listen(3000 , ()=>{
    console.log("Experss app is running on localhost")
})