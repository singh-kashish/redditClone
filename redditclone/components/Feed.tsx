// components/Feed.tsx
import React from "react";
import { usePosts } from "../hooks/usePosts";
import Post from "./Post";

type Props = { topic?: string };

export default function Feed({ topic }: Props) {
  const { posts, loading } = usePosts(topic);

  if (loading) return <div className="p-4">Loading...</div>;
  if (!posts.length) return <div className="p-4">No posts</div>;

  return (
    <div className="space-y-4">
      {posts.map((p) => <Post key={p.id} post={p} />)}
    </div>
  );
}
