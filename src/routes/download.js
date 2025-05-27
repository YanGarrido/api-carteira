import express from 'express';
import { downloadImage } from '../controllers/downloadController.js';

const router = express.Router();
/**
 * @swagger
 * /download/{matricula}:
 *   get:
 *     summary: Faz download da imagem de um usuário pela matrícula
 *     tags:
 *       - Imagens
 *     parameters:
 *       - in: path
 *         name: matricula
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da matrícula do usuário
 *     responses:
 *       200:
 *         description: Imagem retornada com sucesso
 *         content:
 *           image/jpeg:
 *             schema:
 *               type: string
 *               format: binary
 *           image/png:
 *             schema:
 *               type: string
 *               format: binary
 *       404:
 *         description: Imagem não encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 erro:
 *                   type: string
 *                   example: Imagem não encontrada
 *       500:
 *         description: Erro ao baixar imagem
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 erro:
 *                   type: string
 *                   example: Erro ao baixar imagem
 */
router.get('/download/:matricula', downloadImage);

export default router;
