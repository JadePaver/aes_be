import express from "express";
import { authenticateToken } from "../middlewares/authenticateToken.js";
import {
  uploadImage,
  uploadImageHandler,
  serveImage,
  getByID,
} from "../controllers/prof_imageController.js";

const router = express.Router();

router.post("/upload/:id", authenticateToken, uploadImage, uploadImageHandler);
router.get("/get/:filename", authenticateToken, serveImage);
router.post("/getByID", authenticateToken, getByID);

export default router;
