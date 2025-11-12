"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import { Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

export default function ServiceVideoManager() {
  const { id } = useParams();
  const [videos, setVideos] = useState<string[]>([]);
  const [title, setTitle] = useState("");
  const [newVideoUrl, setNewVideoUrl] = useState("");
  const [loading, setLoading] = useState(false);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVideoUrl, setSelectedVideoUrl] = useState<string | null>(null);

  /* -------------------------------------------------------------------------- */
  /* 🟢 FETCH SERVICE DETAIL (GET VIDEOS)                                      */
  /* -------------------------------------------------------------------------- */
  useEffect(() => {
    const fetchServiceDetail = async () => {
      try {
        const res = await fetch(`/api/service-details/${id}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);

        setTitle(data.data.title);
        setVideos(data.data.videoSamples || []);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load service videos");
      }
    };

    if (id) fetchServiceDetail();
  }, [id]);

  /* -------------------------------------------------------------------------- */
  /* 🟡 ADD VIDEO                                                              */
  /* -------------------------------------------------------------------------- */
  const handleAddVideo = async () => {
    if (!newVideoUrl.trim()) return toast.error("Enter a valid video URL");

    setLoading(true);
    try {
      const res = await fetch(`/api/service-details/${id}/video`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ videoUrl: newVideoUrl.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setVideos(data.data.videoSamples);
      setNewVideoUrl("");
      toast.success("Video added successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to add video");
    } finally {
      setLoading(false);
    }
  };

  /* -------------------------------------------------------------------------- */
  /* 🔴 DELETE VIDEO (With Modal Confirmation)                                 */
  /* -------------------------------------------------------------------------- */
  const handleConfirmDelete = (videoUrl: string) => {
    setSelectedVideoUrl(videoUrl);
    setIsModalOpen(true);
  };

  const handleDeleteVideo = async () => {
    if (!selectedVideoUrl) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/service-details/${id}/video`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ videoUrl: selectedVideoUrl }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setVideos(data.data.videoSamples);
      toast.success("Video deleted successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete video");
    } finally {
      setLoading(false);
      setIsModalOpen(false);
      setSelectedVideoUrl(null);
    }
  };

  /* -------------------------------------------------------------------------- */
  /* 🖼️ UI                                                                    */
  /* -------------------------------------------------------------------------- */
  return (
    <div className="min-h-screen bg-[#f9fafb] py-10 flex flex-col">
      <div className="max-w-5xl mx-auto bg-white border border-amber-100 rounded-xl shadow-sm p-8">
        <h2 className="text-xl font-semibold text-[#1e293b] mb-6">
          Manage Videos for:{" "}
          <span className="text-amber-600">{title || "..."}</span>
        </h2>

        {/* Add Video */}
        <div className="flex gap-4 mb-6">
          <Input
            type="url"
            placeholder="Enter YouTube videoId only!"
            value={newVideoUrl}
            onChange={(e) => setNewVideoUrl(e.target.value)}
          />
          <Button
            onClick={handleAddVideo}
            disabled={loading}
            className="bg-linear-to-r from-amber-500 to-amber-600 text-white"
          >
            {loading ? "Adding..." : "Add Video"}
          </Button>
        </div>

        {/* Video List */}
        {videos.length === 0 ? (
          <p className="text-center text-[#94a3b8]">No videos added yet</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((videoId, idx) => (
              <div
                key={idx}
                className="border border-amber-100 rounded-lg overflow-hidden shadow-sm relative group"
              >
                {/* YouTube Embed */}
                <div className="aspect-w-16 aspect-h-9">
                  <iframe
                    src={`https://www.youtube.com/embed/${videoId}`}
                    title={`YouTube Video ${idx + 1}`}
                    className="w-auto h-48"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>

                {/* Delete Button */}
                <button
                  onClick={() => handleConfirmDelete(videoId)}
                  disabled={loading}
                  className="absolute top-3 right-3 bg-red-500 text-white hover:bg-red-600 rounded-full p-2 opacity-0 group-hover:opacity-100 transition-all"
                >
                  <Trash2 className="size-5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 🧩 Delete Confirmation Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-[#1e293b]">
              Confirm Video Deletion
            </DialogTitle>
          </DialogHeader>

          <p className="text-sm text-[#475569]">
            Are you sure you want to delete this video? This action cannot be
            undone.
          </p>

          <DialogFooter className="mt-6 flex justify-end space-x-3">
            <Button
              variant="outline"
              onClick={() => {
                setIsModalOpen(false);
                setSelectedVideoUrl(null);
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeleteVideo}
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
