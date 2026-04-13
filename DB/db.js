import mongoose from "mongoose";   
const DataSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: "user" },
    timestamp: { type: Date, default: Date.now }
});
    const User1 = mongoose.model("User1", DataSchema);
export default User1;