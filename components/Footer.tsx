import { Mail, Phone, MapPin, Instagram, Facebook, Youtube, CameraIcon } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-8">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Brand Section */}
        <div>
          <div className="flex items-center mb-2">
            <CameraIcon size={50} className="text-white" />
            <div className="flex flex-col items-start justify-start">
              <span className="text-lg font-bold text-white ml-2">RK Digital</span><hr />  
              <span className="text-xs font-bold text-white ml-2">Studio</span>
            </div> 
          </div>
          <p className="text-sm leading-relaxed">
            Capturing your most cherished moments with creativity and passion. 
            We specialize in weddings, pre-weddings, and professional photoshoots.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h1 className="text-lg font-semibold text-white mb-3">Quick Links</h1>
          <ul className="space-y-2">
            <li>
              <Link href="/billing" className="hover:text-white transition">
                Billing
              </Link>
            </li>
            <li>
              <Link href="/#services" className="hover:text-white transition">
                Services
              </Link>
            </li>
            <li>
              <Link href="/#recent-shoots" className="hover:text-white transition">
                Recent Shoots
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-white transition">
                Contact Us
              </Link>
            </li>
            <li>
              <Link href="/signin" className="hover:text-white transition">
                Signin
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact & Socials */}
        <div>
          <h1 className="text-lg font-semibold text-white mb-3">Get in Touch</h1>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <Mail size={16} /> info@rkphotography.com
            </li>
            <li className="flex items-center gap-2">
              <Phone size={16} /> +91 9155696556, +91 9155579541
            </li>
            <li className="flex items-center gap-2">
              <MapPin size={16} /> Sasaram, Bihar, India
            </li>
          </ul>

          {/* Social Links */}
          <div className="flex gap-4 mt-4">
            <Link href="https://instagram.com" target="_blank" aria-label="Visit our Instagram profile" className="hover:text-white transition">
              <Instagram size={20} />
            </Link>
            <Link href="https://facebook.com" target="_blank" aria-label="Visit our Facebook page" className="hover:text-white transition">
              <Facebook size={20} />
            </Link>
            <Link href="https://youtube.com" target="_blank" aria-label="Visit our YouTube channel" className="hover:text-white transition">
              <Youtube size={20} />
            </Link>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-gray-400">
        © {new Date().getFullYear()} RK Digital Studio. All rights reserved.
        <br /> Designed By Ratan Kumar
      </div>
    </footer>
  );
}
