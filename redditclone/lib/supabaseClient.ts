// lib/supabaseClient.ts
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!url || !key) throw new Error("Missing NEXT_PUBLIC_SUPABASE_* env vars");

export const supabase = createClient(url, key);
