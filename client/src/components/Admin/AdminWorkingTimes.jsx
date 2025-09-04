import React, { useState, useEffect } from "react"; 
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Clock, XCircle, X } from "lucide-react";
import axios from "axios";
import { API_BASE_URL } from "../../../api.js";

export default function OpeningDashboard() {
  const [WorkingSchedule, setWorkingSchedule] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null);
  const [formData, setFormData] = useState({
    day: "",
    open: "",
    close: "",
    isClosed: false,
  });

  const allDays = [
    "السبت", "الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة",
  ];

  useEffect(() => {
    const fetchWorkingTimes = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/Working-times`);
        const fullSchedule = allDays.map((day) => {
          const existing = response.data.find((item) => item.day === day);
          return (
            existing || { day, open: null, close: null, isClosed: false, _id: day }
          );
        });
        setWorkingSchedule(fullSchedule);
      } catch (err) {
        setError(err.response?.data?.message || "⚠️ خطأ في جلب أوقات المكتبة");
      }
    };
    fetchWorkingTimes();
  }, []);

  const openEditModal = (day) => {
    setSelectedDay(day);
    setFormData({
      day: day.day,
      open: day.open || "",
      close: day.close || "",
      isClosed: day.isClosed,
    });
    setIsModalOpen(true);
    setError("");
    setSuccess("");
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
      ...(field === "isClosed" && value ? { open: "", close: "" } : {}),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${API_BASE_URL}/working-times`,
        formData,
        { headers: { "Content-Type": "application/json" } }
      );
      setWorkingSchedule((prev) =>
        prev.map((item) =>
          item.day === selectedDay.day
            ? { ...response.data.time, _id: response.data.time._id || item._id }
            : item
        )
      );
      setSuccess("✅ تم تحديث أوقات اليوم بنجاح");
      setIsModalOpen(false);
      setFormData({ day: "", open: "", close: "", isClosed: false });
      setSelectedDay(null);
    } catch (err) {
      setError(err.response?.data?.message || "❌ فشل تحديث أوقات اليوم");
    }
  };

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
    <section id="working-times" className="py-16 pt-20">
      <div className="container mx-auto px-4 text-center min-h-[76vh]">
        <h2 className="text-3xl md:text-4xl font-bold mb-8 text-yellow-400 drop-shadow-lg">
          أوقات العمل
        </h2>

        {error && <p className="text-red-400 mb-6">{error}</p>}
        {success && <p className="text-green-400 mb-6">{success}</p>}

        <div className="flex flex-wrap justify-center gap-6 max-w-6xl mx-auto">
          {WorkingSchedule.map((item) => (
            <motion.div
              key={item._id}
              whileHover={{ scale: 1.05 }}
              onClick={() => openEditModal(item)}
              className="cursor-pointer bg-black/40 backdrop-blur-md border border-gray-700 rounded-2xl shadow-red-500 shadow-lg p-6 min-w-[200px] max-w-[250px] flex flex-col items-center text-white transition"
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

        {/* Modal with animation */}
        <AnimatePresence>
          {isModalOpen && (
            <motion.div
              key="modal-backdrop"
              className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                key="modal-content"
                className="relative w-full max-w-md p-8 bg-gray-800 text-white backdrop-blur-xl rounded-2xl shadow-yellow-500/40 border border-gray-700"
                initial={{ scale: 0.8, opacity: 0, y: 40 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.8, opacity: 0, y: 40 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
              >
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="cursor-pointer absolute top-4 right-4 text-gray-300 hover:text-yellow-400"
                >
                  <X size={24} />
                </button>

                <h3 className="text-2xl font-bold text-yellow-400 mb-6">
                  تعديل أوقات {formData.day}
                </h3>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.isClosed}
                      onChange={(e) => handleInputChange("isClosed", e.target.checked)}
                      className="w-5 h-5 accent-yellow-400 rounded cursor-pointer"
                    />
                    <label>مغلق</label>
                  </div>

                  {!formData.isClosed && (
                    <div className="flex flex-col sm:flex-row gap-4">
                      <div className="flex-1">
                        <label className="block mb-1">وقت الفتح</label>
                        <input
                          type="time"
                          value={formData.open}
                          onChange={(e) => handleInputChange("open", e.target.value)}
                          className="w-full p-2 rounded-lg bg-black/60 border border-gray-600"
                          required
                        />
                      </div>
                      <div className="flex-1">
                        <label className="block mb-1">وقت الإغلاق</label>
                        <input
                          type="time"
                          value={formData.close}
                          onChange={(e) => handleInputChange("close", e.target.value)}
                          className="w-full p-2 rounded-lg bg-black/60 border border-gray-600"
                          required
                        />
                      </div>
                    </div>
                  )}

                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="cursor-pointer w-full bg-yellow-400 text-black font-semibold py-3 rounded-lg shadow-lg hover:bg-yellow-500 transition"
                  >
                    حفظ التغييرات
                  </motion.button>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
