"use client";

import React, { useState } from "react";
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react";
import toast from "react-hot-toast";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { Spinner } from "@/components/ui/spinner";
import Logo from "@/components/layout/Logo";

interface FormData {
  name: string;
  email: string;
  password: string;
}

const Signup: React.FC = () => {
  const router = useRouter();
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    password: "",
  });

  const validateForm = (): boolean => {
    if (!formData.name.trim()) return toast.error("Name is required"), false;
    if (!formData.email.trim()) return toast.error("Email is required"), false;
    if (!/\S+@\S+\.\S+/.test(formData.email))
      return toast.error("Invalid email format"), false;
    if (!formData.password) return toast.error("Password is required"), false;
    if (formData.password.length < 6)
      return toast.error("Password must be at least 6 characters"), false;
    return true;
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const { data, error } = await authClient.signUp.email({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      if (data?.token) {
        toast.success("Account created successfully!");
        setFormData({ name: "", email: "", password: "" });
        router.push("/dashboard");
      } else {
        toast.error(error?.message || "Signup failed. Please try again.");
      }
    } catch (err) {
      console.log("Error in Signup", err);
      toast.error("Something went wrong during signup");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-linear-to-br from-[#fff7ed] via-[#fffaf4] to-[#fef3c7] flex items-center justify-center p-4 overflow-hidden">
      {/* Ambient Glow */}
      <div className="absolute top-1/3 left-1/4 w-80 h-80 bg-[#fcd34d]/40 rounded-full blur-[120px] opacity-50 animate-pulse"></div>
      <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-[#d97706]/30 rounded-full blur-[120px] opacity-50 animate-pulse"></div>

      <div className="relative w-full max-w-lg">
        {/* Card */}
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-[#fcd34d]/30 p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <Link
              href="/"
              className="flex items-center justify-center mb-4 hover:opacity-90"
            >
              <Logo />
            </Link>
            <h1 className="text-2xl font-serif font-bold text-[#1e293b] mb-1">
              Create Your Account
            </h1>
            <p className="text-[#64748b]">
              Join <span className="text-[#d97706] font-medium">RK Digital Studio</span> and start your journey
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleFormSubmit} className="space-y-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-[#1e293b] mb-2">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-[#d97706]/70" />
                </div>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#d97706] focus:border-transparent bg-white/70 placeholder-gray-400 transition-all"
                  placeholder="Enter your full name"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-[#1e293b] mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-[#d97706]/70" />
                </div>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#d97706] focus:border-transparent bg-white/70 placeholder-gray-400 transition-all"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-[#1e293b] mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-[#d97706]/70" />
                </div>
                <input
                  type={isShowPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="block w-full pl-10 pr-12 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#d97706] focus:border-transparent bg-white/70 placeholder-gray-400 transition-all"
                  placeholder="Create a password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setIsShowPassword(!isShowPassword)}
                >
                  {isShowPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-[#d97706]" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-[#d97706]" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-linear-to-r from-[#f59e0b] to-[#d97706] text-white py-3 px-4 rounded-lg font-semibold shadow-md hover:from-[#fbbf24] hover:to-[#f59e0b] transform hover:scale-[1.02] transition-all duration-200"
            >
              <div className="flex items-center justify-center gap-2">
                {isLoading && <Spinner />} Create Account
              </div>
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center text-sm text-[#64748b]">
            Already have an account?{" "}
            <Link
              href="/signin"
              className="text-[#d97706] font-semibold hover:underline transition"
            >
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
