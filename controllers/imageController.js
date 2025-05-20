import db from '../db.js';

export const transformImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Nenhuma imagem foi enviada.' });
    }

    if (req.file.mimetype !== 'image/jpeg') {
      return res.status(400).json({ error: 'Apenas imagens JPG são aceitas.' });
    }

    const base64Image = req.file.buffer.toString('base64');

    // Salvar no banco de dados
    const [result] = await db.execute(
      'INSERT INTO imagens (nome_arquivo, imagem_base64) VALUES (?, ?)',
      [req.file.originalname, base64Image]
    );

    res.status(201).json({
      message: 'Imagem salva com sucesso.',
      id: result.insertId,
      base64: base64Image,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao processar a imagem.' });
  }
};
