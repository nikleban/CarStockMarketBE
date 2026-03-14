import express from "express";
import { registerUser, loginUser } from "#/controllers/User/userController.js";
import protect from "#/middlewares/AuthMiddleware.js";
import { getUserWithToken } from "#/controllers/User/userController.js";
import { logoutUser } from "#/controllers/User/userController.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", protect, getUserWithToken);
router.post("/logout", protect, logoutUser);

export default router;
