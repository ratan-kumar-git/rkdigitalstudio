"use client";

import { Loader2 } from "lucide-react";

interface LoadingScreenProps {
  message?: string;
  fullscreen?: boolean;
}

export default function LoadingScreen({
  message = "Loading...",
  fullscreen = true,
}: LoadingScreenProps) {
  return (
    <main
      className={`${
        fullscreen ? "min-h-screen" : "h-auto"
      } bg-[#fffefc] flex flex-col items-center justify-center`}
    >
      <Loader2 className="w-10 h-10 text-[#d97706] animate-spin mb-3" />
      <p className="text-gray-500 text-lg">{message}</p>
    </main>
  );
}
