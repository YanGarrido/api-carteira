import express from 'express';
import dotenv from 'dotenv';
import uploadRoutes from './routes/upload.js';
import fotoRoutes from './routes/download.js';
import transformRoutes from './routes/transformarbase64.js';
dotenv.config();

const app = express();
app.use(express.json({ limit: "10mb" }));


app.use('/api/upload', uploadRoutes);
app.use('/api/foto', fotoRoutes);
app.use('/api/transformar', transformRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
