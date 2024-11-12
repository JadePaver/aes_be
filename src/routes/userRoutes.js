// src/routes/userRoutes.js
import express from "express";
import { authenticateToken } from "../middlewares/authenticateToken.js";
import { isUsernameTaken,getAllUsers,registUser,loginUser,getProfileDetailByID, changePassword, updateProfileDetals, resetPassword, toggleLockUser } from "../controllers/userController.js";

const router = express.Router();

// Get all users
router.post("/getAll/:id",authenticateToken, getAllUsers);

// Get a single user by ID
router.post("/register", registUser);
router.post("/login", loginUser);
router.post("/profile/:id", authenticateToken,getProfileDetailByID);
router.post("/update_profile_details/:id", authenticateToken,updateProfileDetals);
router.post("/change_pass/:id", authenticateToken,changePassword);
router.post("/check-username/:id", authenticateToken,isUsernameTaken);
router.post("/reset_pass/:id", authenticateToken,resetPassword);
router.post("/toggleLock/:id", authenticateToken,toggleLockUser);

export default router;
