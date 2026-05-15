
import express from "express";
const router=express.Router()
import {registerUser,
        loginUser,
        getUsers,
        getUser,
        deleteUser,
        updateRole,
        updateUser} from "../controllers/usersController.js"
import { registerSchema } from "../config/authVallidator.js";        
import { authToken } from "../middleawre/authToken.js";
import { roleAuth } from "../middleawre/authToken.js";
import validate from "../middleawre/joiValidator.js";

router.route("/register").post(validate(registerSchema),registerUser)
router.route("/auth").post(loginUser)
//seperate user self-routes
router.route("/profile").get(authToken,getUsers)
router.route("/profile").put(authToken,updateUser)

//forbiden routes for admin and allowed few
router.route("/").get(authToken,roleAuth("admin"),getUsers)
router.route("/:id").put(authToken,roleAuth("admin"),updateRole)
router.route("/:id").delete(authToken,roleAuth("admin"),deleteUser)

export default router

