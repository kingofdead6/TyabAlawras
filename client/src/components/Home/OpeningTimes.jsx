import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, XCircle } from "lucide-react";
import axios from "axios";
import { API_BASE_URL } from "../../../api";

export default function OpeningTimes() {
  const [WorkingSchedule, setWorkingSchedule] = useState([]);
  const [error, setError] = useState("");

  const allDays = [
    "السبت",
    "الأحد",
    "الإثنين",
    "الثلاثاء",
    "الأربعاء",
    "الخميس",
    "الجمعة",
  ];

  useEffect(() => {
    const fetchWorkingTimes = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/working-times`);
        const fullSchedule = allDays.map((day) => {
          const existing = response.data.find((item) => item.day === day);
          return (
            existing || {
              day,
              open: null,
              close: null,
              isClosed: false,
              _id: day,
            }
          );
        });
        setWorkingSchedule(fullSchedule);
      } catch (err) {
        setError(err.response?.data?.message || "⚠️ خطأ في جلب أوقات العمل");
      }
    };
    fetchWorkingTimes();
  }, []);

  const formatTime = (time) => {
    if (!time) return "غير محدد";
    const [hours, minutes] = time.split(":");
    const hourNum = parseInt(hours, 10);
    const period = hourNum >= 12 ? "مساءً" : "صباحًا";
    const formattedHour =
      hourNum > 12 ? hourNum - 12 : hourNum === 0 ? 12 : hourNum;
    return `${formattedHour}:${minutes} ${period}`;
  };

  return (
    <section id="Working-times" className="py-16">
      <div className="container mx-auto px-4 text-center">
        {/* Title */}
        <h2 className="text-3xl md:text-4xl font-bold mb-8 text-yellow-400 drop-shadow-lg">
          أوقات العمل
        </h2>

        {error && (
          <p className="text-red-400 text-center mb-6 font-medium">{error}</p>
        )}

        <div className="flex gap-6 max-w-6xl mx-auto overflow-x-auto scrollbar-hide sm:flex-wrap sm:justify-center overflow-y-hidden pb-10">
  {WorkingSchedule.map((item) => (
    <motion.div
      key={item._id}
      whileHover={{ scale: 1.05 }}
      className="bg-black/40 backdrop-blur-md border border-gray-700 rounded-2xl shadow-yellow-400 shadow-lg p-6 min-w-[200px] max-w-[250px] flex flex-col items-center text-white transition flex-shrink-0"
    >
      {item.isClosed ? (
        <XCircle className="w-8 h-8 mb-3 text-red-400" />
      ) : (
        <Calendar className="w-8 h-8 mb-3 text-yellow-400" />
      )}

      <p className="text-lg font-bold">{item.day}</p>

      {item.isClosed ? (
        <p className="mt-2 text-red-400 font-semibold">مغلق</p>
      ) : (
        <div className="flex flex-col items-center gap-1 mt-2 text-yellow-300">
          <span>{formatTime(item.open)}</span>
          <span className="text-gray-400">—</span>
          <span>{formatTime(item.close)}</span>
        </div>
      )}

      {!item.isClosed && <Clock className="w-6 h-6 mt-4 text-yellow-400" />}
    </motion.div>
  ))}
</div>

      </div>
    </section>
  );
}
