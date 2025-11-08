"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { LogOut, User } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";


export default function UserMenu() {
    const router = useRouter();
  const { data } = authClient.useSession();

  if (!data?.user.email) return null;

  const user = data.user;
  const isAdmin = user.email === "admin@gmail.com";

  const initials = user.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "U";

  const handelLogout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          toast.success("Logout successful!");
          return router.replace("/signin");
        },
      },
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="rounded-full p-0 w-10 h-10 border hover:ring-2 hover:ring-[#d97706]/50 transition-all"
        >
          <Avatar className="w-10 h-10">
            <AvatarImage src={user.image || ""} alt={user.name || "User"} />
            <AvatarFallback className="bg-[#f59e0b]/10 text-[#d97706] font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-56 p-2 rounded-xl shadow-lg bg-white border border-gray-100"
      >
        <DropdownMenuLabel className="flex flex-col gap-0.5">
          <span className="font-semibold text-gray-900">{user.name}</span>
          <span className="text-sm text-gray-500">{user.email}</span>
          {isAdmin && (
            <span className="mt-1 inline-block text-xs font-medium text-white bg-[#d97706] px-2 py-0.5 rounded-full">
              Admin
            </span>
          )}
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem className="cursor-pointer flex items-center gap-2 text-gray-700 hover:bg-gray-100">
          <User className="w-4 h-4 text-gray-500" /> Profile
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={handelLogout}
          className="cursor-pointer flex items-center gap-2 text-red-600 hover:bg-red-50"
        >
          <LogOut className="w-4 h-4" /> Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
