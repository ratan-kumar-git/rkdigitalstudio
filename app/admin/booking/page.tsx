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
  CheckCircle2,
} from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
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

  const [paymentAmount, setPaymentAmount] = useState("");
  const [sort, setSort] = useState<"new" | "old">("new");
  const [statusFilter, setStatusFilter] = useState("all");

  // Status change modal
  const [actionBookingId, setActionBookingId] = useState<string | null>(null);
  const [actionType, setActionType] = useState<
    "pending" | "confirmed" | "completed" | "cancelled" | null
  >(null);
  const [isActionModal, setIsActionModal] = useState(false);
  const [isActionLoading, setIsActionLoading] = useState(false);

  // Payment confirmation modal
  const [isPaymentModal, setIsPaymentModal] = useState(false);
  const [paymentBookingId, setPaymentBookingId] = useState<string | null>(null);

  /* -------------------------------------------------------------------------- */
  /* AUTH CHECK                                                                 */
  /* -------------------------------------------------------------------------- */
  useEffect(() => {
    if (isPending) return;

    if (!data?.user) {
      toast.error("Please sign in.");
      router.replace("/signin");
      return;
    }

    if (data.user.email !== "admin@gmail.com") {
      toast.error("Access denied.");
      router.replace("/");
      return;
    }
  }, [data, isPending, router]);

  /* -------------------------------------------------------------------------- */
  /* LOAD BOOKINGS                                                              */
  /* -------------------------------------------------------------------------- */
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

  /* -------------------------------------------------------------------------- */
  /* OPEN STATUS MODAL                                                          */
  /* -------------------------------------------------------------------------- */
  const openActionModal = (
    id: string,
    type: "pending" | "confirmed" | "completed" | "cancelled"
  ) => {
    setActionBookingId(id);
    setActionType(type);
    setIsActionModal(true);
  };

  /* -------------------------------------------------------------------------- */
  /* UPDATE STATUS                                                              */
  /* -------------------------------------------------------------------------- */
  const handleUpdateStatus = async () => {
    if (!actionBookingId || !actionType) return;

    setIsActionLoading(true);

    try {
      const res = await fetch(`/api/bookings/${actionBookingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: actionType }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setBookings((prev) =>
        prev.map((item) =>
          item._id === actionBookingId ? { ...item, status: actionType } : item
        )
      );

      toast.success(`Status updated to ${actionType}`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update status");
    } finally {
      setIsActionModal(false);
      setIsActionLoading(false);
    }
  };

  /* -------------------------------------------------------------------------- */
  /* PAYMENT UPDATE (FIXED)                                                     */
  /* -------------------------------------------------------------------------- */
  const handlePayment = async (id: string) => {
    if (!paymentAmount || Number(paymentAmount) <= 0) {
      toast.error("Enter a valid amount");
      return;
    }

    try {
      const res = await fetch(`/api/bookings/${id}/payment`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amountPaid: paymentAmount }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      toast.success("Payment added");

      setBookings((prev) =>
        prev.map((item) =>
          item._id === id
            ? { ...item, amountPaid: item.amountPaid + Number(paymentAmount) }
            : item
        )
      );

      setPaymentAmount("");
    } catch (err) {
      console.log("error in update payment", err);
      toast.error("Failed to update payment");
    }
  };

  /* -------------------------------------------------------------------------- */
  /* LOADING STATES                                                             */
  /* -------------------------------------------------------------------------- */
  if (isPending || loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-64px)] text-gray-600">
        <Spinner className="h-8 w-8" />
        <span className="mt-2 text-lg">Loading booking requests...</span>
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-6">
        <BookCheck className="w-16 h-16 text-amber-500 mb-4 opacity-80" />
        <p className="text-xl font-semibold text-gray-800">
          No Booking Requests
        </p>
      </div>
    );
  }

  /* SORT & FILTER */
  const sortedBookings = [...bookings]
    .filter((b) => (statusFilter === "all" ? true : b.status === statusFilter))
    .sort((a, b) =>
      sort === "new"
        ? new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        : new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );

  return (
    <section className="max-w-6xl mx-auto py-10 px-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-8">
        <h1 className="text-3xl font-serif font-bold text-[#1e293b]">
          All Booking Requests
        </h1>

        <div className="flex items-center gap-3">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[150px] border-amber-300 bg-amber-50/50 text-amber-800">
              <SelectValue placeholder="Status" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sort} onValueChange={(v) => setSort(v as never)}>
            <SelectTrigger className="w-[150px] border-amber-300 bg-amber-50/50 text-amber-800">
              <SelectValue placeholder="Sort" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="new">Newest First</SelectItem>
              <SelectItem value="old">Oldest First</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Booking Items */}
      <div className="space-y-8 pb-20">
        {sortedBookings.map((b) => (
          <div
            key={b._id}
            className="bg-white border border-amber-100 rounded-2xl shadow-md hover:shadow-lg transition-all p-6"
          >
            {/* SERVICE HEADING */}
            <div className="flex justify-between items-start gap-4">
              <div>
                <h2 className="text-xl font-semibold text-amber-700">
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
                  {new Date(b.bookingDate).toLocaleDateString("en-IN")}
                </p>
              </div>

              <Badge
                className={`px-3 py-1 text-sm rounded-full ${
                  b.status === "confirmed"
                    ? "bg-green-100 text-green-700 border-green-300"
                    : b.status === "cancelled"
                    ? "bg-red-100 text-red-700 border-red-300"
                    : b.status === "completed"
                    ? "bg-blue-100 text-blue-700 border-blue-300"
                    : "bg-yellow-100 text-yellow-700 border-yellow-300"
                }`}
              >
                {b.status.toUpperCase()}
              </Badge>
            </div>

            {/* FEATURES */}
            <div className="mt-4 bg-amber-50/50 border border-amber-100 p-4 rounded-xl">
              <p className="text-sm font-semibold text-amber-700 mb-2">
                Features Included:
              </p>

              <ul className="space-y-1 text-gray-700 text-sm">
                {b.packageFeatures.map((f, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-600" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>

            {/* CUSTOMER INFO */}
            <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl">
              <div>
                <p className="flex items-center gap-2 text-gray-700">
                  <User2 className="w-4 h-4" />
                  {b.fullName}
                </p>
                <p className="flex items-center gap-2 mt-1 text-gray-700">
                  <Mail className="w-4 h-4" />
                  {b.email}
                </p>
              </div>

              <div>
                <p className="flex items-center gap-2 text-gray-700">
                  <Phone className="w-4 h-4" />
                  {b.phone}
                </p>
                <p className="flex items-center gap-2 mt-1 text-gray-700">
                  <MapPin className="w-4 h-4" />
                  {b.address}
                </p>
              </div>
            </div>

            {/* PAYMENT SUMMARY */}
            <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-3 bg-gray-50 border rounded-xl">
                <p className="text-xs text-gray-500">Payment Mode</p>
                <p className="font-semibold text-gray-700 capitalize flex items-center gap-1">
                  <Wallet className="w-4 h-4" />
                  {b.paymentMode}
                </p>
              </div>

              <div className="p-3 bg-gray-50 border rounded-xl">
                <p className="text-xs text-gray-500">Amount Paid</p>
                <p className="font-semibold text-gray-700 flex items-center gap-1">
                  <IndianRupee className="w-4 h-4" />
                  {b.amountPaid}
                </p>
              </div>

              <div className="p-3 bg-gray-50 border rounded-xl">
                <p className="text-xs text-gray-500">Payment Status</p>
                <p className="font-semibold text-gray-700 capitalize">
                  {b.paymentStatus}
                </p>
              </div>

              <div className="p-3 bg-gray-50 border rounded-xl">
                <p className="text-xs text-gray-500">Booking Status</p>
                <p className="font-semibold text-gray-700 capitalize">
                  {b.status}
                </p>
              </div>
            </div>

            {/* ACTION & PAYMENT */}
            <div className="mt-6 flex flex-col lg:flex-row justify-between gap-6">
              {/* LEFT BUTTONS */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 shrink-0">
                <button
                  onClick={() => openActionModal(b._id, "pending")}
                  className="w-full px-4 py-2 bg-yellow-500 text-white rounded-full shadow hover:bg-yellow-600 transition"
                >
                  Pending
                </button>

                <button
                  onClick={() => openActionModal(b._id, "confirmed")}
                  className="w-full px-4 py-2 bg-green-600 text-white rounded-full shadow hover:bg-green-700 transition"
                >
                  Confirm
                </button>

                <button
                  onClick={() => openActionModal(b._id, "completed")}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-full shadow hover:bg-blue-700 transition"
                >
                  Complete
                </button>

                <button
                  onClick={() => openActionModal(b._id, "cancelled")}
                  className="w-full px-4 py-2 bg-red-600 text-white rounded-full shadow hover:bg-red-700 transition"
                >
                  Cancel
                </button>
              </div>

              {/* PAYMENT INPUT */}
              <div className="w-full lg:w-auto flex items-center gap-3">
                <input
                  type="number"
                  placeholder="Enter amount"
                  min={0}
                  className="w-full lg:w-40 px-3 py-2 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                />

                <button
                  onClick={() => {
                    setPaymentBookingId(b._id);
                    setIsPaymentModal(true);
                  }}
                  className="w-full px-4 py-2 bg-amber-600 text-white rounded-full hover:bg-amber-700 transition shadow"
                >
                  Add Payment
                </button>
              </div>
            </div>

            {/* TIMESTAMP */}
            <div className="mt-5 pt-4 border-t border-gray-200 text-sm text-gray-500">
              <span className="flex items-center gap-2">
                <Clock4 className="w-4 h-4" />
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

      {/* STATUS MODAL */}
      <Dialog open={isActionModal} onOpenChange={setIsActionModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Action</DialogTitle>
            <DialogDescription className="text-sm text-gray-600 pt-2">
              Set booking status to{" "}
              <span className="font-semibold text-amber-700">{actionType}</span>
              ?
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="mt-4 flex justify-end gap-3">
            <Button variant="outline" onClick={() => setIsActionModal(false)}>
              Cancel
            </Button>

            <Button
              onClick={handleUpdateStatus}
              disabled={isActionLoading}
              className="bg-amber-600 hover:bg-amber-700 text-white flex items-center gap-2"
            >
              {isActionLoading && <Spinner className="w-4 h-4 text-white" />}
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* PAYMENT CONFIRMATION MODAL */}
      <Dialog open={isPaymentModal} onOpenChange={setIsPaymentModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Action</DialogTitle>
            <DialogDescription className="text-sm text-gray-600 pt-2">
              Add payment of{" "}
              <span className="font-semibold text-amber-700">
                ₹{paymentAmount || 0}
              </span>{" "}
              to this booking?
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="mt-4 flex justify-end gap-3">
            <Button variant="outline" onClick={() => setIsPaymentModal(false)}>
              Cancel
            </Button>

            <Button
              className="bg-amber-600 hover:bg-amber-700 text-white"
              onClick={async () => {
                if (paymentBookingId) {
                  await handlePayment(paymentBookingId);
                }
                setIsPaymentModal(false);
              }}
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}
