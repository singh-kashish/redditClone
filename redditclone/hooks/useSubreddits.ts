// hooks/useSubreddits.ts
import { useEffect, useState, useCallback } from "react";
import { getSubreddits } from "../services/subredditService";
import { Subreddit } from "../types/db";

export function useSubreddits(limit = 10) {
  const [subreddits, setSubreddits] = useState<Subreddit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { data, error } = await getSubreddits(limit);
    if (error) setError(error);
    setSubreddits(data ?? []);
    setLoading(false);
  }, [limit]);

  useEffect(() => { fetch(); }, [fetch]);

  return { subreddits, loading, error, refetch: fetch };
}
