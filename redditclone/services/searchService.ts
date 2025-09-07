import { supabase } from "../lib/supabaseClient";
import { Post } from "../types/db";

function mapPost(p: any): Post {
  return {
    id: p.id,
    created_at: p.created_at ?? "",
    title: p.title ?? "",
    body: p.body ?? "",
    image: p.image ?? "",
    username: p.username ?? "",
    subreddit_id: p.subreddit_id ?? 0,
    subreddit: p.subreddit
      ? { id: p.subreddit.id, topic: p.subreddit.topic ?? "", created_at: p.subreddit.created_at ?? "" }
      : null,
    commentList: [],
    votes: [],
    commentCount: 0,
  };
}

export async function searchPosts(term: string): Promise<{ data: Post[]; error: any }> {
  const t = term.trim();
  if (!t) return { data: [], error: null };

  // 1. Search posts by title, body, username
  const or = `title.ilike.%${t}%,body.ilike.%${t}%,username.ilike.%${t}%`;
  const { data: postData, error: postError } = await supabase
    .from("post")
    .select("*, subreddit(*)")
    .or(or)
    .order("created_at", { ascending: false });

  if (postError) return { data: [], error: postError };

  // 2. Search subreddits by topic
  const { data: subData, error: subError } = await supabase
    .from("subreddit")
    .select("id")
    .ilike("topic", `%${t}%`);

  if (subError) return { data: [], error: subError };

  const subredditIds = (subData ?? []).map((s: any) => s.id);
  let postsBySubreddit: any[] = [];

  if (subredditIds.length > 0) {
    const { data: subPosts, error: subPostsError } = await supabase
      .from("post")
      .select("*, subreddit(*)")
      .in("subreddit_id", subredditIds)
      .order("created_at", { ascending: false });

    if (subPostsError) return { data: [], error: subPostsError };
    postsBySubreddit = subPosts ?? [];
  }

  // 3. Combine and deduplicate posts
  const allPosts = [...(postData ?? []), ...postsBySubreddit];
  const uniquePosts = Array.from(
    new Map(allPosts.map((p: any) => [p.id, p])).values()
  );

  return { data: uniquePosts.map(mapPost), error: null };
}
