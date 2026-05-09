
import mongoose from "mongoose";

const dbConnect=async(req,res)=>{
    try {
        const con=await mongoose.connect(process.env.CONNECTION_STRING)
        console.log(`Database connected successfuly`)
        console.log(con.connection.host)
        console.log(con.connection.name)
    } catch (error) {
       console.log(error) 
       process.exit(1)
    }
}

export default dbConnect