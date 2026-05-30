//Mesmo que cada pasta/arquivo dentro de 'src/pages/api' sejam uma rota, mas esse arquivo precisa existir sempre! Sem ele não temos a 'partida inicial'.

import type { NextApiRequest, NextApiResponse } from 'next'; //Estamos importando do Next.js os parâmetros 'req' e 'res' que usamos no express! No ambiente do next temos que fazer assim.
import connectMongo from '../../../lib/mongodb'; //Importamos o 'connectMongo' do arquivo 'mongodb.ts' que criamos na pasta 'lib'. Ele é responsável por manter a nossa conexão estável e contínua.

import { listarFilmes, criarFilme } from '../../../controllers/filmControllers'; //Aqui estamos importando as funções de backend do 'filmControllers.ts'. Pois é nele que ficam todas as funções que filtram nossos filmes.


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
   
   await connectMongo(); //Conecta ao banco de dados (crucial em cada rota da API do Next.js)

   const metodo = req.method; //Isso garante que o método virá na requisição.

   // 3. Em vez de escrever a lógica do banco/controller aqui, nós apenas "chamamos" o Controller.
   if (metodo === 'GET') { //Se for 'get'.
       return listarFilmes(req, res); //Note a 'listarFilmes()', ela está sendo puxada do 'filmControlers.ts'.
   }


   if (metodo === 'POST') { //Se for 'post'.
       return criarFilme(req, res); //Note a 'criarFilme()', ela está sendo puxada do 'filmControlers.ts'.
   }

   // Caso o usuário tente usar PUT, DELETE, etc.
   return res.status(405).json({ message: 'Método não permitido' });
} //Importante usar, pois nessa rota que faremos os 'GET' e 'POST' acima devem ser feitos somente esses métodos, se acontecer de fazermos outros 'PUT' ou 'DELETE', esses últimos não funcionarão e será mostrado o texto.


// -----------------------------------------------
//No ambiente do Next.js não usamos 'nodemon' assim como no express puro! Por isso, para iniciar o servidor de backend você só precisar digitar no terminal 'npm run dev'.