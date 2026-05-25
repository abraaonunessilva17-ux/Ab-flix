import { FaBrain } from 'react-icons/fa'; //Ícone de cérebro.
import Image from 'next/image'; //Importa o componente de imagem do Next.js.

export default function Footer() {
    return(
        <div className="flex flex-col justify-center items-center h-50 bg-[#0c0c0f]">
            <Image src="/assets/logo2.webp" width={200} height={50} alt="Logo" className="mb-3"/>

            <p className="text-white mb-3">© Todos os direitos reservados a Abraão Nunes</p>

            <p className="flex items-center text-white ">Feito com <FaBrain className="text-red-700 ml-2 mr-2 text-2xl"/>Por Abra<span className="font-bold text-red-700">Ão Nu</span>nes</p>
        </div>
    )
}