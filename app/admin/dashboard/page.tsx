"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Spinner } from "@/components/ui/spinner";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

import {
  ClipboardList,
  Users2,
  Settings,
  Layers,
  BarChart,
} from "lucide-react";

export default function AdminDashboardPage() {
  const router = useRouter();
  const { data, isPending } = authClient.useSession();

  // ─── Auth Check ─────────────────────────────────
  useEffect(() => {
    if (isPending) return;

    if (!data?.user) {
      router.replace("/signin");
    } else if (data.user.email !== "admin@gmail.com") {
      router.replace("/unauthorized");
    }
  }, [data, isPending, router]);

  // ─── Loading UI ────────────────────────────────
  if (isPending || !data?.user) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-64px)] w-full text-gray-600">
        <Spinner className="h-8 w-8" />
        <span className="mt-2 text-xl">Checking session...</span>
      </div>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-6 py-10">
      {/* Header */}
      <h1 className="text-4xl font-serif font-bold text-[#1e293b] mb-8">
        Welcome, <span className="text-[#b45309]">{data.user.name}</span>
      </h1>

      {/* Grid Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

        {/* Booking Requests */}
        <Link href="/admin/booking">
          <Card className="cursor-pointer hover:shadow-lg transition-all border-amber-200 hover:border-amber-400">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#b45309]">
                <ClipboardList className="w-5 h-5 text-amber-600" />
                Booking Requests
              </CardTitle>
            </CardHeader>
            <CardContent className="text-gray-600 text-sm">
              View, manage & approve customer booking requests.
            </CardContent>
          </Card>
        </Link>

        {/* Services Management */}
        <Link href="/admin/services">
          <Card className="cursor-pointer hover:shadow-lg transition-all border-amber-200 hover:border-amber-400">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#b45309]">
                <Layers className="w-5 h-5 text-amber-600" />
                Services Management
              </CardTitle>
            </CardHeader>
            <CardContent className="text-gray-600 text-sm">
              Add, update or remove service offerings.
            </CardContent>
          </Card>
        </Link>

        {/* Users */}
        <Link href="/admin/users">
          <Card className="cursor-pointer hover:shadow-lg transition-all border-amber-200 hover:border-amber-400">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#b45309]">
                <Users2 className="w-5 h-5 text-amber-600" />
                Users Management
              </CardTitle>
            </CardHeader>
            <CardContent className="text-gray-600 text-sm">
              View all user accounts & activity.
            </CardContent>
          </Card>
        </Link>

        {/* Analytics */}
        <Link href="/admin/analytics">
          <Card className="cursor-pointer hover:shadow-lg transition-all border-amber-200 hover:border-amber-400">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#b45309]">
                <BarChart className="w-5 h-5 text-amber-600" />
                Analytics
              </CardTitle>
            </CardHeader>
            <CardContent className="text-gray-600 text-sm">
              Track booking trends, revenue, and more.
            </CardContent>
          </Card>
        </Link>

        {/* Settings */}
        <Link href="/admin/settings">
          <Card className="cursor-pointer hover:shadow-lg transition-all border-amber-200 hover:border-amber-400">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#b45309]">
                <Settings className="w-5 h-5 text-amber-600" />
                Admin Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="text-gray-600 text-sm">
              Manage platform configuration & preferences.
            </CardContent>
          </Card>
        </Link>
      </div>
    </section>
  );
}
