"use client";

import { Loader2 } from "lucide-react";

interface PageLoaderProps {
  message?: string;
  fullScreen?: boolean;
}

export function PageLoader({
  message = "Loading...",
  fullScreen = false,
}: PageLoaderProps) {
  return (
    <div
      className={`flex items-center justify-center ${
        fullScreen ? "min-h-[calc(100vh-3.5rem)]" : "min-h-[40vh]"
      }`}
    >
      <div className="flex items-center gap-2 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin" />
        <span className="text-sm">{message}</span>
      </div>
    </div>
  );
}
