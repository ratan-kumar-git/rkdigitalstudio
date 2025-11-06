'use client';

import Image from "next/image";
import { useState } from "react";
import { X } from "lucide-react";

const portfolioCategories = [
  {
    title: "Wedding Moments",
    images: [
      "/wedding1.jpg",
      "/wedding2.jpg",
      "/wedding3.jpg",
      "/wedding4.jpg",
    ],
  },
  {
    title: "Pre-Wedding Shoots",
    images: [
      "/wedding1.jpg",
      "/wedding2.jpg",
      "/wedding3.jpg",
      "/wedding4.jpg",
    ],
  },
  {
    title: "Cinematic Highlights",
    images: [
      "/wedding1.jpg",
      "/wedding2.jpg",
      "/wedding3.jpg",
      "/wedding4.jpg",
    ],
  },
  {
    title: "Drone Photography",
    images: [
      "/wedding1.jpg",
      "/wedding2.jpg",
      "/wedding3.jpg",
      "/wedding4.jpg",
    ],
  },
];

const videoSamples = [
  {
    title: "Cinematic Wedding Highlights",
    url: "https://www.youtube.com/embed/tHckmMuhVAs",
  },
  {
    title: "Pre-Wedding Teaser",
    url: "https://www.youtube.com/embed/tHckmMuhVAs",
  },
  {
    title: "Engagement Story Film",
    url: "https://www.youtube.com/embed/tHckmMuhVAs",
  },
];

export default function PortfolioPage() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  return (
    <main className="bg-[#fffefc] min-h-screen py-24">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-serif font-bold text-[#1e293b]">
            Our <span className="text-[#d97706]">Portfolio</span>
          </h1>
          <p className="text-[#64748b] mt-4 text-lg max-w-2xl mx-auto">
            Explore our creative work — from wedding photography to cinematic videography.
          </p>
        </div>

        {/* ---------- Photo Galleries ---------- */}
        {portfolioCategories.map((category, idx) => (
          <div key={idx} className="mb-20">
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-[#1e293b] mb-6 text-center">
              {category.title}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {category.images.map((src, i) => (
                <div
                  key={i}
                  className="relative group cursor-pointer overflow-hidden rounded-2xl shadow-md hover:shadow-xl transition-all duration-300"
                  onClick={() => setSelectedImage(src)}
                >
                  <Image
                    src={src}
                    alt={category.title}
                    width={600}
                    height={400}
                    className="object-cover w-full h-64 transform group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent group-hover:from-black/60 transition-all"></div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* ---------- Cinematic Videos Section ---------- */}
        <div className="mt-24">
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-[#1e293b] mb-8 text-center">
            Cinematic <span className="text-[#d97706]">Video Highlights</span>
          </h2>
          <p className="text-[#64748b] text-center mb-10 text-lg max-w-2xl mx-auto">
            Watch a few of our cinematic films and see how we capture stories that move hearts.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {videoSamples.map((video, index) => (
              <div
                key={index}
                className="rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 bg-white"
              >
                <div className="aspect-video w-full overflow-hidden">
                  <iframe
                    src={video.url}
                    title={video.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  ></iframe>
                </div>
                <div className="p-4">
                  <h3 className="text-[#1e293b] font-semibold text-lg font-serif">
                    {video.title}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ---------- Lightbox Modal for Images ---------- */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-6 right-6 text-white hover:text-[#fbbf24] transition-colors"
          >
            <X size={28} />
          </button>
          <div className="relative max-w-6xl w-full h-[80vh] rounded-lg overflow-hidden">
            <Image
              src={selectedImage}
              alt="Full view"
              fill
              className="object-contain"
            />
          </div>
        </div>
      )}
    </main>
  );
}
