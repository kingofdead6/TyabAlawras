import { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { FaTrash, FaStar } from "react-icons/fa";
import { API_BASE_URL } from "../../../api";

export default function AdminRating() {
  const [ratings, setRatings] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    fetchRatings();
  }, []);

  const fetchRatings = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      const response = await axios.get(`${API_BASE_URL}/rating`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRatings(response.data);
    } catch (err) {
      console.error("Fetch ratings error:", err);
      setError(err.response?.data?.message || "⚠️ خطأ في جلب التقييمات");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      await axios.delete(`${API_BASE_URL}/rating/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchRatings();
    } catch (err) {
      console.error("Delete rating error:", err);
      setError(err.response?.data?.message || "⚠️ خطأ في حذف التقييم");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="min-h-screen text-white py-12 px-4 pt-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-6xl mx-auto"
      >
        <h1 className="text-3xl font-bold text-yellow-400 mb-8 text-center">
          إدارة التقييمات
        </h1>

        {error && <p className="text-red-400 text-center mb-6 font-medium">{error}</p>}

        {loading ? (
          <p className="text-center text-gray-400">جارٍ التحميل...</p>
        ) : ratings.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {ratings.map((rating, i) => (
              <motion.div
                key={rating._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-2xl transition shadow-yellow-400"
                dir="rtl"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-semibold text-yellow-400">{rating.name}</h2>
                    <div className="flex gap-1 mt-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <FaStar
                          key={star}
                          size={20}
                          className={star <= rating.rating ? "text-yellow-400" : "text-gray-400"}
                        />
                      ))}
                    </div>
                    <p className="text-gray-300 mt-2">التعليق: {rating.comment}</p>
                    <p className="text-gray-400 text-sm mt-2">
                      تاريخ: {new Date(rating.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDelete(rating._id)}
                    disabled={deletingId === rating._id}
                    className={`cursor-pointer flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg shadow transition ${
                      deletingId === rating._id ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    <FaTrash /> {deletingId === rating._id ? "جارٍ الحذف..." : "حذف"}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-400 mt-10">لا توجد تقييمات</p>
        )}
      </motion.div>
    </div>
  );
}