//SOBRE ESSE ARQUIVO:
/*O Next.js funciona de um jeito diferente do Express. No Express, o servidor fica ligado direto. No Next, ele "liga e desliga" as rotas para economizar energia/processamento.

Se você não usar esses códigos do mongodb.ts com o cached, toda vez que alguém carregar sua página, o Next vai tentar abrir uma conexão nova. Rapidinho o MongoDB Atlas vai te expulsar porque você estourou o limite de conexões. Esse arquivo garante que você use sempre a mesma conexão.
*/

import mongoose from 'mongoose'; //Importa o Mongoose para conectar com o MongoDB

const MONGODB_URI = process.env.MONGODB_URI || ''; //Pega a URL de conexão que você salvou no arquivo .env.local

if (!MONGODB_URI) {
  throw new Error('Por favor, defina a variável MONGODB_URI no arquivo .env.local');
} //Se a URL estiver vazia, ele trava o código e avisa que você esqueceu de configurar

/* No Next.js, toda vez que você salva o código, ele reinicia o servidor.
Para não criar MIL conexões com o banco toda vez que você salvar, a gente usa uma "variável global" para guardar a conexão atual.
*/
let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
} //Se ainda não existir nada nessa variável global, a gente cria um objeto vazio nela

async function connectMongo() {
  if (cached.conn) return cached.conn; //1. Se já existir uma conexão ativa, use ela e não faça nada novo.

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI).then((mongoose) => {
      return mongoose;
    }); //2. Se não houver uma conexão começando (promise), a gente inicia uma agora
  }
  cached.conn = await cached.promise; //3. Espera a conexão terminar e guarda o resultado na nossa variável global.
  return cached.conn; //4. Retorna a conexão pronta para ser usada
}

export default connectMongo; // Exporta essa função para que possamos usá-la em outras partes do projeto.