import sharp from "sharp";
import db from "../db.js";
import dotenv from "dotenv";

dotenv.config();

export const uploadImage = async (req, res) => {
  const { matricula, email, chave, image, foto_ext } = req.body;

  if (chave !== process.env.CODIGO) {
    return res.status(403).json({ message: "Chave de acesso inválida." });
  }

  if (!image) {
    return res.status(400).json({ message: "Imagem em base64 não fornecida." });
  }

  try {
    const formatoImagem = ["jpeg", "jpg", "png"].includes(foto_ext) ? foto_ext : "jpeg";
    const base64Data = image
    
    const bufferOriginal = Buffer.from(base64Data, "base64");
    
    const bufferRedimensionado = await sharp(bufferOriginal)
    .resize({
      width: 600,
      //height: 300,
      fit: 'inside',   // redimensiona para caber dentro de 300x300, mantendo proporção
      withoutEnlargement: true // não aumenta imagem se for menor que 300x300
    })
    .toFormat(foto_ext || 'jpg')
    .withMetadata({density: 150}) 
    .toBuffer();

    const imagemRedimensionadaBase64 = bufferRedimensionado.toString("base64");
    const dataAtual = new Date();

    const [rows] = await db.query(
      "SELECT COUNT(*) AS total FROM tblfotoredimensionadadpi WHERE intmatriculaid = ?",
      [matricula]
    );

    if (rows[0].total > 0) {
      await db.query(
        `UPDATE tblfotoredimensionadadpi 
         SET stremail = ?, imgfoto = ?, strfoto = ?, imgext = ?, dtaregistro = ? 
         WHERE intmatriculaid = ?`,
        [email, bufferRedimensionado, imagemRedimensionadaBase64, formatoImagem, dataAtual, matricula]
      );
    } else {
      await db.query(
        `INSERT INTO tblfotoredimensionadadpi
         (dtaregistro, intmatriculaid, stremail, imgfoto, strfoto, imgext) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [dataAtual, matricula, email, bufferRedimensionado, imagemRedimensionadaBase64, formatoImagem]
      );
    }

    res.json({ sucesso: true, mensagem: "Imagem salva com sucesso!" });

  } catch (error) {
    console.error("Erro ao processar a imagem:", error);
    res.status(500).json({ erro: error.mensagem });
  }
};

