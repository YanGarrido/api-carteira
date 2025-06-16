import db from "../../db.js";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const TABELA_USUARIOS = "carteiras.tblusuarios";
const TABELA_APLICACOES = "carteiras.tblaplicacoes";
const TABELA_CONFIG = "carteiras.tblconfiguracoes";

const calcularCodigoAtivacao = (matricula, baseAtivacao) => {
  const agora = new Date();
  
  const minutos = agora.getMinutes().toString().padStart(2, '0');

  const primeiroDigitoMinuto = parseInt(minutos[0], 10);

  const fatorTempo = primeiroDigitoMinuto + 1;

  const resultadoNumerico = parseInt(matricula, 10) * baseAtivacao * fatorTempo;

  return resultadoNumerico.toString().slice(-5);
};

const calcularCodigoCarteira = (matricula,baseCarteira) => {
  const resultadoNumerico = parseInt(matricula, 10) * baseCarteira;

  return resultadoNumerico.toString().slice(-8);
};

const montarUrlValidacao = (baseUrl, matricula, codigoCarteiraParcial) => {
  return `${baseUrl}?RA=${matricula}&carteira=${codigoCarteiraParcial}`;
};

export const validateUserAndSendCode = async (req, res) => {
  const {matricula, email, cpf, nascimento, chave} = req.body;

  if (!matricula || !email || !cpf || !nascimento || !chave) {
    return res.status(400).json({ message: "Todos os campos são obrigatórios"});
  }

  try{
    const [authRows] = await db.query(
      `SELECT intaplicacaoid FROM ${TABELA_APLICACOES} WHERE strchave = ? AND NOW() BETWEEN dtaativacao AND dtavalidade`, [chave]
    );

    if(authRows.length === 0) {
      return res.status(403).json({ message: "Chave de acesso inválida, expirada ou inativa." });
    }

    const query = `
    SELECT
      u.strnome,
      u.dtavalidadecarteira,
      u.strcodigo,
      u.strtipo,
      u.strcurso,
      u.stremail,
      u.strcpf,
      u.dtanascimento,
      u.strturno,
      c.intbasecodigoativacao,
      c.intbasecodigocarteira,
      c.strurlvalidacao
    FROM
      ${TABELA_USUARIOS} u, ${TABELA_CONFIG} c
    WHERE
      u.strcodigo = ? AND u.stremail = ?
    `;

    const [rows] = await db.query(simpleQuery, [matricula, email]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "Usuário não encontrado!" });
    }

    const dados = rows[0];

    const codigoAtivacao = calcularCodigoAtivacao(matricula, dados.intbasecodigoativacao);
    const codigoCarteira = calcularCodigoCarteira(matricula, dados.intbasecodigocarteira);
    
    const codigoCarteiraUrl = (parseInt(matricula, 10) * dados.intbasecodigocarteira).toString().substring(0, 8);
    const urlValidacao = montarUrlValidacao(dados.strurlvalidacao, matricula, codigoCarteiraUrl);
    
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: process.env.SMTP_PORT == 465, // true para porta 465 (SSL), false para outras (TLS)
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const mailOptions = {
      from: `"CEST" <${process.env.SMTP_USER}>`, // Remetente
      to: dados.stremail, // Destinatário (e-mail do usuário)
      subject: "Ativação do Documento de Identificação Digital do CEST", // Assunto
      html: `
        <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
          <h2 style="color: #0056b3;">Ativação do Documento Digital - CEST</h2>
          <p>Prezado(a) <strong>${dados.strnome}</strong>,</p>
          <p>
            Você está recebendo este e-mail pois solicitou a ativação do seu Documento de Identificação Digital do CEST.
            Para concluir o processo, utilize o código de ativação abaixo no aplicativo.
          </p>
          <div style="text-align: center; margin: 25px 0;">
            <span style="display: inline-block; padding: 12px 25px; background-color: #f0f0f0; border-radius: 5px; font-size: 24px; font-weight: bold; letter-spacing: 3px; border: 1px solid #ccc;">
              ${codigoAtivacao}
            </span>
          </div>
          <p>Parabéns e desfrute de todos os benefícios!</p>
          <hr>
          <p style="font-size: 12px; color: #777;">
            Este é um e-mail automático. Por favor, não responda a esta mensagem.
          </p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`E-mail de ativação enviado com sucesso para: ${dados.stremail}`);



    const curso = dados.strtipo === 'Aluno' ? dados.strcurso : dados.strtipo;
    const turno = dados.strtipo === 'Aluno' ? (dados.strturno || '') : dados.strtipo;
    const nascimentoFormatado = new Date(dados.dtanascimento).toLocaleDateString('pt-BR', { timeZone: 'UTC' });




  } catch (error) {
    
  }
}