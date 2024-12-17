import Layout from "@/Components/page-sections/layout";
import "@/styles/globals.css";
import { Provider } from "@/components/ui/provider";
import { UserProvider } from "@/context/UserContext";

export default function App({ Component, pageProps }) {
  return (
    <UserProvider>
      <Provider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </Provider>
    </UserProvider>
  );
}
