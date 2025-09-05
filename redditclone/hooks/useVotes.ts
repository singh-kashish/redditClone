import { useEffect, useMemo, useState } from "react";
import { getVotesByPostId } from "../services/voteService";
import { Vote } from "../types/db";

export function useVotes(postId?: number) {
  const [votes, setVotes] = useState<Vote[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    if (!postId) return;
    let mounted = true;
    (async () => {
      setLoading(true);
      setError(null);
      const { data, error } = await getVotesByPostId(postId);
      if (!mounted) return;
      if (error) setError(error);
      setVotes(data ?? []);
      setLoading(false);
    })();
    return () => { mounted = false; };
  }, [postId]);

  const total = useMemo(() => {
    if (!votes?.length) return 0;
    const sum = votes.reduce((acc, v) => acc + (v.upvote ? 1 : -1), 0);
    if (sum === 0) return votes[0].upvote ? 1 : -1;
    return sum;
  }, [votes]);

  return { votes, total, loading, error };
}
