
import mongoose from "mongoose";
import bcrypt from "bcrypt"

const userSchema=mongoose.Schema({
    firstName:{
        type:String,
        required:true,
        trim:true
    },
    secondName:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        lowwerCase:true
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        enum:["admin","staff","citizen"],
        default:"citizen"
    },
    department:{
        type:String,
        enum:["Bursary","Project","Finance","ICT","Administration"],
        default:null
    }
},{timestamps:true})

userSchema.pre("save",async function() {
   if (!this.isModified("password")) return
   const salt=await bcrypt.genSalt(10) 
   this.password=bcrypt.hash(this.password,salt)
})
userSchema.methods.matchPassword=async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword,this.password)
}
const Users=mongoose.model("Users",userSchema)
export default Users