import express from "express";
import { authenticateToken } from "../middlewares/authenticateToken.js";
import {
  create,
  getBySubject,
  uploadModule,
  getAttachedFiles
} from "../controllers/moduleController.js";

const router = express.Router();

router.post("/create/:object_data", authenticateToken, create, uploadModule);
router.post("/by_subject/:subject_id", authenticateToken, getBySubject);
router.post("/get_attached_files/:module_id", authenticateToken, getAttachedFiles);

export default router;
