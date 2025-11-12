"use client";

import { Image } from "@imagekit/next";
import NextImage from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Edit,
  Eye,
  FileText,
  Trash2,
  ImageIcon,
  Video,
  IndianRupee,
} from "lucide-react";
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
  imageFileId?: string;
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

      if (service.imageFileId) {
        const delImage = await fetch("/api/imagekit/delete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ fileId: service.imageFileId }),
        });

        if (!delImage.ok) console.warn("Failed to delete image from ImageKit");
      }

      toast.success("Service deleted successfully!");
      onDelete?.(service._id);
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
        {service.imageUrl ? (
          <Image
            urlEndpoint="https://ik.imagekit.io/ratanofficial"
            src={service.imageUrl}
            alt={service.title}
            width={400}
            height={300}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <NextImage
            src="/coming-soon.jpg"
            alt={service.title}
            width={400}
            height={300}
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}
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
        <div className="grid grid-cols-2 gap-3">
          {/* View */}
          <Link href={`/services/${service._id}`} className="flex-1">
            <Button
              variant="outline"
              size="sm"
              className="w-full gap-2 text-amber-700 border-amber-300 hover:bg-amber-50"
            >
              <Eye className="w-4 h-4" /> View
            </Button>
          </Link>

          {/* Edit Card */}
          <Link href={`/admin/add-service/${service._id}`} className="flex-1">
            <Button
              variant="outline"
              size="sm"
              className="w-full gap-2 text-blue-700 border-blue-300 hover:bg-blue-50"
            >
              <Edit className="w-4 h-4" /> Edit Card
            </Button>
          </Link>

          {/* Edit Details */}
          <Link
            href={`/admin/service-details/${service._id}/description`}
            className="flex-1"
          >
            <Button
              variant="outline"
              size="sm"
              className="w-full gap-2 text-emerald-700 border-emerald-300 hover:bg-emerald-50"
            >
              <FileText className="w-4 h-4" /> Details
            </Button>
          </Link>

          {/* Edit Packages */}
          <Link
            href={`/admin/service-details/${service._id}/packages`}
            className="flex-1"
          >
            <Button
              variant="outline"
              size="sm"
              className="w-full gap-2 text-cyan-600 border-cyan-300 hover:bg-cyan-50"
            >
              <IndianRupee className="w-4 h-4" /> Packages
            </Button>
          </Link>

          {/* Manage Images */}
          <Link
            href={`/admin/service-details/${service._id}/images`}
            className="flex-1"
          >
            <Button
              variant="outline"
              size="sm"
              className="w-full gap-2 text-violet-700 border-violet-300 hover:bg-violet-50"
            >
              <ImageIcon className="w-4 h-4" /> Images
            </Button>
          </Link>

          {/* Manage Videos */}
          <Link
            href={`/admin/service-details/${service._id}/videos`}
            className="flex-1"
          >
            <Button
              variant="outline"
              size="sm"
              className="w-full gap-2 text-fuchsia-700 border-fuchsia-300 hover:bg-fuchsia-50"
            >
              <Video className="w-4 h-4" /> Videos
            </Button>
          </Link>

          {/* Delete (Dialog) */}
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="col-span-2 w-full gap-2 text-red-700 border-red-300 hover:bg-red-50"
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
