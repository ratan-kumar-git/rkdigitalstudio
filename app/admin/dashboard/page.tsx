"use client";
import { Spinner } from "@/components/ui/spinner";
import YouTubeEmbed from "@/components/unused/YouTubeEmbed";
import { authClient } from "@/lib/auth-client";


export default function AdminDashboardPage() {
  const { data, isPending } = authClient.useSession();

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
