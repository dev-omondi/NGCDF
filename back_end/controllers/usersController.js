
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
        _id:user._id,
        role:user.role
    })

})
//..@description-----------------------------find all the users
//..@api---------------------------------------GET/api/users/
//..@access-------------------------------------private
const getUsers=expressAsyncHandler(async(req,res)=>{
    const Users=await Users.find().select("-password")
    res.status(200).json(Users)
})

//..@description-------------------------------get a single user
//..@pai---------------------------------------GET/api/user:id
//..@access---------------------------------------private
const getUser=expressAsyncHandler(async(req,res)=>{
    
    const user=req.user
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
        department:user.department
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

    if(req.body.password){
        user.password=req.body.password
    }

    const updatedUser=await user.save()
    res.status(201).json({
        firstName:updatedUser.firstName,
        secondName:updatedUser.secondName,
        _id:updatedUser._id,
        email:updatedUser.email,
        role:updatedUser.role,
        department:updateUser.department
    })
})

//..@description-------------------------update user roles and department
//..@api----------------------------------PUT/api/user/:id
//..access---------------------------------private and forbiden

const updateRole=expressAsyncHandler(async(req,res)=>{
    const user=await Users.findById(req.params._id)
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
        role:updatedRole.role,
        department:updatedRole.department
    })
})

export{registerUser,
        loginUser,
        getUsers,
        getUser,
        deleteUser,
        updateRole,
        updateUser
}