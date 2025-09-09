import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <section className="flex items-center justify-center h-screen  text-white px-4">
      <div className="text-center">
        {/* 404 Title */}
        <motion.h1
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="text-7xl md:text-9xl font-extrabold text-yellow-400 drop-shadow-[0_0_15px_#ff1a1a]"
        >
          404
        </motion.h1>

        {/* Subtitle */}
        <motion.h2
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mt-4 text-2xl md:text-3xl font-semibold text-yellow-300"
        >
          الصفحة غير موجودة
        </motion.h2>

        {/* Description */}
        <motion.p
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="mt-3 text-gray-300"
        >
          عذراً، الصفحة التي تبحث عنها غير متوفرة.  
          يمكنك العودة إلى الرئيسية.
        </motion.p>

        {/* Go Home Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mt-8"
        >
          <Link
            to="/"
            className="cursor-pointer px-6 py-3 bg-yellow-400 text-black font-semibold rounded-full shadow-lg hover:bg-yellow-500 transition"
          >
            العودة للرئيسية
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
