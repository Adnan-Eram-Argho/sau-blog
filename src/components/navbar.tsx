"use client";

import Link from "next/link";
import {
  BookOpen,
  GraduationCap,
  LogOut,
  ShieldCheck,
  Menu,
  X,
  LayoutDashboard,
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { siteConfig, SHOW_SAU_GATE } from "@/config";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SearchBar } from "@/components/search/search-bar";
import { useState } from "react";

export function Navbar() {
  const { user, role, signOut } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto flex h-14 items-center justify-between px-4">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <BookOpen className="h-5 w-5 text-primary" />
          <span className="text-sm sm:text-base">{siteConfig.name}</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          <SearchBar />

          <Button variant="ghost" size="sm" asChild>
            <Link href="/blog">Blog</Link>
          </Button>

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

          {role === "admin" && (
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin" className="flex items-center gap-1">
                <ShieldCheck className="h-4 w-4" />
                Admin
              </Link>
            </Button>
          )}

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
              <Button variant="ghost" size="icon" onClick={signOut} title="Logout">
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

        {/* Mobile Right Side */}
        <div className="flex md:hidden items-center gap-1">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden border-t bg-background px-4 py-4 space-y-2">

          {/* Mobile Search */}
          <div className="pb-2">
            <SearchBar />
          </div>

          <Link
            href="/blog"
            onClick={closeMenu}
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-muted"
          >
            Blog
          </Link>

          {SHOW_SAU_GATE && (
            <Link
              href="https://question-bank-app-five.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              onClick={closeMenu}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-muted"
            >
              <GraduationCap className="h-4 w-4" />
              Question Bank
            </Link>
          )}

          {role === "admin" && (
            <Link
              href="/admin"
              onClick={closeMenu}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-muted text-primary"
            >
              <ShieldCheck className="h-4 w-4" />
              Admin Dashboard
            </Link>
          )}

          {user ? (
            <>
              <Link
                href="/dashboard"
                onClick={closeMenu}
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-muted"
              >
                <Avatar className="h-6 w-6">
                  <AvatarImage src={user.user_metadata?.avatar_url} />
                  <AvatarFallback className="text-xs">
                    {user.email?.[0]?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                My Profile
              </Link>
              <button
                onClick={() => { signOut(); closeMenu(); }}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-muted text-destructive"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </>
          ) : (
            <Link
              href="/login"
              onClick={closeMenu}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-muted"
            >
              Login
            </Link>
          )}
        </div>
      )}
    </header>
  );
}