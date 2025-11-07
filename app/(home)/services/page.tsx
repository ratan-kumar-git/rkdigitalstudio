"use client";

import { useEffect, useState } from "react";
import ServiceCard from "@/components/service/ServiceCard";
import LoadingScreen from "@/components/layout/LoadingScreen";

interface Service {
  _id: string;
  slug: string;
  title: string;
  description: string;
  imageUrl: string;
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/service", { cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = await res.json();
      console.log("Fetched services:", data);

      if (Array.isArray(data?.data)) {
        setServices(data.data);
      } else {
        console.warn("Unexpected data format. Falling back to empty list.");
        setServices([]);
      }
    } catch (error) {
      console.error("Error fetching services:", error);
      setServices([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  if (loading) return <LoadingScreen message="Loading services..." />;

  return (
    <main className="bg-[#fffefc] min-h-screen py-24">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-serif font-bold text-[#1e293b]">
            Our <span className="text-[#d97706]">Services</span>
          </h1>
          <p className="text-[#64748b] mt-4 text-lg max-w-2xl mx-auto">
            We provide a complete range of photography and videography services,
            from traditional to cinematic, designed to make your story
            unforgettable.
          </p>
        </div>

        {/* Services Grid */}
        {services.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <ServiceCard key={service._id} {...service} />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 mt-10">
            No services found. Please add some from the admin panel.
          </p>
        )}
      </div>
    </main>
  );
}
