
import expressAsyncHandler from "express-async-handler";
import Users from "../models/usersModel.js";
import generateToken from "../config/generateToken.js";

//..@description------------------------register a new user
//@api-------------------------POST/api/user/registerUser
//@..access-----------------------public
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
    res.status(201).json({
        firstName:user.firstName,
        secondName:user.secondName,
        email:user.email,
        role:user.role,
        department:user.department,
        image:user.image,
        _id:user._id
})

})

//..@api----------------------------POST/api/user/auth
//..@description--------------------Login the user
//..@access----------------------------public
const loginUser=expressAsyncHandler(async(req,res)=>{
    const {email,password}=req.body
    if(!email||!password){
        res.status(400)
        throw new Error("All the fields are mandatory")
    }
    const user=await Users.findOne({email})
    if(!user){
        res.status(404)
        throw new Error("Dont have account register");
        
    }
    const isMatch=await user.matchPassword(password)
    if (!isMatch) {
        res.status(401)
        throw new Error("Invalid email or password");
        
    }
    generateToken(res,user._id)

    res.status(200).json({
        email:user.email,
        firstName:user.firstName,
        secondName:user.secondName,
        department:user.department,
        role:user.role,
        image:user.image,
        phoneNo:user.phoneNo,
        _id:user._id,
        role:user.role
    })

})
//..@description-------------------------------logout the user
//..@api------------------------------------------POST/api/user/logout
//..@access----------------------------------------public
const logoutUser=expressAsyncHandler(async(req,res)=>{
    res.cookie("jwt","",{
        httpOnly:true,
        sameSite:"none",
        secure:process.env.NODE_ENV==="production",
        expires:new Date(0)
    })
    res.status(200).json({
        message:"User Logged Out successfully"
    })
})
//..@description-----------------------------find all the users
//..@api---------------------------------------GET/api/users/
//..@access-------------------------------------private
const getUsers=expressAsyncHandler(async(req,res)=>{
    if(req.user.role!=="admin"){
        res.status(403)
        throw new Error("You are not allowed to access this route")
    }
    const users=await Users.find().select("-password")
    res.status(200).json(users)
})

//..@description-------------------------------get a single user
//..@pai---------------------------------------GET/api/user:id
//..@access---------------------------------------private
const getUser=expressAsyncHandler(async(req,res)=>{
    if(req.user.role!=="admin"){
        res.status(403)
        throw new Error("You are not allowed to access this route")
    }
    const user=await Users.findById(req.params.id)
    if(!user){
        res.status(404)
        throw new Error('user not found')
    }
    res.status(200).json({
        email:user.email,
        _id:user._id,
        firstName:user.firstName,
        secondName:user.secondName,
        role:user.role,
        phoneNo:user.phoneNo,
        image:user.image,
        department:user.department,
        craetedAt:user.createdAt
    })
})
//..@description-----------------------------delete the user details
//..@api--------------------------------------DELETE/api/user:id
//..@access--------------------------------------private
const deleteUser=expressAsyncHandler(async(req,res)=>{
    const user=await Users.findById(req.params._id)
    if(!user){
        res.status(404)
        throw new Error("User not Found")
    }

    if(req.user.role!=="admin"&&req.user._id.toString()!==user._id.toString()){
        res.status(403)
        throw new Error("You can not delete a user")
    }
    if (req.user.role==="admin"&&req.user._id.toString()===user._id.toString()) {
        res.status(403)
        throw new Error("Forbidden,Use own route to delete your account");
        
    }
    await user.deleteOne()
    res.status(200).json({
        message:"User deleted successfully"
    })
})
//..@description---------------------------------update user details
//..@api--------------------------------------------PUT/api/user/
//..@access------------------------------------------private
const updateUser=expressAsyncHandler(async(req,res)=>{
    const user=await Users.findById(req.user._id)
    if(!user){
        res.status(404)
        throw new Error("User not found")
    }
   
    user.firstName=req.body.firstName||user.firstName
    user.secondName=req.body.secondName||user.secondName
    user.email=req.body.email||user.email
    user.image=req.body.image||user.image
    user.phoneNo=req.body.phoneNo||user.phoneNo

    if(req.body.password){
        user.password=req.body.password
    }

    const updatedUser=await user.save()
    res.status(201).json({
        firstName:updatedUser.firstName,
        secondName:updatedUser.secondName,
        _id:updatedUser._id,
        email:updatedUser.email,
        phoneNo:user.phoneNo,
        role:updatedUser.role,
        department:updatedUser.department,
        createdAt:updatedUser.createdAt
    })
})

//..@description-------------------------update user roles and department
//..@api----------------------------------PUT/api/user/:id
//..access---------------------------------private and forbiden

const updateRole=expressAsyncHandler(async(req,res)=>{
    const user=await Users.findById(req.params.id)
    if(!user){
        res.status(404)
        throw new Error("User not found");
    }
    const {role,department,firstName,secondName,email,password}=req.body
    if(firstName,secondName,email,password){
        res.status(403)
        throw new Error("Personal details are forbidden");   
    }
    user.role=req.body.role||user.role
    user.department=req.body.department||user.department

    const updatedRole=await user.save()
    res.status(200).json({
        firstName:updatedRole.firstName,
        secondName:updatedRole.secondName,
        _id:updatedRole._id,
        email:updatedRole.email,
        phoneNo:user.phoneNo,
        image:user.image,
        role:updatedRole.role,
        department:updatedRole.department
    })
})
//..@description---------------------------------------get a single user who is logged in 
//..api------------------------------------------------PUT/api/user/:id
//..@access--------------------------------------------private
const getProfile=expressAsyncHandler(async(req,res)=>{
    const user=req.user
    if(!user){
        res.status(401)
        throw new Error("Unauthorized cant not access this route")
    }
    res.status(200).json(user)
})

export{registerUser,
        loginUser,
        getUsers,
        getUser,
        getProfile,
        deleteUser,
        updateRole,
        updateUser,
        logoutUser
}