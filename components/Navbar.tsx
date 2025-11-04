"use client";
import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import Image from "next/image";

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Services", href: "/services" },
    { name: "Gallery", href: "/gallery" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <nav className="w-full bg-white/50 backdrop-blur-md border-b shadow-sm fixed top-0 left-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image 
              src="/rksLogo.avif"
              alt="Logo"
              width={140}
              height={100}
              style={{ width: "156px", height: "48px" }}
            />
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`${
                pathname === link.href
                  ? "text-blue-600 font-semibold"
                  : "text-gray-700"
              } hover:text-blue-500 transition hover:scale-110`}
              >
                {link.name}
              </Link>
            ))}
            <Button asChild className="ml-2">
              <Link href="/">Book Now</Link>
            </Button>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden text-gray-700 hover:text-blue-500" 
            aria-label={isOpen ? "Close menu" : "Open menu"}
            onClick={toggleMenu}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {isOpen && (
        <div className="md:hidden border-t border-gray-400">
          <div className="flex flex-col items-center py-4 space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`${
                pathname === link.href
                  ? "text-blue-600 font-semibold"
                  : "text-gray-900"
              } hover:text-blue-500 transition hover:scale-105`}
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <Button asChild className="w-3/4 mt-2">
              <Link href="/contact" onClick={() => setIsOpen(false)}>Book Now</Link>
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
}
