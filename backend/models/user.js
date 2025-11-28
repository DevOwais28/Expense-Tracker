import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: String,
    role:{
        type:String,
        enum:["user","admin"],
        default: 'user'
    },
    permissions:[{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Permission",
    }],
    avatar: {type :String , default:""} , // optional: show on dashboard
    createdAt: { type: Date, default: Date.now }
});


export const User = mongoose.model("User", userSchema);
