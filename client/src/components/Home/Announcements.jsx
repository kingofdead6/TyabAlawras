import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { API_BASE_URL } from "../../../api";

export default function Announcements() {
  const [announcements, setAnnouncements] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.get(`${API_BASE_URL}/announcements`);
      setAnnouncements(response.data || []);
    } catch (err) {
      console.error('Fetch announcements error:', err);
      setError(err.response?.data?.message || "⚠️ خطأ في جلب الإعلانات");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="announcements" className="py-20" dir="rtl">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-4xl font-bold text-yellow-400 drop-shadow-[0_0_10px_red] mb-12">
          الإعلانات
        </h2>

        {error && <p className="text-red-400 text-center mb-6 font-medium">{error}</p>}

        {loading ? (
          <p className="text-center text-gray-400 mt-10">جارٍ التحميل...</p>
        ) : announcements.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-8">
            {announcements.map((item, i) => (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.2 }}
                viewport={{ once: true }}
                className="bg-black/70 rounded-2xl overflow-hidden shadow-lg shadow-red-500 hover:shadow-2xl border border-yellow-400/20"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-56 object-cover"
                />
                <div className="p-6 text-white">
                  <h3 className="text-2xl font-semibold mb-3 text-yellow-300 drop-shadow-[0_0_5px_red]">
                    {item.title}
                  </h3>
                  <p className="text-gray-200 text-sm leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-400 mt-10">لا توجد إعلانات متاحة</p>
        )}
      </div>
    </section>
  );
}