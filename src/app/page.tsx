import Link from "next/link";
import Image from "next/image";
import { ArrowRight, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SHOW_SAU_GATE } from "@/config";
import { createClient } from "@/lib/supabase/server";
import type { Post } from "@/lib/types";

export default async function HomePage() {
  const supabase = await createClient();

  const [{ data: posts }, { count: postCount }] = await Promise.all([
    supabase
      .from("posts")
      .select("id, title, slug, excerpt, cover_image, created_at")
      .eq("published", true)
      .order("created_at", { ascending: false })
      .limit(7),
    supabase
      .from("posts")
      .select("id", { count: "exact", head: true })
      .eq("published", true),
  ]);

  const featured = posts?.[0] ?? null;
  const recent = posts?.slice(1, 7) ?? [];

  return (
    <div className="container mx-auto max-w-5xl px-4 py-10">

      {/* ── Hero Banner ── */}
      <div className="mb-10 text-center">
        <span className="inline-flex items-center rounded-full border px-3 py-1 text-xs text-muted-foreground mb-4">
          Sher-e-Bangla Agricultural University · Agricultural Economics
        </span>
        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight mb-3">
          Knowledge Hub for{" "}
          <span className="text-primary">AEC Students</span>
        </h1>
        <p className="text-muted-foreground max-w-xl mx-auto text-sm sm:text-base">
          Economics blogs, past questions, and AI summaries — all in one place.
        </p>
      </div>

      {/* ── Featured Post ── */}
      {featured && (
        <Link
          href={`/blog/${featured.slug}`}
          className="group mb-10 grid sm:grid-cols-2 rounded-2xl border bg-card overflow-hidden hover:shadow-md transition-shadow"
        >
          {/* Image */}
          <div className="relative h-52 sm:h-auto bg-muted">
            {featured.cover_image ? (
              <Image
                src={featured.cover_image}
                alt={featured.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                priority
              />
            ) : (
              <div className="flex h-full items-center justify-center text-muted-foreground text-sm">
                No image
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex flex-col justify-center gap-3 p-6 sm:p-8">
            <span className="inline-flex w-fit items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              Featured
            </span>
            <h2 className="text-xl sm:text-2xl font-bold leading-snug group-hover:text-primary transition-colors">
              {featured.title}
            </h2>
            {featured.excerpt && (
              <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                {featured.excerpt}
              </p>
            )}
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs text-muted-foreground">
                {new Date(featured.created_at).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
              <span className="flex items-center gap-1 text-sm font-medium text-primary">
                Read more <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </div>
          </div>
        </Link>
      )}

      {/* ── Recent Posts ── */}
      {recent.length > 0 && (
        <div className="mb-10">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-semibold">Recent Posts</h2>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/blog">
                View all <ArrowRight className="ml-1 h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>

          <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {recent.map((post: Post) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="group rounded-xl border bg-card overflow-hidden hover:shadow-md transition-shadow"
              >
                {/* Card Image */}
                <div className="relative h-40 bg-muted overflow-hidden">
                  {post.cover_image ? (
                    <Image
                      src={post.cover_image}
                      alt={post.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
                      No image
                    </div>
                  )}
                </div>

                {/* Card Body */}
                <div className="p-4">
                  <p className="text-xs text-muted-foreground mb-2">
                    {new Date(post.created_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                  <h3 className="font-semibold text-sm leading-snug mb-2 group-hover:text-primary transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  {post.excerpt && (
                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                      {post.excerpt}
                    </p>
                  )}
                  <span className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-primary">
                    Read more <ArrowRight className="h-3 w-3" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* ── Stats + QB Banner ── */}
      <div className="grid gap-4 sm:grid-cols-3 mb-6">
        <div className="rounded-xl bg-muted/50 p-5 text-center">
          <p className="text-3xl font-bold">{postCount ?? 0}</p>
          <p className="text-sm text-muted-foreground mt-1">Articles published</p>
        </div>
        <div className="rounded-xl bg-muted/50 p-5 text-center">
          <p className="text-3xl font-bold">4</p>
          <p className="text-sm text-muted-foreground mt-1">Academic levels</p>
        </div>
        <div className="rounded-xl bg-muted/50 p-5 text-center">
          <p className="text-3xl font-bold">AI</p>
          <p className="text-sm text-muted-foreground mt-1">Powered summaries</p>
        </div>
      </div>

      {/* ── QB Banner ── */}
      {SHOW_SAU_GATE && (
        <div className="rounded-2xl border bg-card p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-lg mb-1">
              Looking for past question papers?
            </h3>
            <p className="text-sm text-muted-foreground">
              Access semester-wise questions organized by course and level.
            </p>
          </div>
          <Button asChild className="shrink-0 w-full sm:w-auto">
            <Link
              href="https://question-bank-app-five.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <GraduationCap className="mr-2 h-4 w-4" />
              Open Question Bank
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}