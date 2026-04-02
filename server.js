import express from "express"
import cor from "cors"
import dotenv from "dotenv"
import mongoose from "mongoose";
import User from "./contact/user.js";

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

    mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("DB connected"))
  .catch(err => console.log(err));

app.get("/test", (req,res)=>{
    res.send("working")
})
app.post("/contact", async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const newUser = new User({ name, email, message });
    await newUser.save();

    res.status(201).json({ message: "Message saved successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});
app.listen(3000, ()=>{
    console.log("running on port 3000")
})