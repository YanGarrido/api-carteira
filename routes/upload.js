import express from "express";
import { uploadImage } from "../controllers/uploadController.js";

const router = express.Router();
/**
 * @swagger
 * /:
 *   post:
 *     summary: Faz o upload de uma imagem em base64, redimensiona a imagem para ficar com uma largura maxima de 600 pixels e 150dpi de densidade e após isso salva no banco de dados
 *     tags:
 *       - Upload
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - matricula
 *               - email
 *               - chave
 *               - image
 *               - foto_ext
 *             properties:
 *               matricula:
 *                 type: integer
 *                 example: 12345
 *               email:
 *                 type: string
 *                 format: email
 *                 example: usuario@example.com
 *               chave:
 *                 type: string
 *                 description: Chave de autenticação (definida em .env)
 *               image:
 *                 type: string
 *                 format: base64
 *                 description: Imagem em base64 (sem cabeçalho data URI)
 *               foto_ext:
 *                 type: string
 *                 enum: [jpg, jpeg, png]
 *                 example: jpg
 *     responses:
 *       200:
 *         description: Imagem salva com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 sucesso:
 *                   type: boolean
 *                   example: true
 *                 mensagem:
 *                   type: string
 *                   example: Imagem salva com sucesso!
 *       400:
 *         description: Erro de validação
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Imagem em base64 não fornecida.
 *       403:
 *         description: Chave inválida
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Chave de acesso inválida.
 *       500:
 *         description: Erro interno ao processar imagem
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 erro:
 *                   type: string
 *                   example: Erro interno no servidor
 */

router.post("/", uploadImage);

export default router;
