import express from 'express';
import pool from '../db.js';

const router = express.Router();

router.get('/download/:matricula', async (req, res) => {
  const { matricula } = req.params;

  try {
    const [rows] = await pool.query(
      'SELECT imgfoto, imgext FROM tblfoto WHERE intmatriculaid = ?',
      [matricula]
    );

    if (rows.length === 0) {
      return res.status(404).json({ erro: 'Imagem não encontrada' });
    }

    const { imgfoto, imgext } = rows[0];

    // Define o tipo de conteúdo e força o download
    res.setHeader('Content-Type', `image/${imgext}`);
    res.setHeader('Content-Disposition', `attachment; filename="foto_${matricula}.${imgext}"`);

    // imgfoto é um buffer (blob), envie diretamente
    res.send(imgfoto);
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: 'Erro ao baixar imagem' });
  }
});

export default router;
