
import express from "express"
const router=express.Router()
import { authToken,roleAuth } from "../middleawre/authToken.js"
import{createApplication,
    getApplicants,
    getApllicant,
    updateApplicantsStatus} from "../controllers/applicationControllers.js"

router.route("/").post(createApplication)
router.route("/:id").get(getApllicant)
router.route("/:id").put(updateApplicantsStatus)
router.route("/").get(authToken,roleAuth("admin","reviewer","finance"),getApplicants)

export default router

