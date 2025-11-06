"use client";

import Image from "next/image";
import { Camera, Heart, Users, Sparkles, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function WeddingPhotographyPage() {
  return (
    <main className="bg-[#fffefc] min-h-screen">
      {/* Hero Section */}
      <section className="relative w-full h-[60vh] flex items-center justify-center">
        {/* <Image
          src="/wedding-hero.jpg"
          alt="Wedding Photography"
          fill
          className="object-cover"
          priority
        /> */}
        <div className="absolute inset-0 bg-linear-to-b from-black/50 via-black/20 to-transparent"></div>
        <div className="relative text-center z-10 text-zinc-700">
          <h1 className="text-4xl md:text-6xl font-serif font-bold mb-3">
            Wedding Photography
          </h1>
          <p className="text-lg md:text-xl text-gray-700">
            Capture your love story — timeless, elegant, and cinematic.
          </p>
        </div>
      </section>

      {/* About Section */}
      <section className="max-w-6xl mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="relative w-full h-[420px] rounded-2xl overflow-hidden shadow-lg">
          <Image
            src="/wedding1.jpg"
            alt="Wedding Photography Sample"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-t from-[#fff7ed]/60 via-transparent to-transparent"></div>
        </div>

        <div>
          <h2 className="text-3xl font-serif font-bold text-[#1e293b] mb-4">
            Storytelling Through Every Frame
          </h2>
          <p className="text-[#64748b] text-lg leading-relaxed mb-4">
            At <span className="text-[#d97706] font-semibold">RK Digital Studio</span>, 
            we believe your wedding is more than an event — it’s an emotion. 
            Our team of skilled photographers and filmmakers are dedicated to 
            capturing those fleeting, heartfelt moments and turning them into 
            everlasting memories.
          </p>
          <p className="text-[#64748b] text-lg leading-relaxed">
            From candid laughter to emotional vows, from timeless portraits to 
            breathtaking cinematic shots — we create a visual story that reflects 
            your love, personality, and celebration.
          </p>
        </div>
      </section>

      {/* Highlights Section */}
      <section className="bg-[#fff7ed] py-16">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h3 className="text-3xl font-serif font-bold text-[#1e293b] mb-10">
            Why Choose Our <span className="text-[#d97706]">Wedding Photography?</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Camera,
                title: "Candid & Traditional Shots",
                desc: "Balanced blend of documentary-style and classic poses.",
              },
              {
                icon: Heart,
                title: "Emotional Storytelling",
                desc: "Every photo is crafted to reflect love and connection.",
              },
              {
                icon: Users,
                title: "Creative Team",
                desc: "Experienced photographers and editors with artistic vision.",
              },
              {
                icon: Sparkles,
                title: "Premium Quality",
                desc: "Edited to perfection with professional color grading.",
              },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <div
                  key={i}
                  className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl border border-gray-100 transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="w-14 h-14 flex items-center justify-center mx-auto bg-[#fff1d6] rounded-full mb-5">
                    <Icon className="w-7 h-7 text-[#d97706]" />
                  </div>
                  <h4 className="text-xl font-semibold text-[#1e293b] mb-2 font-serif">
                    {item.title}
                  </h4>
                  <p className="text-[#64748b] text-sm leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Package Inclusions */}
      <section className="max-w-6xl mx-auto px-6 py-20 text-center">
        <h3 className="text-3xl font-serif font-bold text-[#1e293b] mb-8">
          What’s Included in Our <span className="text-[#d97706]">Wedding Package</span>
        </h3>

        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 text-left max-w-4xl mx-auto">
          {[
            "Candid & Traditional Photography",
            "Cinematic Wedding Video & Highlights",
            "Drone Coverage",
            "Pre-Wedding Session",
            "Custom Designed Photo Album (40–50 pages)",
            "6 Premium Photo Frames",
            "Full-day On-site Coverage",
            "Professional Color Grading & Retouching",
            "Digital Delivery + Album Prints",
          ].map((feature, i) => (
            <li key={i} className="flex items-start gap-2 text-[#334155]">
              <CheckCircle2 className="w-5 h-5 text-[#d97706] mt-0.5" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>

        <div className="mt-12">
          <Link
            href="/booking"
            className="inline-block px-8 py-3 rounded-full bg-linear-to-r from-[#f59e0b] to-[#d97706] hover:from-[#fbbf24] hover:to-[#f59e0b] text-white font-semibold shadow-md transition-transform hover:scale-[1.05]"
          >
            Book Your Wedding Shoot
          </Link>
        </div>
      </section>

      {/* Sample Gallery */}
      <section className="bg-[#fffefc] py-16">
        <div className="max-w-6xl mx-auto px-6">
          <h3 className="text-3xl font-serif font-bold text-[#1e293b] mb-10 text-center">
            Our <span className="text-[#d97706]">Wedding Moments</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              "/wedding2.jpg",
              "/wedding3.jpg",
              "/wedding4.jpg",
              "/wedding1.jpg",
              "/wedding2.jpg",
              "/wedding3.jpg",
            ].map((src, index) => (
              <div
                key={index}
                className="relative w-full h-64 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
              >
                <Image
                  src={src}
                  alt={`Wedding Sample ${index + 1}`}
                  fill
                  className="object-cover hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
