// services/postService.ts
import { supabase } from "../lib/supabaseClient";
import { DBPost, Post, Subreddit, NewPostInput, UpdatePostInput } from "../types/db";

const norm = (s: string | null) => s ?? "";

function mapBase(d: DBPost) {
  return {
    id: d.id,
    created_at: norm(d.created_at),
    title: d.title ?? "",
    body: d.body ?? "",
    image: d.image ?? "",
    username: d.username ?? "",
    subreddit_id: d.subreddit_id ?? 0,
  };
}

/** get all posts with subreddit joined */
export async function getAllPosts(): Promise<{ data: Post[]; error: any }> {
  const { data, error } = await supabase.from("post").select(` *,
    subreddit (
      id,
      topic,
      created_at
    ),
    comment (
      id,
      text,
      post_id,
      username,
      created_at
    )
`).order("created_at", { ascending: false });
  if (error) return { data: [], error };
  const posts: Post[] = (data ?? []).map((p: any) => ({
    ...mapBase(p),
    subreddit: p.subreddit ? { id: p.subreddit.id, topic: p.subreddit.topic ?? "", created_at: p.subreddit.created_at ?? "" } : null,
    commentList: p.comment ?? [],
    votes: p.votes ?? [],
    commentCount: p.comment ? p.comment.length : 0,
  }));
  return { data: posts, error: null };
}

export async function getPostsByTopic(topic: string): Promise<{ data: Post[]; error: any }> {
  const cleanTopic = topic.trim().replace(/^\/+/, "");
  // find subreddit id
  const { data: subs, error: subErr } = await supabase
    .from("subreddit")
    .select("id, topic, created_at")
    .eq("topic", cleanTopic);
  if (subErr) return { data: [], error: subErr };
  const sub = subs?.[0];
  if (!sub) return { data: [], error: null };

  const { data, error } = await supabase
    .from("post")
    .select(`
      *,
      comment (
        id,
        text,
        post_id,
        username,
        created_at
      )
    `)
    .eq("subreddit_id", sub.id)
    .order("created_at", { ascending: false });

  if (error) return { data: [], error };
  const posts = (data ?? []).map((p: any) => ({
    ...mapBase(p),
    subreddit: { id: sub.id, topic: sub.topic ?? "", created_at: sub.created_at ?? "" },
    commentList: p.comment ?? [],
    commentCount: p.comment ? p.comment.length : 0,
  }));
  return { data: posts, error: null };
}


export async function getFullPost(id: number): Promise<{ data: Post | null; error: any }> {
  const { data: raw, error } = await supabase.from("post").select("*").eq("id", id).single();
  if (error || !raw) return { data: null, error };
  const base = mapBase(raw);
  let subreddit: Subreddit | null = null;
  if (base.subreddit_id) {
    const { data: s } = await supabase.from("subreddit").select("*").eq("id", base.subreddit_id).single();
    if (s) subreddit = { id: s.id, topic: s.topic ?? "", created_at: s.created_at ?? "" };
  }
  const { data: comments } = await supabase.from("comment").select("*").eq("post_id", id).order("created_at", { ascending: true });
  const commentList = (comments ?? []).map((c: any) => ({ id: c.id, created_at: c.created_at ?? "", post_id: c.post_id ?? id, text: c.text ?? "", username: c.username ?? "" }));
  const { data: votes } = await supabase.from("vote").select("*").eq("post_id", id);
  const votesList = (votes ?? []).map((v: any) => ({ id: v.id, created_at: v.created_at ?? "", post_id: v.post_id ?? id, upvote: !!v.upvote, username: v.username ?? "" }));
  return { data: { ...base, subreddit, commentList, votes: votesList, commentCount: commentList.length }, error: null };
}

export async function addPost(payload: NewPostInput): Promise<{ data: Post | null; error: any }> {
  const { data, error } = await supabase.from("post").insert({
    title: payload.title,
    body: payload.body ?? "",
    image: payload.image ?? "",
    subreddit_id: payload.subreddit_id,
    username: payload.username,
  }).select("*, subreddit(*)").single();

  if (error || !data) return { data: null, error };
  return {
    data: {
      id: data.id,
      created_at: data.created_at ?? "",
      title: data.title ?? "",
      body: data.body ?? "",
      image: data.image ?? "",
      username: data.username ?? "",
      subreddit_id: data.subreddit_id ?? 0,
      subreddit: data.subreddit ? { id: data.subreddit.id, topic: data.subreddit.topic ?? "", created_at: data.subreddit.created_at ?? "" } : null,
      commentList: [],
      votes: [],
      commentCount: 0,
    },
    error: null,
  };
}

export async function modifyPost(id: number, updates: UpdatePostInput): Promise<{ data: Post | null; error: any }> {
  const { data, error } = await supabase.from("post").update({
    ...(updates.title !== undefined ? { title: updates.title } : {}),
    ...(updates.body !== undefined ? { body: updates.body } : {}),
    ...(updates.image !== undefined ? { image: updates.image } : {}),
  }).eq("id", id).select("*, subreddit(*)").single();

  if (error || !data) return { data: null, error };
  return {
    data: {
      id: data.id,
      created_at: data.created_at ?? "",
      title: data.title ?? "",
      body: data.body ?? "",
      image: data.image ?? "",
      username: data.username ?? "",
      subreddit_id: data.subreddit_id ?? 0,
      subreddit: data.subreddit ? { id: data.subreddit.id, topic: data.subreddit.topic ?? "", created_at: data.subreddit.created_at ?? "" } : null,
      commentList: [],
      votes: [],
      commentCount: 0,
    },
    error: null,
  };
}

export async function deletePost(id: number): Promise<{ error: any }> {
  const { error } = await supabase.from("post").delete().eq("id", id);
  return { error };
}

export async function getPostsByUser(username: string): Promise<{ data: Post[]; error: any }> {
  const { data, error } = await supabase.from("post").select(` *,
    subreddit (
      id,
      topic,
      created_at
    ),
    comment (
      id,
      text,
      post_id,
      username,
      created_at
    )
`).eq("username", username).order("created_at", { ascending: false });
  if (error) return { data: [], error };
  const posts: Post[] = (data ?? []).map((p: any) => ({
    ...mapBase(p),
    subreddit: p.subreddit ? { id: p.subreddit.id, topic: p.subreddit.topic ?? "", created_at: p.subreddit.created_at ?? "" } : null,
    commentList: p.comment ?? [],
    votes: p.votes ?? [],
    commentCount: p.comment ? p.comment.length : 0,
  }));
  return { data: posts, error: null };
}
