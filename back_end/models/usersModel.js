
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
        lowercase:true
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        enum:["admin","reviewer","citizen","finance","technician"],
        default:"citizen"
    },
    phoneNo:{
        type:String
    },
    image:{
        type:String
    },
    department:{
        type:String,
        lowercase:true,
        enum:[""],
        default:null
    }
},{timestamps:true})

userSchema.pre("save",async function() {
   if (!this.isModified("password")) return 
   const salt=await bcrypt.genSalt(10) 
   this.password=await bcrypt.hash(this.password,salt)

})
userSchema.methods.matchPassword=async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword,this.password)
}
const Users=mongoose.model("Users",userSchema)
export default Users