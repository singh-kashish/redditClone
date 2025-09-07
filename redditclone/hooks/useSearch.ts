// hooks/useSearch.ts
import { useEffect, useState, useCallback } from "react";
import { searchPosts } from "../services/searchService";
import { Post } from "../types/db";

export function useSearch(term: string) {
  const [results, setResults] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  const fetch = useCallback(async () => {
    if (!term.trim()) {
      setResults([]);
      setLoading(false);
      setError(null);
      return;
    }
    setLoading(true);
    setError(null);
    const { data, error } = await searchPosts(term);
    if (error) setError(error);
    setResults(data ?? []);
    setLoading(false);
  }, [term]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { results, loading, error, refetch: fetch };
}
