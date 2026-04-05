"use client";

import Link from "next/link";
import { BookOpen, GraduationCap, LogOut, LayoutDashboard, ShieldCheck } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { siteConfig, SHOW_SAU_GATE } from "@/config";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SearchBar } from "@/components/search/search-bar";

export function Navbar() {
  const { user, role, signOut } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto flex h-14 items-center justify-between px-4">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <BookOpen className="h-5 w-5 text-primary" />
          <span>{siteConfig.name}</span>
        </Link>

        {/* Right side */}
        <nav className="flex items-center gap-1">

          {/* Search */}
          <SearchBar />

          {/* Blog */}
          <Button variant="ghost" size="sm" asChild>
            <Link href="/blog">Blog</Link>
          </Button>

          {/* Question Bank */}
          {SHOW_SAU_GATE && (
            <Button variant="ghost" size="sm" asChild>
              <Link
                href="https://question-bank-app-five.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1"
              >
                <GraduationCap className="h-4 w-4" />
                Question Bank
              </Link>
            </Button>
          )}

          {/* Admin links — only visible to admin */}
          {role === "admin" && (
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin" className="flex items-center gap-1">
                <ShieldCheck className="h-4 w-4" />
                Admin
              </Link>
            </Button>
          )}

          {/* Logged in */}
          {user ? (
            <div className="flex items-center gap-1 ml-1">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/dashboard" className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={user.user_metadata?.avatar_url} />
                    <AvatarFallback className="text-xs">
                      {user.email?.[0]?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden sm:inline text-sm">Profile</span>
                </Link>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={signOut}
                title="Logout"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <Button variant="ghost" size="sm" asChild>
              <Link href="/login">Login</Link>
            </Button>
          )}

          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}