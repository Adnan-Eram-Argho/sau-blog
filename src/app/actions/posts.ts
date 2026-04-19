"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import cloudinary from "@/lib/cloudinary";
import { getPublicIdFromUrl } from "@/lib/cloudinary-upload";

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

async function ensureAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    throw new Error("Forbidden");
  }

  return { supabase, user };
}

export async function createPost(formData: FormData) {
  const { supabase, user } = await ensureAdmin();

  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const excerpt = formData.get("excerpt") as string;
  const cover_image = formData.get("cover_image") as string;
  const seo_title = formData.get("seo_title") as string;
  const seo_description = formData.get("seo_description") as string;
  const published = formData.get("published") === "true";

  const slug = generateSlug(title);

  const { error } = await supabase.from("posts").insert({
    title,
    slug,
    content,
    excerpt,
    cover_image,
    seo_title,
    seo_description,
    published,
    author_id: user.id,
  });

  if (error) throw new Error(error.message);

  revalidatePath("/blog");
  revalidatePath("/admin/posts");
  redirect("/admin/posts");
}

export async function updatePost(id: string, formData: FormData) {
  const { supabase } = await ensureAdmin();

  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const excerpt = formData.get("excerpt") as string;
  const cover_image = formData.get("cover_image") as string;
  const seo_title = formData.get("seo_title") as string;
  const seo_description = formData.get("seo_description") as string;
  const published = formData.get("published") === "true";
  const slug = generateSlug(title);

  const { error } = await supabase
    .from("posts")
    .update({
      title,
      slug,
      content,
      excerpt,
      cover_image,
      seo_title,
      seo_description,
      published,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath("/blog");
  revalidatePath("/admin/posts");
  redirect("/admin/posts");
}

export async function deletePost(id: string) {
  const { supabase } = await ensureAdmin();

  // Get the post first to find the image URL
  const { data: post } = await supabase
    .from("posts")
    .select("cover_image")
    .eq("id", id)
    .single();

  // Delete image from Cloudinary if it exists
  if (post?.cover_image) {
    try {
      const publicId = getPublicIdFromUrl(post.cover_image);
      await cloudinary.uploader.destroy(publicId);
    } catch (err) {
      console.error("Failed to delete image from Cloudinary:", err);
    }
  }

  // Delete post from database
  const { error } = await supabase.from("posts").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/blog");
  revalidatePath("/admin/posts");
}