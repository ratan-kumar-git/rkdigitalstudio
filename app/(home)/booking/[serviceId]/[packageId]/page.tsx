"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
import { AlertTriangle } from "lucide-react";
import Link from "next/link";

interface Package {
  _id: string;
  name: string;
  price: string;
  features: string[];
}

interface Service {
  _id: string;
  title: string;
  description: string;
  packages: Package[];
}

export default function BookingPage() {
  const { serviceId, packageId } = useParams();
  const router = useRouter();
  const { data, isPending } = authClient.useSession();

  const [service, setService] = useState<Service | null>(null);
  const [pkg, setPkg] = useState<Package | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    address: "",
    bookingDate: "",
  });

  // ─── Auth Check ─────────────────────────────────────
  useEffect(() => {
    if (isPending) return;

    const user = data?.user;
    if (!user) {
      toast.error("Please sign in to proceed with your booking.");
      router.replace("/signin");
      return;
    }

    if (user.email === "admin@gmail.com") {
      toast.error("Admins cannot book services.");
      router.replace("/admin/booking");
      return;
    }
  }, [data, isPending, router]);

  // ─── Fetch Service & Package ────────────────────────
  useEffect(() => {
    if (!serviceId || !packageId) return;

    const loadData = async () => {
      try {
        const res = await fetch(`/api/service-details/${serviceId}`);
        if (!res.ok) throw new Error("Failed to fetch service details");
        const { data } = await res.json();

        setService(data);
        setPkg(data.packages.find((p: Package) => p._id === packageId) || null);
      } catch (error) {
        console.error(error);
        toast.error("Unable to load booking details.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [serviceId, packageId]);

  const validateForm = () => {
    // Full Name
    if (!formData.fullName.trim()) {
      toast.error("Please enter your full name.");
      return false;
    }

    // Phone
    if (!/^[0-9]{10}$/.test(formData.phone)) {
      toast.error("Please enter a valid 10-digit phone number.");
      return false;
    }

    // Address
    if (!formData.address.trim()) {
      toast.error("Please enter your address.");
      return false;
    }

    // Booking Date
    if (!formData.bookingDate) {
      toast.error("Please select a booking date.");
      return false;
    }

    return true;
  };

  // ─── Input Change Handler ───────────────────────────
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ─── Submit Booking Request ─────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (!pkg || !service || !data?.user) {
      toast.error("Missing booking details!");
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: data.user.id,
          serviceDetailId: service._id,
          packageId: pkg._id,

          // User-entered data
          email: data.user.email,
          fullName: formData.fullName,
          phone: formData.phone,
          address: formData.address,
          bookingDate: formData.bookingDate,
        }),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Booking request failed");

      toast.success("Booking request sent successfully!");
      setFormData({
        fullName: "",
        phone: "",
        address: "",
        bookingDate: "",
      });
      router.push("/booking");
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong while sending your request.");
    } finally {
      setSubmitting(false);
    }
  };

  // ─── Loading UI ─────────────────────────────────────
  if (isPending || !data?.user) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-64px)] text-gray-600">
        <Spinner className="h-8 w-8" />
        <span className="mt-2 text-lg">Checking session...</span>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[70vh] text-gray-500">
        Loading booking details...
      </div>
    );
  }

  if (!service || !pkg) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-6">
        <AlertTriangle className="w-16 h-16 text-red-500 mb-4 opacity-80" />

        <p className="text-2xl font-semibold text-gray-800">
          Booking Details Not Found
        </p>

        <p className="text-sm text-gray-500 mt-2 max-w-sm">
          The service or package you’re trying to book does not exist or may
          have been removed. Please choose a valid service from the list below.
        </p>

        <Link
          href="/services"
          className="mt-6 bg-linear-to-r from-[#f59e0b] to-[#d97706] text-white px-6 py-3 rounded-full text-sm font-semibold shadow-md hover:scale-[1.03] transition-transform"
        >
          Browse Services
        </Link>
      </div>
    );
  }

  // ─── Main UI ────────────────────────────────────────
  return (
    <section className="bg-[#fffefc] flex items-center justify-center p-6 sm:py-12 sm:px-6">
      <div className="max-w-4xl w-full bg-white rounded-3xl shadow-xl border border-amber-100 overflow-hidden">
        {/* Header */}
        <div className="bg-linear-to-r from-[#f59e0b] to-[#d97706] text-white py-6 px-8">
          <h1 className="text-3xl font-serif font-bold">Book Your Service</h1>
          <p className="text-sm text-amber-100">
            Send a request to check availability for your preferred date
          </p>
        </div>

        <div className="p-8">
          {/* Service Info */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-1">
              {service.title}
            </h2>
            <p className="text-gray-600">{service.description}</p>
          </div>

          {/* Package Info */}
          <div className="bg-amber-50 border border-amber-100 rounded-xl p-6 mb-8">
            <h3 className="text-xl font-semibold text-amber-700">{pkg.name}</h3>
            <p className="text-lg font-medium text-gray-800 mb-3">
              ₹{pkg.price}
            </p>
            <ul className="space-y-1 text-gray-600 text-sm">
              {pkg.features.map((f, i) => (
                <li key={i}>• {f}</li>
              ))}
            </ul>
          </div>

          {/* Booking Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Full Name
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Ratan Kumar"
                className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="7894568213"
                className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            {/* Address */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Address
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="your address"
                className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            {/* Booking Date */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Preferred Booking Date
              </label>
              <input
                type="date"
                name="bookingDate"
                value={formData.bookingDate}
                onChange={handleChange}
                placeholder="Choose your date"
                className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <Button
              type="submit"
              disabled={submitting}
              className="w-full mt-6 py-3 rounded-full text-lg font-semibold bg-linear-to-r from-[#f59e0b] to-[#d97706] text-white hover:from-[#fbbf24] hover:to-[#f59e0b] transition-all transform hover:scale-[1.03] shadow-md disabled:opacity-60"
            >
              {submitting
                ? "Submitting Request..."
                : "Request Booking Availability"}
            </Button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            We’ll contact you soon to confirm availability for your selected
            date.
          </p>
        </div>
      </div>
    </section>
  );
}
