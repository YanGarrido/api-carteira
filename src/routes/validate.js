import express from 'express';
import { validateUserAndSendCode } from '../controllers/validateController.js';

const router = express.Router();

router.post('/validate', validateUserAndSendCode);

export default router;