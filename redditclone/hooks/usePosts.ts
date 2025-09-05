// hooks/usePosts.ts
import { useEffect, useState, useCallback } from "react";
import { getAllPosts, getPostsByTopic } from "../services/postService";
import { Post } from "../types/db";

export function usePosts(topic?: string) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    const res = topic ? await getPostsByTopic(topic) : await getAllPosts();
    if (res.error) setError(res.error);
    setPosts(res.data ?? []);
    setLoading(false);
  }, [topic]);

  useEffect(() => { fetch(); }, [fetch]);

  return { posts, loading, error, refetch: fetch };
}
