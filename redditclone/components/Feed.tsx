// components/Feed.tsx
import React from "react";
import { usePosts } from "../hooks/usePosts";
import Post from "./Post";
import { DotSpinner } from "@uiball/loaders";
import { useEffect } from "react";
import { ChevronDoubleUpIcon } from "@heroicons/react/outline";
type Props = { 
  topic?: string,
  refresh?: number 
};

export default function Feed({ topic,refresh }: Props) {
  const { posts, loading, error, refetch } = usePosts(topic);
  useEffect(() => {
    if(refresh !== undefined)refetch();
  }, [refresh,refetch]);
  const handleGoToTop = () => {
    const root = document.getElementById("root");
    if (root) {
      root.scrollTo({ top: 0, behavior: "smooth" });
    }
  };
  
  return (
    <div className="space-y-4">
      {(loading)?(<div className="flex items-center justify-center"><DotSpinner size={80} color="orange"/></div>):
      (!posts.length)? (<div className="p-4">No posts</div>):(<>
        {posts.map((p) => <Post key={p.id} post={p} />)}
        <div className="flex justify-center my-8">
          <button
            onClick={handleGoToTop}
            className="px-4 py-2 rounded-full bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 transition"
          >
            Go to Top
            <ChevronDoubleUpIcon className="h-5 w-5 inline-block ml-2" />
          </button>
        </div>
      </>
)
      
      }
    </div>
  );
}
