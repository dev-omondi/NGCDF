
import express from "express"
const router=express.Router()
import { authToken,roleAuth } from "../middleawre/authToken.js"
import{createApplication,
    getApplicants,
    getApllicant,
    updateApplicantsStatus,
    updateAllocatedAmount,
    getApprovedApplicantsStats,
    checkApplicationStatus
} from "../controllers/applicationControllers.js"
   
router.route("/").get(getApplicants)
router.route("/").post(createApplication)
router.route("/status").post(checkApplicationStatus)
router.route("/stats").get(getApprovedApplicantsStats)
router.route("/:id").get(authToken,roleAuth("reviewer","finance"),getApllicant)
router.route("/:id").put(authToken,roleAuth("finance","reviewer"),updateApplicantsStatus)
router.route("/allocation/:id").put(authToken,roleAuth("finance"),updateAllocatedAmount)


export default router

