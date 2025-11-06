'use client';

import Image from "next/image";
import { useState } from "react";
import { X } from "lucide-react";

// Example portfolio images — replace with your real photos
const gallery = [
  { src: "/wedding1.jpg", title: "Wedding Moments" },
  { src: "/wedding2.jpg", title: "Pre-Wedding Shoot" },
  { src: "/wedding3.jpg", title: "Birthday Event" },
  { src: "/wedding4.jpg", title: "Cinematic Highlight" },
  { src: "/wedding5.jpeg", title: "Candid Portrait" },
  { src: "/wedding1.jpg", title: "Drone Photography" },
];

export default function Portfolio() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  return (
    <section className="bg-[#fffefc] py-20" id="portfolio">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-14">
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-[#1e293b]">
            Our <span className="text-[#d97706]">Portfolio</span>
          </h2>
          <p className="text-[#64748b] mt-3 text-lg max-w-2xl mx-auto">
            A glimpse into the stories we’ve captured — where emotion meets art through the lens.
          </p>
        </div>

        {/* Image Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {gallery.map((item, index) => (
            <div
              key={index}
              className="relative group cursor-pointer overflow-hidden rounded-2xl shadow-md hover:shadow-xl transition-all duration-300"
              onClick={() => setSelectedImage(item.src)}
            >
              <Image
                src={item.src}
                alt={item.title}
                width={600}
                height={400}
                className="object-cover w-full h-72 transform group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent group-hover:from-black/60 transition-all"></div>
              <div className="absolute bottom-4 left-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <h3 className="text-lg font-semibold">{item.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-6 right-6 text-white hover:text-[#fbbf24] transition-colors"
          >
            <X size={28} />
          </button>
          <div className="relative max-w-5xl w-full h-[80vh] rounded-lg overflow-hidden">
            <Image
              src={selectedImage}
              alt="Portfolio full view"
              fill
              className="object-contain"
            />
          </div>
        </div>
      )}
    </section>
  );
}
