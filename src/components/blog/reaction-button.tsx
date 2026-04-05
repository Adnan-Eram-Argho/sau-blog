"use client";

import { useState } from "react";
import { toggleReaction } from "@/app/actions/interactions";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Profile } from "@/lib/types";

interface Props {
  postId: string;
  slug: string;
  initialCount: number;
  initialLiked: boolean;
  reactors: Profile[];
  currentUserId: string | null;
}

export function ReactionButton({
  postId,
  slug,
  initialCount,
  initialLiked,
  reactors,
  currentUserId,
}: Props) {
  const [liked, setLiked] = useState(initialLiked);
  const [count, setCount] = useState(initialCount);
  const [showReactors, setShowReactors] = useState(false);

  async function handleToggle() {
    if (!currentUserId) {
      alert("Please login to react.");
      return;
    }
    // Optimistic update
    setLiked((prev) => !prev);
    setCount((prev) => (liked ? prev - 1 : prev + 1));
    await toggleReaction(postId, slug);
  }

  return (
    <div className="relative inline-flex items-center gap-2">
      <Button
        variant={liked ? "default" : "outline"}
        size="sm"
        onClick={handleToggle}
        className="gap-2"
      >
        <Heart className={`h-4 w-4 ${liked ? "fill-current" : ""}`} />
        <span>{count}</span>
      </Button>

      {/* Reactor list — only visible to logged in users */}
      {currentUserId && count > 0 && (
        <button
          onClick={() => setShowReactors(!showReactors)}
          className="text-xs text-muted-foreground hover:text-foreground underline"
        >
          {showReactors ? "Hide" : "See who liked"}
        </button>
      )}

      {showReactors && currentUserId && (
        <div className="absolute bottom-full left-0 mb-2 min-w-[160px] rounded-lg border bg-popover p-3 shadow-md">
          <p className="mb-2 text-xs font-medium text-muted-foreground">
            Liked by
          </p>
          <ul className="space-y-1">
            {reactors.map((r) => (
              <li key={r.id} className="text-sm">
                {r.full_name ?? r.email ?? "Student"}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}