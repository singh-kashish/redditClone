import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Header from "../components/Header";
import PostBox from "../components/PostBox";

const Home: NextPage = () => {
  return (
    <div className="max-w-5xl my-7 mx-auto">
      <Head>
        <title>Reddit Clone</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <PostBox/>
    </div>
  );
};

export default Home;
