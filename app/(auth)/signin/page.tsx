"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { Spinner } from "@/components/ui/spinner";
import Logo from "@/components/layout/Logo";

interface LoginFormData {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const router = useRouter();
  const [isShowPassword, setIsShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });

  const validateForm = (): boolean => {
    if (!formData.email.trim()) {
      toast.error("Email is required");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      toast.error("Invalid email format");
      return false;
    }
    if (!formData.password) {
      toast.error("Password is required");
      return false;
    }
    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return false;
    }
    return true;
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const { data, error } = await authClient.signIn.email({
        email: formData.email,
        password: formData.password,
      });

      if (data?.user?.email === "admin@gmail.com") {
        toast.success("Admin login successful!");
        setFormData({ email: "", password: "" });
        return router.push("/admin/dashboard");
      } else if (data?.user) {
        toast.success("Login successful!");
        setFormData({ email: "", password: "" });
        return router.push("/dashboard");
      } else {
        toast.error("You are not authorized to access the dashboard");
      }

      if (error) {
        toast.error(error?.message || "Invalid credentials");
        return;
      }
    } catch (err) {
      console.log("Error in Signin", err);
      toast.error("Something went wrong during login");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-linear-to-br from-[#fff7ed] via-[#fffaf4] to-[#fef3c7] flex items-center justify-center p-4">
      {/* Amber Glow Effects */}
      <div className="absolute top-1/4 left-1/3 w-64 h-64 bg-[#fcd34d]/40 rounded-full blur-[100px] opacity-60 animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/3 w-64 h-64 bg-[#d97706]/30 rounded-full blur-[100px] opacity-60 animate-pulse"></div>

      <div className="relative w-full max-w-md">
        {/* Card */}
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-[#fcd34d]/30 p-8">
          {/* Logo + Header */}
          <div className="text-center mb-8">
            <Link
              href="/"
              className="flex items-center justify-center mb-4 hover:opacity-90"
            >
              <Logo />
            </Link>
            <h1 className="text-2xl font-serif font-bold text-[#1e293b] mb-1">
              Welcome Back
            </h1>
            <p className="text-[#64748b]">
              Sign in to continue with{" "}
              <span className="text-[#d97706] font-medium">
                RK Digital Studio
              </span>
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleFormSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-[#1e293b] mb-2"
              >
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-[#d97706]/70" />
                </div>
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#d97706] focus:border-transparent transition-all duration-200 bg-white/70 placeholder-gray-400"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-[#1e293b] mb-2"
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-[#d97706]/70" />
                </div>
                <input
                  id="password"
                  type={isShowPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="block w-full pl-10 pr-12 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#d97706] focus:border-transparent transition-all duration-200 bg-white/70 placeholder-gray-400"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setIsShowPassword((prev) => !prev)}
                >
                  {isShowPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-[#d97706]" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-[#d97706]" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-linear-to-r from-[#f59e0b] to-[#d97706] text-white py-3 px-4 rounded-lg font-semibold shadow-md hover:from-[#fbbf24] hover:to-[#f59e0b] transform hover:scale-[1.02] transition-all duration-200"
            >
              <div className="flex items-center justify-center gap-2">
                {isLoading && <Spinner />} Sign In
              </div>
            </button>
          </form>

          {/* Divider */}
          <div className="mt-10 mb-6 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">
                Don’t have an account?
              </span>
            </div>
          </div>

          {/* Sign Up */}
          <div className="text-center">
            <Link
              href="/signup"
              className="text-[#d97706] font-semibold hover:underline transition"
            >
              Create your account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
