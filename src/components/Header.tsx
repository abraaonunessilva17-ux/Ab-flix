import { FaHome, FaPhone } from 'react-icons/fa'; //Ícone de claquete.
import Link from 'next/link'; //Importamos isso para usar nos menus. OBS: Sempre que for criar links de menu no Next.js use o Link! Ele é mais vantajoso que o <a>. Use o <a> somente a fazer 'Âncoras' ou link externo.
import Image from 'next/image'; //Importa o componente de imagem do Next.js.


export default function Header( ){
   return (
    <div className="flex flex-col md:flex-row justify-center items-center h-20 bg-[#0c0c0f] gap-10 border border-b-3 border-gray-400">
        <div className="flex-1">
           <Image src="/assets/logo2.webp" width={100} height={10} alt="Logo" className="hidden md:block p-2 hover:bg-gray-800 rounded-3xl ml-20"/>
        </div>
        
        <div className="flex gap-10">
            <Link href={`/`} className="flex items-center gap-3 text-gray-400 hover:text-white font-bold">
              <FaHome className = "text-gray-400 hover:text-white text-3xl" />
            Home
           </Link>

           <Link href={`/Contato`} className="flex items-center  gap-2 text-gray-400 hover:text-white font-bold">
             <FaPhone className = "text-gray-400 hover:text-white text-2xl" />
            Contato
           </Link>
        </div>
        
        <div className="flex-1" />
    </div>
   )
}