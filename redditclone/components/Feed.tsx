// components/Feed.tsx
import React from "react";
import { usePosts } from "../hooks/usePosts";
import Post from "./Post";
import { DotSpinner } from "@uiball/loaders";
import { useEffect } from "react";
type Props = { 
  topic?: string,
  refresh?: number 
};

export default function Feed({ topic,refresh }: Props) {
  const { posts, loading, error, refetch } = usePosts(topic);
  useEffect(() => {
    if(refresh !== undefined)refetch();
  }, [refresh,refetch]);
  return (
    <div className="space-y-4">
      {(loading)?(<div className="flex items-center justify-center"><DotSpinner size={80} color="orange"/></div>):
      (!posts.length)? (<div className="p-4">No posts</div>):(posts.map((p) => <Post key={p.id} post={p} />))
      }
    </div>
  );
}
