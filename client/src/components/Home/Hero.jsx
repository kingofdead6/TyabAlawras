import { motion } from "framer-motion";
import { FaUtensils, FaPhone } from "react-icons/fa";

export default function Hero() {
  return (
    <div id="home"
      className="h-screen bg-cover bg-center relative flex items-center justify-center text-white"
      style={{ backgroundImage: "url('https://res.cloudinary.com/dtwa3lxdk/image/upload/v1757414467/20250909_112204_1_1_u9cy5g.jpg')" }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-gray-900/30 to-black/40" />

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="relative z-10 text-center px-6 max-w-3xl"
      >
        <motion.h1
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, duration: 1 }}
          className="text-6xl font-bold mb-6 drop-shadow-[0_0_15px_#c9ab00]"
        >
          طياب الأوراس
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 1 }}
          className="text-xl md:text-2xl text-yellow-400 font-medium mb-8"
        >
          تجربة فريدة بنكهات أصيلة ولمسة عصرية
        </motion.p>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 1 }}
          className="flex justify-center gap-6"
        >
          <a
            href="#menu"
            className="flex items-center gap-2 bg-yellow-500 text-black font-semibold px-6 py-3 rounded-2xl duration-300 hover:scale-105 transition-transform"
          >
            <FaUtensils /> تصفح القائمة
          </a>
          <a
            href="#contact"
            className="flex items-center gap-2 duration-300 transform bg-gray-800 text-white border border-yellow-400 px-6 py-3 rounded-2xl hover:bg-yellow-500 hover:text-black font-semibold transition-colors "
          >
            <FaPhone /> تواصل معنا
          </a>
        </motion.div>
      </motion.div>
    </div>
  );
}
