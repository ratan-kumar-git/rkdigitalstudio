"use client";

import { Image } from "@imagekit/next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Edit, Eye, FileText, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Service {
  _id: string;
  slug: string;
  title: string;
  description: string;
  imageUrl: string;
}

interface Props {
  service: Service;
  onDelete?: (id: string) => void;
}

const AdminServiceCard = ({ service, onDelete }: Props) => {
  const [deleting, setDeleting] = useState(false);
  const [open, setOpen] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const res = await fetch(`/api/service/${service._id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete service");
      toast.success("Service deleted successfully!");

      if (onDelete) onDelete(service._id);
    } catch (err) {
      console.error(err);
      toast.error("Error deleting service");
    } finally {
      setDeleting(false);
      setOpen(false);
    }
  };

  return (
    <div
      key={service._id}
      className="group bg-white border border-gray-100 rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden"
    >
      {/* ─── Image ─────────────────────────────── */}
      <div className="relative w-full h-48">
        <Image
          urlEndpoint="https://ik.imagekit.io/ratanofficial"
          src={service.imageUrl}
          alt={service.title}
          loading="eager"
          width={400}
          height={300}
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>

      {/* ─── Content ────────────────────────────── */}
      <div className="p-6">
        <h3 className="text-xl font-serif font-semibold text-[#1e293b] mb-2">
          {service.title}
        </h3>
        <p className="text-[#64748b] text-sm leading-relaxed mb-6 line-clamp-3">
          {service.description}
        </p>

        {/* ─── Action Buttons ───────────────────── */}
        <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-3">
          {/* View */}
          <Link href={`/services/${service.slug}`} className="flex-1">
            <Button
              variant="outline"
              size="sm"
              className="w-full flex items-center justify-center gap-2 text-[#d97706] border-[#d97706]/50 hover:bg-[#fef3c7]"
            >
              <Eye className="w-4 h-4" /> View
            </Button>
          </Link>

          {/* Edit Card */}
          <Link href={`/`} className="flex-1">
            <Button
              variant="outline"
              size="sm"
              className="w-full flex items-center justify-center gap-2 text-blue-600 border-blue-300 hover:bg-blue-50"
            >
              <Edit className="w-4 h-4" /> Edit Card
            </Button>
          </Link>

          {/* Add/Edit Details */}
          <Link href={`/`} className="flex-1">
            <Button
              variant="outline"
              size="sm"
              className="w-full flex items-center justify-center gap-2 text-green-600 border-green-300 hover:bg-green-50"
            >
              <FileText className="w-4 h-4" /> Edit Details
            </Button>
          </Link>

          {/* Delete - uses modal */}
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="w-full flex items-center justify-center gap-2 text-red-600 border-red-300 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[400px]">
              <DialogHeader>
                <DialogTitle className="text-lg font-semibold">
                  Confirm Delete
                </DialogTitle>
                <DialogDescription className="text-gray-500">
                  Are you sure you want to delete{" "}
                  <span className="font-semibold text-gray-700">
                    {service.title}
                  </span>
                  ? This action cannot be undone.
                </DialogDescription>
              </DialogHeader>

              <DialogFooter className="flex justify-end gap-3 mt-4">
                <Button
                  variant="outline"
                  onClick={() => setOpen(false)}
                  disabled={deleting}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  {deleting ? "Deleting..." : "Confirm Delete"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default AdminServiceCard;
