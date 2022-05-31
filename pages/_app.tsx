import "../styles/tailwind.css";
import Layout from "../components/Layout";
import { ApolloProvider } from "@apollo/client";
import { client } from "../lib/apollo";
import {Provider} from "react-redux";
import {wrapper, store} from "../redux/store"

function MyApp({ Component, pageProps }) {
  return (
      <Provider store={store}>
          <ApolloProvider client={client}>
              <Layout>
                  <Component {...pageProps} />
              </Layout>
          </ApolloProvider>
      </Provider>
  );
}

export default wrapper.withRedux(MyApp);
