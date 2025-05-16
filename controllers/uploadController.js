import sharp from "sharp";
import db from "../db.js";
import dotenv from "dotenv";

dotenv.config();

export const uploadImage = async (req, res) => {
  const { matricula, email, foto_ext, chave } = req.body;

  if (chave !== process.env.CODIGO) {
    return res.status(403).json({ message: "Chave de acesso inválida." });
  }

  if (!req.file) {
    return res.status(400).json({ message: "Arquivo de imagem não enviado." });
  }

  try {
    const formatoImagem = ["jpeg", "jpg", "png"].includes(foto_ext) ? foto_ext : "jpeg";

    const buffer = await sharp(req.file.buffer)
  .resize({
    width: 800,
    fit: 'inside',
    withoutEnlargement: true,
  })
  .toFormat(foto_ext === 'png' ? 'png' : 'jpeg', { quality: 70 })
  .toBuffer();

    const imagemBase64 = buffer.toString("base64");
    const dataAtual = new Date();

    const [rows] = await db.query(
      "SELECT COUNT(*) AS total FROM tblfoto WHERE intmatriculaid = ?",
      [matricula]
    );

    if (rows[0].total > 0) {
      await db.query(
        `UPDATE tblfoto 
         SET stremail = ?, imgfoto = ?, strfoto = ?, imgext = ?, dtaregistro = ? 
         WHERE intmatriculaid = ?`,
        [email, buffer, imagemBase64, formatoImagem, dataAtual, matricula]
      );
    } else {
      await db.query(
        `INSERT INTO tblfoto 
         (dtaregistro, intmatriculaid, stremail, imgfoto, strfoto, imgext) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [dataAtual, matricula, email, buffer, imagemBase64, formatoImagem]
      );
    }

    res.json({ sucesso: true, mensagem: "Imagem salva com sucesso!" });

  } catch (error) {
    console.error("Erro ao processar a imagem:", error);
    res.status(500).json({ erro: error.mensagem });
  }
};

