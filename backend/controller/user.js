const express= require("express");
const path = require("path");
const router= express.Router();
const {upload} = require("../multer");
const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const { error } = require("console");
const { JsonWebTokenError } = require("jsonwebtoken");
const fs = require("fs");
const jwt = require("jsonwebtoken");
const sendMail = require("../utils/sendMail");
const sendToken = require("../utils/jwtToken");
const User = require("../model/user");

router.post("/create-user", upload.single("file"), async (req,res, next)=>{
  try{
  const {name, email, password} = req.body;
  const userEmail= await User.findOne({email});

  if(userEmail){
    const filename= req.file.filename;
    const filePath = `uploads/${filename}`;
   fs.unlink(filePath, (err)=>{
    if(err){
      console.log(err);
      res.status(500).json({messsage:"Error deleting file"});
    }
   });

    return next(new ErrorHandler("User already exists", 400));
 }

    const filename = req.file.filename;
    const fileUrl = path.join(filename);

    const user = {
        name: name,
        email:email,
        password:password,
        avatar: fileUrl,
    };

     const activationToken = createActivationToken(user);
     
     const activationUrl= `http://localhost:5173/activation/${activationToken}`;

     try{
       await sendMail({
        email: user.email,
        subject:"Activate your account",
        message:`Hello ${user.name}, please click on the link to activate your account: ${activationUrl}`,
       })
       res.status(201).json({
        success: true,
        message: `please check your email:- ${user.email} to activate your account !`
       })
     }catch(err){
       return next(new ErrorHandler(err.message, 400));
     }
     
      // console.log("User created:", newUser);
    }
    catch (err){
      return next(new ErrorHandler(err.message, 400));
    }
});

// create activation token
const createActivationToken = (user) =>{
  return jwt.sign(user, process.env.ACTIVATION_SECRET,{
     expiresIn: "5m",
  }) 
}

// activate user
router.post("/activation", catchAsyncErrors(async(req, res, next)=>{
  try{
  const {activation_token} = req.body;

  const newUser = jwt.verify(activation_token, process.env.ACTIVATION_SECRET);

  if(!newUser){
    return next(new ErrorHandler("Invalid token", 400));
  }

  const {name, email, password, avatar} = newUser;
  console.log("Email from token:", email);
   let user = await User.findOne({email});

    if(user){
      return next(new ErrorHandler("User already exists", 400))
    }

    const createdUser = await User.create({
      name,
      email,
      avatar,
      password,
    })
    sendToken(createdUser, 201, res);
  
  }catch(err){
    return next(new ErrorHandler(err.message, 500));
  }
}));

module.exports = router;