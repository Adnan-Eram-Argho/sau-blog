import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { siteConfig } from "@/config";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Read articles on Agricultural Economics, policy, development, and academic resources for SAU students. Written by Adnan Eram Argho.",
  alternates: {
    canonical: "/blog",
  },
  openGraph: {
    title: "Blog | SAU EconHub",
    description:
      "Articles on Agricultural Economics, policy, and development for SAU students.",
    url: `${siteConfig.url}/blog`,
    siteName: siteConfig.name,
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "SAU EconHub Blog",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog | SAU EconHub",
    description:
      "Articles on Agricultural Economics, policy, and development for SAU students.",
    images: ["/og-image.png"],
  },
};

function BlogListJsonLd() {
  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "SAU EconHub Blog",
    description:
      "Articles on Agricultural Economics, policy, and development.",
    url: `${siteConfig.url}/blog`,
    isPartOf: {
      "@type": "WebSite",
      name: siteConfig.name,
      url: siteConfig.url,
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
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(collectionSchema),
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

export default async function BlogPage() {
  const supabase = await createClient();
  const { data: posts } = await supabase
    .from("posts")
    .select("id, title, slug, excerpt, cover_image, created_at")
    .eq("published", true)
    .order("created_at", { ascending: false });

  return (
    <div className="container mx-auto px-4 py-12">
      <BlogListJsonLd />

      <div className="mb-10">
        <h1 className="text-4xl font-bold tracking-tight">Blog</h1>
        <p className="mt-2 text-muted-foreground">
          Thoughts on Agricultural Economics, policy, and development.
        </p>
      </div>

      {posts && posts.length > 0 ? (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="group rounded-xl border bg-card overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              {post.cover_image && (
                <div className="relative h-48 w-full overflow-hidden">
                  <Image
                    src={post.cover_image}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
              )}
              <div className="p-5">
                <p className="mb-2 text-xs text-muted-foreground">
                  {new Date(post.created_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
                <h2 className="mb-2 text-lg font-semibold leading-snug group-hover:text-primary transition-colors">
                  {post.title}
                </h2>
                {post.excerpt && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {post.excerpt}
                  </p>
                )}
                <span className="mt-4 inline-block text-sm font-medium text-primary">
                  Read more →
                </span>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="py-24 text-center text-muted-foreground">
          No posts published yet. Check back soon!
        </div>
      )}
    </div>
  );
}