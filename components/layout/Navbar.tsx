"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import clsx from "clsx";
import Logo from "./Logo";
import { authClient } from "@/lib/auth-client";
import UserMenu from "./UserMenu";

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { data } = authClient.useSession();
  const user = data?.user;

  const isAdmin = user?.email === "admin@gmail.com";
  const isAuthenticated = !!user;

  const navLinks = !isAuthenticated
    ? [
        { href: "/", label: "Home" },
        { href: "/services", label: "Services" },
        { href: "/about", label: "About" },
        { href: "/contact", label: "Contact" },
      ]
    : [
        { href: "/", label: "Home" },
        { href: isAdmin ? "/admin/dashboard" : "/dashboard", label: "Dashboard", },
        { href: isAdmin ? "/admin/add-service" : "/services", label: "Services", },
        ...(!isAdmin
          ? [
              { href: "/about", label: "About" },
              { href: "/contact", label: "Contact" },
            ]
          : []),
      ];

  // Close menu on route change or link click
  const handleLinkClick = () => setOpen(false);

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-2">
        {/* Mobile Menu Toggle */}
        <button
          aria-label="Toggle menu"
          onClick={() => setOpen(!open)}
          className="md:hidden text-[#1e293b] focus:outline-none"
        >
          {open ? <X size={26} /> : <Menu size={26} />}
        </button>

        {/* Logo */}
        <Logo />

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
          {user ? (
            <UserMenu />
          ) : (
            <Button className="rounded-full bg-linear-to-r from-[#f59e0b] to-[#d97706] hover:from-[#fbbf24] hover:to-[#f59e0b] text-white font-semibold px-5 py-2 shadow-md transition-transform hover:scale-[1.05]">
              <Link href="/signin">Sign in</Link>
            </Button>
          )}
        </div>

        {user ? (
          <div className="md:hidden">
            <UserMenu />
          </div>
        ) : (
          <div className="md:hidden">
            <Button className="rounded-full bg-linear-to-r from-[#f59e0b] to-[#d97706] hover:from-[#fbbf24] hover:to-[#f59e0b] text-white font-semibold px-4 py-2 shadow-md transition-transform hover:scale-[1.05]">
              <Link href="/signin">Sign in</Link>
            </Button>
          </div>
        )}
      </div>

      {/* Mobile Dropdown */}
      {open && (
        <div className="md:hidden bg-white/95 border-t border-gray-200 backdrop-blur-md shadow-sm">
          <div className="flex flex-col px-6 py-4 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={handleLinkClick}
                className={clsx(
                  "text-base font-medium px-3 py-2 rounded-md transition-all duration-200",
                  pathname === link.href
                    ? "text-[#d97706] bg-[#fef3c7]"
                    : "text-[#334155] hover:bg-[#fef3c7] hover:text-[#1e293b]"
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
