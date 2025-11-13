"use client";

import { useEffect, useState } from "react";
import { Spinner } from "@/components/ui/spinner";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
import { Badge } from "@/components/ui/badge";
import {
  CalendarDays,
  Clock4,
  Phone,
  Mail,
  MapPin,
  User2,
  IndianRupee,
  Wallet,
  PackageCheckIcon,
  BookCheck,
  IndianRupeeIcon,
  ArrowDownWideNarrow,
  ArrowUpWideNarrow,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";

interface Booking {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;

  serviceTitle: string;
  packageName: string;
  packagePrice: string;
  packageFeatures: string[];
  bookingDate: string;

  paymentMode: "upi" | "cash";
  amountPaid: number;
  paymentStatus: "pending" | "partial" | "paid" | "refunded" | "failed";

  status: "pending" | "confirmed" | "completed" | "cancelled";
  createdAt: string;
}

export default function AdminBookingPage() {
  const router = useRouter();
  const { data, isPending } = authClient.useSession();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState<"new" | "old">("new");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // ─── Auth Check for Admin ─────────────────────────
  useEffect(() => {
    if (isPending) return;

    const user = data?.user;
    if (!user) {
      toast.error("Please sign in.");
      router.replace("/signin");
      return;
    }

    if (user.email !== "admin@gmail.com") {
      toast.error("Access denied.");
      router.replace("/");
      return;
    }
  }, [data, isPending, router]);

  // ─── Fetch All Bookings ───────────────────────────
  useEffect(() => {
    if (!data?.user?.email) return;

    const loadBookings = async () => {
      try {
        const res = await fetch(`/api/bookings`);
        const result = await res.json();

        if (!res.ok) {
          toast.error(result.error || "Failed to fetch bookings");
          return;
        }

        setBookings(result.data || []);
      } catch (err) {
        console.error(err);
        toast.error("Unable to load bookings");
      } finally {
        setLoading(false);
      }
    };

    loadBookings();
  }, [data]);

  // ─── Loading UI ───────────────────────────────────
  if (isPending || loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-64px)] text-gray-600">
        <Spinner className="h-8 w-8" />
        <span className="mt-2 text-lg">Loading booking requests...</span>
      </div>
    );
  }

  // ─── Empty UI ─────────────────────────────────────
  if (bookings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-6">
        <BookCheck className="w-16 h-16 text-amber-500 mb-4 opacity-80" />
        <p className="text-xl font-semibold text-gray-800">
          No Booking Requests
        </p>
        <p className="text-sm text-gray-500 mt-1 max-w-sm">
          All booking requests will appear here once users start booking
          services.
        </p>
      </div>
    );
  }

  // ─── Sorting & Filtering ──────────────────────────
  const sortedBookings = [...bookings]
    .filter((b) => (statusFilter === "all" ? true : b.status === statusFilter))
    .sort((a, b) =>
      sort === "new"
        ? new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        : new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );

  // ─── Main UI ──────────────────────────────────────
  return (
    <section className="max-w-7xl mx-auto py-10 px-4">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-8">
        <h1 className="text-3xl font-serif font-bold text-[#1e293b]">
          All Booking Requests
        </h1>

        <div className="flex items-center gap-3">
          {/* Status Filter */}
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger
              className="w-[150px] rounded-lg border-amber-200 bg-amber-50/40 
                 text-[#b45309] shadow-sm hover:bg-amber-50 transition"
            >
              <SelectValue placeholder="Status" />
            </SelectTrigger>

            <SelectContent className="border border-amber-200 bg-white shadow-lg rounded-lg">
              <SelectItem
                value="all"
                className="cursor-pointer text-gray-700 focus:bg-amber-100 focus:text-amber-800"
              >
                All Status
              </SelectItem>
              <SelectItem
                value="pending"
                className="cursor-pointer text-yellow-700 focus:bg-yellow-100 focus:text-yellow-800"
              >
                Pending
              </SelectItem>
              <SelectItem
                value="confirmed"
                className="cursor-pointer text-green-700 focus:bg-green-100 focus:text-green-800"
              >
                Confirmed
              </SelectItem>
              <SelectItem
                value="completed"
                className="cursor-pointer text-blue-700 focus:bg-blue-100 focus:text-blue-800"
              >
                Completed
              </SelectItem>
              <SelectItem
                value="cancelled"
                className="cursor-pointer text-red-700 focus:bg-red-100 focus:text-red-800"
              >
                Cancelled
              </SelectItem>
            </SelectContent>
          </Select>

          {/* Sort New/Old */}
          <Select value={sort} onValueChange={(v) => setSort(v as never)}>
            <SelectTrigger
              className="w-40 rounded-lg border-amber-200 bg-amber-50/40 
                 text-[#b45309] shadow-sm hover:bg-amber-50 transition"
            >
              <SelectValue placeholder="Sort" />
            </SelectTrigger>

            <SelectContent className="border border-amber-200 bg-white shadow-lg rounded-lg">
              <SelectItem
                value="new"
                className="cursor-pointer text-gray-700 focus:bg-amber-100 focus:text-amber-800"
              >
                <div className="flex items-center gap-2">
                  <ArrowDownWideNarrow className="h-4 w-4 text-amber-600" />
                  Newest First
                </div>
              </SelectItem>

              <SelectItem
                value="old"
                className="cursor-pointer text-gray-700 focus:bg-amber-100 focus:text-amber-800"
              >
                <div className="flex items-center gap-2">
                  <ArrowUpWideNarrow className="h-4 w-4 text-amber-600" />
                  Oldest First
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-8">
        {sortedBookings.map((b) => (
          <div
            key={b._id}
            className="bg-white border border-amber-100 rounded-2xl shadow-md hover:shadow-lg transition-all p-6"
          >
            {/* Section 1 — Service */}
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-semibold text-[#b45309]">
                  {b.serviceTitle}
                </h2>

                <p className="text-gray-600 text-sm flex items-center gap-2 mt-1">
                  <PackageCheckIcon className="w-4 h-4 text-amber-600" />
                  {b.packageName}
                </p>
                <p className="text-gray-600 text-sm flex items-center gap-2 mt-1">
                  <IndianRupeeIcon className="w-4 h-4 text-amber-600" />
                  {b.packagePrice}
                </p>

                <p className="text-gray-600 text-sm flex items-center gap-2 mt-1">
                  <CalendarDays className="w-4 h-4 text-amber-600" />
                  {new Date(b.bookingDate).toLocaleDateString("en-IN", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </p>
              </div>

              <div className="text-right">
                <Badge
                  className={`px-3 py-1 text-sm rounded-full ${
                    b.status === "confirmed"
                      ? "bg-green-100 text-green-700 border border-green-300"
                      : b.status === "cancelled"
                      ? "bg-red-100 text-red-700 border border-red-300"
                      : b.status === "completed"
                      ? "bg-blue-100 text-blue-700 border border-blue-300"
                      : "bg-yellow-100 text-yellow-700 border border-yellow-300"
                  }`}
                >
                  {b.status.toUpperCase()}
                </Badge>
              </div>
            </div>

            {/* Section 2 — Customer Info */}
            <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
              <div>
                <p className="flex items-center gap-2 text-gray-700">
                  <User2 className="w-4 h-4 text-gray-700" />
                  {b.fullName}
                </p>
                <p className="flex items-center gap-2 text-gray-700 mt-1">
                  <Mail className="w-4 h-4 text-gray-700" />
                  {b.email}
                </p>
              </div>

              <div>
                <p className="flex items-center gap-2 text-gray-700">
                  <Phone className="w-4 h-4 text-gray-700" />
                  {b.phone}
                </p>
                <p className="flex items-center gap-2 text-gray-700 mt-1">
                  <MapPin className="w-4 h-4 text-gray-700" />
                  {b.address}
                </p>
              </div>
            </div>

            {/* Section 3 – Payment Info */}
            <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                <p className="text-xs text-gray-500">Payment Mode</p>
                <p className="font-semibold text-gray-800 capitalize flex items-center gap-1">
                  <Wallet className="w-4 h-4 text-gray-700" />
                  {b.paymentMode}
                </p>
              </div>

              <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                <p className="text-xs text-gray-500">Amount Paid</p>
                <p className="font-semibold text-gray-800 flex items-center gap-1">
                  <IndianRupee className="w-4 h-4 text-gray-700" />
                  {b.amountPaid}
                </p>
              </div>

              <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                <p className="text-xs text-gray-500">Payment Status</p>
                <p className="font-semibold text-gray-800 capitalize">
                  {b.paymentStatus}
                </p>
              </div>

              <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                <p className="text-xs text-gray-500">Booking Status</p>
                <p className="font-semibold text-gray-800 capitalize">
                  {b.status}
                </p>
              </div>
            </div>

            {/* Footer Timestamp */}
            <div className="mt-5 pt-4 border-t border-gray-200 flex items-center justify-between text-sm text-gray-500">
              <span className="flex items-center gap-2">
                <Clock4 className="w-4 h-4 text-gray-500" />
                Requested on{" "}
                {new Date(b.createdAt).toLocaleString("en-IN", {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
