import { useState, useEffect, useRef } from 'react'; //Usamos o useRef para criar uma referência ao elemento do carrossel, e assim controlar a rolagem dele.

import Titulo from '../components/Titulo'; //Importamos o componente de Título.
import Card from '../components/Card'; //Importamos o componente Card pois ele receberá as props de 'estado' que contém as listas de filmes. 
import EntradaBusca from '../components/EntradaBusca'; //Importamos o componente EntradaBusca pois ele receberá as props de input para a busca de gêneros.

import { LuClapperboard } from 'react-icons/lu'; //Ícone de claquete.
import { MdWhatshot } from 'react-icons/md'; //Para usar ícone de 'ação'.
import { LuOrbit } from 'react-icons/lu'; //Ícone de ficção científica.
import { LuSmilePlus} from 'react-icons/lu'; //Ícone de comédia.
import { LuGhost } from 'react-icons/lu'; //Ícone de animações.
import { FaFilm, FaVideo } from 'react-icons/fa'; //Ícones de filmes.
import { MdFindInPage} from 'react-icons/md'; //ícone de busca.

interface Avaliacao { //Criamos uma interface separada para..
  usuario: string;
  nota: number;
  comentario: string;
}

interface Filme { //Usamos o TypeScript aqui para que os tipos do molde Filmes que veio do back esteja alinhado com o front.
  _id: string; //O MongoDB sempre gera o _id com undeline, precisaremos dele para usar na render da lista.
  titulo: string;
  ano: number;
  genero: string;
  elenco: string[]; //Como você enviou uma lista de atores no Postman, definir como string[] permite que você faça um pequeno loop dentro do card do filme para mostrar os nomes.
  avaliacoes: Avaliacao[]; //Em vez de usar any[] (que aceita qualquer coisa e não ajuda em nada), definir como Avaliacao[] permite que, ao digitar filme.avaliacoes[0]., o VS Code já te sugira nota, usuario e comentario.
  posterUrl: string;
}

