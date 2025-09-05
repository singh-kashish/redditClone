// services/searchService.ts
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
    subreddit: p.subreddit ? { id: p.subreddit.id, topic: p.subreddit.topic ?? "", created_at: p.subreddit.created_at ?? "" } : null,
    commentList: [],
    votes: [],
    commentCount: 0,
  };
}

export async function searchPosts(term: string): Promise<{ data: Post[]; error: any }> {
  const t = term.trim();
  if (!t) return { data: [], error: null };
  // build OR of ilike checks
  const or = `title.ilike.%${t}%,body.ilike.%${t}%,username.ilike.%${t}%,subreddit.topic.ilike.%${t}%`;
  const { data, error } = await supabase.from("post").select("*, subreddit(*)").or(or).order("created_at", { ascending: false });
  if (error) return { data: [], error };
  return { data: (data ?? []).map(mapPost), error: null };
}
