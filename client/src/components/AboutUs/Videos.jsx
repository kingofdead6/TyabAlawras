import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { API_BASE_URL } from "../../../api";

export default function Videos() {
  const [videos, setVideos] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const videoRefs = useRef([]);

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.get(`${API_BASE_URL}/videos`);
      setVideos(response.data.map((item) => item.video) || []);
    } catch (err) {
      console.error("Fetch videos error:", err);
      setError(err.response?.data?.message || "⚠️ خطأ في جلب الفيديوهات");
    } finally {
      setLoading(false);
    }
  };

  const togglePlay = (index) => {
    const video = videoRefs.current[index];
    if (video) {
      if (video.paused) {
        video.play();
      } else {
        video.pause();
      }
    }
  };

  return (
    <section id="videos" className="py-16 relative" dir="rtl">
      <div className="container mx-auto text-center">
        <motion.h2
          initial={{ y: -30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 1 }}
          className="text-3xl md:text-4xl font-bold mb-10 text-yellow-400 drop-shadow-lg"
        >
          معرض الفيديوهات
        </motion.h2>

        {error && (
          <p className="text-red-400 text-center mb-6 font-medium">{error}</p>
        )}

        {loading ? (
          <p className="text-center text-gray-400 mt-10">جارٍ التحميل...</p>
        ) : videos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 justify-items-center">
            {videos.map((video, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="w-[90%]  md:w-[700px] rounded-2xl overflow-hidden shadow-lg bg-gray-900 hover:shadow-yellow-500/30 transform hover:scale-105 transition duration-300"
              >
                <video
                  ref={(el) => (videoRefs.current[idx] = el)}
                  src={video}
                  autoPlay
                  loop
                  muted
                  playsInline
                  controls
                  onClick={() => togglePlay(idx)}
                  className="w-full h-[220px] sm:h-[280px] md:h-[320px] object-cover cursor-pointer"
                />
              </motion.div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-400 mt-10">
            لا توجد فيديوهات في المعرض
          </p>
        )}
      </div>
    </section>
  );
}
