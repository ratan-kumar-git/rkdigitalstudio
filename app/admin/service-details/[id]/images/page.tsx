"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import {
  upload,
  ImageKitAbortError,
  ImageKitInvalidRequestError,
  ImageKitUploadNetworkError,
  ImageKitServerError,
} from "@imagekit/next";
import { authenticator } from "@/lib/imageClintAuth";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Trash2, Upload, ImageIcon } from "lucide-react";

interface IGalleryItem {
  imageUrl: string;
  imageFileId: string;
  thumbnailUrl?: string;
}

interface IServiceDetail {
  title: string;
  description: string;
}

export default function ServiceGalleryManager() {
  const { id } = useParams();
  const [service, setService] = useState<IServiceDetail | null>(null);
  const [gallery, setGallery] = useState<IGalleryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);

  /* -------------------------------------------------------------------------- */
  /* 🟢 FETCH SERVICE DETAILS                                                  */
  /* -------------------------------------------------------------------------- */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/service-details/${id}`);
        const data = await res.json();

        if (!res.ok) throw new Error(data.message);
        setService({
          title: data.data.title,
          description: data.data.description,
        });
        setGallery(data.data.gallery || []);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load service details");
      }
    };

    if (id) fetchData();
  }, [id]);

  /* -------------------------------------------------------------------------- */
  /* 🟡 UPLOAD NEW IMAGE TO IMAGEKIT + SAVE TO DB                              */
  /* -------------------------------------------------------------------------- */
  const handleUpload = async () => {
    const fileInput = fileInputRef.current;
    if (!fileInput?.files?.length) return toast.error("Please select an image");
    const file = fileInput.files[0];

    if (!file.type.startsWith("image/"))
      return toast.error("Only image files are allowed!");
    if (file.size > 5 * 1024 * 1024)
      return toast.error("Image must be smaller than 5 MB!");

    setUploading(true);
    const abortController = new AbortController();

    try {
      const auth = await authenticator();
      const { signature, expire, token, publicKey } = auth;
      const imgFolder = `rkdigitalstudio/gallery/${id}`

      const res = await upload({
        expire,
        token,
        signature,
        publicKey,
        file,
        fileName: file.name,
        folder: imgFolder,
        onProgress: (e) => setUploadProgress((e.loaded / e.total) * 100),
        abortSignal: abortController.signal,
      });

      const addRes = await fetch(`/api/service-details/${id}/image`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageUrl: res.url,
          imageFileId: res.fileId,
          thumbnailUrl: res.thumbnailUrl || "",
        }),
      });

      const addData = await addRes.json();
      if (!addRes.ok) throw new Error(addData.message);

      setGallery(addData.data.gallery || []);
      toast.success("Image uploaded successfully!");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error(error);
      if (error instanceof ImageKitAbortError) toast.error("Upload aborted");
      else if (error instanceof ImageKitInvalidRequestError)
        toast.error("Invalid upload request");
      else if (error instanceof ImageKitUploadNetworkError)
        toast.error("Network error during upload");
      else if (error instanceof ImageKitServerError)
        toast.error("Server error during upload");
      else toast.error("Unknown upload error");
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  /* -------------------------------------------------------------------------- */
  /* 🔴 DELETE IMAGE                                                          */
  /* -------------------------------------------------------------------------- */
  const handleDelete = async () => {
    if (!selectedImageId) return;
    setLoading(true);

    try {
      const res = await fetch(`/api/service-details/${id}/image`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageFileId: selectedImageId }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setGallery(data.data.gallery || []);

      const res2 = await fetch("/api/imagekit/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileId: selectedImageId }),
      });

      if (!res2.ok) {
        toast.error("Image removed from DB but failed to delete from ImageKit");
      }

      toast.success("Image deleted successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete image");
    } finally {
      setLoading(false);
      setIsModalOpen(false);
      setSelectedImageId(null);
    }
  };

  /* -------------------------------------------------------------------------- */
  /* 🖼️ UI                                                                    */
  /* -------------------------------------------------------------------------- */
  return (
    <div className="bg-[#fafaf9] p-6 sm:py-10 sm:px-10">
      <div className="max-w-6xl mx-auto bg-white border border-amber-100 rounded-2xl shadow-sm p-8 sm:p-10 space-y-10">
        {/* Header */}
        {service && (
          <div className="border-b border-amber-100 pb-6">
            <h1 className="text-2xl sm:text-3xl font-semibold text-[#1e293b] mb-2 flex items-center gap-2">
              <ImageIcon className="text-amber-500 sm:size-8" />
              Manage Images
            </h1>
            <p className="text-[#64748b] text-sm sm:text-base">
              Service:{" "}
              <span className="font-medium text-amber-600">
                {service.title || "loading ..."}
              </span>
            </p>
          </div>
        )}

        {/* Upload Section */}
        <div className="bg-amber-50 border border-amber-100 p-6 rounded-xl shadow-sm">
          <h2 className="text-lg font-medium text-[#1e293b] mb-4 flex items-center gap-2">
            <Upload className="text-amber-600" />
            Upload New Image
          </h2>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <Input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              className="flex-1"
            />
            <Button
              onClick={handleUpload}
              disabled={uploading}
              className="bg-linear-to-r from-amber-500 to-amber-600 text-white hover:scale-[1.02] transition-transform"
            >
              {uploading
                ? `Uploading... ${uploadProgress.toFixed(0)}%`
                : "Upload"}
            </Button>
          </div>

          {uploading && (
            <div className="w-full bg-amber-100 rounded-full h-2 mt-3 overflow-hidden">
              <div
                className="bg-linear-to-r from-amber-500 to-amber-600 h-2 transition-all"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          )}
        </div>

        {/* Gallery */}
        <div>
          <h2 className="text-lg font-medium text-[#1e293b] mb-4">
            Gallery Images
          </h2>
          {gallery.length === 0 ? (
            <div className="text-center py-16 text-[#94a3b8] italic border border-dashed border-amber-200 rounded-xl">
              No images yet. Start uploading above!
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {gallery.map((item) => (
                <div
                  key={item.imageFileId}
                  className="relative group rounded-xl overflow-hidden shadow-sm border border-amber-100 bg-white hover:shadow-md transition-all"
                >
                  <Image
                    src={item.imageUrl}
                    alt="Gallery Image"
                    width={500}
                    height={400}
                    className="object-cover w-full h-56 sm:h-52"
                  />
                  <button
                    onClick={() => {
                      setSelectedImageId(item.imageFileId);
                      setIsModalOpen(true);
                    }}
                    disabled={loading}
                    className="absolute top-3 right-3 bg-red-500 text-white hover:bg-red-600 rounded-full p-2 transition-all"
                  >
                    <Trash2 className="size-5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-[#1e293b] text-lg">
              Confirm Image Deletion
            </DialogTitle>
          </DialogHeader>

          <p className="text-sm text-[#475569] leading-relaxed">
            Are you sure you want to delete this image? This action cannot be
            undone.
          </p>

          <DialogFooter className="mt-6 flex justify-end space-x-3">
            <Button
              variant="outline"
              onClick={() => {
                setIsModalOpen(false);
                setSelectedImageId(null);
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleDelete}
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
