"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { updatePost } from "@/app/actions/posts";
import { RichTextEditor } from "@/components/editor/rich-text-editor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { uploadToCloudinary } from "@/lib/cloudinary-upload";
import { ImagePlus, Loader2 } from "lucide-react";
import Image from "next/image";

export default function EditPostPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [content, setContent] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [fields, setFields] = useState({
    title: "",
    excerpt: "",
    seo_title: "",
    seo_description: "",
    published: false,
  });

  function setSelectedImage(file: File) {
    if (!file.type.startsWith("image/")) {
      alert("Please paste or choose an image file.");
      return;
    }
    setPendingFile(file);
    setPreview(URL.createObjectURL(file));
  }

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("posts")
        .select("*")
        .eq("id", id)
        .single();

      if (data) {
        setFields({
          title: data.title ?? "",
          excerpt: data.excerpt ?? "",
          seo_title: data.seo_title ?? "",
          seo_description: data.seo_description ?? "",
          published: data.published ?? false,
        });
        setContent(data.content ?? "");
        setCoverImage(data.cover_image ?? "");
        setPreview(data.cover_image ?? "");
      }
      setLoading(false);
    }
    load();
  }, [id]);

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
      if (pendingFile) {
        const url = await uploadToCloudinary(pendingFile);
        formData.set("cover_image", url);
      } else {
        formData.set("cover_image", coverImage);
      }
      await updatePost(id, formData);
    } catch {
      alert("Something went wrong");
    } finally {
      setUploading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <h2 className="text-xl font-semibold">Edit and Update Post</h2>

      <form action={handleSubmit} className="space-y-6">
        <input type="hidden" name="content" value={content} />

        {/* Title */}
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            name="title"
            value={fields.title}
            onChange={(e) => setFields((p) => ({ ...p, title: e.target.value }))}
            required
          />
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
                  className="absolute -top-2 -right-2 rounded-full bg-destructive text-white w-5 h-5 flex items-center justify-center text-xs"
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
            rows={2}
            value={fields.excerpt}
            onChange={(e) => setFields((p) => ({ ...p, excerpt: e.target.value }))}
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
              value={fields.seo_title}
              onChange={(e) => setFields((p) => ({ ...p, seo_title: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="seo_description">SEO Description</Label>
            <Textarea
              id="seo_description"
              name="seo_description"
              rows={2}
              value={fields.seo_description}
              onChange={(e) => setFields((p) => ({ ...p, seo_description: e.target.value }))}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            type="submit"
            name="published"
            value="true"
            disabled={uploading}
          >
            {uploading ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Saving...</>
            ) : "Update & Publish"}
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
          <Button
            type="button"
            variant="ghost"
            onClick={() => router.push("/admin/posts")}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}