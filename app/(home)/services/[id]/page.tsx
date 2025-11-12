"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";

import Heading from "@/components/service/Heading";
import Packages from "@/components/service/Packages";
import { PackageMap } from "@/components/service/type";
import ServiceVideos from "@/components/service/ServiceVideos";
import ImgGallery from "@/components/service/ImgGallery";

interface IGalleryItem {
  imageUrl?: string;
  imageFileId?: string;
  thumbnailUrl?: string;
}

interface IPackage {
  name: string;
  price: string;
  features: string[];
  highlight?: boolean;
}

interface ServiceData {
  title: string;
  description: string;
  coverImage?: {
    imageUrl?: string;
    imageFileId?: string;
    thumbnailUrl?: string;
  };
  packages: IPackage[];
  gallery?: IGalleryItem[];
  videoSamples?: string[];
}

export default function WeddingPhotographyPage() {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [serviceData, setServiceData] = useState<ServiceData | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/service-details/${id}`);
        const result = await res.json();

        if (!res.ok)
          throw new Error(result.data?.message || "Failed to load data");
        setServiceData(result.data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch service detail");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading || !serviceData) {
    return (
      <div className="flex flex-col items-center justify-center py-20 h-screen text-gray-500">
        <Loader2 className="w-8 h-8 animate-spin mb-3 text-[#d97706]" />
        <p>Loading service page...</p>
      </div>
    );
  }

  const {
    title,
    description,
    coverImage,
    packages = [],
    gallery = [],
    videoSamples = [],
  } = serviceData;

  const fallbackImage = "/wedding1.jpg";

  const packageData: PackageMap = Object.fromEntries(
    packages.map((pkg) => [
      pkg.name.toLowerCase(),
      {
        name: pkg.name,
        price: `₹${pkg.price}`,
        features: pkg.features,
        highlight: pkg.highlight || false,
      },
    ])
  );

  return (
    <div className="bg-[#fffefc] min-h-screen space-y-16">
      <Heading
        title={title || "Untitled Service"}
        description={
          description ||
          "No description available for this service at the moment."
        }
        imgUrl={coverImage?.imageUrl || fallbackImage}
      />

      <Packages packageData={packageData} />

      <ImgGallery gallery={gallery} />

      <ServiceVideos videos={videoSamples} />
    </div>
  );
}
