"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X, Search, LogIn, LayoutDashboard, Sparkles } from "lucide-react";
import { useApp } from "@/components/providers";
import { NammaMark } from "@/components/brand/NammaMark";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/services",      label: "Services" },
  { href: "/how-it-works",  label: "How it works" },
  { href: "/about",         label: "About" },
];

const MOBILE_USER_LINKS = [
  { href: "/dashboard",  label: "Dashboard" },
  { href: "/bookmarks",  label: "Bookmarks" },
  { href: "/history",    label: "History" },
  { href: "/profile",    label: "Profile" },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, language, setLanguage } = useApp();
  const pathname = usePathname();

  if (pathname === "/onboarding") return null;

  return (
    <header className="sticky top-0 z-40 w-full bg-white/85 backdrop-blur-xl border-b border-brand-100/80 shadow-[0_8px_30px_rgba(7,62,69,0.06)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 font-bold text-[#073E45] text-lg hover:text-brand-600 transition-colors">
            <NammaMark className="h-9 w-9 drop-shadow-sm" />
            <span className="hidden sm:inline tracking-tight">Namma<span className="text-brand-600">Path</span></span>
            <span className="sm:hidden font-extrabold text-brand-600">NammaPath</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
            {NAV_LINKS.map((link) => (
              <Link key={link.href} href={link.href}
                className={cn("text-sm font-medium px-3 py-2 rounded-lg transition-colors",
                  pathname === link.href ? "text-brand-600 bg-brand-50" : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                )}
              >{link.label}</Link>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-1.5">
            <Link href="/search" aria-label="Search"
              className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
              <Search className="w-5 h-5" />
            </Link>

            {/* Language switcher */}
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as "en" | "hi" | "kn")}
              className="hidden sm:block text-xs border border-gray-200 rounded-lg px-2 py-1.5 text-gray-600 bg-white hover:border-gray-300 focus:ring-2 focus:ring-brand-500 cursor-pointer"
              aria-label="Select language"
            >
              <option value="en">English</option>
              <option value="hi">हिन्दी</option>
              <option value="kn">ಕನ್ನಡ</option>
            </select>

            {/* Personalize button */}
            <Link href="/onboarding"
              className="hidden sm:flex items-center gap-1.5 text-xs font-medium text-brand-600 border border-brand-200 hover:bg-brand-50 px-3 py-1.5 rounded-lg transition-colors">
              <Sparkles className="w-3.5 h-3.5" />
              Personalize
            </Link>

            {user ? (
              <Link href="/dashboard"
                className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-white bg-brand-500 hover:bg-brand-600 px-4 py-2 rounded-lg transition-colors shadow-sm">
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </Link>
            ) : (
              <Link href="/auth/login"
                className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-white bg-brand-500 hover:bg-brand-600 px-4 py-2 rounded-lg transition-colors shadow-sm">
                <LogIn className="w-4 h-4" />
                Sign in
              </Link>
            )}

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-4 space-y-2 animate-slide-down">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href}
              className="block text-sm font-medium text-gray-700 hover:text-brand-600 py-2 px-2 rounded-lg hover:bg-gray-50"
              onClick={() => setMobileOpen(false)}
            >{link.label}</Link>
          ))}
          <Link href="/onboarding"
            className="flex items-center gap-2 text-sm font-medium text-brand-600 py-2 px-2 rounded-lg hover:bg-brand-50"
            onClick={() => setMobileOpen(false)}>
            <Sparkles className="w-4 h-4" /> Personalize
          </Link>
          <div className="pt-2 border-t border-gray-100 flex flex-col gap-2">
            {user ? (
              MOBILE_USER_LINKS.map((link) => (
                <Link key={link.href} href={link.href}
                  className="text-sm font-medium text-gray-700 py-2 px-2 rounded-lg hover:bg-gray-50"
                  onClick={() => setMobileOpen(false)}>
                  {link.label}
                </Link>
              ))
            ) : (
              <Link href="/auth/login" className="flex items-center justify-center gap-2 text-sm font-medium text-white bg-brand-500 rounded-lg px-4 py-2.5" onClick={() => setMobileOpen(false)}>
                <LogIn className="w-4 h-4" /> Sign in
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
