
import express from "express"
import dotenv from "dotenv"
import { notFound ,errorHandler} from "./middleawre/errorHandler.js"
dotenv.config()
import dbConnect from "./config/connectDb.js"

const app=express()

const port=process.env.PORT||4000

dbConnect()

app.use(notFound)
app.use(errorHandler)
app.listen(port,()=>{
    console.log("Server is running to port",port)
})