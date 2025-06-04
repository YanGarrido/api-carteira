import sharp from "sharp";
import db from "../../db.js";
import dotenv from "dotenv";

dotenv.config();

const LARGURA_MAXIMA = 600;
const DPI = 150;
const EXTENSOES_PERMITIDAS = Object.freeze(["jpeg", "jpg", "png"]);
const TABELA_FOTOS = "carteiras.tblfotoredimensionada";

export const uploadImage = async (req, res) => {
  const { matricula, email, chave, foto, foto_ext } = req.body;
  
  if (!matricula || !email ||!chave || !foto || !foto_ext) {
    console.warn("Tentativa de upload com campos ausentes",{ body: req.body });
    return res.status(400).json({ message: "Todos os campos são obrigatorios: matricula, email, chave, foto, foto_ext" });
  }

  if (chave !== process.env.CODIGO) {
    return res.status(403).json({ message: "Chave de acesso inválida." });
  }
  
  const extensaoNormalizada = foto_ext.toLowerCase();
  if(!EXTENSOES_PERMITIDAS.includes(extensaoNormalizada)) {
    return res.status(400).json({ message: `Formato de imagem ${foto_ext} não suportado; Use ${EXTENSOES_PERMITIDAS.join(", ")}.` });
  }
  
  try {
    const base64Data = foto;
    const bufferOriginal = Buffer.from(base64Data, "base64");
    
    const bufferRedimensionado = await sharp(bufferOriginal)
    .resize({
      width: LARGURA_MAXIMA,
      fit: 'inside',   
      withoutEnlargement: true 
    })
    .toFormat(extensaoNormalizada)
    .withMetadata({density: DPI}) 
    .toBuffer();

    const imagemRedimensionadaBase64 = bufferRedimensionado.toString("base64");
    const dataAtual = new Date();

    const [rows] = await db.query(
      `SELECT COUNT(*) AS total FROM ${TABELA_FOTOS}  WHERE intmatriculaid = ?`,
      [matricula]
    );

    if (rows[0].total > 0) {
      await db.query(
        `UPDATE ${TABELA_FOTOS} 
         SET stremail = ?, imgfoto = ?, strfoto = ?, imgext = ?, dtaregistro = ? 
         WHERE intmatriculaid = ?`,
        [email, bufferRedimensionado, imagemRedimensionadaBase64, extensaoNormalizada, dataAtual, matricula]
      );
    } else {
      await db.query(
        `INSERT INTO ${TABELA_FOTOS}
         (dtaregistro, intmatriculaid, stremail, imgfoto, strfoto, imgext) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [dataAtual, matricula, email, bufferRedimensionado, imagemRedimensionadaBase64, extensaoNormalizada]
      );
    }

    res.json({ sucesso: true, mensagem: `Imagem para a matrícula ${matricula} foi salva/atualizada com sucesso!` });
    console.log(`Imagem para a matrícula ${matricula} foi redimensionada com sucesso!`);

  } catch (error) {
    console.error(`Erro ao processar a imagem para matrícula ${matricula}:`, error);
    
    if(error.message.includes("Input buffer contains unsupported image format") || error.message.includes("Input buffer is invalid")) {
      return res.status(400).json({ message: "O arquivo fornecido não é uma imagem válida, está corrompido ou tem formato não suportado pelo servidor." });
    };
    
    res.status(500).json({ message: "Ocorreu um erro interno no servidor ao processar a imagem. Tente novamente mais tarde." });
  };
};

