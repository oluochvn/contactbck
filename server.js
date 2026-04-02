import express from "express"
import cor from "cors"
import dotenv from "dotenv"

const app = express();

app.get("/test", (req,res)=>{
    res.send("working")
})
app.listen(3000, ()=>{
    console.log("running on port 3000")
})