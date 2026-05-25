import { LuPopcorn } from 'react-icons/lu'; //Ícone de pote de pipoca.

export default function titulo() {
    return (
        <div>
            <div className={`flex flex-row justify-center`}>
              <h1 className={`text-red-600 text-center text-4xl mb-10 font-medium`}>Catálogo de Filmes</h1>
              <LuPopcorn className={`text-red-600 text-4xl ml-2`}/>
            </div>
        </div>
    )
}