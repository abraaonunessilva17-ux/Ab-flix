import type {NextPage} from 'next'; //Esse é um import do Next.js que só serve para nos avisar quando passarmos alguma pro estranha ou esquecer de retornar o HTML direito. Usamos ela pois essa é uma 'página'.
import mongoose from 'mongoose';
import connectMongo from '../../lib/mongodb'; //Importamos o 'connectMongo' do arquivo 'mongodb.ts' que criamos na pasta 'lib'. Ele é responsável por manter a nossa conexão estável e contínua.
import FilmeModel from '../../models/Filme'; //Importamos o molde de filmes diretamente do 'models/filme'.
import { GetServerSidePropsContext } from 'next'; //Isso guarda os 'tipos' do parâmetro 'contexto' que usaremos na função 'ssr' lá embaixo. Ele avisa ao TypeScript tudo o que existe dentro da variável 'context' (como a requisição, a resposta e principalmente os parâmetros da URL em 'context.query') que são os valores dinâmicos que usaremos para que cada filme tenhas seus dados mostrados na página.

interface FilmeProps { //OBS: Nós já temos criado o arquivo com o molde dos filmes que é 'Filme.ts'. No entanto ele foi criado para ser usado no back! E se fossemos usá-lo aqui ele traria vários 'métodos' e outras coias atrapalhariam, por isso nós 'recriamos' o molde aqui (FilmeProps). 
  filme: {
    _id: string;
    titulo: string;
    ano: number;
    genero: string;
    elenco: string[];
    avaliacoes: {
        usuario: string;
        nota: string;
        comentario: string;
    };
    posterUrl?: string;
    diretores?: string;
    produtores?: string;
    roteiristas?: string;
    sinopse?: string;
    trailerUrl?: string;
    duracao: string;
  } | null;
}

//OBS: Para essa página de modelo de filmes usaremos 'ssr' ou SERVER SIDE RENDERING, que é uma outra forma de termos páginas no site. Diferente do que já estávamos fazendo onde os dados dos filmes eram carregados no 'client side', ou seja no navegador do usuário no momento em que a tela carregava e o 'useEffect' era executado, pois nesse sistema o 'front' sempre fazia uma 'requisição' pedindo os dados dos filmes para o 'back', e só depois mostrava na tela. Dessa vez queremos montar a página/molde dos filmes no 'server side', ou seja, no servidor, e faremos isso com o 'getServerSideProps', que é uma função do Next.js. 

//Assim o fluxo será: O usuário clica no filme, o pedido chega ao 'servidor do Next.js' que aciona o 'controller' que busca os dados no MongoDB que monta o HTML com as info do filme e envia de volta. E essa página é montada na hora em que a pesso clica no card.

//Assim não é necessário o front fazer uma requisição para o back para buscar os dados do filme, pois o p próprio servidor do Next.js já monta a página. 

export default function modeloDeFilme({filme }: FilmeProps) { //Essa é a função principal do componente. Note o '{filme}' isso é justamente o dado 'filme: filmeFormatado' que veio do 'getSeverSideProps' para cá! E ele aqui usa o molde de 'FilmeProps' apenas para organizar esses dados que ele recebe para que se encaixem nas regras do molde.

  if (!filme) {  //Se por acaso o id não existir no banco, mostramos um aviso simples.
    return (
      <div className="flex justify-center items-center h-screen bg-gray-700 text-white">
        <h1>Filme não encontrado.</h1>
      </div>
    );
  }

    return (
        <div className={`min h-full screen w-full bg-cover bg-center bg-no-repeat relative pb-20`} 

        style={{ backgroundImage: `url(${filme.posterUrl})` }}> {/*Usamos o link dinâmico da url do poster.*/}

            {/* Camada de escurecimento (Overlay) */}
           <div className="absolute inset-0 bg-black/65 backdrop-blur-xs" />
            
            <div className={`flex flex-col justify-baseline w-full h-auto mx-auto px-4 sm:px-6 lg:px-20 py-10 pt-20 relative z-10`}>

            <p className="text-4xl font-extrabold text-red-600 mb-10">{filme.titulo}</p>
            
            <p className={`text-white`}><span className="bg-yellow-400 rounded-sm p-0.5 border border-white mr-1">{filme.ano} </span> -  {filme.duracao}</p>
                {/*<a 
                   href={filme.trailerUrl}  target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-white hover:bg-green-500 hover:text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200 shadow-lg mr-10 w-60 m-3">     

                  <span>Assistir Trailer</span>

                   <svg 
                   xmlns="http://www.w3.org/2000/svg" 
                   viewBox="0 0 24 24" 
                   fill="currentColor" 
                   className="w-6 h-6"
                   >
                   <path fillRule="evenodd" d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z" clipRule="evenodd" />
                   </svg>
                  </a> */}

            
            <div className="mt-8 max-w-2xl w-full mb-5">
                <h2 className="text-xl text-white mb-2">Veja o trailer</h2>
            
            {/*Aqui ficará o iframe de trailer.*/}
            <div className="w-full aspect-video rounded-xl overflow-hidden shadow-2xl border border-red-500 mb-4">
              <iframe className="h-full w-full"
              src={filme.trailerUrl}
              title={`trailer de ${filme.titulo}`}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              >
              </iframe>
            </div>
            </div>

            <p className={`text-white text-xl mb-3`}>{filme.sinopse} </p>

            <p className={`mb-3 text-white`}>{filme.genero}</p>

            <p className={`text-white text-xl mb-3`}><span className="text-red-500 font-extrabold">Estrelando: </span>{filme.elenco.join(', ')} </p>

            <p className={`text-white text-xl mb-3`}><span className="text-red-500 font-extrabold">Diretores: </span>{filme.diretores} </p>

            <p className={`text-white text-xl mb-3`}><span className="text-red-500 font-extrabold">Roteiristas: </span>{filme.roteiristas} </p>

            <p className={`text-white text-xl mb-3`}><span className="text-red-500 font-extrabold">Produtores: </span>{filme.produtores}</p>

            </div>

        </div>
    )
}


