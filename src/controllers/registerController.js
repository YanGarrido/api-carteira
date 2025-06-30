import db from "../../db.js";
import dotenv from "dotenv";

dotenv.config();

const TABELA_REGISTROS = "carteiras.tblregistro";

const TABELA_APLICACOES = "carteiras.tblaplicacoes";

export const registerDevice = async (req, res) => {
  const { matricula, email, platformVersion, imeiNo, modelName, deviceName, cpuType, chave} = req.body;

  const camposObrigatorios = {matricula, email, platformVersion, imeiNo, modelName, deviceName, cpuType, chave};

  for (const [campo, valor] of Object.entries(camposObrigatorios)) {
    if (!valor) {
      return res.status(400).json({ message: `O campo obrigatório '${campo}' está ausente.`});
    }
  }
  
  try {
    const [authRows] = await db.query(
      `SELECT intaplicacaoid FROM ${TABELA_APLICACOES} WHERE strchave = ? AND NOW() BETWEEN dtaativacao AND dtavalidade`,[chave]
    );

    if (authRows.length === 0) {
      return res.status(403).json({ message: "Chave de acesso inválida, expirada ou inativa."})
    }
    const dataAtual = new Date();
    const insertQuery = `INSERT INTO ${TABELA_REGISTROS} (intmatriculaid, stremail, strplatformversion, strimeino, strmodelname, strdevicename, strcputype, dtaregistro) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

    await db.query(insertQuery, [
      matricula,
      email,
      platformVersion,
      imeiNo,
      modelName,
      deviceName,
      cpuType,
      dataAtual
    ]);

    const [verificationRows] = await db.query(
      `SELECT COUNT(*) AS total FROM ${TABELA_REGISTROS} WHERE intmatriculaid = ? AND strimeino = ?`, [matricula, imeiNo]);
    
    if (verificationRows[0].total > 0){
      console.log(`Dispositivo registrado com sucesso para a matrícula ${matricula}.`);
      res.status(200).json({
        status: "sucesso",
        mensagem: `Dispositivo registrado com sucesso para a matrícula ${matricula}`,
      })
    } else {
      console.error(`Falha ao verificar o registro do dispositivo para a matrícula ${matricula}. A inserção pode ter falhado`);
      res.status(500).json({
        status: "erro",
        mensagem: "Erro na gravação do dispositivo: não foi possível confimar o registro.",
      });
    }
  } catch (error) {
    console.error(`Erro ao registrar o dispositivo para a matrícula  ${matricula}:`, error);
    res.status(500).json({message:"Ocorreu um erro interno no servidor ao registrar o dispositivo."})
  }
}
