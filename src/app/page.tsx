// src/app/page.tsx
import Link from "next/link";
import { ArrowRight, BookOpenText, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SHOW_SAU_GATE, siteConfig } from "@/config";

export default function HomePage() {
  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] flex-col">
      {/* Hero */}
      <section className="flex flex-1 flex-col items-center justify-center gap-6 px-4 py-24 text-center">
        <div className="inline-flex items-center rounded-full border px-3 py-1 text-xs text-muted-foreground">
          Sher-e-Bangla Agricultural University · Agricultural Economics
        </div>

        <h1 className="max-w-3xl text-4xl font-bold tracking-tight sm:text-6xl">
          Knowledge Hub for{" "}
          <span className="text-primary">AEC Students</span>
        </h1>

        <p className="max-w-xl text-lg text-muted-foreground">
          {siteConfig.description} Read articles, access past question papers,
          and stay ahead in your coursework.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button size="lg" asChild>
            <Link href="/blog">
              <BookOpenText className="mr-2 h-4 w-4" />
              Read the Blog
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>

          {SHOW_SAU_GATE && (
            <Button size="lg" variant="outline" asChild>
              <Link href="https://question-bank-app-five.vercel.app/">
                <GraduationCap className="mr-2 h-4 w-4" />
                Question Bank
              </Link>
            </Button>
          )}
        </div>
      </section>

      {/* Feature Cards */}
      <section className="container mx-auto grid gap-4 px-4 pb-16 sm:grid-cols-3">
        {[
          {
            icon: "📝",
            title: "Economics Blogs",
            desc: "Insightful articles on agri-economics, policy, and development.",
          },
          {
            icon: "📚",
            title: "Past Questions",
            desc: "Semester-wise question papers organized by course and type.",
          },
          {
            icon: "🤖",
            title: "AI Summaries",
            desc: "Gemini-powered blog summaries so you can skim fast.",
          },
        ].map((card) => (
          <div
            key={card.title}
            className="rounded-xl border bg-card p-6 text-card-foreground shadow-sm"
          >
            <div className="mb-3 text-3xl">{card.icon}</div>
            <h3 className="mb-1 font-semibold">{card.title}</h3>
            <p className="text-sm text-muted-foreground">{card.desc}</p>
          </div>
        ))}
      </section>
    </div>
  );
}