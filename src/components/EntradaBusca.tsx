interface EntradaBusca {
   type: string;
   placeholder?: string; //Opcional, apenas para pegar de index.tsx o texto que fica dentro do input.
   value: string; //O tipo 'string' representa o tipo de valor que o campo vai receber de index.tsx, esse valor vem do estado 'titulos' que armazena o texto 'string' que digitamos na busca. 
   onChange: (texto: string) => void //Isso representa a função que vai ser chamada no evento 'onchange' do input. Ela vem de index.tsx e é a função 'buscarTitulo'.
}

import { FaSearch } from 'react-icons/fa';

export default function EntradaBusca({type, placeholder, value, onChange}: EntradaBusca) {
   return(
    <div>
        {/*Seção busca titulo.*/}
       <div className={`flex flex-row align-baseline`}> 
        <div className={`flex flex-row`}>
            <h2 className={`text-xl foont-bold mb-1 text-white`}>Pesquisar por título</h2>
            <FaSearch className={`text-red-600 text-2xl ml-2`} />
        </div>
        </div>

        {/*Imput de busca de título.*/}
        <input 
        className={`block w-full p-2.5 m-7 ml-0 border-4 rounded-xl bg-gray-200 focus:bg-gray-500 focus:border-gray-500 text-2xl text-gray-800 focus:text-white`}
        type = {type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder= {placeholder}
        />
    </div>
   )
}