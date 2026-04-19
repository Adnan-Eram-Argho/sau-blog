import { siteConfig } from "@/config";

export function absoluteUrl(path: string): string {
  const base = siteConfig.url.replace(/\/+$/, "");
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${base}${cleanPath}`;
}

