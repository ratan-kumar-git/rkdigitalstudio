'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import clsx from "clsx";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="text-[#d97706] text-2xl font-bold font-serif tracking-tight">
            RK
          </div>
          <span className="text-[#1e293b] font-serif text-lg font-semibold group-hover:text-[#d97706] transition-colors">
            Digital Studio
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={clsx(
                "relative text-sm font-medium tracking-wide transition-colors duration-300",
                pathname === link.href
                  ? "text-[#d97706]"
                  : "text-[#64748b] hover:text-[#1e293b]"
              )}
            >
              {link.label}
              <span
                className={clsx(
                  "absolute left-0 -bottom-1 h-0.5 w-0 bg-[#d97706] transition-all duration-300",
                  pathname === link.href && "w-full"
                )}
              ></span>
            </Link>
          ))}
          <Button
            className="rounded-full bg-linear-to-r from-[#f59e0b] to-[#d97706] hover:from-[#fbbf24] hover:to-[#f59e0b] text-white font-semibold px-5 py-2 shadow-md transition-transform hover:scale-[1.05]"
          >
            <Link href="/signin">Sign in</Link>
          </Button>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-[#1e293b] focus:outline-none"
        >
          {open ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {open && (
        <div className="md:hidden bg-white/95 border-t border-gray-200 backdrop-blur-md shadow-sm">
          <div className="flex flex-col px-6 py-4 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={clsx(
                  "text-base font-medium px-3 py-2 rounded-md transition-all duration-200",
                  pathname === link.href
                    ? "text-[#d97706] bg-[#fef3c7]"
                    : "text-[#334155] hover:bg-[#f8fafc] hover:text-[#1e293b]"
                )}
              >
                {link.label}
              </Link>
            ))}

            <Button
              className="rounded-full bg-linear-to-r from-[#f59e0b] to-[#d97706] text-white font-semibold mt-3 shadow-md hover:from-[#fbbf24] hover:to-[#f59e0b]"
            >
              <Link href="/signin">Signin</Link>
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
}
