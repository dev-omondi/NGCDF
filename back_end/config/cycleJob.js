
import nodeCron from "node-cron";
import Applicationcycle from "../models/cycleModel.js";

nodeCron.schedule("0 0 * * *",async()=>{
    const now =new Date()
    try {
        await Applicationcycle.findOneAndUpdate(
        {
            closingDate: { $lt: now },
            status: "open",
        },
        {
            $set: { status: "closed" },
        },{
            new:true
        }
        );
    } catch (error) {
        console.log(error)
    }
})