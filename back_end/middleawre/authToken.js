
import Users from "../models/usersModel.js";
import expressAsyncHandler from "express-async-handler";
import jwt from "jsonwebtoken"

const authToken=expressAsyncHandler(async(req,res,next)=>{
     console.log("Cookies received:", req.cookies);
    console.log("JWT cookie:", req.cookies?.jwt);

    let token
    token=req.cookies.jwt

    if (!token) {
        res.status(401)
        throw new Error("Not authorized,No token was found")
    }
    try {
        const decoded=jwt.verify(token,process.env.ACCESS_KEY)
        req.user=await Users.findById(decoded.userId).select("-password")

        if(!req.user){
            res.status(401)
            throw new Error("User no longer exists")
        }
        next()
    } catch (error) {
       res.status(401)
       throw new Error("Not authorized,Invalid or expired token") 
    }
})

const roleAuth=(...roles)=>{
    return (req,res,next)=>{
        if(!req.user){
            res.status(401)
            throw new Error("Not authenticated")
        }
        if(!roles.includes(req.user.role)){
            res.status(403)
            throw new Error(`User with role ${req.user.role} is not allowed to access the route`)
        }
        next()

    }
}

export {authToken,roleAuth}