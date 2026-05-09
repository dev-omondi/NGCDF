
import expressAsyncHandler from "express-async-handler";
import Users from "../models/usersModel.js";
import generateToken from "../config/generateToken.js";

//@register user-------------------------POST/api/user/registerUser
const registerUser=expressAsyncHandler(async(req ,res)=>{
    const{firstName,secondName,email,password}=req.body
    
    const userExist=await Users.findOne({email})
    if(userExist){
        res.status(409)
        throw new Error("Already have an account login or use a diffrent email")
    }
    //generate token
    const user=await Users.create({
        email,firstName,secondName,password,
    })
    generateToken(res,user._id)
    res.status(200).json({
        firstName:user.firstName,
        secondName:user.secondName,
        email:user.email,
        role:user.role,
        department:user.department,
        _id:user._id
})

})