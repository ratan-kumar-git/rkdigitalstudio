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

  /* ------------------------------------------------------------ */
  /* AUTH REDIRECT                                                */
  /* ------------------------------------------------------------ */
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

  /* ------------------------------------------------------------ */
  /* LOADER                                                       */
  /* ------------------------------------------------------------ */
  if (isPending || !data?.user) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-64px)] text-gray-600">
        <Spinner className="h-8 w-8" />
        <p className="mt-2 text-lg">Checking session...</p>
      </div>
    );
  }

  const user = data.user;

  /* ------------------------------------------------------------ */
  /* UI                                                           */
  /* ------------------------------------------------------------ */
  return (
    <section className="max-w-6xl mx-auto py-14 px-6">
      {/* Header */}
      <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#1e293b] mb-10">
        Welcome, <span className="text-[#b45309]">{user.name}</span>
      </h1>

      {/* Dashboard Options */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

        {/* My Bookings */}
        <UserCard
          href="/booking"
          icon={<ClipboardList className="w-7 h-7 text-amber-600" />}
          title="My Bookings"
          desc="View all your booking requests, status updates, and payment details."
        />

        {/* Book New Service */}
        <UserCard
          href="/services"
          icon={<BookOpenCheck className="w-7 h-7 text-amber-600" />}
          title="Book New Service"
          desc="Browse photography & videography services and send booking requests."
        />

        {/* My Profile */}
        <UserCard
          href="/profile"
          icon={<User2 className="w-7 h-7 text-amber-600" />}
          title="My Profile"
          desc="Manage your profile, personal details, and contact information."
        />
      </div>

      {/* Footer Badge */}
      <div className="mt-10 text-center">
        <p className="text-gray-500 text-sm flex items-center justify-center gap-2">
          <BadgeCheck className="w-4 h-4 text-amber-600" />
          Logged in as <span className="font-semibold text-gray-700">{user.email}</span>
        </p>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------ */
/* USER CARD COMPONENT                                           */
/* ------------------------------------------------------------ */
interface UserCardProps {
  href: string;
  icon: React.ReactNode;
  title: string;
  desc: string;
}

function UserCard({ href, icon, title, desc }: UserCardProps) {
  return (
    <Link
      href={href}
      className="
        block 
        bg-white 
        border border-amber-100 
        rounded-2xl 
        shadow-md 
        p-6 
        hover:shadow-xl 
        hover:border-amber-300 
        transition-all 
        hover:-translate-y-1
      "
    >
      <div className="flex items-center gap-3 mb-3">
        {icon}
        <h2 className="text-xl font-semibold text-[#b45309]">{title}</h2>
      </div>
      <p className="text-sm text-gray-600 leading-relaxed">{desc}</p>
    </Link>
  );
}
