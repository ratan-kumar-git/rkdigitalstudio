"use client";

import { useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
import { toast } from "react-hot-toast";
import {
  ImageKitAbortError,
  ImageKitInvalidRequestError,
  ImageKitServerError,
  ImageKitUploadNetworkError,
  upload,
} from "@imagekit/next";
import { authenticator } from "@/lib/imageClintAuth";

export default function AddServicePage() {
  const [form, setForm] = useState({
    slug: "",
    title: "",
    description: "",
    imageUrl: "",
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  /** ─── Handle Form Field Changes ───────────────────────────── */
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

  /** ─── Handle Image Upload to ImageKit ─────────────────────── */
  const handleImageUpload = async () => {
    const fileInput = fileInputRef.current;
    if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
      toast.error("Please select an image to upload");
      return;
    }

    const file = fileInput.files[0];
    const abortController = new AbortController();

    // Get ImageKit Auth
    let authParams;
    try {
      authParams = await authenticator();
    } catch (authError) {
      toast.error("Authentication failed for ImageKit");
      console.error("Auth error:", authError);
      return;
    }

    const { signature, expire, token, publicKey } = authParams;

    try {
      const uploadResponse = await upload({
        expire,
        token,
        signature,
        publicKey,
        file,
        fileName: file.name,
        folder: "rkdigitalstudio",
        onProgress: (event) => {
          setUploadProgress((event.loaded / event.total) * 100);
        },
        abortSignal: abortController.signal,
      });

      const imageUrl = uploadResponse.url || "";
      setForm((prev) => ({ ...prev, imageUrl }));
      setImagePreview(imageUrl);

      toast.success("Image uploaded successfully!");
    } catch (error) {
      console.error("Upload error:", error);
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

  /** ─── Handle Form Submission ──────────────────────────────── */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!form.title.trim()) {
      toast.error("Please enter a service title");
      return;
    }
    if (!form.description.trim()) {
      toast.error("Please enter a service description");
      return;
    }
    if (!form.imageUrl) {
      toast.error("Please upload an image before saving");
      return;
    }

    setLoading(true);

    try {
      console.log(form);
      const res = await fetch("/api/service", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      console.log(res);
      
      if (res.ok) {
        toast.success("🎉 Service saved successfully!");
        setForm({ slug: "", title: "", description: "", imageUrl: "" });
        setImagePreview(null);
        setUploadProgress(0);
        if (fileInputRef.current) fileInputRef.current.value = "";
      } else {
        toast.error("Failed to save service.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong while saving!");
    } finally {
      setLoading(false);
    }
  };

  /** ─── UI Layout ───────────────────────────────────────────── */
  return (
    <div className="bg-[#f9fafb] flex items-center justify-center px-6 py-16">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-lg space-y-5 border border-gray-100"
      >
        <h1 className="text-2xl font-semibold text-gray-800 text-center">
          Add New Service
        </h1>

        {/* Title */}
        <Input
          name="title"
          placeholder="Service Title"
          value={form.title}
          onChange={handleChange}
          required
        />

        {/* Description */}
        <Textarea
          name="description"
          placeholder="Service Description"
          value={form.description}
          onChange={handleChange}
          required
        />

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700">
            Upload Image
          </label>
          <Input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleImageUpload}
          />

          {uploadProgress > 0 && (
            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-3">
              <div
                className="bg-blue-500 h-2.5 rounded-full transition-all"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          )}

          {imagePreview && (
            <div className="mt-4">
              <Image
                src={imagePreview}
                alt="Preview"
                width={400}
                height={300}
                className="rounded-lg shadow-sm border"
              />
            </div>
          )}
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full"
          disabled={loading}
        >
          {loading ? "Saving..." : "Save Service"}
        </Button>
      </form>
    </div>
  );
}
