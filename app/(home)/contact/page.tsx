"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Mail, Phone, MapPin, MessageSquareTextIcon } from "lucide-react";
import Image from "next/image";
import toast from "react-hot-toast";
import { Spinner } from "@/components/ui/spinner";

export default function ContactPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true)
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        toast.error("Error in to send message")
      }

      const data = await res.json();
      if (data.success){
        toast.success("Message sent")
        setFormData({email: "", message: "", name: ""})
      }
    } catch (error) {
      console.error("❌ Error submitting form:", error);
      toast.error("Something went wrong. Please try again later.")
    } finally {
      setIsLoading(false)
    }
  };

  return (
    <section className="w-full py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-start">
        {/* Left Section - Contact Info */}
        <div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Get in Touch
          </h2>
          <p className="text-gray-600 mb-8">
            Have a question, want to book a photoshoot, or just say hello?
            Fill out the form or contact us directly through the details below.
          </p>

          <ul className="space-y-4 text-gray-700">
            <li className="flex items-center gap-3">
              <Phone className="text-blue-600 w-5 h-5" />
              <span>+91 9155696556, +91 9155579541</span>
            </li>
            <li className="flex items-center gap-3">
              <Mail className="text-blue-600 w-5 h-5" />
              <span>contact@rkphotography.com</span>
            </li>
            <li className="flex items-center gap-3">
              <MapPin className="text-blue-600 w-5 h-5" />
              <span>R.K DIGITAL STUDIO, Sasaram, Bihar, India</span>
            </li>
          </ul>

          <div className="mt-10">
            <div className="relative w-full h-64 rounded-xl shadow-md">
              <Image
              alt="contact-img"
              src="/contact.jpg"
              fill
              className="rounded-xl shadow-md"
              quality={50}
            />
            </div>
          </div>
        </div>

        {/* Right Section - Contact Form */}
        <div className="bg-white p-8 rounded-2xl shadow-md">
          <h3 className="text-2xl font-semibold text-gray-900 mb-6 inline-flex items-center gap-2">
            <MessageSquareTextIcon /> Send a Message
          </h3>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-gray-700 font-medium mb-2">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Your full name"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Your email address"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">Message</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={5}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                placeholder="Type your message..."
              ></textarea>
            </div>
            
            <Button
              type="submit"
              variant="default"
              className="w-full"
            >
              <div className="flex items-center justify-center gap-2">
                {isLoading && <Spinner />} Send Message
              </div>
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}
