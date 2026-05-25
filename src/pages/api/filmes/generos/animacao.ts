import type { NextApiRequest, NextApiResponse } from 'next'; //Estamos importando do Next.js os parâmetros 'req' e 'res' que usamos no express! No ambiente do next temos que fazer assim.
import connectMongo from '../../../../lib/mongodb'; //Importamos o 'connectMongo' do arquivo 'mongodb.ts' que criamos na pasta 'lib'. Ele é responsável por manter a nossa conexão estável e contínua.
import {buscarPorAnimacao} from '../../../../controllers/filmControllers'; //Importamos a função 'buscarPorAnimacao' que foi criada no arquivo que concentra todas as funções de filtro do projeto Filmes, a 'controllers.ts'.

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await connectMongo(); //Conecta ao banco de dados (crucial em cada rota da API do Next.js).

    if(req.method === 'GET') { //Se for um 'get'. Usamos esse método pois mesmo sendo uma bsusca, mas é uma 'leitura'.
        return buscarPorAnimacao(req, res);

    }

    res.status(405).json({ mensagem: "Método não permitido nesta rota." }); //Caso o usuário tente usar PUT, DELETE, etc.
     //Importante usar, pois nessa rota que faremos um 'GET', e deve ser feito somente esse método, se acontecer de fazermos outros 'PUT' ou 'DELETE', POST e etc, esses últimos não funcionarão e será mostrado o texto de erro.
}