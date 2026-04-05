"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Search } from "lucide-react";

export function SearchPageInput({ initialQuery }: { initialQuery: string }) {
    const [query, setQuery] = useState(initialQuery);
    const router = useRouter();

    function handleKeyDown(e: React.KeyboardEvent) {
        if (e.key === "Enter" && query.trim()) {
            router.push(`/search?q=${encodeURIComponent(query)}`);
        }
    }

    return (
        <div className="flex items-center gap-3 rounded-xl border bg-background px-4 py-3 focus-within:border-primary transition-colors">
            <Search className="h-5 w-5 shrink-0 text-muted-foreground" />
            <input
                type="text"
                placeholder="Search blog posts..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                autoFocus
                className="flex-1 bg-transparent text-base outline-none placeholder:text-muted-foreground"
            />
        </div>
    );
}