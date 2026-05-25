//Se estiver usando Next.js com Pages Router (não o AppRoutes), você deve inserir seu componente Layout que engloba os componentes fixos e dinâmicos do site (header, footer, main) aqui.
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Layout from '../components/Layout'; //Importamos o compoenente de Layout.

//Abaixo veja o 'Component', ele representa qualquer página 'atual' que está sendo visualizada em qualquer momento.
export default function App({ Component, pageProps }: AppProps) {
  return ( 
  <Layout><Component {...pageProps} />
  </Layout>
  )
}
