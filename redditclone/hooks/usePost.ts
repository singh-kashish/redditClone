// hooks/usePost.ts
import { useEffect, useState, useCallback } from "react";
import { getFullPost } from "../services/postService";
import { Post } from "../types/db";

export function usePost(id?: number) {
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  const fetch = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    const { data, error } = await getFullPost(id);
    if (error) setError(error);
    setPost(data ?? null);
    setLoading(false);
  }, [id]);

  useEffect(() => { fetch(); }, [fetch]);

  return { post, loading, error, refetch: fetch };
}
