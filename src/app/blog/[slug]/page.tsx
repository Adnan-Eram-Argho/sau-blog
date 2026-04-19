import { createClient } from "@/lib/supabase/server";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { AISummary } from "@/components/blog/ai-summary";
import { CommentSection } from "@/components/blog/comment-section";
import { ReactionButton } from "@/components/blog/reaction-button";
import { TranslatableBlogContent } from "@/components/blog/translatable-blog-content";
import { siteConfig } from "@/config";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  // Use direct Supabase client (no cookies) for build-time static generation
  const supabase = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  const { data: posts } = await supabase
    .from("posts")
    .select("slug")
    .eq("published", true);

  return posts?.map((post) => ({ slug: post.slug })) ?? [];
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

  const title = post.seo_title ?? post.title;
  const description = post.seo_description ?? post.excerpt ?? "";

  return {
    title,
    description,
    alternates: {
      canonical: `/blog/${slug}`,
    },
    openGraph: {
      type: "article",
      title,
      description,
      url: `${siteConfig.url}/blog/${slug}`,
      siteName: siteConfig.name,
      images: post.cover_image
        ? [
            {
              url: post.cover_image,
              alt: title,
            },
          ]
        : [{ url: "/og-image.png", width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: post.cover_image ? [post.cover_image] : ["/og-image.png"],
    },
  };
}

function BlogPostJsonLd({
  post,
  slug,
}: {
  post: {
    title: string;
    excerpt: string | null;
    content: string | null;
    cover_image: string | null;
    created_at: string;
    updated_at: string;
  };
  slug: string;
}) {
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt ?? "",
    image: post.cover_image ?? `${siteConfig.url}/og-image.png`,
    datePublished: post.created_at,
    dateModified: post.updated_at,
    url: `${siteConfig.url}/blog/${slug}`,
    author: {
      "@type": "Person",
      name: siteConfig.author.name,
      url: siteConfig.author.url,
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url,
      logo: {
        "@type": "ImageObject",
        url: `${siteConfig.url}/android-chrome-512x512.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${siteConfig.url}/blog/${slug}`,
    },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: siteConfig.url,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Blog",
        item: `${siteConfig.url}/blog`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: post.title,
        item: `${siteConfig.url}/blog/${slug}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />
    </>
  );
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
    { data: authorProfile },
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
    post.author_id
      ? supabase
          .from("profiles")
          .select("full_name, avatar_url")
          .eq("id", post.author_id)
          .single()
      : Promise.resolve({ data: null }),
  ]);

  let currentUserRole = "student";
  let currentUserProfile: { full_name: string | null; avatar_url: string | null; email: string | null } | null = null;
  if (user?.id) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role, full_name, avatar_url, email")
      .eq("id", user.id)
      .single();
    currentUserRole = profile?.role ?? "student";
    currentUserProfile = profile ? { full_name: profile.full_name, avatar_url: profile.avatar_url, email: profile.email } : null;
  }

  const authorName = authorProfile?.full_name ?? siteConfig.author.name;

  const reactors = reactions?.map((r) => r.profiles) ?? [];
  const userLiked = reactions?.some((r) => r.user_id === user?.id) ?? false;

  return (
    <article className="container mx-auto max-w-3xl px-4 py-12">
      <BlogPostJsonLd post={post} slug={slug} />

      {/* Header */}
      <header className="mb-8">
        <h1 className="text-4xl font-bold leading-tight tracking-tight">
          {post.title}
        </h1>
        {post.excerpt && (
          <p className="mt-4 text-xl text-muted-foreground">{post.excerpt}</p>
        )}
        <div className="mt-4 flex items-center gap-3">
          {authorProfile?.avatar_url && (
            <img
              src={authorProfile.avatar_url}
              alt={authorName}
              className="h-10 w-10 rounded-full object-cover"
            />
          )}
          <div>
            <p className="text-sm font-medium">{authorName}</p>
            <p className="text-xs text-muted-foreground">
              {new Date(post.created_at).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
        </div>
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
        currentUserProfile={currentUserProfile}
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