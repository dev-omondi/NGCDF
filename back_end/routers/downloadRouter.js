
import express from "express";
import { downloadApprovedApplicants } from "../controllers/downloadController.js";
import { authToken } from "../middleawre/authToken.js";
import { roleAuth } from "../middleawre/authToken.js";

const router=express.Router()

router.route("/").get(authToken,roleAuth("admin"),downloadApprovedApplicants)

export default router