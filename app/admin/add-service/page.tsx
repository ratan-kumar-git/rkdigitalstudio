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

interface IService {
  slug: string;
  title: string;
  description: string;
  imageUrl: string;
  imageFileId: string;
}

export default function AddServicePage() {
  const router = useRouter();
  const [form, setForm] = useState<IService>({
    slug: "",
    title: "",
    description: "",
    imageUrl: "",
    imageFileId: "",
  });
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFileId, setImageFileId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    if (name === "title") {
      const newSlug = value
        .toLowerCase()
        .trim()
        .replace(/ /g, "-")
        .replace(/[^\w-]+/g, "");
      setForm((prev) => ({ ...prev, slug: newSlug }));
    }
  };

  const handleImageUpload = async () => {
    const fileInput = fileInputRef.current;
    if (!fileInput?.files?.length)
      return toast.error("Please select an image");
    const file = fileInput.files[0];
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
      const imageFileId = res.fileId ?? "";
      setForm((prev) => ({ ...prev, imageUrl, imageFileId }));
      setImagePreview(imageUrl || null);
      setImageFileId(imageFileId || null);
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
      setForm((prev) => ({ ...prev, imageUrl: "" }));
      toast.success("Image removed");
    } catch (err) {
      console.error(err);
      toast.error("Error deleting image");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title) return toast.error("Please enter a service title!");
    if (!form.description) return toast.error("Please enter a service description!");
    if (!form.imageUrl) return toast.error("Please upload an image before saving!");
    if (!form.imageFileId) return toast.error("Image upload incomplete!");

    setLoading(true);
    try {
      const res = await fetch("/api/service", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      toast.success("Service created successfully!");
      router.push(`/admin/service-details/${data.data._id}`);
    } catch (error) {
      console.error(error);
      toast.error("Failed to save service");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f9fafb] py-10 flex flex-col">
      <div className="flex-1 p-8">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
          {/* Form Section */}
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
                  className="min-h-[130px]"
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-linear-to-r from-[#f59e0b] to-[#d97706] hover:from-[#fbbf24] hover:to-[#f59e0b] text-white font-semibold py-2.5 rounded-lg shadow-md transition-transform hover:scale-[1.02]"
              >
                {loading ? "Saving..." : "Create Service"}
              </Button>
            </form>
          </div>

          {/* Image Upload Section */}
          <div className="bg-white border border-amber-100 rounded-xl shadow-sm p-8">
            <h2 className="text-lg font-semibold text-[#1e293b] mb-6">
              Upload Image
            </h2>

            <Input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleImageUpload}
            />

            {/* Progress */}
            {uploadProgress > 0 && (
              <div className="w-full bg-amber-50 rounded-full h-2 mt-3">
                <div
                  className="bg-linear-to-r from-[#f59e0b] to-[#d97706] h-2 rounded-full transition-all"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
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
                  className="absolute top-3 right-3 bg-white/80 text-[#1e293b] hover:bg-red-500 hover:text-white rounded-full px-2 py-1 shadow-sm transition-all"
                >
                  ✕
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
