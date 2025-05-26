import db from '../db.js';

export const downloadImage = async (req, res) => {
  const { matricula } = req.params;

  try {
    const [rows] = await db.query(
      'SELECT imgfoto, imgext FROM tblfotoredimensionadadpi WHERE intmatriculaid = ?',
      [matricula]
    );

    if (rows.length === 0) {
      return res.status(404).json({ erro: 'Imagem não encontrada' });
    }

    const { imgfoto, imgext } = rows[0];

    res.setHeader('Content-Type', `image/${imgext}`);
    res.setHeader('Content-Disposition', `attachment; filename="foto_${matricula}.${imgext}"`);

    res.send(imgfoto);
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: 'Erro ao baixar imagem' });
  }
};
