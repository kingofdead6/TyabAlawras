import { motion } from "framer-motion";
import { FaClock } from "react-icons/fa";

export default function ShopLocationPage() {
  const shopName = "طياب الأوراس";

  return (
    <div id="location" className="min-h-screen  text-white py-12 px-4 pt-20">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-5xl mx-auto text-center"
      >
        <h1 className="text-3xl font-bold text-yellow-400 mb-8">
          موقع المتجر - {shopName}
        </h1>

        {/* Your iframe map (responsive) */}
        <div className="w-full h-[500px] md:h-[600px] rounded-lg overflow-hidden shadow-lg border border-gray-700 shadow-amber-300 hover:shadow-2xl transition-shadow duration-300">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3246.6030547769547!2d6.181976!3d35.5388058!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12f411007a9990b5%3A0x9f18f536aacfc566!2z2LfZitin2Kgg2KfZhNij2YjYsdin2LM!5e0!3m2!1sen!2sdz!4v1756932614835!5m2!1sen!2sdz"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Shop Location"
          ></iframe>
        </div>
      </motion.div>
    </div>
  );
}
