import { searchPosts } from "@/app/actions/search";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { SearchPageInput } from "@/components/search/search-page-input";

interface Props {
    searchParams: Promise<{ q?: string }>;
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
    const { q } = await searchParams;
    return {
        title: q ? `Search: ${q}` : "Search",
        description: q
            ? `Search results for "${q}" on SAU EconHub.`
            : "Search blog posts on SAU EconHub.",
        robots: {
            index: false,
            follow: true,
        },
    };
}

export default async function SearchPage({ searchParams }: Props) {
    const { q } = await searchParams;
    const query = q ?? "";
    const results = query ? await searchPosts(query) : [];

    return (
        <div className="container mx-auto max-w-3xl px-4 py-12">
            {/* Search Input */}
            <div className="mb-8">
                <h1 className="mb-4 text-3xl font-bold tracking-tight">Search</h1>
                <SearchPageInput initialQuery={query} />
            </div>

            {/* Results */}
            {query && (
                <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                        {results.length > 0
                            ? `${results.length} result${results.length !== 1 ? "s" : ""} for "${query}"`
                            : `No results found for "${query}"`}
                    </p>

                    {results.length > 0 ? (
                        <div className="space-y-4">
                            {results.map((post) => (
                                <Link
                                    key={post.id}
                                    href={`/blog/${post.slug}`}
                                    className="flex gap-4 rounded-xl border bg-card p-4 hover:shadow-md transition-shadow"
                                >
                                    {post.cover_image && (
                                        <div className="relative h-24 w-32 shrink-0 overflow-hidden rounded-lg">
                                            <Image
                                                src={post.cover_image}
                                                alt={post.title}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                    )}
                                    <div className="flex flex-col justify-center min-w-0">
                                        <h2 className="font-semibold text-foreground truncate">
                                            {post.title}
                                        </h2>
                                        {post.excerpt && (
                                            <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                                                {post.excerpt}
                                            </p>
                                        )}
                                        <p className="mt-2 text-xs text-muted-foreground">
                                            {new Date(post.created_at).toLocaleDateString("en-US", {
                                                year: "numeric",
                                                month: "long",
                                                day: "numeric",
                                            })}
                                        </p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="rounded-xl border border-dashed py-16 text-center text-muted-foreground">
                            <p className="mb-2 text-lg font-medium">No posts found</p>
                            <p className="text-sm">Try a different search term</p>
                        </div>
                    )}
                </div>
            )}

            {!query && (
                <div className="rounded-xl border border-dashed py-16 text-center text-muted-foreground">
                    <p className="text-sm">Type something to search blog posts</p>
                </div>
            )}
        </div>
    );
}