export default function Home() {
  const [filmes, setFilmes] = useState<Filme[]>([]); //Estado que guardará a lista completa de Filmes. O '<Filme[]>' quer dizer: Ei, este estado vai começar vazio, mas eu te garanto que, quando ele tiver dados, será um Array preenchido com objetos que seguem o formato da interface Filme.

  const [filmesTitulo, setFilmesTitulo] = useState<Filme[]>([]); //Estado que guardará a segunda lista de filmes, porém filtrados por título, é com isso que teremos uma 'segunda lista' de filmes na tela.

  const [titulos, setTitulos] = useState<string>(''); //Estado que guarda o que digitamos no campo busca de títulos.

  const [filmesAcao, setFilmesAcao] = useState<Filme[]>([]); //Estado que guardará a lista de filmes filtrados pelo gênero 'ação'.

  const [ficcaoCientifica, setFiccaoCientifica] = useState<Filme[]>([]); //Estado que guardará a lista de filmes filtrados pelo gênero 'ficção científica'.

  const [filmesComedia, setFilmesComedia] = useState<Filme[]>([]); //Estado que guardará a lista de filmes filtrados pelo gênero 'comédia'.

  const [filmesAnimacao, setFilmesAnimacao] = useState<Filme[]>([]); //Estado que guardará a lista de filmes filtrados pelo gênero 'animação'.

  const [filmeAberto, setFilmeAberto] = useState<string | null>(null); //Estado que guarda o 'id' do filme. Útil pra saber qual filme terá seu popup aberto ou fechado.

  const carrosselGeralRef = useRef<HTMLDivElement>(null); //Criamos uma referência para o elemento do carrossel, que é do tipo HTMLDivElement. (Uma div comun).
  const carrosselAcaoRef = useRef<HTMLDivElement>(null); 
  const carrosselFiccaoRef = useRef<HTMLDivElement>(null);
  const carrosselComediaRef = useRef<HTMLDivElement>(null);
  const carrosselAnimacaoRef = useRef<HTMLDivElement>(null);

  const carregarFilmes = async () => {
    const response = await fetch('/api/filmes'); //A comunicação entre o front e o back acontece aqui! Somente no momento em que passamos a rota. Aqui é um get que estamos fazendo, pois quando n especificamos nada é um 'get'.
    const data = await response.json();
    setFilmes(data);
  }

  useEffect(() => { //Usamos isso para que dispare a função que busca os filmes assim que a página carregar.
    carregarFilmes();
    buscarFilmesAcao(); //Assim como o 'carregarFilmes' que busca a lista completa de filmes assim que a página carrega importamos a 'buscarFilmesAcao()' para que busque os filmes de ação.
    buscarFiccaoCientifica(); 
    buscarComedia();
    buscarAnimacao();
  }, []);

  useEffect(() => { //Esse useEffect é para que quando a lista de filmes for carregada, o carrossel já inicie na posição do meio.
    if(filmes.length > 0 && carrosselGeralRef.current) {
      const larguraDoCard = carrosselGeralRef.current.clientWidth / 5;
      carrosselGeralRef.current.scrollLeft = larguraDoCard * 3 
    }
  }, [filmes]);

  function alternarPopup(id: string) {
     setFilmeAberto(filmeAberto === id ? null : id); //O id do filme que vc clicou é o mesmo que está no estado 'filmeAberto'? Se for ele fará 'null' o que fehchará o popup, se não for ele colocará esse 'id' novo no estado e o popup daquele filme se abrirá.
  }

  const buscarTitulo = async (texto: string) => {
    setTitulos(texto); //Aqui estamos atribuindo o 'texto: string' que representa o 'que  foi digitado na busca por titulos' ao estado 'titulos' por meio dessa função.

    if(texto.length > 0) { //Se o que foi digitado e que está no estado 'titulo' que é o 'texto' tiver pelo menos uma letra, será feita a 'get' abaixo.
    const response = await fetch(`/api/filmes/titulo/${texto}`); //Nessa rota note que temos a url de onde acontece, lembre do postman que quando vc testa uma requisição, vc precisa montar a url na mão.. Aqui como o dado/texto do input precisa ir para a 'url' usamos a ponte para isso ${texto}. Isso pega o que digitamos na busca e insere na rota pra requisição. OBS: Sempre que vir isso, fique atento.
    
    const data = await response.json();
    setFilmesTitulo(data); //Inserimos o objeto 'data' que contém o título digitado dentro do estado 'filmesTitulo' que armazena a segunda lista.
    } else {
      setFilmesTitulo([]); //Se não tiver nenhum filme digitado (texto), isso limpará a segunda lista, ou seja, não é mostrada. 
    }
  } 

  const buscarFilmesAcao = async () => { 
    const response = await fetch('/api/filmes/generos/acao'); //Aqui estamos fazendo a requisição para a rota de filmes de ação.
    
    const data = await response.json();
    setFilmesAcao(data); //Aqui estamos inserindo os filmes de ação que vieram da requisição dentro do estado 'filmesAcao'. 
    console.log("Dados de Ação que chegaram no Index:", data)
  }

  const buscarFiccaoCientifica = async () => {
    const response = await fetch('/api/filmes/generos/ficcaoCientifica'); //Aqui estamos fazendo a requisição para a rota de filmes de ficção científica.

    const data = await response.json();
    setFiccaoCientifica(data); //Aqui estamos inserindo os filmes de ficção científica que vieram da requisição dentro do estado 'ficcaoCientifica'.
  }

  const buscarComedia = async () => {
    const response = await fetch('api/filmes/generos/comedia'); //Aqui estamos fazendo a requisição para a rota de filmes de comédia.

    const data = await response.json();
    setFilmesComedia(data); //Aqui estamos inserindo os filmes de comédia que vieram da rquisição dentro do estado 'filmesComedia'.
  }

  const buscarAnimacao = async () => {
    const response = await fetch('api/filmes/generos/animacao'); //Aqui estamos fazendo a requisição para a rota de filmes de animação. 

    const data = await response.json(); 
    setFilmesAnimacao(data); //Aqui estamos inserindo os filmes de animação que vieram da requisição dentro do estado 'filmesAnimacao'.
  }

  const rolarCarrossel = (ref: React.RefObject<HTMLDivElement | null>, direcao: 'esquerda' | 'direita') => {
  if(ref.current) { 
    // 1. Buscamos o primeiro card filho dentro do carrossel
    const primeiroCard = ref.current.children[0] as HTMLElement;
    
    //Se a tela for de PC (maior que 768px), usa a sua conta original perfeita de dividir por 5.
    // Se for celular, ele pega a largura real do card. Isso isola o PC de qualquer bug!
    const larguraDoCard = ref.current.clientWidth > 768
      ? ref.current.clientWidth / 5
      : (primeiroCard ? primeiroCard.offsetWidth + 16 : ref.current.clientWidth / 2);

    const quantidadeRolagem = larguraDoCard;

    // Descobre o limite físico máximo que o navegador consegue ir para a direita
    const maxScrollRight = ref.current.scrollWidth - ref.current.clientWidth;

    if(direcao === 'esquerda') { 
      // Se o usuário clicar para a esquerda e chegar perto do início real (0),
      // jogamos o scroll lá para o final da esteira instantaneamente e tiramos 1 card.
      if (ref.current.scrollLeft <= larguraDoCard) {
        ref.current.scrollLeft = maxScrollRight - larguraDoCard;
      } else {
        ref.current.scrollLeft -= quantidadeRolagem; 
      }
    } else {
      // Se o usuário clicar para a direita e chegar no limite máximo físico do navegador,
      // jogamos o scroll de volta para o começo (larguraDoCard) sem dar tranco.
      if (ref.current.scrollLeft >= maxScrollRight - larguraDoCard - 5) { // O -5 resolve o travamento de pixels no PC
        ref.current.scrollLeft = larguraDoCard;
      } else {
        ref.current.scrollLeft += quantidadeRolagem; 
      }
    }
  }
}

  return (
    <div className={`p-8 bg-gray-800 mx-auto px-4 sm:px-6 lg:px-20 py-10`}>
    {/*Aqui o título do site.*/}
    <Titulo />

    {/*Aqui ficarão aninhados os componentes filhos de index.tsx.*/}
    <EntradaBusca type="text" value={titulos} onChange={buscarTitulo} placeholder="Insira um título"/>

    {/* --- INÍCIO DO BLOCO DE RESULTADOS DA BUSCA --- */} 
    {/*Abaixo temos uma condition que diz, se 'filmesTitulo' tiver elementos, ou seja: Se tivermos digitado algum título na busca, então renderize o resultado que são os cards da busca.*/}
   {filmesTitulo.length > 0 && (
   <div className="mt-8">
    
    {/* Título da seção de busca com os ícones */}
    <div className="flex flex-row justify-center">
      <div className="flex flex-row">
        <MdFindInPage className="text-red-600 text-3xl mr-2" />
        <h2 className="text-2xl font-bold mb-6 text-white text-center">
          Resultados para {titulos}
        </h2>
        <MdFindInPage className="text-red-600 text-3xl ml-2" />
      </div>
    </div>

    {/* Container em formato de grade (flex-wrap) */}
    <div className="flex flex-wrap gap-4 justify-center mb-16">
      {filmesTitulo.map((filme) => (
        <div key={filme._id} className="w-80">
          {/*Aqui criamos um componente 'Card' para cada filme que for encontrado na busca de títulos.*/}
          <Card 
            filme={filme} 
            idFilme={filmeAberto} 
            alternarPopupFunction={alternarPopup} 
          />
        </div>
      ))}
    </div>

   </div>
  )}
  {/* FIM DO BLOCO DE RESULTADOS DA BUSCA --- */}


{/*1° Seção - Todos os filmes*/}
<div className="flex flex-row justify-center mt-12">
<LuClapperboard  className="text-red-600 text-3xl mr-2" />
<h2 className="text-2xl font-bold mb-6 text-white text-center">Todos os Filmes ({filmes.length})</h2>
<LuClapperboard className="text-red-600 text-3xl ml-2" />
</div>

{/*CONTAINER COM POSITION RELATIVE PARA PODER COLOCAR AS SETAS NAS PONTAS */}
<div className="relative group max-w-full">
{/* BOTÃO DA ESQUERDA */}
<button 
onClick={() => rolarCarrossel(carrosselGeralRef, 'esquerda')}
className="absolute left-0 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white text-red-600 p-2 rounded-full text-2xl font-bold ml-2 transition-all z-50 cursor-pointer">‹</button>

<div ref={carrosselGeralRef} 
style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
className="w-full overflow-x-auto scroll-smooth mb-20 relative z-10 "> {/*Note que essa div que guarda a render de todos os filmes possui o atributo 'ref'. */}
{/* Injetamos uma mini tag style para cobrir também o Chrome/Safari sem quebrar o JSX */}
      <style jsx global>{`
        div::-webkit-scrollbar {
          display: none;
        }
`}</style>

<div className="flex snap-x snap-mandatory"> {[...filmes, ...filmes, ...filmes].map((filme, index) => (
<div key={`geral-${filme._id}-${index}`} className="w-full sm:w-1/2 md:w-1/3 lg:w-1/5 p-2 shrink-0 snap-start">
<Card filme={filme} idFilme={filmeAberto} alternarPopupFunction={alternarPopup}/>
 </div>
 ))}
 </div>
 </div>
   
{/* BOTÃO DA DIREITA */}
 <button
  onClick={() => rolarCarrossel(carrosselGeralRef, 'direita')}
   className="absolute right-0 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white text-red-600 p-2 rounded-full text-2xl font-bold mr-2 transition-all z-50 cursor-pointer">›</button>
   </div>


    {/*2° Seção - Somente Ação*/}
    <div className="flex flex-row justify-center mt-12">
    <MdWhatshot  className="text-red-600 text-3xl mr-2" />
    <h2 className="text-2xl font-bold mb-6 text-white text-center">Somente Ação  ({filmesAcao.length})</h2>
    <MdWhatshot className="text-red-600 text-3xl ml-2" />
    </div>


{/*CONTAINER COM POSITION RELATIVE PARA PODER COLOCAR AS SETAS NAS PONTAS */}
<div className="relative group max-w-full">
{/* BOTÃO DA ESQUERDA */}
<button 
onClick={() => rolarCarrossel(carrosselAcaoRef, 'esquerda')}
className="absolute left-0 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white text-red-600 p-2 rounded-full text-2xl font-bold ml-2 transition-all z-50">‹</button>

<div ref={carrosselAcaoRef} 
style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
className="w-full overflow-x-auto scroll-smooth mb-20 relative z-10 "> {/*Note que essa div que guarda a render de todos os filmes possui o atributo 'ref'. */}
{/* Injetamos uma mini tag style para cobrir também o Chrome/Safari sem quebrar o JSX */}
      <style jsx global>{`
        div::-webkit-scrollbar {
          display: none;
        }
`}</style>

<div className="flex snap-x snap-mandatory"> {[...filmesAcao, ...filmesAcao, ...filmesAcao].map((filme, index) => (
<div key={`acao-${filme._id}-${index}`} className="w-full sm:w-1/2 md:w-1/3 lg:w-1/5 p-2 shrink-0 snap-start">
<Card filme={filme} idFilme={filmeAberto} alternarPopupFunction={alternarPopup}/>
 </div>
 ))}
 </div>
 </div>
   
{/* BOTÃO DA DIREITA */}
<button
onClick={() => rolarCarrossel(carrosselAcaoRef, 'direita')}
className="absolute right-0 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white text-red-600 p-2 rounded-full text-2xl font-bold mr-2 transition-all z-50">›</button>
</div>


    {/*3° Seção - Para você que ama Ficção Científica*/}
    <div className="flex flex-row justify-center mt-12">
    <LuOrbit className="text-red-600 text-3xl mr-2" />
    <h2 className="text-2xl font-bold mb-6 text-white text-center">Ficção Científica  ({ficcaoCientifica.length})</h2>
    <LuOrbit className="text-red-600 text-3xl ml-2" />
    </div>

    {/*CONTAINER COM POSITION RELATIVE PARA PODER COLOCAR AS SETAS NAS PONTAS */}
<div className="relative group max-w-full">
{/* BOTÃO DA ESQUERDA */}
<button 
onClick={() => rolarCarrossel(carrosselFiccaoRef, 'esquerda')}
className="absolute left-0 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white text-red-600 p-2 rounded-full text-2xl font-bold ml-2 transition-all z-50">‹</button>

<div ref={carrosselFiccaoRef} 
style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
className="w-full overflow-x-auto scroll-smooth mb-20 relative z-10 "> {/*Note que essa div que guarda a render de todos os filmes possui o atributo 'ref'. */}
{/* Injetamos uma mini tag style para cobrir também o Chrome/Safari sem quebrar o JSX */}
      <style jsx global>{`
        div::-webkit-scrollbar {
          display: none;
        }
`}</style>

<div className="flex snap-x snap-mandatory"> {[...ficcaoCientifica, ...ficcaoCientifica, ...ficcaoCientifica].map((filme, index) => (
<div key={`ficcao-${filme._id}-${index}`} className="w-full sm:w-1/2 md:w-1/3 lg:w-1/5 p-2 shrink-0 snap-start">
<Card filme={filme} idFilme={filmeAberto} alternarPopupFunction={alternarPopup}/>
</div>
))}
</div>
</div>
   
{/* BOTÃO DA DIREITA */}
<button
onClick={() => rolarCarrossel(carrosselFiccaoRef, 'direita')}
className="absolute right-0 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white text-red-600 p-2 rounded-full text-2xl font-bold mr-2 transition-all z-50">›</button>
</div>

    {/*4° Seção - Filmes de Comédia*/}
    <div className="flex flex-row justify-center mt-12">
    <LuSmilePlus className="text-red-600 text-3xl mr-2" />
    <h2 className="text-2xl font-bold mb-6 text-white text-center">As melhores Comédias ({filmesComedia.length})</h2>
    <LuSmilePlus className="text-red-600 text-3xl ml-2" />
    </div>


    {/*CONTAINER COM POSITION RELATIVE PARA PODER COLOCAR AS SETAS NAS PONTAS */}
<div className="relative group max-w-full">
{/* BOTÃO DA ESQUERDA */}
<button 
onClick={() => rolarCarrossel(carrosselComediaRef, 'esquerda')}
className="absolute left-0 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white text-red-600 p-2 rounded-full text-2xl font-bold ml-2 transition-all z-50">‹</button>

<div ref={carrosselComediaRef} 
style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
className="w-full overflow-x-auto scroll-smooth mb-20 relative z-10 "> {/*Note que essa div que guarda a render de todos os filmes possui o atributo 'ref'. */}
{/* Injetamos uma mini tag style para cobrir também o Chrome/Safari sem quebrar o JSX */}
      <style jsx global>{`
        div::-webkit-scrollbar {
          display: none;
        }
`}</style>

<div className="flex snap-x snap-mandatory"> {[...filmesComedia, ...filmesComedia, ...filmesComedia].map((filme, index) => (
<div key={`comedia-${filme._id}-${index}`} className="w-full sm:w-1/2 md:w-1/3 lg:w-1/5 p-2 shrink-0 snap-start">
<Card filme={filme} idFilme={filmeAberto} alternarPopupFunction={alternarPopup}/>
 </div>
 ))}
 </div>
 </div>
   
{/* BOTÃO DA DIREITA */}
 <button
  onClick={() => rolarCarrossel(carrosselComediaRef, 'direita')}
   className="absolute right-0 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white text-red-600 p-2 rounded-full text-2xl font-bold mr-2 transition-all z-50">›</button>
   </div>


    {/*5° Seção - Filmes de Animação*/}
    <div className="flex flex-row justify-center mt-12">
    <LuGhost className="text-red-600 text-3xl mr-2" />
    <h2 className="text-2xl font-bold mb-6 text-white text-center">As melhores Animações ({filmesAnimacao.length})</h2>
    <LuGhost className="text-red-600 text-3xl ml-2" />
    </div>

    {/*CONTAINER COM POSITION RELATIVE PARA PODER COLOCAR AS SETAS NAS PONTAS */}
<div className="relative group max-w-full">
{/* BOTÃO DA ESQUERDA */}
<button 
onClick={() => rolarCarrossel(carrosselAnimacaoRef, 'esquerda')}
className="absolute left-0 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white text-red-600 p-2 rounded-full text-2xl font-bold ml-2 transition-all z-50">‹</button>

<div ref={carrosselAnimacaoRef} 
style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
className="w-full overflow-x-auto scroll-smooth mb-20 relative z-10 "> {/*Note que essa div que guarda a render de todos os filmes possui o atributo 'ref'. */}
{/* Injetamos uma mini tag style para cobrir também o Chrome/Safari sem quebrar o JSX */}
      <style jsx global>{`
        div::-webkit-scrollbar {
          display: none;
        }
`}</style>

<div className="flex snap-x snap-mandatory"> {[...filmesAnimacao, ...filmesAnimacao, ...filmesAnimacao].map((filme, index) => (
<div key={`animacao-${filme._id}-${index}`} className="w-full sm:w-1/2 md:w-1/3 lg:w-1/5 p-2 shrink-0 snap-start">
<Card filme={filme} idFilme={filmeAberto} alternarPopupFunction={alternarPopup}/>
 </div>
 ))}
 </div>
 </div>
   
{/* BOTÃO DA DIREITA */}
 <button
  onClick={() => rolarCarrossel(carrosselAnimacaoRef, 'direita')}
   className="absolute right-0 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white text-red-600 p-2 rounded-full text-2xl font-bold mr-2 transition-all z-50">›</button>
   </div>

    </div>
  )

}
    

/* COMO ESTAVA CARD ANTES DE IMPLEMENTAR O CARROSSEL:
<Card lista={filmes} listaTitulo={filmesTitulo} listaAcao={filmesAcao} listaFiccao={ficcaoCientifica} listaComedia={filmesComedia} listaAnimacao={filmesAnimacao} idFilme={filmeAberto} alternarPopupFunction={alternarPopup} estadotitulos={titulos}/>
*/