import express from 'express';
import dotenv from 'dotenv';
import uploadRoutes from './src/routes/upload.js';
import registerRoutes from './src/routes/register.js';
import validateRoutes from './src/routes/validate.js';
import { serveSwagger, setupSwagger } from './swagger.js';
dotenv.config();

const app = express();
app.use(express.json({ limit: "20mb" }));

app.use('/api-docs', serveSwagger, setupSwagger);
app.use('/api', uploadRoutes, registerRoutes, validateRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log('Documentação Swagger em http://localhost:3000/api-docs');
});
