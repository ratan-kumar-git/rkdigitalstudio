"use client";

import Image from "next/image";
import { useState } from "react";

interface IImage {
  imageUrl?: string;
  imageFileId?: string;
  thumbnailUrl?: string;
}

interface GalleryProps {
  gallery: IImage[];
}

const ImgGallery: React.FC<GalleryProps> = ({ gallery }) => {
  const fallbackImage = "/coming-soon.jpg";

  // Filter valid images
  const validImages = gallery?.filter((item) => item.imageUrl) || [];

  return (
    <section className="bg-[#fffefc] py-12">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section Heading */}
        <h3 className="text-3xl md:text-4xl font-serif font-bold text-[#1e293b] mb-10 text-center">
          Our <span className="text-[#d97706]">Gallery</span>
        </h3>

        {/* Handle Empty Gallery */}
        {validImages.length === 0 ? (
          <div className="text-center text-gray-500 italic py-10">
            No images available in the gallery.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {validImages.map((item, index) => (
              <GalleryImage
                key={ item.imageFileId || index }
                src={ item.imageUrl || fallbackImage }
                index={index}
                fallbackImage={fallbackImage}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ImgGallery;

/* ──────────────────────────────── */
/* 🔧 Sub-component for each image  */
/* ──────────────────────────────── */

interface GalleryImageProps {
  src: string;
  index: number;
  fallbackImage: string;
}

const GalleryImage: React.FC<GalleryImageProps> = ({
  src,
  index,
  fallbackImage,
}) => {
  const [imgSrc, setImgSrc] = useState(src);

  return (
    <div className="relative w-full h-64 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group">
      <Image
        src={imgSrc}
        alt={`Gallery Image ${index + 1}`}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        className="object-cover hover:scale-110 transition-transform duration-500"
        placeholder="blur"
        blurDataURL={`${imgSrc}?tr=w-20,h-20,bl-10,q=20`}
        onError={() => setImgSrc(fallbackImage)} 
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent"></div>
    </div>
  );
};
