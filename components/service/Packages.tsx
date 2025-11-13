"use client";

import PackageCard from "./PackageCard";
import { Package } from "./type";

export default function Packages({
  packageData,
  serviceId,
}: {
  packageData: Package[];
  serviceId: string;
}) {
  const numberOfPackage = packageData ? packageData.length : 0;

  return (
    <section className="bg-[#fffefc]" id="packages">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#1e293b]">
            Our <span className="text-[#d97706]">Packages</span>
          </h2>
          <p className="text-[#64748b] mt-3 text-lg max-w-2xl mx-auto">
            Choose a package that suits your event — from elegant simplicity to
            full cinematic luxury.
          </p>
        </div>

        {/* No Packages */}
        {numberOfPackage === 0 ? (
          <div className="text-center text-gray-500 italic py-10">
            No packages available for this service.
          </div>
        ) : (
          <div
            className={`grid gap-8 ${
              numberOfPackage === 1
                ? "grid-cols-1 place-items-center"
                : numberOfPackage === 2
                ? "grid-cols-1 md:grid-cols-2"
                : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
            }`}
          >
            {Object.entries(packageData).map(([key, pkg]) => (
              <PackageCard key={key} pkg={pkg} serviceId={serviceId} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
