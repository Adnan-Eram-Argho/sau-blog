"use server";

import { createClient } from "@/lib/supabase/server";
import type { Post } from "@/lib/types";

export async function searchPosts(query: string): Promise<Post[]> {
  if (!query.trim()) return [];

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("posts")
    .select("id, title, slug, excerpt, cover_image, created_at")
    .eq("published", true)
    .textSearch("fts", query, {
      type: "websearch",
      config: "english",
    })
    .order("created_at", { ascending: false })
    .limit(10);

  if (error) {
    console.error("Search error:", error);
    return [];
  }

  return data ?? [];
}