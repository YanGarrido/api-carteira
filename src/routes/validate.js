import express from 'express';
import { validateUserAndSendCode } from '../controllers/validateController.js';

/**
 * @swagger
 * /validate:
 *   post:
 *     summary: Valida os dados do usuário e envia um código de ativação por e-mail
 *     description: Valida a matrícula, CPF, data de nascimento e chave da aplicação. Caso os dados estejam corretos, gera um código de ativação e envia por e-mail ao usuário.
 *     tags:
 *       - Validação
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - matricula
 *               - email
 *               - cpf
 *               - nascimento
 *               - chave
 *             properties:
 *               matricula:
 *                 type: string
 *                 example: "12345678"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "usuario@exemplo.com"
 *               cpf:
 *                 type: string
 *                 example: "123.456.789-00"
 *               nascimento:
 *                 type: string
 *                 format: date
 *                 example: "2000-01-01"
 *               chave:
 *                 type: string
 *                 format: uuid
 *                 example: "f47ac10b-58cc-4372-a567-0e02b2c3d479"
 *     responses:
 *       '200':
 *         description: Validação bem-sucedida. Código de ativação enviado por e-mail.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 nome:
 *                   type: string
 *                   example: "João da Silva"
 *                 validade:
 *                   type: string
 *                   format: date
 *                   example: "2025-12-31"
 *                 matricula:
 *                   type: string
 *                   example: "12345678"
 *                 curso:
 *                   type: string
 *                   example: "Engenharia de Software"
 *                 codigo_ativacao:
 *                   type: string
 *                   example: "54321"
 *                 codigo_carteira:
 *                   type: string
 *                   example: "12345678"
 *                 url_validacao:
 *                   type: string
 *                   example: "https://validacao.cest.edu.br?RA=12345678&carteira=12345678"
 *                 email:
 *                   type: string
 *                   example: "usuario@exemplo.com"
 *                 nascimento:
 *                   type: string
 *                   example: "01/01/2000"
 *                 turno:
 *                   type: string
 *                   example: "Matutino"
 *       '400':
 *         description: Requisição inválida. Um ou mais campos obrigatórios estão ausentes.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Todos os campos são obrigatórios"
 *       '403':
 *         description: Chave de acesso inválida, expirada ou inativa.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Chave de acesso inválida, expirada ou inativa."
 *       '404':
 *         description: Usuário não encontrado com os dados informados.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Usuário não encontrado!"
 *       '500':
 *         description: Erro interno no servidor.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Ocorreu um erro interno no servidor durante a validação."
 */

const router = express.Router();

router.post('/validate', validateUserAndSendCode);

export default router;