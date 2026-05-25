//Nesse arquivo ficarão as funções que farão as requisições do backend! Enquanto o 'index.ts' e os arquivos dentro de 'api/' mandam a chamada das funções de filtro que teremos no projeto, esse arquivo aqui recebe essas chamadas e as utiliza nas funções. OBS: Todas as funções de filtragem do projeto serão feitas aqui.
import type { NextApiRequest, NextApiResponse } from 'next'; //Estamos importando do Next.js os parâmetros 'req' e 'res' que usamos no express! No ambiente do next temos que fazer assim.

import Filme from '../models/Filme'; //Importamos o nosso molde 'Filme' que possui todas as regras de tipos que os filmes terão.

export const listarFilmes = async (req: NextApiRequest, res: NextApiResponse) => { //Essa função é para buscar todos os filmes do banco.
    try {
      const filmes = await Filme.find({}); //Aqui fazemos a busca do filme com a consulta do 'find({})' que aprendemos no módulo de 'Consultas NoSQL'.
      return res.status(200).json(filmes);

    } catch (error) {
      return res.status(500).json({ mensagem: "Erro ao buscar filmes" });
    }
};


export const criarFilme = async (req: NextApiRequest, res: NextApiResponse) => { //Essa função é para fazermos o método 'post' para inserir mais filmes.
    try {
      //No Mongoose, o .create() já salva automaticamente no banco
      const novoFilme = await Filme.create(req.body);

      return res.status(201).json(novoFilme); //201 é o resultado de sucesso para 'criações' no banco!

    } catch (error) {
      return res.status(400).json({ mensagem: "Erro ao criar filme" }); //400 geralmente significa que fizemos um envio 'post' ou 'put' de forma errada. (ex: esqueceu um campo).
    }
};

export const filtrarPorTitulo = async (req: NextApiRequest, res: NextApiResponse) => { //Essa função vai criar o filtro de gênero para os filmes.

    const tituloDigitado = req.query.titulo; //Essa const representa o título digitado e que fica gravado no 'req'.
    try{
       const titulos = await Filme.find({titulo: { $regex: tituloDigitado, $options: 'i'}}); //Fizemos a busca por titulos no molde Filme.Usamos regex para que a busca de titulos aceite letras minúsculas também.

       return res.status(200).json(titulos); //200 é o resultado de sucesso para buscas!

    } catch (error) {
      return res.status(500).json({mensagem: "Erro ao buscar um título."}); //500 é mais indicado para esse caso, quando o banco de dados falha.
    }
}


export const buscarPorAcao = async (req: NextApiRequest, res: NextApiResponse) => { //Função que busca somente os filmes de ação.
    try {
      const filmesAcao = await Filme.find({ genero: {$regex: '^Ação', $options: 'i'}}); //Usamos regex para que a busca do gênero ação seja eficiente pois no nosso banco temos filmes de 'Ação' que estão juntos com outros gêneros, (ex: 'Ação, Aventura'). OBS: Note o '^' antes de 'Ação', isso é para evitar que seja mostrado outros filmes de outros gêneros que também possuem a palavra 'ação' (ex: Animação).

      return res.status(200).json(filmesAcao);

    } catch (error) {
      return res.status(500).json({ mensagem: "Erro ao buscar filmes de ação"}); 

    }
}


export const buscarPorFiccaoCientifica = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
       const filmesFiccaoCientifica = await Filme.find( { genero: { $regex: 'Ficção Científica', $options: 'i'}}); 

       return res.status(200).json(filmesFiccaoCientifica);

    } catch (error) {
      return res.status(500).json({ mensagem: "Erro ao buscar filmes de ficção científica"});

    }
}

export const buscarPorComedia = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
     const filmesComedia = await Filme.find( {genero: {$regex: 'Comédia', $options: 'i' }});

     return res.status(200).json(filmesComedia);

  } catch(error) {
    return res.status(500).json({mensagem: "Erro ao buscar filmes de comédia"});

  }
}


export const buscarPorAnimacao = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const filmesAnimacao = await Filme.find( {genero: {$regex: 'Animação', $options: 'i'}});

    return res.status(200).json(filmesAnimacao);

  } catch (error) {
    return res.status(500).json({ mensagem: "Erro ao buscar filmes de animação"});

  }
}


export const buscarFilmePorId = async (req: NextApiRequest, res: NextApiResponse) => {
  const {id} = req.query; //Pegamos o id que vem na re.query da requisição.
  try {
    const filme = await Filme.findById(id); //Fazemos a busca do filme por id usando o método 'findById' do Mongoose.
    if(!filme) {
      return res.status(404).json({mensagem: "Filme não encontrado"}); //Esse if com o '!' é para caso o id digitado não exista no banco, ou seja, se o filme não for achado, ele retorna um status de erro. 
    }
    return res.status(200).json(filme); //Se o filme for encontrado.

  } catch (error) {
    return res.status(500).json({mensagem: "Erro ao buscar filme por ID"}); //Enquanto o erro anterior era sobre o filme não ser encontrado, esse erro é para quando acontece algum problema no banco de dados, ou seja, quando a busca por id falha por algum motivo.
  }
}