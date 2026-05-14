
import express from "express"
const router=express.Router()

import{createApplication,
    getApplicants,
    getApllicant,
    updateApplicantsStatus} from "../controllers/applicationControllers.js"

router.route("/").post(createApplication)
router.route("/:id").get(getApllicant)
router.route("/:id").put(updateApplicantsStatus)
router.route("/").get(getApplicants)

export default router

