// services/voteService.ts
import { supabase } from "../lib/supabaseClient";
import { Vote } from "../types/db";

function map(v: any): Vote {
  return { id: v.id, created_at: v.created_at ?? "", post_id: v.post_id ?? 0, upvote: !!v.upvote, username: v.username ?? "" };
}

export async function getVotesByPostId(postId: number): Promise<{ data: Vote[]; error: any }> {
  const { data, error } = await supabase.from("vote").select("*").eq("post_id", postId);
  return { data: (data ?? []).map(map), error };
}

export async function addVote(input: { post_id: number; username: string; upvote: boolean }): Promise<{ data: Vote | null; error: any }> {
  const { data, error } = await supabase.from("vote").insert(input).select().single();
  return { data: data ? map(data) : null, error };
}

export async function updateVote(id: number, upvote: boolean): Promise<{ data: Vote | null; error: any }> {
  const { data, error } = await supabase.from("vote").update({ upvote }).eq("id", id).select().single();
  return { data: data ? map(data) : null, error };
}

export async function removeVote(id: number): Promise<{ error: any }> {
  const { error } = await supabase.from("vote").delete().eq("id", id);
  return { error };
}
