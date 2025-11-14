'use client';

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-linear-to-b from-[#fff7ed] to-[#ffffff]">
      <div className="max-w-7xl mx-auto flex flex-col-reverse md:flex-row items-center justify-between gap-10 px-6 py-20 md:pt-24">
        {/* Left Content */}
        <div className="flex-1 text-center md:text-left">
          <h1 className="font-serif text-5xl md:text-6xl font-bold text-[#1e293b] leading-tight">
            Capture <span className="text-[#d97706]">Your Story</span> in Every Frame
          </h1>
          <p className="mt-6 text-[#64748b] text-lg max-w-xl mx-auto md:mx-0">
            We turn your precious moments into timeless memories through cinematic videography and professional photography — perfect for weddings, birthdays, and more.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4">
            <Button
              className="rounded-full bg-linear-to-r from-[#f59e0b] to-[#d97706] hover:from-[#fbbf24] hover:to-[#f59e0b] text-white font-semibold px-6 py-3 shadow-md transition-transform hover:scale-[1.05]"
            >
              <Link href="/dashboard">Book Now</Link>
            </Button>
            <Button
              variant="outline"
              className="rounded-full border-[#d97706] text-[#d97706] hover:bg-[#fff7ed] px-6 py-3 font-medium transition-colors"
            >
              <Link href="/services">View Services</Link>
            </Button>
          </div>
        </div>

        {/* Right Image */}
        <div className="flex-1 relative w-full h-[380px] md:h-[520px]">
          <div className="absolute inset-0 rounded-2xl overflow-hidden shadow-lg">
            <Image
              src="/wedding1.jpg"
              alt="Cinematic wedding photography"
              fill
              className="object-cover"
              priority
            />
          </div>
          <div className="absolute inset-0 bg-linear-to-t from-[#fff7ed]/40 via-transparent to-transparent rounded-2xl"></div>
        </div>
      </div>

      {/* Decorative Bottom Shape */}
      <div className="absolute bottom-0 left-0 w-full h-20 bg-linear-to-t from-white to-transparent"></div>
    </section>
  );
}
