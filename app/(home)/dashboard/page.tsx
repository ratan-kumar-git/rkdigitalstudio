"use client";

import { Spinner } from "@/components/ui/spinner";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import toast from "react-hot-toast";

import Link from "next/link";
import {
  BookOpenCheck,
  BadgeCheck,
  ClipboardList,
  User2,
} from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const { data, isPending } = authClient.useSession();

  // ─── Auth Redirect ──────────────────────────
  useEffect(() => {
    if (isPending) return;

    if (!data?.user) {
      toast.error("Your session has expired. Please sign in again.");
      router.replace("/signin");
      return;
    }

    if (data.user.email === "admin@gmail.com") {
      router.replace("/admin/dashboard");
      return;
    }
  }, [data?.user, isPending, router]);

  // ─── Loader ─────────────────────────────────
  if (isPending || !data?.user) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-64px)] w-full text-gray-600">
        <Spinner className="h-8 w-8" />
        <span className="mt-2 text-xl">Checking session...</span>
      </div>
    );
  }

  const user = data.user;

  // ─── UI ─────────────────────────────────────
  return (
    <section className="max-w-6xl mx-auto py-14 px-6">
      {/* Header */}
      <h1 className="text-4xl font-serif font-bold text-[#1e293b] mb-8">
        Welcome, <span className="text-[#b45309]">{user.name}</span>
      </h1>

      {/* Grid Options */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

        {/* My Bookings */}
        <Link
          href="/booking"
          className="block bg-white border border-amber-100 rounded-2xl shadow-md p-6 hover:shadow-lg transition-all hover:border-amber-300"
        >
          <div className="flex items-center gap-3 mb-3">
            <ClipboardList className="w-6 h-6 text-amber-600" />
            <h2 className="text-lg font-semibold text-[#b45309]">
              My Bookings
            </h2>
          </div>
          <p className="text-sm text-gray-600">
            View booking requests, status updates and payment history.
          </p>
        </Link>

        {/* Book New Service */}
        <Link
          href="/services"
          className="block bg-white border border-amber-100 rounded-2xl shadow-md p-6 hover:shadow-lg transition-all hover:border-amber-300"
        >
          <div className="flex items-center gap-3 mb-3">
            <BookOpenCheck className="w-6 h-6 text-amber-600" />
            <h2 className="text-lg font-semibold text-[#b45309]">
              Book New Service
            </h2>
          </div>
          <p className="text-sm text-gray-600">
            Browse available services and send your booking request.
          </p>
        </Link>

        {/* Profile */}
        <Link
          href="/profile"
          className="block bg-white border border-amber-100 rounded-2xl shadow-md p-6 hover:shadow-lg transition-all hover:border-amber-300"
        >
          <div className="flex items-center gap-3 mb-3">
            <User2 className="w-6 h-6 text-amber-600" />
            <h2 className="text-lg font-semibold text-[#b45309]">
              My Profile
            </h2>
          </div>
          <p className="text-sm text-gray-600">
            Update your account details and contact information.
          </p>
        </Link>

      </div>

      {/* Footer small badge */}
      <div className="mt-10 text-center">
        <p className="text-gray-500 text-sm flex items-center justify-center gap-2">
          <BadgeCheck className="w-4 h-4 text-amber-600" />
          Logged in as <strong className="text-gray-700">{user.email}</strong>
        </p>
      </div>
    </section>
  );
}
