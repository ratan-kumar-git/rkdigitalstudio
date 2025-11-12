"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import { Trash2, Video } from "lucide-react";
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

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVideoUrl, setSelectedVideoUrl] = useState<string | null>(null);

  /* -------------------------------------------------------------------------- */
  /* 🟢 FETCH SERVICE DETAIL                                                   */
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
    if (!newVideoUrl.trim())
      return toast.error("Enter a valid YouTube Video ID");

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
  /* 🔴 DELETE VIDEO                                                          */
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
  /* 🎨 UI SECTION                                                            */
  /* -------------------------------------------------------------------------- */
  return (
    <div className="min-h-screen bg-[#fafaf9] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto bg-white border border-amber-100 rounded-2xl shadow-sm p-6 sm:p-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-3">
          <div>
            <h2 className="text-2xl sm:text-3xl font-semibold text-[#1e293b] flex items-center gap-2">
              <Video className="text-amber-600 sm:size-8" /> Manage Videos
            </h2>
            <p className="text-[#64748b] text-sm sm:text-base">
              Service:{" "}
              <span className="font-medium text-amber-600">
                {title || "loading ..."}
              </span>
            </p>
          </div>
        </div>

        {/* Add Video Input */}
        <div className="bg-amber-50 border border-amber-100 rounded-lg p-5 sm:p-6 mb-10">
          <h3 className="text-lg font-medium text-[#1e293b] mb-3">
            Add a New Video
          </h3>
          <div className="flex flex-col sm:flex-row gap-3">
            <Input
              type="text"
              placeholder="Enter YouTube Video ID (e.g., dQw4w9WgXcQ)"
              value={newVideoUrl}
              onChange={(e) => setNewVideoUrl(e.target.value)}
              className="flex-1"
            />
            <Button
              onClick={handleAddVideo}
              disabled={loading}
              className="bg-linear-to-r from-amber-500 to-amber-600 text-white hover:scale-[1.02] transition-transform"
            >
              {loading ? "Adding..." : "Add Video"}
            </Button>
          </div>
          <p className="text-xs text-[#94a3b8] mt-2">
            Only paste the video ID, not the full YouTube URL.
          </p>
        </div>

        {/* Video Grid */}
        {videos.length === 0 ? (
          <div className="text-center text-[#94a3b8] italic py-12">
            No videos added yet. Start by adding one above.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {videos.map((videoId, idx) => (
              <div
                key={idx}
                className="relative group rounded-xl overflow-hidden border border-amber-100 shadow-sm hover:shadow-md transition-all bg-white"
              >
                {/* Video Frame */}
                <iframe
                  src={`https://www.youtube.com/embed/${videoId}`}
                  title={`YouTube Video ${idx + 1}`}
                  className="w-full h-46"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>

                {/* Delete Button */}
                <button
                  onClick={() => handleConfirmDelete(videoId)}
                  disabled={loading}
                  className="absolute top-3 right-3 bg-red-500 text-white hover:bg-red-600 rounded-full p-2 opacity-0 group-hover:opacity-100 transition-all shadow-sm"
                  aria-label="Delete Video"
                >
                  <Trash2 className="size-5" />
                </button>

                {/* Footer Info */}
                <div className="p-3 border-t border-amber-100 bg-amber-50/60 text-xs text-[#475569]">
                  Video ID:{" "}
                  <span className="font-medium text-[#1e293b]">{videoId}</span>
                </div>
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
