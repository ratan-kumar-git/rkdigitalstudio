"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Edit, Package, X, Star, Sparkles } from "lucide-react";

interface IPackage {
  name: string;
  price: string;
  features: string[];
  highlight?: boolean;
}

export default function PackageManager() {
  const { id } = useParams();
  const [serviceTitle, setServiceTitle] = useState("");
  const [packages, setPackages] = useState<IPackage[]>([]);
  const [form, setForm] = useState<IPackage>({
    name: "",
    price: "",
    features: [],
    highlight: false,
  });
  const [newFeature, setNewFeature] = useState("");
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  /* -------------------------------------------------------------------------- */
  /* 🟢 FETCH PACKAGES                                                         */
  /* -------------------------------------------------------------------------- */
  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const res = await fetch(`/api/service-details/${id}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        setServiceTitle(data.data.title);
        setPackages(data.data.packages);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load packages");
      }
    };
    if (id) fetchPackages();
  }, [id]);

  /* -------------------------------------------------------------------------- */
  /* 🧾 VALIDATION                                                             */
  /* -------------------------------------------------------------------------- */
  const validateForm = (): boolean => {
    if (!form.name.trim()) {
      toast.error("Package name is required");
      return false;
    }

    if (!form.price.trim()) {
      toast.error("Price is required");
      return false;
    }

    if (isNaN(Number(form.price.trim()))) {
      toast.error("Price must be a valid number");
      return false;
    }

    if (form.features.length === 0) {
      toast.error("Add at least one feature");
      return false;
    }

    return true;
  };

  /* -------------------------------------------------------------------------- */
  /* 🟡 ADD OR UPDATE PACKAGE                                                  */
  /* -------------------------------------------------------------------------- */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/service-details/${id}/package`, {
        method: editIndex !== null ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...(editIndex !== null ? { index: editIndex } : {}),
          ...form,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setPackages(data.data);
      setForm({ name: "", price: "", features: [], highlight: false });
      setNewFeature("");
      setEditIndex(null);
      toast.success(
        editIndex !== null
          ? "Package updated successfully!"
          : "Package added successfully!"
      );
    } catch (err) {
      console.error(err);
      toast.error("Failed to save package");
    } finally {
      setLoading(false);
    }
  };

  /* -------------------------------------------------------------------------- */
  /* 🧩 FEATURE HANDLING                                                      */
  /* -------------------------------------------------------------------------- */
  const handleAddFeature = () => {
    if (!newFeature.trim()) return toast.error("Enter a valid feature");
    setForm((prev) => ({
      ...prev,
      features: [...prev.features, newFeature.trim()],
    }));
    setNewFeature("");
  };

  const handleRemoveFeature = (index: number) => {
    setForm((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }));
  };

  /* -------------------------------------------------------------------------- */
  /* 🔴 DELETE PACKAGE                                                         */
  /* -------------------------------------------------------------------------- */
  const handleDeletePackage = async () => {
    if (deleteIndex === null) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/service-details/${id}/package`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ index: deleteIndex }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setPackages(data.data);
      toast.success("Package deleted successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete package");
    } finally {
      setLoading(false);
      setIsModalOpen(false);
      setDeleteIndex(null);
    }
  };

  /* -------------------------------------------------------------------------- */
  /* 🎨 UI SECTION                                                            */
  /* -------------------------------------------------------------------------- */
  return (
    <div className="bg-[#fafaf9] p-6 sm:py-10 sm:px-10">
      <div className="max-w-6xl mx-auto bg-white border border-amber-100 rounded-2xl shadow-sm p-8 sm:p-10 space-y-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="text-2xl sm:text-3xl font-semibold text-[#1e293b] flex items-center gap-2">
              {editIndex !== null ? (
                <>
                  <Edit className="text-amber-600 sm:size-8" /> Edit Package
                </>
              ) : (
                <>
                  {" "}
                  <Package className="text-amber-600 sm:size-8" />
                  Manage Package
                </>
              )}
            </h2>
            <p className="text-[#64748b] text-sm mt-1">
              Service:{" "}
              <span className="font-medium text-amber-600">
                {serviceTitle || "loading..."}
              </span>
            </p>
          </div>
          {editIndex !== null && (
            <Button
              variant="outline"
              onClick={() => {
                setForm({
                  name: "",
                  price: "",
                  features: [],
                  highlight: false,
                });
                setEditIndex(null);
              }}
              className="text-[#475569] border-[#cbd5e1] hover:bg-amber-50"
            >
              Cancel Edit
            </Button>
          )}
        </div>

        {/* Form Section */}
        <form
          onSubmit={handleSubmit}
          className="bg-amber-50/60 border border-amber-100 rounded-xl p-6 space-y-6"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-[#475569] mb-2">
                Package Name <span className="text-red-500">*</span>
              </label>
              <Input
                name="name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g., Wedding Gold"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#475569] mb-2">
                Price (₹) <span className="text-red-500">*</span>
              </label>
              <Input
                type="number"
                name="price"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                placeholder="e.g., 20000"
              />
            </div>
          </div>

          {/* Features */}
          <div>
            <label className="block text-sm font-medium text-[#475569] mb-2">
              Features <span className="text-red-500">*</span>
            </label>
            <div className="flex flex-col sm:flex-row gap-3">
              <Input
                value={newFeature}
                onChange={(e) => setNewFeature(e.target.value)}
                placeholder="e.g., Cinematic Highlight Video"
                className="flex-1"
              />
              <Button
                type="button"
                onClick={handleAddFeature}
                className="bg-linear-to-r from-amber-500 to-amber-600 text-white hover:scale-[1.02]"
              >
                Add Feature
              </Button>
            </div>

            {form.features.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {form.features.map((f, i) => (
                  <div
                    key={i}
                    className="flex items-center bg-amber-100 border border-amber-200 px-3 py-1.5 rounded-full text-sm text-[#374151] hover:bg-amber-200 transition"
                  >
                    {f}
                    <button
                      type="button"
                      onClick={() => handleRemoveFeature(i)}
                      className="ml-2 text-red-500 hover:text-red-700 transition"
                    >
                      <X size={15} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Highlight */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={form.highlight}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, highlight: e.target.checked }))
              }
              className="w-4 h-4 text-amber-600 border-gray-300 rounded focus:ring-amber-500"
            />
            <span className="text-[#475569] text-sm">
              Highlight this package
            </span>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-linear-to-r from-amber-500 to-amber-600 text-white font-semibold py-2.5 rounded-lg hover:scale-[1.02] transition"
          >
            {loading
              ? "Saving..."
              : editIndex !== null
              ? "Update Package"
              : "Add Package"}
          </Button>
        </form>

        {/* Packages Grid */}
        <section>
          <h3 className="text-xl font-semibold text-[#1e293b] mb-4 flex items-center gap-2">
            <Sparkles className="text-amber-500" /> Added Packages
          </h3>

          {packages.length === 0 ? (
            <p className="text-center text-[#94a3b8] italic py-10">
              No packages added yet.
            </p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {packages.map((pkg, idx) => (
                <div
                  key={idx}
                  className={`relative rounded-xl border transition-all shadow-sm hover:shadow-md p-6 ${
                    pkg.highlight
                      ? "border-amber-400 bg-linear-to-br from-amber-50 via-white to-amber-100"
                      : "border-amber-100 bg-white"
                  }`}
                >
                  {pkg.highlight && (
                    <Star
                      className="absolute top-3 right-3 text-amber-500"
                      size={18}
                    />
                  )}
                  <h4 className="text-lg font-semibold text-[#1e293b]">
                    {pkg.name}
                  </h4>
                  <p className="text-amber-600 font-bold text-base mt-1">
                    ₹{pkg.price}
                  </p>
                  <ul className="mt-3 text-sm text-[#475569] list-disc pl-5 space-y-1">
                    {pkg.features.map((f, i) => (
                      <li key={i}>{f}</li>
                    ))}
                  </ul>

                  <div className="flex flex-col sm:flex-row gap-3 mt-6">
                    <Button
                      onClick={() => {
                        setForm(pkg);
                        setEditIndex(idx);
                      }}
                      className="bg-amber-500 hover:bg-amber-600 text-white flex-1"
                    >
                      Edit
                    </Button>
                    <Button
                      onClick={() => {
                        setDeleteIndex(idx);
                        setIsModalOpen(true);
                      }}
                      className="bg-red-500 hover:bg-red-600 text-white flex-1"
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Delete Confirmation Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-[#1e293b]">
              Confirm Deletion
            </DialogTitle>
          </DialogHeader>
          <p className="text-sm text-[#475569]">
            Are you sure you want to delete this package? This action cannot be
            undone.
          </p>
          <DialogFooter className="mt-6 flex justify-end space-x-3">
            <Button
              variant="outline"
              onClick={() => {
                setIsModalOpen(false);
                setDeleteIndex(null);
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeletePackage}
              disabled={loading}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              {loading ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
