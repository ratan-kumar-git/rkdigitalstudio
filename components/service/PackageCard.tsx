"use client";

import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import { Package } from "./type";


interface PackageCardProps {
  pkg: Package;
}

export default function PackageCard({ pkg }: PackageCardProps) {
  return (
    <div
      className={`relative rounded-2xl bg-white border border-gray-100 shadow-md p-8 flex flex-col items-start justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
        pkg.highlight ? "ring-2 ring-[#d97706]" : ""
      }`}
    >
      {pkg.highlight && (
        <span className="absolute top-4 right-4 text-xs font-medium bg-[#fef3c7] text-[#d97706] px-3 py-1 rounded-full">
          Popular
        </span>
      )}
      <h3 className="text-2xl font-serif font-bold text-[#1e293b] mb-2">
        {pkg.name}
      </h3>
      <p className="text-[#d97706] font-semibold text-xl mb-6">{pkg.price}</p>

      <ul className="space-y-3 mb-8">
        {pkg.features.map((feature, i) => (
          <li key={i} className="flex items-start gap-2 text-[#64748b]">
            <CheckCircle2 className="w-5 h-5 text-[#d97706] mt-0.5" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <Button className="w-full rounded-full bg-linear-to-r from-[#f59e0b] to-[#d97706] hover:from-[#fbbf24] hover:to-[#f59e0b] text-white font-semibold shadow-md transition-transform hover:scale-[1.05]">
        Book Now
      </Button>
    </div>
  );
}
