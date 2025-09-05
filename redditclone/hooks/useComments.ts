// hooks/useComments.ts
import { useEffect, useState, useCallback } from "react";
import { getCommentsByPostId } from "../services/commentService";
import { Comment } from "../types/db";

export function useComments(postId?: number) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  const fetch = useCallback(async () => {
    if (!postId) {
      setComments([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    const { data, error } = await getCommentsByPostId(postId);
    if (error) setError(error);
    setComments(data ?? []);
    setLoading(false);
  }, [postId]);

  useEffect(() => { fetch(); }, [fetch]);

  return { comments, loading, error, refetch: fetch };
}
