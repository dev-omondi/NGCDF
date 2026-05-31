
import express from "express";
import { createCycle,
    getCycle,
    getCycles,
    getOpenCycle,
    updateCycle,
    deleteCycle
 } from "../controllers/cycleContoller.js";
import { authToken,roleAuth } from "../middleawre/authToken.js";

const router=express.Router()

router.route("/").post(authToken,roleAuth("admin"),createCycle)
                .get(authToken,roleAuth("admin"),getCycles)
router.route("/:id").get(authToken,roleAuth("admin"),getCycle)
                    .put(authToken,roleAuth("admin"),updateCycle)
                    .delete(authToken,roleAuth("admin"),deleteCycle)
router.route("/open").get(getOpenCycle)         

export default router