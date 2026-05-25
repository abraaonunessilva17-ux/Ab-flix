import {ReactNode} from 'react'; //Precisamos disso, pois o projeto usa TypeScript, e como precisaremos do 'children' no parâmetro do componente, isso aqui serve para que ele aceite receber qualquer dado, que no caso será 'todo o conteúdo' das pgs de conteúdo.
import Header from './Header'; 
import Footer from './Footer'; 

export default function Layout({children}: {children: ReactNode} ) {
   return(
    <div className="flex flex-col min-h-screen">
        <Header />

        <main>
            {children}
        </main>

        <Footer />
    </div>
   )
}