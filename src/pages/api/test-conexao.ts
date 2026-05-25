import type { NextApiRequest, NextApiResponse } from 'next';
import connectMongo from '../../lib/mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // 1. Tenta conectar ao banco usando a URI do seu .env.local
    await connectMongo();
    
    // 2. Se chegar aqui, deu certo!
    res.status(200).json({ 
      status: 'Sucesso!',
      mensagem: 'Conectado ao MongoDB Atlas com sucesso, Abraão!',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    // 3. Se houver erro (senha errada, IP bloqueado), cai aqui
    console.error(error);
    res.status(500).json({ 
      error: 'Erro na conexão', 
      detalhes: error instanceof Error ? error.message : 'Erro desconhecido' 
    });
  }
}