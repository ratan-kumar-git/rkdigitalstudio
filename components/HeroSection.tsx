import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function HeroSection() {
  return (
    <section className="relative w-full h-[calc(100vh-64px)] flex items-center justify-center text-center bg-gray-900 text-white overflow-hidden">
      {/* Background Image */}
      <Image
        src="/wedding5.jpeg"
        alt="Photography background"
        fill
        className="object-cover object-center opacity-60"
        priority
        quality={50}
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/50"></div>

      {/* Content */}
      <div className="relative z-10 px-6 max-w-2xl">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          Capturing Life&apos;s Beautiful Moments
        </h1>
        <p className="text-lg md:text-xl text-gray-200 mb-8">
          Professional photography that tells your unique story with artistic vision and technical excellence
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
            <Link href="/services">View Our Services</Link>
          </Button>
          <Button asChild
            size="lg"
            variant="outline"
            className="text-white border-white bg-white/10"
          >
            <Link href="/contact">Book a Shoot</Link>
          </Button>
        </div>
      </div>

      {/* Decorative Gradient Bottom Fade */}
      <div className="absolute bottom-0 left-0 w-full h-40 bg-linear-to-t from-gray-900 to-transparent"></div>
    </section>
  );
}
