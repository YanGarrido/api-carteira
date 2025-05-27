import express from 'express';
import multer from 'multer';
import { transformImage } from '../controllers/imageController.js';

const router = express.Router();
/**
 * @swagger
 * /api/transformar:
 *   post:
 *     summary: Faz upload de imagem JPG via multipart/form-data, converte para base64 e salva no banco
 *     tags:
 *       - Upload
 *     consumes:
 *       - multipart/form-data
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - image
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Imagem JPG a ser enviada
 *     responses:
 *       201:
 *         description: Imagem salva com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Imagem salva com sucesso.
 *                 id:
 *                   type: integer
 *                   example: 101
 *                 base64:
 *                   type: string
 *                   format: base64
 *                   description: Imagem convertida para base64
 *       400:
 *         description: Requisição inválida ou imagem ausente/errada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Nenhuma imagem foi enviada.
 *       500:
 *         description: Erro ao processar a imagem
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Erro ao processar a imagem.
 */

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/', upload.single('image'), transformImage);

export default router;
