"use client";

import { useState } from "react";
import { generateSummary } from "@/app/actions/ai";
import { Button } from "@/components/ui/button";
import { Sparkles, Loader2, ChevronDown, ChevronUp } from "lucide-react";

export function AISummary({ content }: { content: string }) {
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  async function handleGenerate() {
    setLoading(true);
    try {
      const result = await generateSummary(content);
      setSummary(result);
      setOpen(true);
    } catch {
      alert("Failed to generate summary. Check your Gemini API key.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mb-8 rounded-xl border bg-muted/40 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium">AI Summary</span>
        </div>

        {summary ? (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setOpen(!open)}
          >
            {open ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        ) : (
          <Button
            variant="outline"
            size="sm"
            onClick={handleGenerate}
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-3 w-3" />
                Generate
              </>
            )}
          </Button>
        )}
      </div>

      {open && summary && (
        <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
          {summary}
        </p>
      )}
    </div>
  );
}