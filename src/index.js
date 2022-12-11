const express = require("express")
const mongoose = require("mongoose")
mongoose.set('strictQuery', false)
const route = require("./routes/route")
const app = express()

app.use(express.json())

mongoose.connect("mongodb+srv://Rajnigandha-2402:LG1AyAT8nJB77pPC@cluster0.t7g9trm.mongodb.net/project-6",
{useNewUrlParser: true})
.then(() => console.log("mongoDB is connected"))
.catch(err => console.log(err))

app.use("/",route)
app.listen(3000, ()=>{
    console.log("express app running on port 3000");
})