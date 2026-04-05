"use client";

import { useState, useEffect, useRef, useTransition } from "react";
import { searchPosts } from "@/app/actions/search";
import { Search, X, Loader2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import type { Post } from "@/lib/types";
import { useRouter } from "next/navigation";

export function SearchBar() {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<Post[]>([]);
    const [open, setOpen] = useState(false);
    const [isPending, startTransition] = useTransition();
    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();

    // Close on outside click
    useEffect(() => {
        function handleClick(e: MouseEvent) {
            if (!containerRef.current?.contains(e.target as Node)) {
                setOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, []);

    // Debounced search
    useEffect(() => {
        if (!query.trim()) {
            setResults([]);
            setOpen(false);
            return;
        }

        const timer = setTimeout(() => {
            startTransition(async () => {
                const data = await searchPosts(query);
                setResults(data);
                setOpen(true);
            });
        }, 300);

        return () => clearTimeout(timer);
    }, [query]);

    function handleClear() {
        setQuery("");
        setResults([]);
        setOpen(false);
        inputRef.current?.focus();
    }

    function handleKeyDown(e: React.KeyboardEvent) {
        if (e.key === "Enter" && query.trim()) {
            router.push(`/search?q=${encodeURIComponent(query)}`);
            setOpen(false);
        }
        if (e.key === "Escape") {
            setOpen(false);
        }
    }

    return (
        <div ref={containerRef} className="relative">
            {/* Input */}
            <div className="flex items-center gap-2 rounded-lg border bg-muted/50 px-3 py-1.5 text-sm focus-within:border-primary focus-within:bg-background transition-colors w-48 lg:w-64">
                {isPending ? (
                    <Loader2 className="h-3.5 w-3.5 shrink-0 animate-spin text-muted-foreground" />
                ) : (
                    <Search className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                )}
                <input
                    ref={inputRef}
                    type="text"
                    placeholder="Search posts..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="flex-1 bg-transparent outline-none placeholder:text-muted-foreground text-sm"
                />
                {query && (
                    <button onClick={handleClear}>
                        <X className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground" />
                    </button>
                )}
            </div>

            {/* Dropdown Results */}
            {open && (
                <div className="absolute top-full left-0 right-0 z-50 mt-2 rounded-xl border bg-popover shadow-lg overflow-hidden min-w-[320px]">
                    {results.length > 0 ? (
                        <>
                            <div className="px-3 py-2 border-b">
                                <p className="text-xs text-muted-foreground">
                                    {results.length} result{results.length !== 1 ? "s" : ""} for{" "}
                                    <span className="font-medium text-foreground">"{query}"</span>
                                </p>
                            </div>
                            <ul>
                                {results.map((post) => (
                                    <li key={post.id}>
                                        <Link
                                            href={`/blog/${post.slug}`}
                                            onClick={() => {
                                                setOpen(false);
                                                setQuery("");
                                            }}
                                            className="flex items-center gap-3 px-3 py-2.5 hover:bg-muted transition-colors"
                                        >
                                            {post.cover_image && (
                                                <Image
                                                    src={post.cover_image}
                                                    alt={post.title}
                                                    width={40}
                                                    height={40}
                                                    className="rounded-md object-cover shrink-0"
                                                />
                                            )}
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium truncate">
                                                    {post.title}
                                                </p>
                                                {post.excerpt && (
                                                    <p className="text-xs text-muted-foreground truncate mt-0.5">
                                                        {post.excerpt}
                                                    </p>
                                                )}
                                                <p className="text-xs text-muted-foreground mt-0.5">
                                                    {new Date(post.created_at).toLocaleDateString(
                                                        "en-US",
                                                        { month: "short", day: "numeric", year: "numeric" }
                                                    )}
                                                </p>
                                            </div>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                            <div className="border-t px-3 py-2">
                                <Link
                                    href={`/search?q=${encodeURIComponent(query)}`}
                                    onClick={() => setOpen(false)}
                                    className="text-xs text-primary hover:underline"
                                >
                                    See all results for "{query}" →
                                </Link>
                            </div>
                        </>
                    ) : (
                        <div className="px-3 py-6 text-center text-sm text-muted-foreground">
                            No results found for "{query}"
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}