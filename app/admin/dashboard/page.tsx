"use client";

import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Spinner } from "@/components/ui/spinner";

import {
  Layers,
  BookCheck,
  CheckCircle2,
  ClockAlert,
  CheckSquare,
  XCircle,
  IndianRupee,
  MessageSquare,
} from "lucide-react";

/* -------------------------------------------------------------- */
/* TYPES                                                          */
/* -------------------------------------------------------------- */
interface IBooking {
  _id: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  packagePrice: string;
  amountPaid: number;
}

interface IService {
  _id: string;
}

interface IMessage {
  _id: string;
}

interface DashboardStats {
  totalServices: number;
  totalBookings: number;
  pending: number;
  confirmed: number;
  completed: number;
  cancelled: number;
  totalEarnings: number;
  amountPaid: number;
  dues: number;
  totalMessages: number;
}

export default function AdminDashboard() {
  const router = useRouter();
  const { data, isPending } = authClient.useSession();

  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState<DashboardStats>({
    totalServices: 0,
    totalBookings: 0,
    pending: 0,
    confirmed: 0,
    completed: 0,
    cancelled: 0,
    totalEarnings: 0,
    amountPaid: 0,
    dues: 0,
    totalMessages: 0,
  });

  /* -------------------------------------------------------------- */
  /* AUTH CHECK                                                     */
  /* -------------------------------------------------------------- */
  useEffect(() => {
    if (isPending) return;

    if (!data?.user) {
      toast.error("Please sign in.");
      router.replace("/signin");
      return;
    }
    if (data.user.email !== "admin@gmail.com") {
      toast.error("Access Denied.");
      router.replace("/");
      return;
    }
  }, [data, isPending, router]);

  /* -------------------------------------------------------------- */
  /* LOAD ALL DASHBOARD DATA                                        */
  /* -------------------------------------------------------------- */
  useEffect(() => {
    const loadData = async () => {
      try {
        const [servicesRes, bookingsRes, messagesRes] = await Promise.all([
          fetch("/api/service"),
          fetch("/api/bookings"),
          fetch("/api/message"),
        ]);

        const servicesJson = await servicesRes.json();
        const bookingsJson = await bookingsRes.json();
        const messagesJson = await messagesRes.json();

        const services: IService[] = servicesJson.data || [];
        const bookings: IBooking[] = bookingsJson.data || [];
        const messages: IMessage[] = messagesJson.data || [];

        const totalPrice = bookings.reduce(
          (sum, b) => sum + Number(b.packagePrice || 0),
          0
        );

        const totalPaid = bookings.reduce(
          (sum, b) => sum + Number(b.amountPaid || 0),
          0
        );

        setStats({
          totalServices: services.length,
          totalBookings: bookings.length,
          pending: bookings.filter((b) => b.status === "pending").length,
          confirmed: bookings.filter((b) => b.status === "confirmed").length,
          completed: bookings.filter((b) => b.status === "completed").length,
          cancelled: bookings.filter((b) => b.status === "cancelled").length,
          totalEarnings: totalPaid,
          amountPaid: totalPaid,
          dues: totalPrice - totalPaid,
          totalMessages: messages.length,
        });
      } catch (err) {
        console.error(err);
        toast.error("Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading || isPending) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh]">
        <Spinner className="h-8 w-8" />
        <p className="text-gray-600 mt-2 text-sm">Loading dashboard...</p>
      </div>
    );
  }

  /* -------------------------------------------------------------- */
  /* UI (Improved + Mobile Responsive + Quick Buttons)               */
  /* -------------------------------------------------------------- */
  return (
    <section className="max-w-7xl mx-auto px-4 py-8">
      {/* Header + Quick Navigation Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-amber-700">
          Admin Dashboard
        </h1>

        {/* Quick Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={() => router.push("/admin/booking")}
            className="px-4 py-2 bg-amber-600 text-white rounded-lg text-sm sm:text-base hover:bg-amber-700 transition"
          >
            Bookings
          </button>

          <button
            onClick={() => router.push("/admin/services")}
            className="px-4 py-2 bg-amber-600 text-white rounded-lg text-sm sm:text-base hover:bg-amber-700 transition"
          >
            Services
          </button>

          <button
            onClick={() => router.push("/admin/messages")}
            className="px-4 py-2 bg-amber-600 text-white rounded-lg text-sm sm:text-base hover:bg-amber-700 transition"
          >
            Messages
          </button>
        </div>
      </div>

      {/* Metric Grid */}
      <div
        className="
      grid 
      grid-cols-1 
      sm:grid-cols-2 
      lg:grid-cols-3 
      gap-5
      "
      >
        <Card
          title="Total Services"
          value={stats.totalServices}
          icon={<Layers className="text-amber-700 w-6 h-6 sm:w-7 sm:h-7" />}
        />

        <Card
          title="Total Bookings"
          value={stats.totalBookings}
          icon={<BookCheck className="text-amber-700 w-6 h-6 sm:w-7 sm:h-7" />}
        />

        <Card
          title="Pending Bookings"
          value={stats.pending}
          icon={
            <ClockAlert className="text-yellow-600 w-6 h-6 sm:w-7 sm:h-7" />
          }
        />

        <Card
          title="Confirmed Bookings"
          value={stats.confirmed}
          icon={
            <CheckSquare className="text-green-600 w-6 h-6 sm:w-7 sm:h-7" />
          }
        />

        <Card
          title="Completed Bookings"
          value={stats.completed}
          icon={
            <CheckCircle2 className="text-blue-600 w-6 h-6 sm:w-7 sm:h-7" />
          }
        />

        <Card
          title="Cancelled Bookings"
          value={stats.cancelled}
          icon={<XCircle className="text-red-600 w-6 h-6 sm:w-7 sm:h-7" />}
        />

        <Card
          title="Amount Received"
          value={`₹${stats.amountPaid}`}
          icon={
            <IndianRupee className="text-green-700 w-6 h-6 sm:w-7 sm:h-7" />
          }
        />

        <Card
          title="Pending Dues"
          value={`₹${stats.dues}`}
          icon={<IndianRupee className="text-red-600 w-6 h-6 sm:w-7 sm:h-7" />}
        />

        <Card
          title="Total Messages"
          value={stats.totalMessages}
          icon={
            <MessageSquare className="text-blue-600 w-6 h-6 sm:w-7 sm:h-7" />
          }
        />
      </div>
    </section>
  );
}

/* -------------------------------------------------------------- */
/* CARD COMPONENT (Better Mobile UI)                               */
/* -------------------------------------------------------------- */
interface CardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
}

function Card({ title, value, icon }: CardProps) {
  return (
    <div
      className="
      flex 
      items-center 
      gap-4 
      bg-white 
      border border-amber-200 
      p-4 sm:p-6 
      rounded-xl 
      shadow-sm 
      hover:shadow-md 
      transition
      "
    >
      {/* Icon */}
      <div className="p-3 bg-amber-100 rounded-xl">
        {icon}
      </div>

      {/* Text */}
      <div>
        <p className="text-gray-600 text-xs sm:text-sm">{title}</p>
        <h3 className="text-2xl sm:text-3xl font-bold text-amber-700">
          {value}
        </h3>
      </div>
    </div>
  );
}

