import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import cloudinary from "../lib/cloudinary.js";

export const signup = async (req, res) => {
  const { firstname,lastname, email, password } = req.body;

  try {
    if (!firstname || !lastname|| !email || !password) {
      return res.status(400).json({ message: "Please provide all required fields" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters long" });
    }

    const existingUser = await User.findOne({ email }); // ✅ renamed 'user' to 'existingUser' to avoid conflict

    if (existingUser) return res.status(400).json({ message: "Email already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      firstname,
      lastname,
      email,
      password: hashedPassword,
    });

    if (newUser) {
      generateToken(newUser._id, res);

      await newUser.save();
      res.status(201).json({
        _id: newUser._id,
        email: newUser.email,
        firstname: newUser.firstname,
        lastname: newUser.lastname,
        ProfilePic: newUser.ProfilePic,
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }

  } catch (error) {
    console.log("ERROR In signup contoller", error.message);
    res.status(500).json({ message: "Internal server error" }); // ✅ fixed typo: 'statuus' → 'status'
  }
};

export const login = async(req, res) => {
const {email,password}=req.body
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "Invalid Credentials" });
    }

   const isPasswordcorrect = await bcrypt.compare(password, user.password)

   if(!isPasswordcorrect){
           return res.status(404).json({ message: "Invalid Credentials" });

   }
   generateToken(user._id, res);

   res.status(200).json({
    _id:user._id,
    email:user.email,
    firstname:user.firstname,
    lastname:user.lastname,
    ProfilePic:user.ProfilePic
   })
  } catch (error) {
    console.log("ERROR In login contoller", error.message);
    res.status(500).json({ message: "Internal server error" });
    
  }

};

export const logout = (req, res) => {
try {
  res.cookie("jwt", "", {  maxAge: 0
  })
  res.status(200).json({ message: "Logout successful" });
  
} catch (error) {
  console.log("ERROR In logout contoller", error.message);
  res.status(500).json({ message: "Internal server error" });
  
}
};

export const updateProfile = async (req, res) => {
  try {
   const {ProfilePic} = req.body;
   const userid = req.user._id
   if(!ProfilePic){
    return res.status(400).json({ message: " Profile Pic is required" });
   }

   const uploadResponse = await cloudinary.uploader.upload(ProfilePic,)  
   const updatedUser = await User.findByIdAndUpdate(userid,{ProfilePic:uploadResponse.secure_url},{new:true})
   res.status(200).json({updatedUser});
  } catch (error) {
    console.log("ERROR In updateProfile contoller", error.message);
    
  }
}

export const checkAuth = (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    console.log("ERROR In checkAuth contoller", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
}