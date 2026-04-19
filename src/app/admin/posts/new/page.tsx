"use client";

import { useEffect, useState } from "react";
import { createPost } from "@/app/actions/posts";
import { createClient } from "@/lib/supabase/client";
import { RichTextEditor } from "@/components/editor/rich-text-editor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { uploadToCloudinary } from "@/lib/cloudinary-upload";
import { ImagePlus, Loader2 } from "lucide-react";
import Image from "next/image";

export default function NewPostPage() {
  const [content, setContent] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [uploading, setUploading] = useState(false);
  const [availablePosts, setAvailablePosts] = useState<
    { id: string; title: string; slug: string }[]
  >([]);

  useEffect(() => {
    async function loadPosts() {
      const supabase = createClient();
      const { data } = await supabase
        .from("posts")
        .select("id, title, slug")
        .order("created_at", { ascending: false });
      setAvailablePosts(data ?? []);
    }
    loadPosts();
  }, []);

  function setSelectedImage(file: File) {
    if (!file.type.startsWith("image/")) {
      alert("Please paste or choose an image file.");
      return;
    }
    setPendingFile(file);
    setPreview(URL.createObjectURL(file)); // local preview only
  }

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedImage(file);
  }

  function handlePasteImage(e: React.ClipboardEvent<HTMLDivElement>) {
    const imageItem = Array.from(e.clipboardData.items).find((item) =>
      item.type.startsWith("image/")
    );
    const file = imageItem?.getAsFile();
    if (!file) return;
    e.preventDefault();
    setSelectedImage(file);
  }

  function handleRemoveImage() {
    setPendingFile(null);
    setPreview("");
    setCoverImage("");
  }

  async function handleSubmit(formData: FormData) {
    setUploading(true);
    try {
      // Only upload to Cloudinary if user didn't remove the image
      if (pendingFile) {
        const url = await uploadToCloudinary(pendingFile);
        formData.set("cover_image", url);
      }
      await createPost(formData);
    } catch (err) {
      if (
        typeof err === "object" &&
        err !== null &&
        "digest" in err &&
        typeof err.digest === "string" &&
        err.digest.startsWith("NEXT_REDIRECT")
      ) {
        throw err;
      }
      alert("Something went wrong");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <h2 className="text-xl font-semibold">New Post</h2>

      <form action={handleSubmit} className="space-y-6">
        {/* Hidden fields */}
        <input type="hidden" name="content" value={content} />
        <input type="hidden" name="cover_image" value={coverImage} />

        {/* Title */}
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input id="title" name="title" placeholder="Post title" required />
        </div>

        {/* Cover Image */}
        <div className="space-y-2">
          <Label>Cover Image</Label>
          <div className="space-y-3">
            {!preview && (
              <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-dashed px-4 py-3 text-sm text-muted-foreground hover:border-primary hover:text-primary transition-colors">
                <ImagePlus className="h-4 w-4" />
                Choose Image
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileSelect}
                />
              </label>
            )}

            <div
              role="button"
              tabIndex={0}
              onPaste={handlePasteImage}
              className="rounded-lg border border-dashed px-4 py-3 text-sm text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              Click here and press Ctrl/Cmd+V to paste an image
            </div>

            {preview && (
              <div className="relative inline-block">
                <Image
                  src={preview}
                  alt="Cover"
                  width={80}
                  height={80}
                  className="rounded-lg object-cover"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute -top-2 -right-2 rounded-full bg-destructive text-white w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                >
                  ✕
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Excerpt */}
        <div className="space-y-2">
          <Label htmlFor="excerpt">Excerpt</Label>
          <Textarea
            id="excerpt"
            name="excerpt"
            placeholder="Short description shown in blog listing..."
            rows={2}
          />
        </div>

        {/* Content */}
        <div className="space-y-2">
          <Label>Content</Label>
          <RichTextEditor content={content} onChange={setContent} />
        </div>

        {/* SEO */}
        <div className="rounded-xl border p-4 space-y-4">
          <h3 className="font-medium">SEO Settings</h3>
          <div className="space-y-2">
            <Label htmlFor="seo_title">SEO Title</Label>
            <Input
              id="seo_title"
              name="seo_title"
              placeholder="SEO title (defaults to post title)"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="seo_description">SEO Description</Label>
            <Textarea
              id="seo_description"
              name="seo_description"
              placeholder="Meta description for search engines..."
              rows={2}
            />
          </div>
        </div>

        {/* Learning Flow (Optional) */}
        <div className="rounded-xl border p-4 space-y-4">
          <h3 className="font-medium">Learning Flow (Optional)</h3>
          <p className="text-xs text-muted-foreground">
            Link previous and next blogs so readers can follow a sequence.
          </p>
          <div className="space-y-2">
            <Label htmlFor="previous_slug">Previous Blog</Label>
            <select
              id="previous_slug"
              name="previous_slug"
              className="w-full rounded-md border bg-background px-3 py-2 text-sm"
              defaultValue=""
            >
              <option value="">None</option>
              {availablePosts.map((post) => (
                <option key={post.id} value={post.slug}>
                  {post.title}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="next_slug">Next Blog</Label>
            <select
              id="next_slug"
              name="next_slug"
              className="w-full rounded-md border bg-background px-3 py-2 text-sm"
              defaultValue=""
            >
              <option value="">None</option>
              {availablePosts.map((post) => (
                <option key={post.id} value={post.slug}>
                  {post.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button type="submit" name="published" value="true" disabled={uploading}>
            {uploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Publishing...
              </>
            ) : (
              "Publish"
            )}
          </Button>
          <Button
            type="submit"
            name="published"
            value="false"
            variant="outline"
            disabled={uploading}
          >
            Save as Draft
          </Button>
        </div>
      </form>
    </div>
  );
}