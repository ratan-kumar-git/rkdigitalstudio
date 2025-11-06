import Image from "next/image";

interface GalleryProps {
  title?: string;
  subtitle?: string;
  images: string[];
}

const Gallery: React.FC<GalleryProps> = ({ title, subtitle, images }) => {
  return (
    <section className="bg-[#fffefc]">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section Heading */}
        <h3 className="text-3xl font-serif font-bold text-[#1e293b] mb-10 text-center">
          {title} <span className="text-[#d97706]">{subtitle}</span>
        </h3>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.map((src, index) => (
            <div
              key={index}
              className="relative w-full h-64 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
            >
              <Image
                src={src}
                alt={`Gallery Image ${index + 1}`}
                fill
                className="object-cover hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Gallery;
