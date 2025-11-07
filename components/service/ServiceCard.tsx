// import Image from "next/image";
import { Image } from "@imagekit/next";
import Link from "next/link";

interface Service {
  _id: string;
  slug: string;
  title: string;
  description: string;
  imageUrl: string;
}

const ServiceCard = (service: Service) => {
  return (
    <div
      key={service._id}
      className="group bg-white border border-gray-100 rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden"
    >
      <div className="relative w-full h-48">
        <Image
          urlEndpoint="https://ik.imagekit.io/ratanofficial"
          src={service.imageUrl}
          alt={service.title}
          loading="eager"
          width={400}
          height={300}
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-xl font-serif font-semibold text-[#1e293b] mb-2">
          {service.title}
        </h3>
        <p className="text-[#64748b] text-sm leading-relaxed mb-4">
          {service.description}
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
};

export default ServiceCard;
