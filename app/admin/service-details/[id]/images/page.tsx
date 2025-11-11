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
import { Trash2 } from "lucide-react";

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
  /* 🟢 FETCH SERVICE DETAIL DATA                                               */
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
  /* 🟡 UPLOAD NEW IMAGE TO IMAGEKIT + SAVE TO MONGODB                         */
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

      const res = await upload({
        expire,
        token,
        signature,
        publicKey,
        file,
        fileName: file.name,
        folder: "rkdigitalstudio/gallery",
        onProgress: (e) => setUploadProgress((e.loaded / e.total) * 100),
        abortSignal: abortController.signal,
      });

      // Add to MongoDB
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
      toast.success("Image uploaded and added to gallery!");
    } catch (error) {
      console.error(error);
      if (error instanceof ImageKitAbortError) toast.error("Upload aborted");
      else if (error instanceof ImageKitInvalidRequestError)
        toast.error("Invalid upload request");
      else if (error instanceof ImageKitUploadNetworkError)
        toast.error("Network error during upload");
      else if (error instanceof ImageKitServerError)
        toast.error("Server error during upload");
      else toast.error("Unknown error occurred");
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  /* -------------------------------------------------------------------------- */
  /* 🔴 DELETE IMAGE (Triggered from Modal)                                    */
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
  /* 🖼️ UI                                                                     */
  /* -------------------------------------------------------------------------- */
  return (
    <div className="min-h-screen bg-[#f9fafb] py-10 flex flex-col">
      <div className="max-w-6xl mx-auto bg-white border border-amber-100 rounded-xl shadow-sm p-8 space-y-8">
        {/* 📌 Service Header */}
        {service && (
          <div className="border-b border-amber-100 pb-6">
            <h1 className="text-2xl font-semibold text-[#1e293b] mb-2">
              Service Name: {service.title}
            </h1>
            <p className="text-[#475569] text-sm leading-relaxed">
              Service Description: {service.description}
            </p>
          </div>
        )}

        {/* 📸 Upload Section */}
        <div>
          <h2 className="text-lg font-medium text-[#1e293b] mb-4">
            Upload New Image
          </h2>
          <Input type="file" accept="image/*" ref={fileInputRef} />
          <Button
            onClick={handleUpload}
            disabled={uploading}
            className="mt-3 bg-linear-to-r from-amber-500 to-amber-600 text-white"
          >
            {uploading
              ? `Uploading... ${uploadProgress.toFixed(0)}%`
              : "Upload Image"}
          </Button>

          {uploading && (
            <div className="w-full bg-amber-50 rounded-full h-2 mt-3">
              <div
                className="bg-linear-to-r from-amber-500 to-amber-600 h-2 rounded-full transition-all"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          )}
        </div>

        {/* 🖼️ Gallery Grid */}
        <div>
          <h2 className="text-lg font-medium text-[#1e293b] mb-4">
            Gallery Images
          </h2>
          {gallery.length === 0 ? (
            <p className="text-center text-[#94a3b8]">No images in gallery</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
              {gallery.map((item) => (
                <div
                  key={item.imageFileId}
                  className="relative group border border-amber-100 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                >
                  <Image
                    src={item.imageUrl}
                    alt="Gallery Image"
                    width={400}
                    height={300}
                    className="object-cover w-full h-48"
                  />
                  <button
                    onClick={() => {
                      setSelectedImageId(item.imageFileId);
                      setIsModalOpen(true);
                    }}
                    disabled={loading}
                    className="absolute top-2 right-2 bg-red-500 text-white hover:text-[#1e293b] rounded-full px-2 py-2"
                  >
                    <Trash2 className="size-5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 🧩 Confirmation Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-[#1e293b]">
              Confirm Deletion
            </DialogTitle>
          </DialogHeader>

          <p className="text-sm text-[#475569]">
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
