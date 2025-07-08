import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
        minLength:6
    },
    firstname:{
        type:String,
        required:true
    },
    lastname:{
        type:String,
        required:true
    },
    ProfilePic:{
        type:String,
        default:"",
    },
},
{timestamps:true}
);

const User = mongoose.model("User",userSchema);
export default User; 