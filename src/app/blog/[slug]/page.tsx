import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { AISummary } from "@/components/blog/ai-summary";
import { CommentSection } from "@/components/blog/comment-section";
import { ReactionButton } from "@/components/blog/reaction-button";
import { TranslatableBlogContent } from "@/components/blog/translatable-blog-content";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: post } = await supabase
    .from("posts")
    .select("title, seo_title, seo_description, excerpt, cover_image")
    .eq("slug", slug)
    .single();

  if (!post) return { title: "Post Not Found" };

  return {
    title: post.seo_title ?? post.title,
    description: post.seo_description ?? post.excerpt ?? "",
    openGraph: {
      title: post.seo_title ?? post.title,
      description: post.seo_description ?? post.excerpt ?? "",
      images: post.cover_image ? [post.cover_image] : [],
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const supabase = await createClient();

  // Get post
  const { data: post } = await supabase
    .from("posts")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .single();

  if (!post) notFound();

  const [previousPostResult, nextPostResult] = await Promise.all([
    post.previous_slug
      ? supabase
          .from("posts")
          .select("slug, title")
          .eq("slug", post.previous_slug)
          .eq("published", true)
          .maybeSingle()
      : Promise.resolve({ data: null }),
    post.next_slug
      ? supabase
          .from("posts")
          .select("slug, title")
          .eq("slug", post.next_slug)
          .eq("published", true)
          .maybeSingle()
      : Promise.resolve({ data: null }),
  ]);

  const previousPost = previousPostResult.data;
  const nextPost = nextPostResult.data;

  // Fetch supporting data in parallel after post load
  const [
    {
      data: { user },
    },
    { data: comments },
    { data: reactions },
  ] = await Promise.all([
    supabase.auth.getUser(),
    supabase
      .from("comments")
      .select(
        `
    *,
    profiles (
      id,
      full_name,
      avatar_url,
      email
    )
  `
      )
      .eq("post_id", post.id)
      .order("created_at", { ascending: true }),
    supabase
      .from("reactions")
      .select("*, profiles(id, full_name, email)")
      .eq("post_id", post.id),
  ]);

  let currentUserRole = "student";
  if (user?.id) {
    const { data: currentProfile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();
    currentUserRole = currentProfile?.role ?? "student";
  }

  const reactors = reactions?.map((r) => r.profiles) ?? [];
  const userLiked = reactions?.some((r) => r.user_id === user?.id) ?? false;

  return (
    <article className="container mx-auto max-w-3xl px-4 py-12">
      {/* Header */}
      <header className="mb-8">
        <p className="mb-3 text-sm text-muted-foreground">
          {new Date(post.created_at).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
        <h1 className="text-4xl font-bold leading-tight tracking-tight">
          {post.title}
        </h1>
        {post.excerpt && (
          <p className="mt-4 text-xl text-muted-foreground">{post.excerpt}</p>
        )}
      </header>

      {/* Cover Image */}
      {post.cover_image && (
        <div className="relative mb-10 h-72 w-full overflow-hidden rounded-xl sm:h-96">
          <Image
            src={post.cover_image}
            alt={post.title}
            fill
            className="object-cover"
            priority
          />
        </div>
      )}

      {/* AI Summary */}
      <AISummary content={post.content ?? ""} />

      {/* Content */}
      <TranslatableBlogContent content={post.content ?? ""} />

      {/* Reaction */}
      <div className="mt-10">
        <ReactionButton
          postId={post.id}
          slug={slug}
          initialCount={reactions?.length ?? 0}
          initialLiked={userLiked}
          reactors={reactors}
          currentUserId={user?.id ?? null}
        />
      </div>

      {/* Comments */}
      <CommentSection
        postId={post.id}
        slug={slug}
        initialComments={comments ?? []}
        currentUserId={user?.id ?? null}
        isAdmin={currentUserRole === "admin"}
      />

      {/* Previous/Next Learning Navigation */}
      {(previousPost || nextPost) && (
        <section className="mt-12 rounded-xl border bg-muted/30 p-4">
          <p className="mb-3 text-sm font-medium">Continue Learning</p>
          <div className="grid gap-3 sm:grid-cols-2">
            {previousPost ? (
              <Link
                href={`/blog/${previousPost.slug}`}
                className="rounded-lg border bg-background p-3 text-sm transition-colors hover:border-primary"
              >
                <p className="text-xs text-muted-foreground">Previous Blog</p>
                <p className="mt-1 font-medium">{previousPost.title}</p>
              </Link>
            ) : (
              <div className="rounded-lg border border-dashed p-3 text-sm text-muted-foreground">
                No previous blog linked
              </div>
            )}

            {nextPost ? (
              <Link
                href={`/blog/${nextPost.slug}`}
                className="rounded-lg border bg-background p-3 text-sm text-right transition-colors hover:border-primary"
              >
                <p className="text-xs text-muted-foreground">Next Blog</p>
                <p className="mt-1 font-medium">{nextPost.title}</p>
              </Link>
            ) : (
              <div className="rounded-lg border border-dashed p-3 text-sm text-muted-foreground sm:text-right">
                No next blog linked
              </div>
            )}
          </div>
        </section>
      )}
    </article>
  );
}