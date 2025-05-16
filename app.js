import express from 'express';
import dotenv from 'dotenv';
import uploadRoutes from './routes/upload.js';
import fotoRoutes from './routes/teste.js';

dotenv.config();

const app = express();
app.use(express.json());

app.use('/api/upload', uploadRoutes);
app.use('/api/foto', fotoRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
