import express from 'express';
import { registerDevice } from '../controllers/registerController.js';

/**
 * @swagger
 * /register:
 *   post:
 *     summary: Registra um novo dispositivo no sistema
 *     description: Recebe os detalhes de um dispositivo e uma chave de acesso. Valida a chave e, se for válida, registra o dispositivo no sistema associado a uma matrícula de usuário.
 *     tags:
 *       - Dispositivos
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - matricula
 *               - email
 *               - platformVersion
 *               - imeiNo
 *               - modelName
 *               - deviceName
 *               - cpuType
 *               - chave
 *             properties:
 *               matricula:
 *                 type: string
 *                 description: ID de matrícula do usuário.
 *                 example: "12345678"
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email do usuário.
 *                 example: "usuario@exemplo.com"
 *               platformVersion:
 *                 type: string
 *                 description: Versão do sistema operacional do dispositivo.
 *                 example: "13"
 *               imeiNo:
 *                 type: string
 *                 description: Número IMEI do dispositivo.
 *                 example: "867530901234567"
 *               modelName:
 *                 type: string
 *                 description: Nome do modelo do dispositivo.
 *                 example: "Galaxy S23"
 *               deviceName:
 *                 type: string
 *                 description: Nome definido pelo usuário para o dispositivo.
 *                 example: "Celular de Trabalho"
 *               cpuType:
 *                 type: string
 *                 description: Arquitetura da CPU do dispositivo.
 *                 example: "arm64-v8a"
 *               chave:
 *                 type: string
 *                 format: uuid
 *                 description: Chave de acesso da aplicação que está tentando registrar o dispositivo.
 *                 example: "f47ac10b-58cc-4372-a567-0e02b2c3d479"
 *     responses:
 *       '200':
 *         description: Dispositivo registrado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "sucesso"
 *                 mensagem:
 *                   type: string
 *                   example: "Dispositivo registrado com sucesso para a matrícula 12345678"
 *       '400':
 *         description: Requisição inválida. Um ou mais campos obrigatórios não foram fornecidos.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "O campo obrigatório 'matricula' está ausente."
 *       '403':
 *         description: Acesso negado. A chave de acesso fornecida é inválida, expirou ou está inativa.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Chave de acesso inválida, expirada ou inativa."
 *       '500':
 *         description: Erro interno no servidor. Ocorre por uma falha no banco de dados ou um erro inesperado durante o processamento.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Ocorreu um erro interno no servidor ao registrar o dispositivo."
 */
const router = express.Router();

router.post('/register', registerDevice);

export default router;