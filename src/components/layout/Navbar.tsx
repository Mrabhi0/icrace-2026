"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, Calendar, MapPin, LogIn, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/tracks", label: "Tracks" },
  { href: "/important-dates", label: "Important Dates" },
  { href: "/registration", label: "Registration" },
  { href: "/call-for-papers", label: "Call for Papers" },
  { href: "/programme", label: "Programme" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <div className="bg-navy-900 text-white text-xs">
        <div className="container-max flex items-center justify-between px-4 py-2 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-teal-400" />
              March 5–7, 2026
            </span>
            <span className="hidden items-center gap-1.5 sm:flex">
              <MapPin className="h-3.5 w-3.5 text-teal-400" />
              National Institute of Technology, Rourkela
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-teal-400 font-medium">ICRACE 2026</span>
            <span className="hidden sm:inline text-gray-400">|</span>
            <span className="hidden sm:inline text-gray-300">Prototype Demo</span>
          </div>
        </div>
      </div>

      <nav className="sticky top-0 z-40 border-b border-gray-100 bg-white shadow-sm">
        <div className="container-max flex items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-navy-800">
              <span className="text-lg font-bold text-white">IC</span>
            </div>
            <div>
              <p className="text-sm font-bold leading-tight text-navy-800">ICRACE 2026</p>
              <p className="text-xs text-gray-500 leading-tight">Research & Advanced Computing</p>
            </div>
          </Link>

          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition hover:bg-navy-50 hover:text-navy-800"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <Link href="/login" className="hidden sm:flex items-center gap-2 btn-outline text-sm">
              <LogIn className="h-4 w-4" />
              Login
            </Link>
            <Link href="/register" className="hidden sm:flex btn-secondary text-sm">
              Register
            </Link>
            <button
              className="lg:hidden rounded-lg p-2 text-gray-600 hover:bg-gray-100"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="lg:hidden border-t border-gray-100 bg-white animate-slide-up">
            <div className="px-4 py-3 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-navy-50 hover:text-navy-800"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="flex gap-2 pt-2">
                <Link href="/login" className="flex-1 btn-outline text-sm" onClick={() => setMobileOpen(false)}>
                  Login
                </Link>
                <Link href="/register" className="flex-1 btn-secondary text-sm" onClick={() => setMobileOpen(false)}>
                  Register
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
