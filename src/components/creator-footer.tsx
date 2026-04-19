"use client";

import { useState } from "react";

export function CreatorFooter() {
  const [hovered, setHovered] = useState(false);

  return (
    <footer className="relative mt-16 border-t border-border/40">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col items-center justify-center gap-3">
          {/* Signature line */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="inline-block h-px w-8 bg-gradient-to-r from-transparent to-muted-foreground/40" />
            <span>Crafted with care by</span>
            <span className="inline-block h-px w-8 bg-gradient-to-l from-transparent to-muted-foreground/40" />
          </div>

          {/* Creator name */}
          <a
            href="https://adnan-eram-argho.github.io/portfolio/"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          >
            <span
              className="relative z-10 text-lg font-semibold tracking-tight transition-colors duration-300 group-hover:text-primary"
              style={{
                background: hovered
                  ? "linear-gradient(135deg, #6366f1, #8b5cf6, #a855f7)"
                  : "none",
                WebkitBackgroundClip: hovered ? "text" : "unset",
                WebkitTextFillColor: hovered ? "transparent" : "unset",
              }}
            >
              Adnan Eram Argho
            </span>

            {/* Animated underline */}
            <span
              className="absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 transition-all duration-500 ease-out"
              style={{ width: hovered ? "100%" : "0%" }}
            />

            {/* Subtle glow on hover */}
            <span
              className="absolute inset-0 -z-10 rounded-lg opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-20"
              style={{
                background:
                  "radial-gradient(circle, rgba(139,92,246,0.6) 0%, transparent 70%)",
              }}
            />
          </a>

          {/* Year & copyright */}
          <p className="text-xs text-muted-foreground/60">
            © {new Date().getFullYear()} SAU EconHub
          </p>
        </div>
      </div>
    </footer>
  );
}
