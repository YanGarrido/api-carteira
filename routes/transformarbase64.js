import express from 'express';
import multer from 'multer';
import { transformImage } from '../controllers/imageController.js';

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Rota POST para receber o upload da imagem
router.post('/', upload.single('image'), transformImage);

export default router;
