
import express from "express"
import "dotenv/config"
import { notFound ,errorHandler} from "./middleawre/errorHandler.js"
import r2Router from "./routers/r2Routes.js"
import dbConnect from "./config/connectDb.js"
import cookieParser from "cookie-parser"
import userRouter from "./routers/userRouter.js"
import applicationRouter from "./routers/applicationRouter.js"
import cycleRouter from "./routers/cycleRouter.js"
//import "./config/applicationJob.js"
import cors from "cors";

const app=express()

const port=process.env.PORT||4000
dbConnect()

//..@middleawares
app.use(cors({
     origin: [
    "http://localhost:3000",
    "https://ngcdf.vercel.app",
    "https://ngcdf-2f7zqm4ne-dev-omondi-s-projects.vercel.app"
],
    credentials:true
}))
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())

//routers
app.use("/api/upload",r2Router)
app.use("/api/users",userRouter)
app.use("/api/cycle",cycleRouter)
app.use("/api/application",applicationRouter)


//error handler middleware
app.use(notFound)
app.use(errorHandler)
app.listen(port,()=>{
    console.log("Server is running to port",port)
})