export const getServerSideProps = async (context: GetServerSidePropsContext) => { //Essa função roda exclusivamente no servidor toda vez que alguém tenta acessar essa página (ex: /filmes/6a0491...). O navegador do usuário nunca vê o código que está aqui dentro; ele só recebe o resultado final.
    try {
    await connectMongo(); //Conectamos ao MongoDB.

    const { id } = context.query; //Isso serve para guardar a 'id' de cada filme. Todo filme terá um id diferente, e esse código serve para pegar esse id e guardar ele na 'context.query'. Pegamos de forma dinâmica.
    
    const dadosDoFilme = await FilmeModel.findById(id).lean(); //Aqui o mongoose entra em ação. Ele usa o método findById(id) para procurar na coleção de filmes 'FilmModel', um documento que possua exatamente o mesmo identificador capturado da URL. Na verdade como o 'FilmeModel' é só um 'molde' e não uma lista de filmes, ele por sí só n faz a busca, mas ele avisa ao banco para pegar um filme que tenha o mesmo 'id'. Já o '.lean()' serve para tirar do documento que vem do banco as funções desnecessárias (.save(), .update() e etc).

    if(!dadosDoFilme) { //Validação: Se o filme não existir.
        return {
            props: {
                filme: null
            } //Essa validação serve para caso o filme não for encontrado, nesse caso ele interrompe a execução e retorna a propriedade 'filme' valendo 'null'. OBS: Lá na função do jsx, onde tem 'if (!filme)', isso será usado para mostrar a msg de erro.
        }
    }
    
    // 2. FORMATAÇÃO BLINDADA:
    const filmeFormatado = { //Isso é para resover o conflito de tipos que ocorre entre o MondgoDB e o Next.js. Pois quando o MongoDB nos envia o dado do filme ele chega em 'ObjectId' mas como usaremos esse dado que agora esta aqui no 'getServerSideProps' no componente visual criado acima 'modeloDeFilme', precisamos traduzir de ObjectId para um dado simples (String, number, array) que possa virar JSON! 
      ...dadosDoFilme, //Isso copia todas as informações do filme (título, sinope, ano...) para um novo objeto.
      _id: (dadosDoFilme._id as any).toString(), //Converte o ID do filme principal para string.
      
      // Converte o ID de cada avaliação lá de dentro para string (se existirem avaliações)
      avaliacoes: Array.isArray(dadosDoFilme.avaliacoes)
        ? dadosDoFilme.avaliacoes.map((av: any) => ({
            ...av,
            _id: av._id ? av._id.toString() : String(new mongoose.Types.ObjectId())
          }))
        : []
    };

    // Remove as propriedades do timestamps do objeto principal caso venham como objetos complexos
    if ((filmeFormatado as any).createdAt) (filmeFormatado as any).createdAt = (filmeFormatado as any).createdAt.toString();
    if ((filmeFormatado as any).updatedAt) (filmeFormatado as any).updatedAt = (filmeFormatado as any).updatedAt.toString();

    return { //Esse é o retorno obrigatório que toda função 'getServerSideProps' precisa mandar. Pois mandaremos para a função principal do componente 'modeloDeFilme' o objeto 'props' que contém o filme todo formatado! E esse dado será usado no parâmetro do componente 'modeloDeFilme'.
      props: {
        filme: filmeFormatado
      }
    };
    
 } catch (error) { //Se qualquer coisa der errado no processo todo (ex: se o banco de dados cair ou o 'ID' enviado travar o Mongoose), o código não quebra o servidor inteiro da aplicação. O erro é capturado pelo catch e printado no console, e na tela é mostrado que o filme não foi encontrado.
    console.error("Erro ao buscar filme no SSR:", error);
    return { props: { filme: null } };
  }

}


//COMO ESTAVA ESSA PARTE ANTES DE ALTERARMOS ELA DEVIDO AO ID QUE VEM NA SEÇÃO DE COMENTÁRIOS: 
/*
const filmeFormatado = { //Isso é para resover o conflito de tipos que ocorre entre o MondgoDB e o Next.js. Pois quando o MongoDB nos envia o dado do filme ele chega em 'ObjectId' mas como usaremos esse dado que agora esta aqui no 'getServerSideProps' no componente visual criado acima 'modeloDeFilme', precisamos traduzir de ObjectId para um dado simples (String, number, array) que possa virar JSON! 
        ...dadosDoFilme, //Isso copia todas as informações do filme (título, sinope, ano...) para um novo objeto.
        _id: (dadosDoFilme._id as any).toString() //Sobrescreve o ID original do banco pegando aquele formato e convertendo-o em uma 'string'.
    }
    
    return { //Esse é o retorno obrigatório que toda função 'getServerSideProps' precisa mandar. Pois mandaremos para a função principal do componente 'modeloDeFilme' o objeto 'props' que contém o filme todo formatado! E esse dado será usado no parâmetro do componente 'modeloDeFilme'.
        props: {
            filme: filmeFormatado
        }
    }


*/