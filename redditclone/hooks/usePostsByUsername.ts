import {getPostsByUser} from "../services/postService";
import {useEffect, useState, useCallback} from "react";
import {Post} from "../types/db";

export function usePostsByUsername(username: string) {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(false); 
    const [error, setError] = useState<any>(null);
  
    const fetch = useCallback(async () => {
      if (!username) {
        setPosts([]);
        setLoading(false);
        setError(null);
        return;
      }
      setLoading(true);
      setError(null);
      const res = await getPostsByUser(username);
      if (res.error) setError(res.error);
      setPosts(res.data ?? []);
      setLoading(false);
    }, [username]);
  
    useEffect(() => { fetch(); }, [fetch]);
  
    return { posts, loading, error, refetch: fetch };
  }
  