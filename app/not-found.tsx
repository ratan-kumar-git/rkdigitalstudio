"use client";

import Link from "next/link";
import { SearchX, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[75vh] px-6 text-center">
      <SearchX className="w-20 h-20 text-amber-500 mb-4 opacity-90" />

      <h1 className="text-4xl font-serif font-bold text-gray-800 mb-2">
        Page Not Found
      </h1>

      <p className="text-gray-600 max-w-md mb-6">
        The page you’re looking for doesn’t exist or may have been moved.
      </p>

      <Link
        href="/"
        className="flex items-center gap-2 bg-linear-to-r from-[#f59e0b] to-[#d97706]
                   text-white px-6 py-3 rounded-full text-sm font-semibold 
                   shadow-md hover:scale-[1.05] transition-transform"
      >
        <Home className="w-4 h-4" />
        Return Home
      </Link>
    </div>
  );
}
