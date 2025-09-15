import React from "react";
import {
  FaYoutube,
  FaInstagram,
  FaTiktok,
  FaFacebook,
  FaWhatsapp,
  FaGlobe,
  FaDownload,
} from "react-icons/fa";

export default function LinkTree() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-950 to-gray-900 text-white px-6 py-12">
      <div className="w-full max-w-sm text-center">
        {/* Logo */}
        <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-yellow-400/30 mx-auto mb-6">
          <img
            src="https://res.cloudinary.com/dtwa3lxdk/image/upload/v1756897359/465660711_1763361547537323_2674934284076407223_n_prlt48.jpg"
            alt="طياب الأوراس"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Links */}
        <div className="flex flex-col gap-4">
          <a
            href="https://www.youtube.com/@ttyab_elawras"
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-2 bg-white/5 py-3 rounded-xl font-semibold hover:bg-yellow-400 hover:text-black transition"
          >
            <FaYoutube size={22} /> YouTube
          </a>
          <a
            href="https://www.instagram.com/tteyab_elawras05/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-2 bg-white/5 py-3 rounded-xl font-semibold hover:bg-yellow-400 hover:text-black transition"
          >
            <FaInstagram size={22} /> Instagram
          </a>
          <a
            href="https://www.tiktok.com/@ttyab_alawras05"
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-2 bg-white/5 py-3 rounded-xl font-semibold hover:bg-yellow-400 hover:text-black transition"
          >
            <FaTiktok size={22} /> TikTok
          </a>
          <a
            href="https://www.facebook.com/share/17VmU2KTS9/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-2 bg-white/5 py-3 rounded-xl font-semibold hover:bg-yellow-400 hover:text-black transition"
          >
            <FaFacebook size={22} /> Facebook
          </a>
          <a
            href="https://wa.me/213654768883"
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-2 bg-white/5 py-3 rounded-xl font-semibold hover:bg-yellow-400 hover:text-black transition"
          >
            <FaWhatsapp size={22} /> WhatsApp
          </a>
          <a
            href="https://tyab-alawras.vercel.app/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-2 bg-white/5 py-3 rounded-xl font-semibold hover:bg-yellow-400 hover:text-black transition"
          >
            <FaGlobe size={22} /> الموقع الرسمي
          </a>
          <a
            href="https://github.com/kingofdead6/TyabAlawras/releases/download/v2.0.0/TyabElawras.apk"
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-2 bg-white/5 py-3 rounded-xl font-semibold hover:bg-yellow-400 hover:text-black transition"
          >
            <FaDownload size={22} /> تحميل التطبيق
          </a>
        </div>
      </div>
    </div>
  );
}
