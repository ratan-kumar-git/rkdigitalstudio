"use client";
import Gallery from "@/components/service/ImgGallery";
import Heading from "@/components/service/Heading";
import Packages from "@/components/service/Packages";
import { PackageMap } from "@/components/service/type";
import VideoSamples from "@/components/Home/VideoSamples";

export default function WeddingPhotographyPage() {

  const imageData = [
    "/wedding2.jpg",
    "/wedding3.jpg",
    "/wedding4.jpg",
    "/wedding1.jpg",
    "/wedding2.jpg",
    "/wedding3.jpg",
  ];


  const packages: PackageMap = {
  silver: {
    name: "Silver",
    price: "₹40,000",
    features: [
      "Traditional Video & Photography",
      "Drone Service",
      "Live Service",
      "Photo Frames (6 pcs)",
      "40 Pages Album",
    ],
    highlight: false,
  },
  golden: {
    name: "Golden",
    price: "₹60,000",
    features: [
      "Cinematic Video & Highlight",
      "Candid Photography",
      "Drone Service",
      "Photo Frames (4 pcs)",
      "40 Pages Album",
    ],
    highlight: true,
  },
  diamond: {
    name: "Diamond",
    price: "₹90,000",
    features: [
      "Cinematic Video + Teaser",
      "Candid & Traditional Photography",
      "Pre-Wedding Shoot",
      "Drone + Live Service",
      "50 Pages Album + Frames (6 pcs)",
    ],
    highlight: false,
  },
  };

  return (
    <main className="bg-[#fffefc] min-h-screen space-y-16">
      {/* heading */}
      <Heading 
        title="Wedding Photography"
        description="Capture your love story — timeless, elegant, and cinematic. We turn your special day into lasting art through creative storytelling."
        imgUrl="/wedding1.jpg"
      />

      {/* packages section */}
      <Packages packageData={packages} />

      {/* Image Gallery Section */}
      <Gallery
        title="Our"
        subtitle="Wedding Moments"
        images={imageData}
      />

      {/* video sample  */}
      <VideoSamples />
    </main>
  );
}
