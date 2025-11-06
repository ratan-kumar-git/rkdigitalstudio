'use client';

import { Camera, Video, Drone, Image as ImageIcon, Users, Heart } from "lucide-react";

const services = [
  {
    icon: Camera,
    title: "Wedding Photography",
    desc: "Candid and traditional photography capturing your special day with artistic detail.",
  },
  {
    icon: Video,
    title: "Cinematic Videography",
    desc: "Experience high-end storytelling through cinematic wedding and event films.",
  },
  {
    icon: Drone,
    title: "Drone Shoots",
    desc: "Aerial shots that bring breathtaking perspectives to your memories and events.",
  },
  {
    icon: ImageIcon,
    title: "Photo Albums & Frames",
    desc: "Premium albums and designer frames to showcase your memories beautifully.",
  },
  {
    icon: Users,
    title: "Event Coverage",
    desc: "From birthdays to corporate events — full coverage by our creative team.",
  },
  {
    icon: Heart,
    title: "Pre & Post Wedding",
    desc: "Romantic cinematic sessions that tell your love story in timeless frames.",
  },
];

export default function Services() {
  return (
    <section className="bg-[#fffefc] py-20" id="services">
      <div className="max-w-7xl mx-auto px-6">
        {/* Heading */}
        <div className="text-center mb-14">
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-[#1e293b]">
            Our <span className="text-[#d97706]">Services</span>
          </h2>
          <p className="text-[#64748b] mt-3 text-lg max-w-2xl mx-auto">
            From candid photography to cinematic videography — we capture every moment with precision and passion.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <div
                key={service.title}
                className="group bg-white rounded-2xl p-8 shadow-md hover:shadow-xl border border-gray-100 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex items-center justify-center w-14 h-14 rounded-full bg-[#fff7ed] mb-6 group-hover:bg-[#fef3c7] transition-colors">
                  <Icon className="w-7 h-7 text-[#d97706]" />
                </div>
                <h3 className="text-xl font-semibold text-[#1e293b] mb-3 font-serif">
                  {service.title}
                </h3>
                <p className="text-[#64748b] leading-relaxed text-sm">
                  {service.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
