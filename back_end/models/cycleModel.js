
import mongoose from "mongoose";

const cycleSchema=mongoose.Schema({
    financialYear:{
        type:String,
        required:true,
        unique:true
    },
    openningDate:{
        type:Date,
        required:true
        },
    closingDate:{
        type:Date,
        required:true
    },
    status:{
        type:String,
        enum:["open","closed"],
        default:"open"
    }
   
},{timestamps:true})
const Applicationcycle=mongoose.model("Applicationcycle",cycleSchema)
export default Applicationcycle