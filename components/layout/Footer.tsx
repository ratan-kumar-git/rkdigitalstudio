'use client';

import Link from "next/link";
import { Instagram, Youtube, Phone, Mail, MapPin, MessageCircle } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#fff7ed] border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* 1️⃣ Brand */}
        <div>
          <h3 className="text-2xl font-serif font-bold text-[#1e293b] mb-3">
            <span className="text-[#d97706]">RK</span> Digital Studio
          </h3>
          <p className="text-[#64748b] text-sm leading-relaxed max-w-xs">
            Capturing life’s most beautiful moments through creative photography & cinematic storytelling.
          </p>
        </div>

        {/* 2️⃣ Quick Links */}
        <div>
          <h4 className="text-[#1e293b] font-semibold mb-4">Quick Links</h4>
          <ul className="space-y-2 text-sm text-[#64748b]">
            <li>
              <Link href="/" className="hover:text-[#d97706] transition-colors">Home</Link>
            </li>
            <li>
              <Link href="#services" className="hover:text-[#d97706] transition-colors">Services</Link>
            </li>
            <li>
              <Link href="#portfolio" className="hover:text-[#d97706] transition-colors">Portfolio</Link>
            </li>
            <li>
              <Link href="#packages" className="hover:text-[#d97706] transition-colors">Packages</Link>
            </li>
            <li>
              <Link href="#booking" className="hover:text-[#d97706] transition-colors">Book Now</Link>
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
