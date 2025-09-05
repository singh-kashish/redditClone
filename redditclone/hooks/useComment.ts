// hooks/useComment.ts
import { useEffect, useState, useCallback } from "react";
import { getCommentById } from "../services/commentService";
import { Comment } from "../types/db";

export function useComment(commentId?: number) {
  const [comment, setComment] = useState<Comment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  const fetch = useCallback(async () => {
    if (!commentId) return;
    setLoading(true);
    setError(null);
    const { data, error } = await getCommentById(commentId);
    if (error) setError(error);
    setComment(data ?? null);
    setLoading(false);
  }, [commentId]);

  useEffect(() => { fetch(); }, [fetch]);

  return { comment, loading, error, refetch: fetch };
}
