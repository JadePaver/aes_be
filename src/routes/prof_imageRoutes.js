import express from 'express';
import prisma from '../prismaClient.js';
import { uploadImage, uploadImageHandler,serveImage } from '../controllers/prof_imageController.js';

const router = express.Router();

router.post('/upload/:id', uploadImage, uploadImageHandler);
router.get('/get/:filename', serveImage);

export default router;
