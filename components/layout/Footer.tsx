"use client";

import Link from "next/link";
import {
  Instagram,
  Youtube,
  Phone,
  Mail,
  MapPin,
  MessageCircle,
} from "lucide-react";
import Logo from "./Logo";
import { useEffect, useState } from "react";

export default function Footer() {
  const [total, setTotal] = useState(0);
  const [today, setToday] = useState(0);

  useEffect(() => {
    const VISIT_KEY = "visit_today";
    const DAY_MS = 24 * 60 * 60 * 1000;

    async function loadVisitors() {
      try {
        const res = await fetch("/api/track-visit");
        if (!res.ok) {
          console.error("Failed to load visitor counts", res.status);
          return;
        }
        const data = await res.json();
        setTotal(data.total ?? 0);
        setToday(data.today ?? 0);
      } catch (err) {
        console.error("Error loading visitor counts", err);
      }
    }

    async function trackIfNeededAndRefresh() {
      try {
        const now = Date.now();
        const raw = localStorage.getItem(VISIT_KEY);

        let needToTrack = false;
        if (!raw) {
          needToTrack = true;
        } else {
          const expiry = Number(raw);
          if (isNaN(expiry) || now > expiry) {
            needToTrack = true;
          }
        }

        if (needToTrack) {
          await fetch("/api/track-visit", { method: "POST" });
          localStorage.setItem(VISIT_KEY, String(now + DAY_MS));
        }
        await loadVisitors();
      } catch (err) {
        console.error("Error tracking visit", err);
        await loadVisitors();
      }
    }

    trackIfNeededAndRefresh();
  }, []);

  return (
    <footer className="bg-[#fff7ed] border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 sm:space-y-0 sm:gap-10">
        {/* 1️⃣ Brand */}
        {/* Brand */}
        <div className="space-y-4">
          <Logo />
          <p className="text-[#64748b] text-sm leading-relaxed max-w-xs">
            Capturing life’s most beautiful moments through creative photography
            & cinematic storytelling.
          </p>

          {/* 🎉 Visitor Count */}
          <p className="text-xs text-[#475569]">
            Today Visitors: <span className="font-semibold">{today}</span>
            <br />
            Total Visitors: <span className="font-semibold">{total}</span>
          </p>
        </div>

        <div>
          <h4 className="text-[#1e293b] font-semibold mb-4">Quick Links</h4>
          <ul className="space-y-2 text-sm text-[#64748b]">
            <li>
              <Link href="/" className="hover:text-[#d97706] transition-colors">
                Home
              </Link>
            </li>
            <li>
              <Link
                href="#services"
                className="hover:text-[#d97706] transition-colors"
              >
                Services
              </Link>
            </li>
            <li>
              <Link
                href="/booking"
                className="hover:text-[#d97706] transition-colors"
              >
                Book Now
              </Link>
            </li>
          </ul>
        </div>

        {/* 3️⃣ Contact Info */}
        <div>
          <h4 className="text-[#1e293b] font-semibold mb-4">Contact</h4>
          <ul className="space-y-3 text-sm text-[#64748b]">
            <li className="flex items-center gap-2">
              <Phone size={16} className="text-[#d97706]" />
              <span>+91 9155696556, +91 9155579541</span>
            </li>
            <li className="flex items-center gap-2">
              <Mail size={16} className="text-[#d97706]" />
              <span>info@rkdigitalstudio.com</span>
            </li>
            <li className="flex items-start gap-2">
              <MapPin size={16} className="text-[#d97706] mt-0.5" />
              <span>R.K DIGITAL STUDIO, Sasaram, Bihar, India</span>
            </li>
          </ul>
        </div>

        {/* 4️⃣ Social Links */}
        <div>
          <h4 className="text-[#1e293b] font-semibold mb-4">Follow Us</h4>
          <div className="flex items-center gap-4">
            <Link
              href="https://www.instagram.com/"
              target="_blank"
              className="w-10 h-10 rounded-full bg-[#fff1d6] flex items-center justify-center hover:bg-[#d97706] transition-colors group"
            >
              <Instagram className="w-5 h-5 text-[#d97706] group-hover:text-white" />
            </Link>
            <Link
              href="https://www.youtube.com/"
              target="_blank"
              className="w-10 h-10 rounded-full bg-[#fff1d6] flex items-center justify-center hover:bg-[#d97706] transition-colors group"
            >
              <Youtube className="w-5 h-5 text-[#d97706] group-hover:text-white" />
            </Link>
            <Link
              href="https://wa.me/919876543210"
              target="_blank"
              className="w-10 h-10 rounded-full bg-[#fff1d6] flex items-center justify-center hover:bg-[#25D366] transition-colors group"
            >
              <MessageCircle className="w-5 h-5 text-[#d97706] group-hover:text-white" />
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-200 py-5">
        <p className="text-center text-sm text-[#64748b]">
          © {new Date().getFullYear()} RK Digital Studio — All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}
