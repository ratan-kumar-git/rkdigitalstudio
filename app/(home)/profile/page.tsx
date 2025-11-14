"use client";

import { useState, useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

import { User2, Lock, Eye, EyeOff } from "lucide-react";

export default function ProfilePage() {
  const router = useRouter();
  const { data, isPending } = authClient.useSession();

  const [name, setName] = useState("");
  const [savingName, setSavingName] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loadingPassword, setLoadingPassword] = useState(false);

  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);

  /* ------------------------------------------------------------ */
  /* AUTH CHECK                                                   */
  /* ------------------------------------------------------------ */
  useEffect(() => {
    if (isPending) return;

    if (!data?.user) {
      toast.error("Please sign in.");
      router.replace("/signin");
      return;
    }

    setName(data.user.name || "");
  }, [data, isPending, router]);

  if (isPending || !data?.user) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-64px)] text-gray-600">
        <Spinner className="h-8 w-8" />
        <p className="mt-3 text-lg">Loading your profile...</p>
      </div>
    );
  }

  const user = data.user;

  /* ------------------------------------------------------------ */
  /* UPDATE NAME                                                  */
  /* ------------------------------------------------------------ */
  const handleNameSave = async () => {
    if (!name.trim()) {
      toast.error("Name cannot be empty.");
      return;
    }

    try {
      setSavingName(true);
      const { error } = await authClient.updateUser({ name });
      if (error) {
        toast.error(error.message || "Failed to update name.");
        return;
      }
      toast.success("Name updated successfully.");
    } catch {
      toast.error("Something went wrong.");
    } finally {
      setSavingName(false);
    }
  };

  /* ------------------------------------------------------------ */
  /* CHANGE PASSWORD                                              */
  /* ------------------------------------------------------------ */
  const handlePasswordChange = async () => {
    if (!currentPassword || !newPassword) {
      toast.error("Both fields are required.");
      return;
    }

    try {
      setLoadingPassword(true);
      const { error } = await authClient.changePassword({
        currentPassword,
        newPassword,
        revokeOtherSessions: true,
      });

      if (error) {
        toast.error(error.message || "Failed to change password.");
        return;
      }

      toast.success("Password updated successfully.");
      setCurrentPassword("");
      setNewPassword("");
    } catch {
      toast.error("Something went wrong.");
    } finally {
      setLoadingPassword(false);
    }
  };

  return (
    <section className="max-w-6xl mx-auto py-12 px-4 md:px-6">
      {/* HEADER */}
      <h1 className="text-4xl font-serif font-bold text-[#1e293b] mb-8">
        My <span className="text-[#d97706]">Profile</span>
      </h1>

      {/* USER INFO SECTION */}
      <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm mb-10">
        <h2 className="text-xl font-semibold flex items-center gap-2 text-[#b45309] mb-6">
          <User2 className="w-5 h-5" /> Personal Information
        </h2>

        <div className="space-y-5">
          {/* Name */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Full Name
            </label>
            <div className="relative mt-1">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-amber-500 focus:ring-2 outline-none"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="text-sm font-medium text-gray-700">Email</label>
            <div className="relative mt-1">
              <input
                value={user.email}
                disabled
                className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-md text-gray-500"
              />
            </div>
          </div>

          <Button
            onClick={handleNameSave}
            disabled={savingName}
            className="inline-block px-5 py-2 rounded-full bg-linear-to-r from-[#f59e0b] to-[#d97706] text-white font-semibold text-sm shadow-md hover:from-[#fbbf24] hover:to-[#f59e0b] transition-transform hover:scale-[1.05]"
          >
            {savingName ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>

      {/* CHANGE PASSWORD SECTION */}
      <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm">
        <h2 className="text-xl font-semibold flex items-center gap-2 text-[#b45309] mb-6">
          <Lock className="w-5 h-5" /> Change Password
        </h2>

        <div className="space-y-5">
          {/* Current Password */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Current Password
            </label>
            <div className="relative mt-1">
              <input
                type={showCurrentPass ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-amber-500 focus:ring-2 outline-none"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPass(!showCurrentPass)}
                className="absolute right-3 top-2.5 text-gray-500"
              >
                {showCurrentPass ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              New Password
            </label>
            <div className="relative mt-1">
              <input
                type={showNewPass ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-amber-500 focus:ring-2 outline-none"
              />
              <button
                type="button"
                onClick={() => setShowNewPass(!showNewPass)}
                className="absolute right-3 top-2.5 text-gray-500"
              >
                {showNewPass ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <Button
            onClick={handlePasswordChange}
            disabled={loadingPassword}
            className="inline-block px-5 py-2 rounded-full bg-linear-to-r from-[#f59e0b] to-[#d97706] text-white font-semibold text-sm shadow-md hover:from-[#fbbf24] hover:to-[#f59e0b] transition-transform hover:scale-[1.05]"
          >
            {loadingPassword ? "Updating..." : "Update Password"}
          </Button>
        </div>
      </div>
    </section>
  );
}
