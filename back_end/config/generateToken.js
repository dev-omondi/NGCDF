
import jwt from "jsonwebtoken"

const generateToken=(res,userId)=>{
    const token=jwt.sign({userId},process.env.ACCESS_KEY,{expiresIn:"1d"})

    res.cookie("jwt",token,{
        httpOnly:true,
        secure:process.env.NODE_ENV!=="development",
        sameSite:"strict",
        maxAge:1*24*60*60*1000
    })
    return token
}
export default generateToken