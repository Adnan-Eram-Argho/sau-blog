import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { FileText, PlusCircle } from "lucide-react";

export default async function AdminPage() {
  const supabase = await createClient();

  const { count: postCount } = await supabase
    .from("posts")
    .select("*", { count: "exact", head: true });

  const { count: publishedCount } = await supabase
    .from("posts")
    .select("*", { count: "exact", head: true })
    .eq("published", true);

  return (
    <div className="space-y-8">
      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: "Total Posts", value: postCount ?? 0 },
          { label: "Published", value: publishedCount ?? 0 },
          { label: "Drafts", value: (postCount ?? 0) - (publishedCount ?? 0) },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border bg-card p-6 shadow-sm"
          >
            <p className="text-sm text-muted-foreground">{stat.label}</p>
            <p className="mt-1 text-3xl font-bold">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="flex gap-3">
        <Button asChild>
          <Link href="/admin/posts/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            New Post
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/admin/posts">
            <FileText className="mr-2 h-4 w-4" />
            All Posts
          </Link>
        </Button>
      </div>
    </div>
  );
}