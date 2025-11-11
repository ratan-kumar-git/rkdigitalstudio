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
import { Trash2 } from "lucide-react";

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
  /* ✏️ HANDLE TEXT INPUT                                                      */
  /* -------------------------------------------------------------------------- */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  /* -------------------------------------------------------------------------- */
  /* 🟡 UPLOAD COVER IMAGE (ImageKit + DB SAVE)                                */
  /* -------------------------------------------------------------------------- */
  const handleImageUpload = async () => {
    const fileInput = fileInputRef.current;
    if (!fileInput?.files?.length)
      return toast.error("Please select an image");

    const file = fileInput.files[0];
    if (!file.type.startsWith("image/"))
      return toast.error("Only image files are allowed!");
    if (file.size > 5 * 1024 * 1024)
      return toast.error("Image must be smaller than 5 MB!");

    const abortController = new AbortController();
    setUploading(true);

    try {
      // 1️⃣ Authenticate ImageKit
      const auth = await authenticator();
      const { signature, expire, token, publicKey } = auth;

      // 2️⃣ Upload to ImageKit
      const res = await upload({
        expire,
        token,
        signature,
        publicKey,
        file,
        fileName: file.name,
        folder: "rkdigitalstudio/service-covers",
        onProgress: (e) => setUploadProgress((e.loaded / e.total) * 100),
        abortSignal: abortController.signal,
      });

      const imageUrl = res.url ?? "";
      const imageFileId = res.fileId ?? "";
      const thumbnailUrl = res.thumbnailUrl ?? "";

      // 3️⃣ Save to MongoDB immediately
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

      // 4️⃣ Update UI
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
  /* 🔴 DELETE COVER IMAGE (DB + ImageKit)                                     */
  /* -------------------------------------------------------------------------- */
  const handleRemoveImage = async () => {
    const { imageFileId } = form.coverImage;
    if (!imageFileId) return;

    setLoading(true);
    try {
      // 1️⃣ Clear image from MongoDB first
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

      // 2️⃣ Delete from ImageKit
      const res = await fetch("/api/imagekit/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileId: imageFileId }),
      });
      if (!res.ok) throw new Error("Failed to delete image from ImageKit");

      // 3️⃣ Update UI
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
  /* 💾 UPDATE TITLE + DESCRIPTION ONLY                                        */
  /* -------------------------------------------------------------------------- */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.title || !form.description)
      return toast.error("Title and description are required");

    setLoading(true);
    try {
      const res = await fetch(`/api/service-details/${id}/description`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update");

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
  /* 🖼️ UI                                                                     */
  /* -------------------------------------------------------------------------- */
  return (
    <div className="min-h-screen bg-[#f9fafb] py-10 flex flex-col">
      <div className="max-w-5xl mx-auto bg-white border border-amber-100 rounded-xl shadow-sm p-8">
        <h2 className="text-xl font-semibold text-[#1e293b] mb-6">
          Update Service Detail
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-[#475569] mb-2">
              Title
            </label>
            <Input
              name="title"
              placeholder="Enter title"
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
              placeholder="Enter description"
              value={form.description}
              onChange={handleChange}
              className="min-h-[130px]"
              disabled={loading}
            />
          </div>

          {/* Cover Image Upload */}
          <div>
            <label className="block text-sm font-medium text-[#475569] mb-2">
              Cover Image
            </label>

            <div className="space-y-3">
              <Input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                disabled={uploading || !!form.coverImage.imageUrl}
              />
              <Button
                type="button"
                onClick={handleImageUpload}
                disabled={uploading || loading}
                className="bg-linear-to-r from-amber-500 to-amber-600 text-white"
              >
                {uploading
                  ? `Uploading... ${uploadProgress.toFixed(0)}%`
                  : "Upload Image"}
              </Button>

              {uploadProgress > 0 && (
                <div className="w-full bg-amber-50 rounded-full h-2">
                  <div
                    className="bg-linear-to-r from-amber-500 to-amber-600 h-2 rounded-full transition-all"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              )}

              {form.coverImage.imageUrl ? (
                <div className="relative mt-4 group">
                  <Image
                    src={form.coverImage.imageUrl}
                    alt="Cover"
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
                <div className="border-2 border-dashed border-amber-200 rounded-lg flex flex-col items-center justify-center mt-4 p-10 text-center text-[#94a3b8]">
                  <p>No image selected</p>
                </div>
              )}
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-linear-to-r from-amber-500 to-amber-600 text-white font-semibold py-2.5 rounded-lg shadow-md transition-transform hover:scale-[1.02]"
          >
            {loading ? "Updating..." : "Update Service Detail"}
          </Button>
        </form>
      </div>
    </div>
  );
}
