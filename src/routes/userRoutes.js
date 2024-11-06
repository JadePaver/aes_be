// src/routes/userRoutes.js
import express from "express";
import { authenticateToken } from "../middlewares/authenticateToken.js";
import { getAllUsers,registUser,loginUser,getProfileDetailByID, changePassword } from "../controllers/userController.js";

const router = express.Router();

// Get all users
router.get("/", getAllUsers);

// Get a single user by ID
router.post("/register", registUser);
router.post("/login", loginUser);
router.post("/profile/:id", authenticateToken,getProfileDetailByID);
router.post("/change_pass/:id", authenticateToken,changePassword);

export default router;
