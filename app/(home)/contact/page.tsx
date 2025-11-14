"use client";

import { Phone, Mail, MapPin } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function ContactPage() {
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNo: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const { name, email, phoneNo, message } = formData;

    if (!name.trim()) {
      toast.error("Name is required");
      return false;
    }

    if (!email.trim()) {
      toast.error("Email is required");
      return false;
    }

    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      toast.error("Enter a valid email address");
      return false;
    }

    if (!phoneNo.trim()) {
      toast.error("Phone number is required");
      return false;
    }

    if (!/^\d+$/.test(phoneNo)) {
      toast.error("Phone number must contain only digits");
      return false;
    }

    if (phoneNo.length !== 10) {
      toast.error("Phone number must be exactly 10 digits");
      return false;
    }

    if (!message.trim()) {
      toast.error("Message cannot be empty");
      return false;
    }

    return true;
  };

  /* -------------------------------------------------------------------------- */
  /*  SUBMIT                                                                    */
  /* -------------------------------------------------------------------------- */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const res = await fetch("/api/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Failed to send message");
        return;
      }

      toast.success("Message sent successfully");

      setFormData({
        name: "",
        email: "",
        phoneNo: "",
        message: "",
      });
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong! Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="bg-[#fffefc] min-h-screen py-24">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-serif font-bold text-[#1e293b]">
            Get in <span className="text-[#d97706]">Touch</span>
          </h1>
          <p className="text-[#64748b] mt-4 text-lg max-w-2xl mx-auto">
            Have a question or want to book a shoot? We’d love to hear from you!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left — Contact Info */}
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <Phone className="text-[#d97706]" />
              <div>
                <p className="font-semibold text-[#1e293b]">Phone</p>
                <p className="text-[#64748b]">+91 9155696556, +91 9155579541</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Mail className="text-[#d97706]" />
              <div>
                <p className="font-semibold text-[#1e293b]">Email</p>
                <p className="text-[#64748b]">info@rkdigitalstudio.com</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <MapPin className="text-[#d97706] mt-1" />
              <div>
                <p className="font-semibold text-[#1e293b]">Address</p>
                <p className="text-[#64748b]">
                  R.K DIGITAL STUDIO, Sasaram, Bihar
                </p>
              </div>
            </div>

            <div className="mt-10">
              <div className="relative w-full h-80 rounded-xl shadow-md">
                <Image
                  alt="contact-img"
                  src="/contact.jpg"
                  fill
                  className="rounded-xl shadow-md object-cover"
                  quality={60}
                />
              </div>
            </div>
          </div>

          {/* Right — Form */}
          <div>
            <form
              onSubmit={handleSubmit}
              className="bg-white rounded-2xl shadow-md border border-gray-100 p-8 md:p-10"
            >
              <h2 className="text-2xl font-serif font-bold text-[#1e293b] mb-6">
                Send a <span className="text-[#d97706]">Message</span>
              </h2>

              <div className="space-y-5">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-[#1e293b]">
                    Full Name
                  </label>
                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#d97706]"
                    placeholder="Enter your full name"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-[#1e293b]">
                    Email Address
                  </label>
                  <input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#d97706]"
                    placeholder="you@example.com"
                  />
                </div>

                {/* Phone No */}
                <div>
                  <label className="block text-sm font-medium text-[#1e293b]">
                    Phone Number
                  </label>
                  <input
                    name="phoneNo"
                    type="tel"
                    value={formData.phoneNo}
                    onChange={handleChange}
                    className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#d97706]"
                    placeholder="Enter your phone number"
                  />
                </div>

                {/* Message */}
                <div>
                  <label className="block text-sm font-medium text-[#1e293b]">
                    Message
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={5}
                    className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#d97706]"
                    placeholder="Write your message here..."
                  />
                </div>
              </div>

              <div className="mt-8">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="rounded-full bg-linear-to-r from-[#f59e0b] to-[#d97706] text-white px-8 py-3 shadow-md hover:scale-[1.05]"
                >
                  {isLoading ? "Sending..." : "Send Message"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
