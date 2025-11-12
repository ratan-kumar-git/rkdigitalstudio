"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
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
import { Trash2, UploadCloud, FileText } from "lucide-react";

interface CoverImage {
  imageUrl: string;
  imageFileId: string;
  thumbnailUrl?: string;
}

interface ServiceDetailForm {
  title: string;
  description: string;
  coverImage: CoverImage;
}

export default function EditServiceDescription() {
  const { id } = useParams();
  const router = useRouter();

  const [form, setForm] = useState<ServiceDetailForm>({
    title: "",
    description: "",
    coverImage: { imageUrl: "", imageFileId: "", thumbnailUrl: "" },
  });

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  /* -------------------------------------------------------------------------- */
  /* 🟢 FETCH SERVICE DETAIL DATA                                               */
  /* -------------------------------------------------------------------------- */
  useEffect(() => {
    if (!id) return;
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/service-details/${id}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to load data");

        setForm({
          title: data.data.title || "",
          description: data.data.description || "",
          coverImage: data.data.coverImage || {
            imageUrl: "",
            imageFileId: "",
            thumbnailUrl: "",
          },
        });
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch service detail");
      }
    };
    fetchData();
  }, [id]);

  /* -------------------------------------------------------------------------- */
  /* ✏️ HANDLE INPUT CHANGES                                                  */
  /* -------------------------------------------------------------------------- */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  /* -------------------------------------------------------------------------- */
  /* 🟡 UPLOAD COVER IMAGE                                                     */
  /* -------------------------------------------------------------------------- */
  const handleImageUpload = async () => {
    const fileInput = fileInputRef.current;
    if (!fileInput?.files?.length) return toast.error("Please select an image");

    const file = fileInput.files[0];
    if (!file.type.startsWith("image/"))
      return toast.error("Only image files are allowed!");
    if (file.size > 5 * 1024 * 1024)
      return toast.error("Image must be smaller than 5 MB!");

    const abortController = new AbortController();
    setUploading(true);

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
        folder: "rkdigitalstudio/service-details-covers",
        onProgress: (e) => setUploadProgress((e.loaded / e.total) * 100),
        abortSignal: abortController.signal,
      });

      const imageUrl = res.url ?? "";
      const imageFileId = res.fileId ?? "";
      const thumbnailUrl = res.thumbnailUrl ?? "";

      const dbRes = await fetch(`/api/service-details/${id}/description`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          coverImage: { imageUrl, imageFileId, thumbnailUrl },
        }),
      });

      const dbData = await dbRes.json();
      if (!dbRes.ok) throw new Error(dbData.message);

      setForm((prev) => ({
        ...prev,
        coverImage: { imageUrl, imageFileId, thumbnailUrl },
      }));

      toast.success("Image uploaded and saved successfully!");
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
  /* 🔴 DELETE COVER IMAGE                                                    */
  /* -------------------------------------------------------------------------- */
  const handleRemoveImage = async () => {
    const { imageFileId } = form.coverImage;
    if (!imageFileId) return;

    setLoading(true);
    try {
      const dbRes = await fetch(`/api/service-details/${id}/description`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          coverImage: { imageUrl: "", imageFileId: "", thumbnailUrl: "" },
        }),
      });

      const dbData = await dbRes.json();
      if (!dbRes.ok) throw new Error(dbData.message);

      await fetch("/api/imagekit/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileId: imageFileId }),
      });

      setForm((prev) => ({
        ...prev,
        coverImage: { imageUrl: "", imageFileId: "", thumbnailUrl: "" },
      }));

      toast.success("Image deleted successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Error deleting image");
    } finally {
      setLoading(false);
    }
  };

  /* -------------------------------------------------------------------------- */
  /* 💾 UPDATE TITLE & DESCRIPTION                                            */
  /* -------------------------------------------------------------------------- */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.description.trim())
      return toast.error("Title and description are required");

    setLoading(true);
    try {
      const res = await fetch(`/api/service-details/${id}/description`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Update failed");

      toast.success("Service detail updated successfully!");
      router.push(`/admin/service-details/${id}/description`);
    } catch (err) {
      console.error(err);
      toast.error("Update failed");
    } finally {
      setLoading(false);
    }
  };

  /* -------------------------------------------------------------------------- */
  /* 🎨 UI SECTION                                                            */
  /* -------------------------------------------------------------------------- */
  return (
    <div className="min-h-screen bg-[#fafaf9] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto bg-white border border-amber-100 rounded-2xl shadow-sm p-8 sm:p-10">
        <h2 className="text-2xl sm:text-3xl font-semibold text-[#1e293b] mb-8 flex items-center gap-2">
          <FileText className="text-amber-600 sm:size-8" /> Edit Service Detail
        </h2>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Title */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-[#475569]">
              Service Title <span className="text-red-500">*</span>
            </label>
            <Input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="e.g., Wedding Photography"
              disabled={loading}
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-[#475569]">
              Service Description <span className="text-red-500">*</span>
            </label>
            <Textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              className="min-h-[140px]"
              placeholder="Describe the service..."
              disabled={loading}
            />
          </div>

          {/* Cover Image */}
          <div className="border border-amber-100 bg-amber-50/50 p-6 rounded-xl space-y-4">
            <label className="block text-sm font-medium text-[#475569] mb-1">
              Cover Image
            </label>

            {!form.coverImage.imageUrl && (
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                <Input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  disabled={uploading}
                />
                <Button
                  type="button"
                  onClick={handleImageUpload}
                  disabled={uploading}
                  className="bg-linear-to-r from-amber-500 to-amber-600 text-white hover:scale-[1.02] transition-transform"
                >
                  {uploading ? (
                    <>Uploading {uploadProgress.toFixed(0)}%</>
                  ) : (
                    <>
                      <UploadCloud className="mr-2 size-4" /> Upload Image
                    </>
                  )}
                </Button>
              </div>
            )}

            {uploading && (
              <div className="w-full bg-amber-100 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-linear-to-r from-amber-500 to-amber-600 h-2 transition-all"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            )}

            {form.coverImage.imageUrl && (
              <div className="relative rounded-xl overflow-hidden shadow-sm border border-amber-100 group">
                <Image
                  src={form.coverImage.imageUrl}
                  alt="Cover"
                  width={800}
                  height={400}
                  className="object-cover w-full h-56 sm:h-72"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  disabled={loading}
                  className="absolute top-3 right-3 bg-red-500 text-white hover:bg-red-600 rounded-full p-2 opacity-0 group-hover:opacity-100 transition-all"
                >
                  <Trash2 className="size-5" />
                </button>
              </div>
            )}
          </div>

          {/* Submit */}
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-linear-to-r from-amber-500 to-amber-600 text-white py-3 rounded-lg font-semibold hover:from-amber-600 hover:to-amber-700 transition-transform hover:scale-[1.01]"
          >
            {loading ? "Updating..." : "Save Changes"}
          </Button>
        </form>
      </div>
    </div>
  );
}
