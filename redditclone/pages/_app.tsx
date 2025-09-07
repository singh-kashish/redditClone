import "../styles/globals.css";
import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import Header from "../components/Header";
import { Toaster } from "react-hot-toast";
import Modal from "react-modal";
import { useEffect } from "react";

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  useEffect(() => {
    // ensure modal root exists
    if (!document.getElementById("root")) {
      const div = document.createElement("div");
      div.id = "root";
      document.body.appendChild(div);
    }
    Modal.setAppElement("#root");
  }, []);

  return (
    <SessionProvider session={session}>
      <Toaster />
      <div id="root" className="h-screen overflow-y-scroll bg-slate-200">
        <Header />
        <Component {...pageProps} />
      </div>
    </SessionProvider>
  );
}

export default MyApp;
