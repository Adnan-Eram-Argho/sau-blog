"use client";

import { useEffect, useRef, useState } from "react";
import { Languages, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { translatePostToBangla } from "@/app/actions/ai";
import renderMathInElement from "katex/contrib/auto-render";
import "katex/dist/katex.min.css";

interface TranslatableBlogContentProps {
  content: string;
}

export function TranslatableBlogContent({
  content,
}: TranslatableBlogContentProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [translatedContent, setTranslatedContent] = useState("");
  const [showBangla, setShowBangla] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleTranslate() {
    setLoading(true);
    try {
      const translated = await translatePostToBangla(content);
      setTranslatedContent(translated);
      setShowBangla(true);
    } catch {
      alert("Failed to translate the blog. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const currentContent = showBangla && translatedContent ? translatedContent : content;

  useEffect(() => {
    if (!contentRef.current) return;

    renderMathInElement(contentRef.current, {
      delimiters: [
        { left: "$$", right: "$$", display: true },
        { left: "$", right: "$", display: false },
        { left: "\\(", right: "\\)", display: false },
        { left: "\\[", right: "\\]", display: true },
      ],
      throwOnError: false,
    });
  }, [currentContent]);

  return (
    <section className="mt-2">
      <div className="mb-4 flex items-center gap-2">
        {!translatedContent ? (
          <Button variant="outline" size="sm" onClick={handleTranslate} disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                Translating...
              </>
            ) : (
              <>
                <Languages className="mr-2 h-3 w-3" />
                Translate to Bangla
              </>
            )}
          </Button>
        ) : (
          <div className="flex items-center gap-2">
            <Button
              variant={showBangla ? "outline" : "default"}
              size="sm"
              onClick={() => setShowBangla(false)}
            >
              English
            </Button>
            <Button
              variant={showBangla ? "default" : "outline"}
              size="sm"
              onClick={() => setShowBangla(true)}
            >
              Bangla
            </Button>
            <Button variant="ghost" size="sm" onClick={handleTranslate} disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                  Refreshing...
                </>
              ) : (
                "Re-translate"
              )}
            </Button>
          </div>
        )}
      </div>

      <div
        ref={contentRef}
        className="prose prose-slate dark:prose-invert max-w-none"
        dangerouslySetInnerHTML={{ __html: currentContent }}
      />
    </section>
  );
}
