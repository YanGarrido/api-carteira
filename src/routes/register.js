import express from 'express';
import { registerDevice } from '../controllers/registerController';

const router = express.Router();

router.post('/register', registerDevice);

export default router;