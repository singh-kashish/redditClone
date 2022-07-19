import "../styles/globals.css";
import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import Header from "../components/Header";
import { ApolloProvider } from "@apollo/client";
import client from "../apollo-client";
import { Toaster } from "react-hot-toast";
import Modal from 'react-modal';

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  Modal.setAppElement("#root");
  return (
    <ApolloProvider client={client}>
      <SessionProvider session={session}>
        <Toaster />
        <div id="root" className="h-screen overflow-y-scroll bg-slate-200">
          <Header />
          <Component {...pageProps} />
        </div>
      </SessionProvider>
    </ApolloProvider>
  );
}

export default MyApp;
