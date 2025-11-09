"use client";
import { Spinner } from "@/components/ui/spinner";
import YouTubeEmbed from "@/components/unused/YouTubeEmbed";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import toast from "react-hot-toast";

export default function DashboardPage() {
  const router = useRouter();
  const { data, isPending } = authClient.useSession();

  useEffect(() => {
    if (isPending) return;

    if (!data?.user) {
      toast.error("Your session has expired. Please sign in again.");
      window.location.href = "/signin";
    } else if (data.user.email === "admin@gmail.com") {
      window.location.href = "/admin/dashboard";
    }
  }, [data?.user, isPending, router]);

  if (isPending || !data?.user) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-64px)] w-full text-gray-600">
        <Spinner className="h-8 w-8" />
        <span className="mt-2 text-xl">Checking session...</span>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col items-center justify-center h-[calc(100vh-64px)] w-full space-y-5">
        <h1 className="text-4xl font-bold">Welcome {data.user.name}</h1>
        <br />
        <YouTubeEmbed videoId="tHckmMuhVAs" />
      </div>
    </>
  );
}
