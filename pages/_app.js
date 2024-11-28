import Layout from "@/Components/layout";
import "@/styles/globals.css";
import { ChakraProvider, defaultSystem } from "@chakra-ui/react";

export default function App({ Component, pageProps }) {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}
