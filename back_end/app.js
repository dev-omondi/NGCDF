
import express, { urlencoded } from "express"
import dotenv from "dotenv"
import { notFound ,errorHandler} from "./middleawre/errorHandler.js"
import r2Router from "./routers/r2Routes.js"
dotenv.config()
import dbConnect from "./config/connectDb.js"
import cookieParser from "cookie-parser"
import userRouter from "./routers/userRouter.js"

const app=express()

const port=process.env.PORT||4000
dbConnect()

//..@middleawares
app.use(cors())
app.use(express.json())
app.use(urlencoded({extended:true}))
app.use(cookieParser())

//routers
app.use("/upload",r2Router)
app.use("/user",userRouter)


//error handler middleware
app.use(notFound)
app.use(errorHandler)
app.listen(port,()=>{
    console.log("Server is running to port",port)
})