'use client';

import { useState } from "react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";

export default function Booking() {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    event: "",
    date: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // simulate server request
      await new Promise((res) => setTimeout(res, 1500));
      toast.success("Your booking request has been submitted!");
      setForm({ name: "", email: "", phone: "", event: "", date: "", message: "" });
    } catch {
      toast.error("Something went wrong! Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-[#fff7ed] py-20" id="booking">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-14">
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-[#1e293b]">
            Book <span className="text-[#d97706]">Your Shoot</span>
          </h2>
          <p className="text-[#64748b] mt-3 text-lg max-w-2xl mx-auto">
            Fill out the form below to book your photography or videography session with us.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-md border border-gray-100 p-8 md:p-10"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-medium text-[#1e293b]">Name</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#d97706] outline-none"
                placeholder="Enter your full name"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-[#1e293b]">Email</label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#d97706] outline-none"
                placeholder="your@email.com"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-[#1e293b]">Phone</label>
              <input
                name="phone"
                type="tel"
                value={form.phone}
                onChange={handleChange}
                required
                className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#d97706] outline-none"
                placeholder="Enter your phone number"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-[#1e293b]">Event Type</label>
              <select
                name="event"
                value={form.event}
                onChange={handleChange}
                required
                className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#d97706] outline-none bg-white"
              >
                <option value="">Select Event Type</option>
                <option>Wedding</option>
                <option>Pre-Wedding</option>
                <option>Birthday</option>
                <option>Anniversary</option>
                <option>Corporate Event</option>
                <option>Other</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-[#1e293b]">Date</label>
              <input
                name="date"
                type="date"
                value={form.date}
                onChange={handleChange}
                required
                className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#d97706] outline-none"
              />
            </div>
          </div>

          <div className="mt-6">
            <label className="text-sm font-medium text-[#1e293b]">Message</label>
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              rows={4}
              className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#d97706] outline-none"
              placeholder="Tell us more about your event..."
            />
          </div>

          <div className="mt-8 flex justify-center">
            <Button
              type="submit"
              disabled={loading}
              className="rounded-full bg-linear-to-r from-[#f59e0b] to-[#d97706] hover:from-[#fbbf24] hover:to-[#f59e0b] text-white font-semibold px-8 py-3 shadow-md transition-transform hover:scale-[1.05]"
            >
              {loading ? "Sending..." : "Submit Booking"}
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
}
