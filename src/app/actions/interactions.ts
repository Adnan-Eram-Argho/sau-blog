"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

// ── COMMENTS ──────────────────────────────

export async function addComment(postId: string, content: string) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("You must be logged in to comment.");

  const { error } = await supabase.from("comments").insert({
    post_id: postId,
    author_id: user.id,
    content,
  });

  if (error) throw new Error(error.message);
  revalidatePath(`/blog`);
}

export async function deleteComment(commentId: string, slug: string) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  // Check if admin
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  const isAdmin = profile?.role === "admin";

  const query = supabase.from("comments").delete().eq("id", commentId);

  // Admins can delete any comment, users only their own
  if (!isAdmin) {
    query.eq("author_id", user.id);
  }

  const { error } = await query;
  if (error) throw new Error(error.message);

  revalidatePath(`/blog/${slug}`);
}

// ── REACTIONS ─────────────────────────────

export async function toggleReaction(postId: string, slug: string) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("You must be logged in to react.");

  // Check if reaction already exists
  const { data: existing } = await supabase
    .from("reactions")
    .select("id")
    .eq("post_id", postId)
    .eq("user_id", user.id)
    .single();

  if (existing) {
    // Unlike
    await supabase.from("reactions").delete().eq("id", existing.id);
  } else {
    // Like
    await supabase.from("reactions").insert({
      post_id: postId,
      user_id: user.id,
      type: "love",
    });
  }

  revalidatePath(`/blog/${slug}`);
}