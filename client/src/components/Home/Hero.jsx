import { motion } from "framer-motion";
import { FaUtensils, FaPhone, FaDownload } from "react-icons/fa";

export default function Hero() {
  return (
    <div
      id="home"
      className="h-screen bg-cover bg-center relative flex items-center justify-center text-white"
    >
      {/* Background images */}
      <div
        className="bg-fixed absolute inset-0 bg-cover bg-center sm:hidden"
        style={{
          backgroundImage:
            "url('https://res.cloudinary.com/dtwa3lxdk/image/upload/v1757978907/20250915_164946_wvkd7g.jpg')",
        }}
      ></div>
      <div
        className="absolute inset-0 bg-cover bg-center hidden sm:block"
        style={{
          backgroundImage:
            "url('https://res.cloudinary.com/dtwa3lxdk/image/upload/v1757414467/20250909_112204_1_1_u9cy5g.jpg')",
        }}
      ></div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-gray-900/30 to-black/40" />

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="relative z-10 text-center px-4 sm:px-6 max-w-3xl -mt-40"
      >
        {/* Title */}
        <motion.h1
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, duration: 1 }}
          className="text-4xl sm:text-6xl font-bold mb-6 drop-shadow-[0_0_15px_#c9ab00]"
        >
          طياب الأوراس
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 1 }}
          className="text-lg sm:text-xl md:text-2xl text-yellow-400 font-medium mb-8"
        >
          تجربة فريدة بنكهات أصيلة ولمسة عصرية
        </motion.p>

        {/* Buttons for PC (including download) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 1 }}
          className=" sm:flex flex-row justify-center gap-6"
        >
          <a
            href="#menu"
            className="flex items-center justify-center gap-2 bg-yellow-500 text-black font-semibold px-6 py-3 rounded-2xl duration-300 hover:scale-105 transition-transform"
          >
            <FaUtensils /> تصفح القائمة
          </a>
          <a
            href="#contact"
            className="flex mt-4 sm:mt-0 items-center justify-center gap-2 bg-gray-800 text-white border border-yellow-400 px-6 py-3 rounded-2xl hover:bg-yellow-500 hover:text-black font-semibold transition-colors"
          >
            <FaPhone /> تواصل معنا
          </a>
          <a
            href="/app-download" // replace with actual link
            className="hidden sm:flex items-center justify-center gap-2 bg-green-600 text-white px-6 py-3 rounded-2xl hover:bg-green-700 font-semibold transition-colors"
          >
            <FaDownload /> تحميل التطبيق
          </a>
        </motion.div>
      </motion.div>

      {/* Mobile Download App Button (bottom of Hero only) */}
      <div className="sm:hidden absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20 w-[90%]">
        <a
          href="/app-download"
          className="flex items-center justify-center gap-2 bg-green-600 text-white px-6 py-3 rounded-2xl shadow-lg hover:bg-green-700 font-semibold transition-colors w-full"
        >
          <FaDownload /> تحميل التطبيق
        </a>
      </div>
    </div>
  );
}
