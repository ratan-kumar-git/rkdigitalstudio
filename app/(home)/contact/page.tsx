"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Mail, Phone, MapPin } from "lucide-react";
import Image from "next/image";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form Submitted:", formData);
    alert("Your message has been sent successfully!");
    setFormData({ name: "", email: "", message: "" });
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
          <h3 className="text-2xl font-semibold text-gray-900 mb-6">
            Send a Message
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
              className="w-full bg-blue-600 hover:bg-blue-700 text-white text-lg py-2"
            >
              Send Message
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}
