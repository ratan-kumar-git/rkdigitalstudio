"use client";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import YouTubeEmbed from "@/components/YouTubeEmbed";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import toast from "react-hot-toast";

export default function DashboardPage() {
  const router = useRouter();
  const { data, isPending } = authClient.useSession();

  useEffect(() => {
    if (!isPending && !data?.user) {
      toast.error("You must be logged in to access the dashboard");
      router.replace("/signin");
    }
  }, [data, isPending, router]);

  const handelLogout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          toast.success("Logout successful!")
          router.push("/signin");
        }
      }
    })
  }

  if (isPending || !data?.user) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-64px)] w-full">
        <Spinner /> loading...
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col items-center justify-center h-[calc(100vh-64px)] w-full space-y-5">
        <h1 className="text-4xl font-bold">Welcome {data.user.name}</h1>
        <Button onClick={handelLogout}>Logout</Button>
        <br />
        <YouTubeEmbed videoId="tHckmMuhVAs" />
      </div>
    </>
  );
}
