"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Loader2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SearchPageInput({ initialQuery }: { initialQuery: string }) {
  const [query, setQuery] = useState(initialQuery);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function submitSearch() {
    if (!query.trim()) return;
    startTransition(() => {
      router.push(`/search?q=${encodeURIComponent(query)}`);
    });
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") {
      submitSearch();
    }
  }

  return (
    <div className="flex items-center gap-3 rounded-xl border bg-background px-4 py-3 focus-within:border-primary transition-colors">
      {isPending ? (
        <Loader2 className="h-5 w-5 shrink-0 animate-spin text-muted-foreground" />
      ) : (
        <Search className="h-5 w-5 shrink-0 text-muted-foreground" />
      )}
      <input
        type="text"
        placeholder="Search blog posts..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        autoFocus
        className="flex-1 bg-transparent text-base outline-none placeholder:text-muted-foreground"
      />
      <Button
        type="button"
        size="sm"
        onClick={submitSearch}
        disabled={isPending || !query.trim()}
      >
        {isPending ? "Searching..." : "Search"}
      </Button>
    </div>
  );
}