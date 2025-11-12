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
import { Trash2, UploadCloud } from "lucide-react";

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
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  /* -------------------------------------------------------------------------- */
  /* 🧾 HANDLE INPUT CHANGES                                                   */
  /* -------------------------------------------------------------------------- */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    if (name === "title") {
      const slug = value
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-")
        .replace(/[^\w-]/g, "");
      setForm((prev) => ({ ...prev, title: value, slug }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  /* -------------------------------------------------------------------------- */
  /* 🟡 IMAGE UPLOAD (ImageKit)                                                */
  /* -------------------------------------------------------------------------- */
  const handleImageUpload = async () => {
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
        folder: "rkdigitalstudio/serviceCardImage",
        onProgress: (e) => setUploadProgress((e.loaded / e.total) * 100),
        abortSignal: abortController.signal,
      });

      const imageUrl = res.url ?? "";
      const imageFileId = res.fileId ?? "";

      setForm((prev) => ({ ...prev, imageUrl, imageFileId }));
      setImagePreview(imageUrl || null);
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
  /* 🔴 REMOVE IMAGE                                                          */
  /* -------------------------------------------------------------------------- */
  const handleRemoveImage = async () => {
    if (!form.imageFileId) {
      setImagePreview(null);
      setForm((prev) => ({ ...prev, imageUrl: "", imageFileId: "" }));
      return;
    }

    try {
      const res = await fetch("/api/imagekit/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileId: form.imageFileId }),
      });

      if (!res.ok) throw new Error("Failed to delete image");

      setImagePreview(null);
      setForm((prev) => ({ ...prev, imageUrl: "", imageFileId: "" }));
      toast.success("Image removed successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Error deleting image");
    }
  };

  /* -------------------------------------------------------------------------- */
  /* 💾 SUBMIT SERVICE                                                        */
  /* -------------------------------------------------------------------------- */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.title.trim() || !form.description.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (!form.imageUrl || !form.imageFileId) {
      toast.error("Please upload a service image");
      return;
    }

    setLoading(true);
    try {
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
      if (!res2.ok) {
        toast.error(
          detailData.message || "Service created, but details not initialized"
        );
      } else {
        toast.success("Service and details created successfully!");
      }

      router.push("/admin/services");
    } catch (error) {
      console.error(error);
      toast.error("Failed to create service");
    } finally {
      setLoading(false);
    }
  };

  /* -------------------------------------------------------------------------- */
  /* 🎨 UI                                                                    */
  /* -------------------------------------------------------------------------- */
  return (
    <div className="bg-[#fafaf9] p-6 sm:py-10 sm:px-10">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10">
        {/* ─── Left Section: Form ─────────────────────────────── */}
        <div className="bg-white border border-amber-100 rounded-2xl shadow-sm p-8 space-y-6">
          <h2 className="text-xl font-semibold text-[#1e293b]">
            Service Information
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-[#475569] mb-2">
                Title <span className="text-red-500">*</span>
              </label>
              <Input
                name="title"
                placeholder="e.g., Wedding Photography"
                value={form.title}
                onChange={handleChange}
                disabled={loading}
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-[#475569] mb-2">
                Description <span className="text-red-500">*</span>
              </label>
              <Textarea
                name="description"
                placeholder="Briefly describe the service"
                value={form.description}
                onChange={handleChange}
                disabled={loading}
                className="min-h-[120px]"
              />
            </div>

            {/* Slug (auto-generated) */}
            <div>
              <label className="block text-sm font-medium text-[#475569] mb-2">
                Slug (auto-generated)
              </label>
              <Input value={form.slug} readOnly className="bg-gray-50" />
            </div>

            <Button
              type="submit"
              disabled={loading || uploading}
              className="w-full bg-linear-to-r from-amber-500 to-amber-600 text-white py-2.5 font-medium hover:scale-[1.02] transition-transform"
            >
              {loading ? "Saving..." : "Create Service"}
            </Button>
          </form>
        </div>

        {/* ─── Right Section: Image Upload ─────────────────────── */}
        <div className="bg-white border border-amber-100 rounded-2xl shadow-sm p-8">
          <h2 className="text-xl font-semibold text-[#1e293b] mb-6 flex items-center gap-2">
            <UploadCloud className="text-amber-600" /> Upload Image
          </h2>

          <Input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            disabled={uploading || loading || !!imagePreview}
          />
          <Button
            type="button"
            onClick={handleImageUpload}
            disabled={uploading || loading || !!imagePreview}
            className="mt-3 w-full bg-linear-to-r from-amber-500 to-amber-600 text-white hover:scale-[1.02] transition"
          >
            {uploading ? "Uploading..." : "Upload Image"}
          </Button>

          {/* Progress bar */}
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

          {/* Image preview */}
          {imagePreview ? (
            <div className="relative mt-6 group">
              <Image
                src={imagePreview}
                alt="Service Preview"
                width={400}
                height={300}
                className="rounded-lg border border-amber-100 shadow-sm object-cover w-full"
              />
              <button
                type="button"
                onClick={handleRemoveImage}
                disabled={loading}
                className="absolute top-3 right-3 bg-red-500 text-white hover:bg-red-600 rounded-full p-2 transition-all"
              >
                <Trash2 className="size-5" />
              </button>
            </div>
          ) : (
            <div className="border-2 border-dashed border-amber-200 rounded-lg flex flex-col items-center justify-center mt-6 p-10 text-center text-[#94a3b8]">
              <p>No image uploaded</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
