//Esse arquivo serve para criamos o modelo 'Filmes' que será responsável pelas regras de como os filmes serão cadastrados no banco. OBS: É criando um modelo/arquivo assim como esse, com 'schema' e model que criamos uma 'coleção' nova no mongoDB.

import mongoose, { Schema, model, models } from 'mongoose'; //Importa o Mongoose para conectar com o MongoDB. OBS: O mongoDB é o banco de dados! Já o mongoose é a ferramenta que instalamos para colocarmos ordem ao banco, é ele resposável por configurar os 'schemas', é o que nos permite usar métodos como 'find()', 'update()', save()'. Já o 'model' é a ferramente que nos permite criarmos os 'modelos' que usaremos, ex: model ('Filme', FilmeSchema). O models guarda todos os modelos que foram criados, vc precisa passar aqui.

const FilmeSchema = new Schema({ //Criamos nosso schema das regras do molde Filmes.
    titulo: { type: String, required: true },
    ano: { type: Number, required: true },
    genero: { type: String, required: true },
    //Aqui veremos uma boa prática de NoSQL, colocando 'Elenco e Avaliações' dentro do mesmo documento.
    elenco: [String],
    avaliacoes: [
        {
            usuario: String,
            nota: Number,
            comentario: String
        }
    ],
    posterUrl: { type: String },
    diretores: {type: String},
    produtores: {type: String},
    roteirista: {type: String},
    sinopse: {type: String},
    trailerUrl: {type: String},
    duracao: {type: String}
}, { timestamps: true } //Adiciona automaticamente data de criação e atualização.
)

const Filme = models.Filme || model('Filme', FilmeSchema); //Fizemos isso para evitar que o molde Filme seja criado de novo toda vez que é recaregado. O models.filme serve para que se o 'molde' já tiver sido usado, então ele é atribuído a 'Filme', se não tiver sido usado ainda então com 'model('Filme', FilmeSchema) ele cria o molde pela 1 vez.

export default Filme; //Exportamos o modelo.