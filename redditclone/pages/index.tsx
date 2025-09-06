// pages/index.tsx
import Head from "next/head";
import PostBox from "../components/PostBox";
import Feed from "../components/Feed";
import { useSubreddits } from "../hooks/useSubreddits";
import SubredditRow from "../components/SubredditRow";
import { useState } from "react";

export default function Home() {
  const [refresh, setRefresh] = useState<number>(0);
  const { subreddits, loading } = useSubreddits(10,refresh);

  return (
    <div className="max-w-5xl my-7 mx-auto">
      <Head><title>Reddit Clone</title></Head>
      <PostBox onPostCreated={() => {setRefresh(r=>r+1)}} />
      <div className="flex">
        <div className="flex-1">
          <Feed refresh={refresh}/>
        </div>

        <div className="sticky top-36 mx-5 mt-5 hidden h-fit min-w-[300px] rounded-md border border-gray-300 bg-white lg:inline">
          <p className="tex-md mb-1 p-4 pb-3 font-bold">Top Communities</p>
          <div>
            {!loading && subreddits.map((s, i) => <SubredditRow key={s.id} topic={s.topic} index={i} />)}
          </div>
        </div>
      </div>
    </div>
  );
}
