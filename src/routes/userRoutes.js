// src/routes/userRoutes.js
import express from "express";
import { authenticateToken } from "../middlewares/authenticateToken.js";
import { isUsernameTaken,getAllUsers,registUser,loginUser,getProfileDetailByID, changePassword, updateProfileDetals } from "../controllers/userController.js";

const router = express.Router();

// Get all users
router.get("/", getAllUsers);

// Get a single user by ID
router.post("/register", registUser);
router.post("/login", loginUser);
router.post("/profile/:id", authenticateToken,getProfileDetailByID);
router.post("/update_profile_details/:id", authenticateToken,updateProfileDetals);
router.post("/change_pass/:id", authenticateToken,changePassword);
router.post("/check-username/:id", authenticateToken,isUsernameTaken);

export default router;
