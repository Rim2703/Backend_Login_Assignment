const express = require("express")
const mongoose = require("mongoose")
mongoose.set('strictQuery', false)
const route = require("./routes/route")
const app = express()

app.use(express.json())

mongoose.connect("mongodb+srv://khushi123456789:khushi123456789@cluster0.xcf6vy2.mongodb.net/BackendTask?retryWrites=true&w=majority",
    { useNewUrlParser: true })
    .then(() => console.log("mongoDB is connected"))
    .catch(err => console.log(err))

app.use("/", route)
app.listen(3000, () => {
    console.log("express app running on port 3000");
})