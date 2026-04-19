"use client";

import { useState } from "react";
import { addComment, deleteComment } from "@/app/actions/interactions";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Trash2, Loader2, MessageCircle } from "lucide-react";
import type { Comment } from "@/lib/types";

interface Props {
  postId: string;
  slug: string;
  initialComments: Comment[];
  currentUserId: string | null;
  isAdmin: boolean;
}

export function CommentSection({
  postId,
  slug,
  initialComments,
  currentUserId,
  isAdmin,
}: Props) { 
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function handleSubmit() {
    if (!text.trim()) return;
    setLoading(true);
    try {
      await addComment(postId, text.trim());
      setText("");
      // Optimistic update
      setComments((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          post_id: postId,
          author_id: currentUserId ?? "",
          content: text.trim(),
          created_at: new Date().toISOString(),
        },
      ]);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to post comment");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(commentId: string) {
    if (deletingId) return;
    setDeletingId(commentId);
    try {
      await deleteComment(commentId, slug);
      setComments((prev) => prev.filter((c) => c.id !== commentId));
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to delete comment");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="mt-12 space-y-6">
      <Separator />

      <div className="flex items-center gap-2">
        <MessageCircle className="h-5 w-5" />
        <h2 className="text-xl font-semibold">
          Comments ({comments.length})
        </h2>
      </div>

      {/* Comment Input */}
      {currentUserId ? (
        <div className="space-y-3">
          <Textarea
            placeholder="Write a comment..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={3}
          />
          <Button onClick={handleSubmit} disabled={loading || !text.trim()}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Posting...
              </>
            ) : (
              "Post Comment"
            )}
          </Button>
        </div>
      ) : (
        <div className="rounded-lg border border-dashed p-4 text-center text-sm text-muted-foreground">
          Please{" "}
          <a href="/login" className="text-primary underline">
            login
          </a>{" "}
          to leave a comment.
        </div>
      )}

      {/* Comments List */}
      <div className="space-y-4">
        {comments.length === 0 && (
          <p className="text-sm text-muted-foreground">
            No comments yet. Be the first!
          </p>
        )}

        {comments.map((comment) => (
          <div key={comment.id} className="flex gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={comment.profiles?.avatar_url ?? ""} />
              <AvatarFallback>
                {comment.profiles?.full_name?.[0] ?? "U"}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">
                    {comment.profiles?.full_name ?? "Student"}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(comment.created_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>

{(currentUserId === comment.author_id || isAdmin) && (
  <Button
    variant="ghost"
    size="icon"
    disabled={deletingId === comment.id}
    className="h-6 w-6 text-muted-foreground hover:text-destructive"
    onClick={() => handleDelete(comment.id)}
  >
    {deletingId === comment.id ? (
      <Loader2 className="h-3 w-3 animate-spin" />
    ) : (
      <Trash2 className="h-3 w-3" />
    )}
  </Button>
)}
              </div>

              <p className="text-sm leading-relaxed">{comment.content}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}