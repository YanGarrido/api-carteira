import express from 'express';
import { registerDevice } from '../controllers/registerController.js';

const router = express.Router();

router.post('/register', registerDevice);

export default router;