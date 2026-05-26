const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken")

async function userRegisterController(req,res){
    const {email,name,password} = req.body

    const isExist = await userModel.findOne({
        email: email
    })

    if(isExist){
        return res.status(422).json({
            message: "User already exist",
            success: "failed"
        })
    }
    
    const user = await userModel.create({
        email,password,name
    })

    const token = jwt.sign({userId :user._id},process.env.JWT_SECRET,{expiresIn:"3d"})
    
    res.cookie("token",token)

    res.status(201).json({
        user:{
            _id: user._id,
            email: user.email,
            name: user.name
        },
        token
    })
}
/**
 * TODO: userLoginController
 * 1. validate email and password
 * 2. Post/api/auth/login
 * 3. if user not found, return
 */
async function userLoginController(req,res){
    const {email,password} = req.body
    const user=await userModel.findOne({email}).select("+password")
    if(!user){
        return res.status(404).json({
            message: "User not found",
        })
    }
    const isValidPassword=await user.comparePassword(password)
    if(!isValidPassword){
        return res.status(401).json({
            message: "Invalid password"
        })
    }
    const token = jwt.sign({userId :user._id},process.env.JWT_SECRET,{expiresIn:"3d"})
    
    res.cookie("token",token)

    res.status(200).json({
        user:{
            _id: user._id,
            email: user.email,
            name: user.name
        },
        token
    })
}

module.exports ={
    userRegisterController
}