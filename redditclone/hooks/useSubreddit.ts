// hooks/useSubreddit.ts
import { useEffect, useState, useCallback } from "react";
import { getSubredditByTopic } from "../services/subredditService";
import { Subreddit } from "../types/db";

export function useSubreddit(topic?: string) {
  const [subreddit, setSubreddit] = useState<Subreddit | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  const fetch = useCallback(async () => {
    if (!topic) return;
    setLoading(true);
    setError(null);
    const { data, error } = await getSubredditByTopic(topic);
    if (error) setError(error);
    setSubreddit(data?.[0] ?? null);
    setLoading(false);
  }, [topic]);

  useEffect(() => { fetch(); }, [fetch]);

  return { subreddit, loading, error, refetch: fetch };
}
