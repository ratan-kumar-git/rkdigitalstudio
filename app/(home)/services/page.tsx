'use client';

import Link from "next/link";
import Image from "next/image";
import { Camera, Video, Drone, Image as ImageIcon, Users, Heart } from "lucide-react";

const services = [
  {
    slug: "wedding-photography",
    title: "Wedding Photography",
    desc: "Capturing beautiful memories of your wedding day with artistic detail and emotion.",
    icon: Camera,
    image: "/wedding1.jpg",
  },
  {
    slug: "cinematic-videography",
    title: "Cinematic Videography",
    desc: "Telling your story through cinematic videos that feel like films — elegant and emotional.",
    icon: Video,
    image: "/wedding2.jpg",
  },
  {
    slug: "drone-shoots",
    title: "Drone Shoots",
    desc: "Take your visuals to new heights with stunning aerial shots for your wedding or event.",
    icon: Drone,
    image: "/wedding3.jpg",
  },
  {
    slug: "candid-photography",
    title: "Candid Photography",
    desc: "Natural, unscripted shots that bring out true emotions and joyful moments.",
    icon: ImageIcon,
    image: "/wedding4.jpg",
  },
  {
    slug: "pre-wedding",
    title: "Pre-Wedding Shoots",
    desc: "Cinematic and creative sessions that capture your chemistry before the big day.",
    icon: Heart,
    image: "/wedding1.jpg",
  },
  {
    slug: "event-coverage",
    title: "Event Coverage",
    desc: "From birthdays to corporate events — we cover every angle with precision and creativity.",
    icon: Users,
    image: "/wedding2.jpg",
  },
];

export default function ServicesPage() {
  return (
    <main className="bg-[#fffefc] min-h-screen py-24">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-serif font-bold text-[#1e293b]">
            Our <span className="text-[#d97706]">Services</span>
          </h1>
          <p className="text-[#64748b] mt-4 text-lg max-w-2xl mx-auto">
            We provide a complete range of photography and videography services, from traditional to cinematic, designed to make your story unforgettable.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <div
                key={index}
                className="group bg-white border border-gray-100 rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden"
              >
                {/* Optional Image */}
                {service.image && (
                  <div className="relative w-full h-48">
                    <Image
                      src={service.image}
                      alt={service.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent"></div>
                  </div>
                )}

                {/* Content */}
                <div className="p-6">
                  <div className="w-12 h-12 flex items-center justify-center rounded-full bg-[#fff7ed] mb-4 group-hover:bg-[#fef3c7] transition-colors">
                    <Icon className="w-6 h-6 text-[#d97706]" />
                  </div>
                  <h3 className="text-xl font-serif font-semibold text-[#1e293b] mb-2">
                    {service.title}
                  </h3>
                  <p className="text-[#64748b] text-sm leading-relaxed mb-4">
                    {service.desc}
                  </p>

                  <Link
                    href={`/services/${service.slug}`}
                    className="inline-block px-5 py-2 rounded-full bg-linear-to-r from-[#f59e0b] to-[#d97706] text-white font-semibold text-sm shadow-md hover:from-[#fbbf24] hover:to-[#f59e0b] transition-transform hover:scale-[1.05]"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
