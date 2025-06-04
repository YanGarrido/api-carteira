import express from "express";
import { uploadImage } from "../controllers/uploadController.js";

const router = express.Router();
/**
 * @swagger
 * /upload:
 *   post:
 *     summary: Faz o upload de uma imagem em base64, redimensiona a imagem para ficar com uma largura máxima de 600 pixels e 150dpi de densidade e após isso salva no banco de dados
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
 *               - foto
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
 *               foto:
 *                 type: string
 *                 format: base64
 *                 description: Imagem em base64 (sem cabeçalho data URI)
 *               foto_ext:
 *                 type: string
 *                 enum: [jpeg, jpg, png]
 *                 example: jpg
 *     responses:
 *       200:
 *         description: Imagem salva/atualizada com sucesso
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
 *                   example: Imagem para a matrícula 12345 foi salva/atualizada com sucesso!
 *       400:
 *         description: Erro de validação ou formato de imagem inválido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Todos os campos são obrigatórios: matricula, email, chave, foto, foto_ext"
 *       403:
 *         description: Chave de acesso inválida
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
 *                 message:
 *                   type: string
 *                   example: Ocorreu um erro interno no servidor ao processar a imagem. Tente novamente mais tarde.
 */


router.post("/upload", uploadImage);

export default router;