"use client";

import { useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import {
  upload,
  ImageKitAbortError,
  ImageKitInvalidRequestError,
  ImageKitUploadNetworkError,
  ImageKitServerError,
} from "@imagekit/next";
import { authenticator } from "@/lib/imageClintAuth";
import { Trash2 } from "lucide-react";

interface IService {
  slug: string;
  title: string;
  description: string;
  imageUrl: string;
  imageFileId: string;
}

export default function AddServicePage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [form, setForm] = useState<IService>({
    slug: "",
    title: "",
    description: "",
    imageUrl: "",
    imageFileId: "",
  });

  const [uploadProgress, setUploadProgress] = useState(0);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFileId, setImageFileId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Handle form changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    if (name === "title") {
      const newSlug = value
        .toLowerCase()
        .trim()
        .replace(/ /g, "-")
        .replace(/[^\w-]+/g, "");
      setForm((prev) => ({ ...prev, slug: newSlug }));
    }
  };

  // Image upload
  const handleImageUpload = async () => {
    const fileInput = fileInputRef.current;
    if (!fileInput?.files?.length)
      return toast.error("Please select an image");

    const file = fileInput.files[0];

    // Basic validations
    if (!file.type.startsWith("image/")) {
      return toast.error("Only image files are allowed!");
    }
    if (file.size > 5 * 1024 * 1024) {
      return toast.error("Image must be smaller than 5 MB!");
    }

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
        folder: "rkdigitalstudio",
        onProgress: (e) => setUploadProgress((e.loaded / e.total) * 100),
        abortSignal: abortController.signal,
      });

      const imageUrl = res.url ?? "";
      const fileId = res.fileId ?? "";

      setForm((prev) => ({ ...prev, imageUrl, imageFileId: fileId }));
      setImagePreview(imageUrl || null);
      setImageFileId(fileId || null);
      toast.success("Image uploaded successfully!");
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
    }
  };

  // Remove image from ImageKit
  const handleRemoveImage = async () => {
    if (!imageFileId) {
      setImagePreview(null);
      setForm((prev) => ({ ...prev, imageUrl: "", imageFileId: "" }));
      return;
    }

    try {
      const res = await fetch("/api/imagekit/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileId: imageFileId }),
      });

      if (!res.ok) throw new Error("Failed to delete image");

      setImagePreview(null);
      setImageFileId(null);
      setForm((prev) => ({ ...prev, imageUrl: "", imageFileId: "" }));
      toast.success("Image removed successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Error deleting image");
    }
  };

  // Submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.title || !form.description)
      return toast.error("Please fill all required fields!");
    if (!form.imageUrl || !form.imageFileId)
      return toast.error("Please upload an image first!");

    setLoading(true);
    try {
      // Create Service
      const res = await fetch("/api/service", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to save service");

      // Create default ServiceDetail
      const res2 = await fetch("/api/service-details", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ serviceId: data.data._id }),
      });

      const detailData = await res2.json();
      if (!res2.ok)
        toast.error(
          detailData.message || "Service created, but details not initialized"
        );
      else toast.success("Service and details created successfully!");

      router.push("/admin/services");
    } catch (error) {
      console.error(error);
      toast.error("Failed to create service");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f9fafb] py-10 flex flex-col">
      <div className="flex-1 p-8">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
          {/* Left Section - Form */}
          <div className="bg-white border border-amber-100 rounded-xl shadow-sm p-8">
            <h2 className="text-lg font-semibold text-[#1e293b] mb-6">
              Service Information
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-[#475569] mb-2">
                  Title
                </label>
                <Input
                  name="title"
                  placeholder="Enter service title"
                  value={form.title}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-[#475569] mb-2">
                  Description
                </label>
                <Textarea
                  name="description"
                  placeholder="Describe the service"
                  value={form.description}
                  onChange={handleChange}
                  disabled={loading}
                  className="min-h-[130px]"
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-linear-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-white font-semibold py-2.5 rounded-lg shadow-md transition-transform hover:scale-[1.02]"
              >
                {loading ? "Saving..." : "Create Service"}
              </Button>
            </form>
          </div>

          {/* Right Section - Image Upload */}
          <div className="bg-white border border-amber-100 rounded-xl shadow-sm p-8">
            <h2 className="text-lg font-semibold text-[#1e293b] mb-6">
              Upload Image
            </h2>

            <Input type="file" accept="image/*" ref={fileInputRef} />
            <Button
              type="button"
              onClick={handleImageUpload}
              disabled={loading}
              className="mt-3 w-full bg-linear-to-r from-amber-500 to-amber-600 text-white"
            >
              Upload Image
            </Button>

            {uploadProgress > 0 && uploadProgress < 100 && (
              <div className="mt-3">
                <div className="w-full bg-amber-50 rounded-full h-2">
                  <div
                    className="bg-linear-to-r from-amber-500 to-amber-600 h-2 rounded-full transition-all"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
                <p className="text-sm text-amber-600 mt-2 text-center">
                  Uploading... {uploadProgress.toFixed(0)}%
                </p>
              </div>
            )}

            {/* Image Preview */}
            {imagePreview ? (
              <div className="relative mt-6 group">
                <Image
                  src={imagePreview}
                  alt="Preview"
                  width={400}
                  height={300}
                  className="rounded-lg border border-amber-100 shadow-sm object-cover w-full"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  disabled={loading}
                  className="absolute top-3 right-3 bg-red-500 text-white hover:bg-red-600 rounded-full px-2 py-2"
                >
                  <Trash2 className="size-5" />
                </button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-amber-200 rounded-lg flex flex-col items-center justify-center mt-6 p-10 text-center text-[#94a3b8]">
                <p>No image selected</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
