"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Loader2, PlusCircle } from "lucide-react";
import toast from "react-hot-toast";
import AdminServiceCard from "@/components/AdminService/AdminServiceCard";

interface IService {
  _id: string;
  slug: string;
  title: string;
  description: string;
  imageUrl: string;
  createdAt: string;
}

export default function AdminServicesPage() {
  const [services, setServices] = useState<IService[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/service", {
        method: "GET",
        cache: "no-store",
      });
      if (!res.ok) throw new Error("Failed to fetch services");
      const data = await res.json();
      setServices(data.data || []);
    } catch (error) {
      console.error(error);
      toast.error("Error fetching services");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  return (
    <div className="min-h-screen bg-[#fffefc] py-10 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-10">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">All Services</h1>
          <Link href="/admin/add-service">
            <Button
              size="lg"
              className="flex items-center justify-center gap-2 bg-[#2563eb] hover:bg-[#1e40af] text-white"
            >
              <PlusCircle className="w-5 h-5" /> Add Service
            </Button>
          </Link>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20 text-gray-500">
            <Loader2 className="w-8 h-8 animate-spin mb-3 text-[#d97706]" />
            <p>Loading services...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && services.length === 0 && (
          <p className="text-center text-gray-600 mt-20">
            No services found. Add one to get started!
          </p>
        )}

        {/* Services Grid */}
        {!loading && services.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((s) => (
              <AdminServiceCard
                key={s._id}
                service={s}
                onDelete={(id) =>
                  setServices((prev) => prev.filter((x) => x._id !== id))
                }
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
