"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";

export default function AddServiceDetailsPage() {
  const { id } = useParams();
  const router = useRouter();

  const [form, setForm] = useState({
    title: "",
    description: "",
    packages: [{ name: "", price: "", features: [""] }],
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/service-detail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, service: id }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      toast.success("🎉 Details added successfully!");
      router.push("/admin/services");
    } catch (error) {
      console.error(error);
      toast.error("Error adding details");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fffefc] flex justify-center items-start py-10 px-6">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-lg p-8 w-full max-w-3xl">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800 text-center">
          Add Service Details
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            name="title"
            placeholder="Details Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />

          <Textarea
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            required
          />

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 text-white"
          >
            {loading ? "Saving..." : "Save Details"}
          </Button>
        </form>
      </div>
    </div>
  );
}
