'use client';

import Image from "next/image";
import { Camera, Film, Heart } from "lucide-react";

export default function About() {
  return (
    <section className="bg-[#fffefc] py-20" id="about">
      <div className="max-w-7xl mx-auto px-6 flex flex-col-reverse lg:flex-row items-center gap-12">
        
        {/* Left — Text Section */}
        <div className="flex-1">
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-[#1e293b] mb-6">
            About <span className="text-[#d97706]">RK Digital Studio</span>
          </h2>
          <p className="text-[#64748b] text-lg leading-relaxed mb-5">
            RK Digital Studio is a professional photography and videography team dedicated to capturing your life’s most precious moments in the most cinematic and creative way possible. 
          </p>
          <p className="text-[#64748b] text-lg leading-relaxed mb-8">
            With over <span className="text-[#d97706] font-semibold">10 years of experience</span> in wedding, pre-wedding, and event cinematography, we combine modern technology with artistic storytelling to turn your memories into timeless visuals.
          </p>

          {/* Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
            <div className="flex flex-col items-center text-center">
              <Camera className="text-[#d97706] w-8 h-8 mb-2" />
              <p className="text-[#1e293b] font-semibold">Creative Photography</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <Film className="text-[#d97706] w-8 h-8 mb-2" />
              <p className="text-[#1e293b] font-semibold">Cinematic Films</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <Heart className="text-[#d97706] w-8 h-8 mb-2" />
              <p className="text-[#1e293b] font-semibold">Client Satisfaction</p>
            </div>
          </div>

          <p className="text-[#334155] text-base max-w-xl">
            Our passion lies in telling stories that reflect emotion, light, and life — every shot we take is crafted with care, love, and technical mastery. Whether it’s your wedding, pre-wedding, or any special occasion, we ensure your story is told beautifully.
          </p>
        </div>

        {/* Right — Image Section */}
        <div className="flex-1 relative w-full h-[420px] lg:h-[500px] rounded-2xl overflow-hidden shadow-lg">
          <Image
            src="/rkDigitalStudio.jpg"
            alt="RK Digital Studio Team"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-linear-to-t from-[#fff7ed]/60 via-transparent to-transparent"></div>
        </div>
      </div>
    </section>
  );
}
