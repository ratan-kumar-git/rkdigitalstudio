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
import { Trash2, UploadCloud } from "lucide-react";

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

  /* -------------------------------------------------------------------------- */
  /* 🟢 FETCH SERVICE DATA                                                      */
  /* -------------------------------------------------------------------------- */
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

  /* -------------------------------------------------------------------------- */
  /* ✏️ HANDLE FORM INPUTS                                                     */
  /* -------------------------------------------------------------------------- */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "title"
        ? {
            slug: value
              .toLowerCase()
              .trim()
              .replace(/\s+/g, "-")
              .replace(/[^\w-]/g, ""),
          }
        : {}),
    }));
  };

  /* -------------------------------------------------------------------------- */
  /* 🟡 HANDLE IMAGE UPLOAD                                                    */
  /* -------------------------------------------------------------------------- */
  const handleImageUpload = async () => {
    const fileInput = fileInputRef.current;
    if (!fileInput?.files?.length) return toast.error("Please select an image");

    const file = fileInput.files[0];
    if (!file.type.startsWith("image/"))
      return toast.error("Only image files are allowed!");
    if (file.size > 5 * 1024 * 1024)
      return toast.error("Image must be smaller than 5 MB!");

    setLoading(true);
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

      const dbRes = await fetch(`/api/service/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, imageUrl, imageFileId }),
      });

      const dbData = await dbRes.json();
      if (!dbRes.ok) throw new Error(dbData.message);

      setForm((prev) => ({ ...prev, imageUrl, imageFileId }));
      setImagePreview(imageUrl);
      toast.success("Image uploaded and saved successfully!");
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
      setLoading(false);
      setUploadProgress(0);
    }
  };

  /* -------------------------------------------------------------------------- */
  /* 🔴 HANDLE IMAGE DELETE                                                    */
  /* -------------------------------------------------------------------------- */
  const handleRemoveImage = async () => {
    if (!form.imageFileId) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/service/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          imageUrl: "",
          imageFileId: "",
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      const res2 = await fetch("/api/imagekit/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileId: form.imageFileId }),
      });
      if (!res2.ok) throw new Error("Failed to delete from ImageKit");

      setImagePreview(null);
      setForm((prev) => ({ ...prev, imageUrl: "", imageFileId: "" }));
      toast.success("Image deleted successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Error deleting image");
    } finally {
      setLoading(false);
    }
  };

  /* -------------------------------------------------------------------------- */
  /* 💾 UPDATE SERVICE DETAILS                                                 */
  /* -------------------------------------------------------------------------- */
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return toast.error("Please enter a title!");
    if (!form.description.trim())
      return toast.error("Please enter a description!");
    if (!form.imageUrl)
      return toast.error("Please upload an image before saving!");
    if (!id) return toast.error("Invalid service id");

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

  /* -------------------------------------------------------------------------- */
  /* 🎨 UI                                                                     */
  /* -------------------------------------------------------------------------- */
  if (fetching)
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#f9fafb]">
        <div className="text-lg text-[#64748b] animate-pulse">
          Loading service details...
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#f9fafb] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-10">
        {/* Left: Form Section */}
        <div className="bg-white border border-amber-100 rounded-2xl shadow-sm p-6 sm:p-10 space-y-6">
          <div className="text-center sm:text-left">
            <h2 className="text-2xl font-semibold text-[#1e293b]">
              Edit Service Information
            </h2>
            <p className="text-sm text-[#64748b] mt-1">
              Update your service title, description, and slug below.
            </p>
          </div>

          <form onSubmit={handleUpdate} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-[#475569] mb-2">
                Title <span className="text-red-500">*</span>
              </label>
              <Input
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Enter service title"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#475569] mb-2">
                Description <span className="text-red-500">*</span>
              </label>
              <Textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Describe the service"
                className="min-h-[130px]"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#475569] mb-2">
                Slug (auto-generated)
              </label>
              <Input
                value={form.slug}
                readOnly
                className="bg-gray-50 border-gray-200"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-linear-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-semibold py-2.5 rounded-lg shadow-md transition-transform hover:scale-[1.02]"
            >
              {loading ? "Updating..." : "Update Service"}
            </Button>
          </form>
        </div>

        {/* Right: Image Upload */}
        <div className="bg-white border border-amber-100 rounded-2xl shadow-sm p-6 sm:p-10 space-y-6">
          <h2 className="text-2xl font-semibold text-[#1e293b] flex items-center gap-2">
            <UploadCloud className="text-amber-600" /> Manage Image
          </h2>

          <Input type="file" accept="image/*" ref={fileInputRef} disabled={ loading || !!imagePreview} />

          <Button
            type="button"
            onClick={handleImageUpload}
            disabled={ loading || !!imagePreview}
            className="w-full bg-linear-to-r from-amber-500 to-amber-600 text-white hover:scale-[1.02] transition"
          >
            Upload Image
          </Button>

          {uploadProgress > 0 && (
            <div className="w-full bg-amber-50 rounded-full h-2 mt-3">
              <div
                className="bg-linear-to-r from-amber-500 to-amber-600 h-2 rounded-full transition-all"
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
