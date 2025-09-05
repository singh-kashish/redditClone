// services/subredditService.ts
import { supabase } from "../lib/supabaseClient";
import { DBSubreddit, Subreddit } from "../types/db";

const clean = (t: string) => t.trim().replace(/^\/+/, "");

function map(d: DBSubreddit): Subreddit {
  return { id: d.id, created_at: d.created_at ?? "", topic: d.topic ?? "" };
}

export async function getSubreddits(limit = 10): Promise<{ data: Subreddit[]; error: any }> {
  const { data, error } = await supabase.from("subreddit").select("*").order("created_at", { ascending: false }).limit(limit);
  return { data: (data ?? []).map(map), error };
}

export async function getSubredditByTopic(topic: string): Promise<{ data: Subreddit[]; error: any }> {
  const t = clean(topic);
  const { data, error } = await supabase.from("subreddit").select("*").eq("topic", t);
  return { data: (data ?? []).map(map), error };
}

export async function addSubreddit(topic: string): Promise<{ data: Subreddit | null; error: any }> {
  const t = clean(topic);
  const { data, error } = await supabase.from("subreddit").insert({ topic: t }).select().single();
  return { data: data ? map(data as DBSubreddit) : null, error };
}
