"use client";

import Link from "next/link";
import { ShieldAlert, ArrowLeft } from "lucide-react";

export default function UnauthorizedPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-6">
      <ShieldAlert className="w-20 h-20 text-amber-500 mb-4 opacity-90" />

      <h1 className="text-3xl font-serif font-bold text-gray-800 mb-2">
        Unauthorized Access
      </h1>

      <p className="text-gray-600 max-w-md">
        You do not have permission to view this page.  
        Please sign in with the correct account or go back to the homepage.
      </p>

      <div className="flex gap-4 mt-6">
        <Link
          href="/"
          className="flex items-center gap-2 bg-white border border-amber-300 text-amber-700 px-5 py-2 rounded-full text-sm font-semibold shadow-sm hover:bg-amber-50 transition"
        >
          <ArrowLeft className="h-4 w-4" />
          Go Home
        </Link>

        <Link
          href="/signin"
          className="bg-linear-to-r from-[#f59e0b] to-[#d97706] text-white px-6 py-2 rounded-full text-sm font-semibold shadow-md hover:scale-[1.03] transition-transform"
        >
          Sign In
        </Link>
      </div>
    </div>
  );
}
