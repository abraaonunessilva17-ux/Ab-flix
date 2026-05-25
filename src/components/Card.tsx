interface Avaliacao { //Criamos uma interface separada para representar o formato das avaliacoes.
  usuario: string;
  nota: number;
  comentario: string;
}

interface CardItem { //É necessário descrever os tipos de cada item do card, para que o TypeScript entenda o que cada campo representa. OBS: CardItem aqui é o mesmo molde 'Filme' que está em index.tsx.
    _id: string;
    titulo: string;
    ano: number;
    genero: string;
    elenco: string[];
    avaliacoes: Avaliacao[];
    posterUrl: string;
}


interface CardProps { //Essa interface é somenta para os carrosseis de cards, ela pede o que é necessário para os cards. 
    filme: CardItem; //Ela pede só um filme ao invés de uma lista, pois no index usamos um 'map' para que cada card/filme seja renderizado individualmente. 
    idFilme: string | null; //Precisamos do id desse filme para saber qual filme tem o popup aberto. Esse popup servirá para mostrar os detalhes dos filmes. 
    alternarPopupFunction: (id: string) => void; //É uma função que vem de index.ts para cá que serve para avisar index.tsx qual filme teve ser card aberto. Ela recebe o id filme. 
}

import Link from 'next/link'; //Importamos isso para que ao clicar em qualquer card de filme, sejamos redireccionados para a página individual de cada filme.import Link from 'next/link'; //Importamos isso para que ao clicar em qualquer card de filme, sejamos redireccionados para a página individual de cada filme.
import { LuSmilePlus} from 'react-icons/lu'; //Ícone de comédia.
import { LuGhost } from 'react-icons/lu'; //Ícone de animações.
import { FaFilm, FaVideo } from 'react-icons/fa'; //Ícones de filmes.
import { LuPopcorn } from 'react-icons/lu'; //Ícone de pote de pipoca.
import { MdFindInPage} from 'react-icons/md'; //ícone de busca.

export default function Card({filme, idFilme, alternarPopupFunction}: CardProps) {
    
    return (
      <Link href={`filmes/${filme._id}`} className="group block"> {/*Envolvemos tudo com o 'Link' para que o card seja todo clicável. Note o '$filme._id' isso é a forma dinâmica de dizer que o id do filme será o valor a ser usado na requisição que chamará a página.*/}
      <div className="border-2 hover:border-white p-4 rounded-lg bg-black w-full h-full">

       {/*2. Informações diretas do filme.*/}
      <h3 className="text-xl font-bold text-red-600 mb-2">{filme.titulo}</h3>
      <p className="text-white mb-2">{filme.ano}</p>
      <p className="text-white mb-2"><b>Gênero:</b> {filme.genero}</p>
      <p className="text-white"><b>Elenco:</b> {filme.elenco.join(", ")}</p>
      
      {/* 3. Seção do Botão e do Popup de Avaliações.*/}
      <div className="mt-2">
        <button 
        className={`bg-red-500 text-white text-lg pl-2 pr-2 rounded-sm my-2 font-bold cursor-pointer`}
        onClick={(e) => {e.preventDefault();
            e.stopPropagation();  alternarPopupFunction(filme._id)}}>
          {idFilme === filme._id ? "Fechar avaliações" : "Ver avaliações"}
        </button>
        {/*Usamos e.preventDefault() e e.stopPropagation() para que o clique do botão de avaliações se sobressaia ao clique no card. */}
        {/*Condicional que mostra as avaliações quando o popup é aberto.*/} {/*Se o id do filme que está no estado 'filmeAberto' for igual ao id do filme atual aí temos essa renderização.*/}
        {idFilme === filme._id && ( 
          <div>
            <h4 className={`font-semibold text-red-500`}><b>Avaliações:</b></h4>
             {/*Abaixo diz: se o filme tiver avaliações e se elas forem maiores que 0 então serão renderizadas as avaliações. Se não forem maiores que 0 então será mostrado a mensagem de 'Nenhuma avaliação ainda.'. Se não tiver o campo avaliações nem é renderizado.*/}
            {filme.avaliacoes && filme.avaliacoes.length > 0 ? ( 
              filme.avaliacoes.map((av, index) => (
                <div key={index} className={`ml-4 mt-0 border-l-4 border-yellow-500 pl-3 py-3`}>
                  <p className={`text-sm font-medium text-white`}>👤 {av.usuario} - ⭐ {av.nota}</p>
                  <p className={`text-sm italic text-white`}><i>{av.comentario}</i></p>
                  {/*Aqui usamos map em cada avaliação, e ela será de acordo com o índice, ou seja, cada pessoa que avaliou terá sua avaliação exibida.*/}
                </div>
                
              ))
            ) : (
              <p>Nenhuma avaliação ainda.</p>
            )}
          </div>
        )}
      </div>

      {/* 4. Imagem do Poster */}
      <div className="mt-2 overflow-hidden">
        <img src={filme.posterUrl} alt={`Poster do filme ${filme.titulo}`} className={`rounded-lg`} />
      </div>
    
     </div>
    </Link>
    );

}
 
/* ANTES DE IMPLEMENTAR O CAROSSEEL, A MINHA INTERFACE 'CADRDPROPS' ERA ESSA:
interface CardItem {
    lista: CardItem[]; //O item: CardItem[] representa a lista de filmes que vem via props do index.tsx. Lá eles vem do estado 'filmes'. Usamos [] pois receberemos um array. 
    listaTitulo: CardItem[]; //O item: CardItem[] representa a lista filtrada de filmes que vem do index.tsx. Lá eles vem do estado 'filmesTitulo'. Usamos [] pois receberemos um array. 
    listaAcao: CardItem[]; //O item: CardItem[] representa a lista filtrada de filmes de ação que vem do index.tsx.
    listaFiccao: CardItem[]; //O item: CardItem[] representa a lista filtrada de filmes de ficção científica que vem do index.tsx.
    listaComedia: CardItem[]; // '' ''.
    listaAnimacao: CardItem[]; // '' ''.
    idFilme: string | null; //Essa prop que vem de index.tsx é para sabermos qual filme terá o popup aberto. Ela é do tipo string ou null. Será 'string' quando tiver um filme aberto, e  'null' quando não tiver.
    alternarPopupFunction: (id: string) => void; //Essa prop é a função que vem de index.tsx que alterna o popup dos filmes. Ela recebe um 'id' do tipo string e não retorna nada.
    estadotitulos?: string; //Essa prop é para receber de index.tsx o estado 'titulos' pois precisamos dele para mostrar na frase de busca: Resultados para {titulos}.
}
*/