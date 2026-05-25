import{ useState } from 'react';
import { FaDev, FaPhone, FaEnvelope } from 'react-icons/fa'; //Ícones de filmes.

export default function Contato() {
    const [digito, setDigito] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [envio, setEnvio] = useState({} as any);
    const [erro, setErro] = useState<string>("");

    function ativarInputNome(target: string) {
       if(target === null ) {
        return 
       }
       setDigito(target);
    }

    function ativarInputEmail(target: string) {
        if(target === null) {
         return
        }
        setEmail(target);
    }

    function enviar(e: React.FormEvent) {
         e.preventDefault();
         if(digito.trim() === "" || email.trim() === "") {
            return setErro("Preencha os campos acima!");
         } else {
             setEnvio({digito, email});
             setDigito("");
             setEmail("");
             setErro("");
         }
    }

    return(
        <div className={`bg-gray-800 mx-auto px-4 sm:px-6 lg:px-20 py-10 flex flex-row h-130 items-center`}>
            {/*Seção da esquerda */}
            <div className="flex flex-col flex-1 items-baseline gap-3">
               <h1 className={`text-white text-center text-4xl font-medium`}>Contato</h1>
               <hr className="w-90 text-white border-2" />
               
               <div className="mt-10 flex items-center gap-2">
                  <FaDev className="text-white text-2xl"/>
                  <p className="text-white">Abraão Nunes - Programador FullStack</p>
               </div>

               <div className=" flex items-center gap-2">
                  <FaPhone className="text-white text-2xl"/>
                  <p  className="text-white">(98) 9 81542065</p>
               </div>
    
               <div className=" flex items-center gap-2">
                  <FaEnvelope className="text-white text-2xl"/>
                  <p className="text-white">abraao.nunessilva17@gmail.com</p>
               </div>
            </div>

            {/*Seção da direita.*/}
            <form className="flex flex-col flex-1 gap-2" onSubmit={(e) => enviar(e) }>
                <input type="text" value={digito} placeholder="Nome Completo" className="text-white bg-gray-400 focus:bg-gray-600 w-50 rounded-sm p-1"
                onChange={(e) => ativarInputNome(e.target.value)}/>

                <input type="text" value={email} placeholder="E-mail" className="text-white bg-gray-400 focus:bg-gray-600 w-50 rounded-sm p-1" onChange={(e) => ativarInputEmail(e.target.value)}/>

                <textarea name="mensagem" rows={5} placeholder="Insira uma mensagem"  className="w-80 bg-gray-400 rounded-sm p-1 text-white"/>

                <button className="bg-red-600 active:bg-red-400 w-50 p-1 rounded-xl text-white text-2xl font-bold border-3 border-white" type="submit">Enviar</button>  {envio.digito && (
                    <p className="text-green-500">Formulário enviado com sucesso!</p>
                )}
                {erro && (
                   <p className="text-red-500">{erro}</p>
                )}
            </form>
          
        </div>
    )
}