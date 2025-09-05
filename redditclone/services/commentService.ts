// services/commentService.ts
import { supabase } from "../lib/supabaseClient";
import { DBComment, Comment, NewCommentInput } from "../types/db";

function mapComment(d: DBComment): Comment {
  return {
    id: d.id,
    created_at: d.created_at ?? "",
    post_id: d.post_id ?? 0,
    text: d.text ?? "",
    username: d.username ?? "",
  };
}

export async function getCommentsByPostId(postId: number): Promise<{ data: Comment[]; error: any }> {
  const { data, error } = await supabase.from("comment").select("*").eq("post_id", postId).order("created_at", { ascending: true });
  return { data: (data ?? []).map(mapComment), error };
}

export async function getCommentById(id: number): Promise<{ data: Comment | null; error: any }> {
  const { data, error } = await supabase.from("comment").select("*").eq("id", id).single();
  return { data: data ? mapComment(data) : null, error };
}

export async function addComment(input: NewCommentInput): Promise<{ data: Comment | null; error: any }> {
  const { data, error } = await supabase.from("comment").insert({ post_id: input.post_id, text: input.text, username: input.username }).select().single();
  return { data: data ? mapComment(data) : null, error };
}

export async function modifyComment(id: number, text: string): Promise<{ data: Comment | null; error: any }> {
  const { data, error } = await supabase.from("comment").update({ text }).eq("id", id).select().single();
  return { data: data ? mapComment(data) : null, error };
}

export async function deleteComment(id: number): Promise<{ error: any }> {
  const { error } = await supabase.from("comment").delete().eq("id", id);
  return { error };
}
