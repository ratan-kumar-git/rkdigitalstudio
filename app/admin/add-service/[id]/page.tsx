"use client";

import { useRef, useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
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
  _id?: string;
  slug: string;
  title: string;
  description: string;
  imageUrl: string;
  imageFileId: string;
}

export default function EditServicePage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

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
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    const fetchService = async () => {
      try {
        const res = await fetch(`/api/service/${id}`);
        if (!res.ok) throw new Error("Failed to fetch service");
        const data = await res.json();
        setForm(data.service);
        setImagePreview(data.service.imageUrl);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load service details");
      } finally {
        setFetching(false);
      }
    };
    if (id) fetchService();
  }, [id]);

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
      toast.success("Image removed");
    } catch (err) {
      console.error(err);
      toast.error("Error deleting image");
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title) return toast.error("Please enter a service title!");
    if (!form.description) return toast.error("Please enter a service description!");
    if (!form.imageUrl) return toast.error("Please upload an image before saving!");
    if (!id) return toast.error("Invalid service id")

    setLoading(true);
    try {
      const res = await fetch(`/api/service/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      toast.success("Service updated successfully!");
      router.push("/admin/services");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update service");
    } finally {
      setLoading(false);
    }
  };

  if (fetching)
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-600">
        Loading service details...
      </div>
    );

  return (
    <div className="min-h-screen bg-[#f9fafb] py-10 flex flex-col">
      <div className="flex-1 p-8">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
          {/* Left Section: Form */}
          <div className="bg-white border border-amber-100 rounded-xl shadow-sm p-8">
            <h2 className="text-lg font-semibold text-[#1e293b] mb-6">
              Edit Service Information
            </h2>

            <form onSubmit={handleUpdate} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-[#475569] mb-2">
                  Title
                </label>
                <Input
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="Enter service title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#475569] mb-2">
                  Description
                </label>
                <Textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Describe the service"
                  className="min-h-[130px]"
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-linear-to-r from-[#f59e0b] to-[#d97706] hover:from-[#fbbf24] hover:to-[#f59e0b] text-white font-semibold py-2.5 rounded-lg shadow-md transition-transform hover:scale-[1.02]"
              >
                {loading ? "Updating..." : "Update Service"}
              </Button>
            </form>
          </div>

          {/* Right Section: Image Upload */}
          <div className="bg-white border border-amber-100 rounded-xl shadow-sm p-8">
            <h2 className="text-lg font-semibold text-[#1e293b] mb-6">
              Upload / Replace Image
            </h2>

            <Input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleImageUpload}
              disabled={form.imageFileId ? true : false}
            />

            {uploadProgress > 0 && (
              <div className="w-full bg-amber-50 rounded-full h-2 mt-3">
                <div
                  className="bg-linear-to-r from-[#f59e0b] to-[#d97706] h-2 rounded-full transition-all"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            )}

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
