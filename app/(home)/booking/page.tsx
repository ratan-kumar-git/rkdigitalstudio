"use client";

import { useEffect, useState } from "react";
import { Spinner } from "@/components/ui/spinner";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
import { Badge } from "@/components/ui/badge";
import {
  CalendarDays,
  Clock4,
  BookCheckIcon,
  Phone,
  Mail,
  MapPin,
  User2,
  IndianRupee,
  Wallet,
  IndianRupeeIcon,
  PackageCheckIcon,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";
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

export default function BookingHistoryPage() {
  const router = useRouter();
  const { data, isPending } = authClient.useSession();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isPending) return;

    if (!data?.user) {
      toast.error("Please sign in to proceed with your booking.");
      router.replace("/signin");
      return;
    }

    if (data?.user.email === "admin@gmail.com") {
      router.replace("/admin/booking");
      return;
    }

    const loadBookings = async () => {
      try {
        const res = await fetch(`/api/bookings/${data.user.id}`);
        const result = await res.json();

        if (!res.ok) {
          toast.error(result.error || "Failed to fetch bookings");
          setLoading(false);
          return;
        }

        setBookings(result.data || []);
      } catch (error) {
        console.log("error", error);
        toast.error("Failed to load booking history.");
      } finally {
        setLoading(false);
      }
    };

    loadBookings();
  }, [data, isPending, router]);

  // Loader UI
  if (isPending || loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-64px)] text-gray-600">
        <Spinner className="h-8 w-8" />
        <span className="mt-2 text-lg">Loading your booking history...</span>
      </div>
    );
  }

  // Empty State
  if (bookings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-6">
        <BookCheckIcon className="w-16 h-16 text-amber-500 mb-4 opacity-80" />

        <p className="text-xl font-semibold text-gray-800">No Bookings Yet</p>

        <p className="text-sm text-gray-500 mt-1 max-w-sm">
          You haven’t booked any services so far. Your booking history will
          appear here once you submit a request.
        </p>

        <Link
          href="/services"
          className="mt-6 bg-linear-to-r from-[#f59e0b] to-[#d97706] text-white px-6 py-3 rounded-full text-sm font-semibold shadow-md hover:scale-[1.03] transition-transform"
        >
          Book a Service
        </Link>
      </div>
    );
  }

  // Main UI
  return (
    <section className="max-w-6xl mx-auto py-10 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-serif font-bold text-[#1e293b]">
          My <span className="text-[#d97706]">Bookings</span>
        </h1>

        <Link
          href="/services"
          className="bg-linear-to-r from-[#f59e0b] to-[#d97706] text-white px-5 py-2 rounded-full text-sm font-semibold shadow-md hover:scale-[1.03] transition-transform"
        >
          New Booking
        </Link>
      </div>

      <div className="space-y-8">
        {bookings.map((b) => (
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

                <p className="mt-1 text-gray-600 text-sm flex items-center gap-2">
                  <PackageCheckIcon className="w-4 h-4 text-amber-600" />
                  {b.packageName}
                </p>
                <p className="mt-1 text-gray-600 text-sm flex items-center gap-2">
                  <IndianRupeeIcon className="w-4 h-4 text-amber-600" />
                  {b.packagePrice}
                </p>

                <p className="mt-1 text-gray-600 text-sm flex items-center gap-2">
                  <CalendarDays className="w-4 h-4 text-amber-600" />
                  {new Date(b.bookingDate).toLocaleDateString("en-IN", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </p>
              </div>

              {/* Status */}
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

            {/* ⭐ Section 1.1 – Features */}
            <div className="mt-4 bg-amber-50/60 border border-amber-100 p-4 rounded-xl">
              <p className="text-sm font-semibold text-amber-700 mb-2">
                Features Included:
              </p>

              <ul className="space-y-1 text-gray-700 text-sm">
                {b.packageFeatures.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-600" />
                    {feature}
                  </li>
                ))}
              </ul>
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
                Booking request on{" "}
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
