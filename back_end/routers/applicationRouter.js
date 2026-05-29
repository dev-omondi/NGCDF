
import express from "express"
const router=express.Router()
import { authToken,roleAuth } from "../middleawre/authToken.js"
import{createApplication,
    getApplicants,
    getApllicant,
    updateApplicantsStatus,updateAllocatedAmount} from "../controllers/applicationControllers.js"

router.route("/").post(createApplication)
router.route("/:id").get(authToken,roleAuth("reviewer","finance"),getApllicant)
router.route("/:id").put(authToken,roleAuth("finance","reviewer"),updateApplicantsStatus)
router.route("/allocation/:id").put(authToken,roleAuth("finance"),updateAllocatedAmount)
router.route("/").get(authToken,roleAuth("admin","reviewer","finance"),getApplicants)

export default router

