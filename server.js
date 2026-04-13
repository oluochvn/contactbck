import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import mongoose from "mongoose";
import User from "./contact/user.js";
import User1 from "./DB/db.js";
import session from "express-session";

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors(
));
app.use(session({
    secret: "2210",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
}));

    mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("DB connected"))
  .catch(err => console.log(err));

       function isAuth(req, res, next) {
    if (!req.session.user) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    next();
    }

app.get("/test", (req,res)=>{
    res.send("working")
})
    app.post("/login", async (req, res) => {
        const { username, password } = req.body;
        try{
            const existingUser = await User1.findOne({ username });
        if (!existingUser) {
            return res.status(400).json({ message: "Invalid username or password" });
            
        }
        const isPasswordValid = await bcrypt.compare(password, existingUser.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid username or password" });
        }
        
        req.session.user = {
      id: existingUser._id,
      username: existingUser.username,
      role: existingUser.role
    };
        res.status(200).json({ message: "Login successful" });
        }

        catch (error) {
            console.error(error);
            res.status(500).json({ message: "Server error" });
        }   
        
    });
     app.post("/register",async (req, res) => {
        const { username, password } = req.body;
        try{
            const existingUser = await User1.findOne({ username });

        if (existingUser) {
            return res.status(400).json({ message: "Username already exists" });
        }
            if (!username || !password) {
            return res.status(400).json({ message: "Username and password are required" });
        }
        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters long" });
        }
        
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User1({ username, password: hashedPassword });
        await newUser.save();
        res.status(201).json({ message: "User registered successfully" });
        }
        
        catch (error) {
            console.error(error);
            res.status(500).json({ message: "Server error" });
        } 
        });
        app.delete("/deleteuser",isAuth, async (req, res) => {
            
            try {
                const user = await User1.findById(req.session.user.id);
                if (!user) {
                    return res.status(404).json({ message: "User not found" });
                }
                await user.deleteOne({ _id: user._id });

                req.session.destroy(() => {
                res.status(200).json({ message: "User deleted successfully" });
                });
                
            } catch (error) {
                console.error(error);
                res.status(500).json({ message: "Server error" });
            }
        });

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