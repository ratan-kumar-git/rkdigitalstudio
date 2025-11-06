"use client";

import PackageCard from "./PackageCard";
import { PackageMap } from "./type";


export default function Packages({ packageData }: { packageData: PackageMap } ) {
  const numberOfPackage = packageData ? Object.keys(packageData).length : 0;

  return (
    <section className="bg-[#fffefc]" id="packages">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-14">
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-[#1e293b]">
            Our <span className="text-[#d97706]">Packages</span>
          </h2>
          <p className="text-[#64748b] mt-3 text-lg max-w-2xl mx-auto">
            Choose a package that suits your event — from elegant simplicity to
            full cinematic luxury.
          </p>
        </div>

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
              <PackageCard key={key} pkg={pkg} />
            ))}
        </div>
      </div>
    </section>
  );
}
