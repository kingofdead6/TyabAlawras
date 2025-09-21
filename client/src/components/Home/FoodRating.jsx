import { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { FaStar } from "react-icons/fa";
import { API_BASE_URL } from "../../../api";

export default function FoodRating() {
  const [form, setForm] = useState({ name: "", rating: 0, comment: "" });
  const [formErrors, setFormErrors] = useState({});
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [hoverRating, setHoverRating] = useState(0);

  const validateForm = () => {
    const errors = {};
    if (!form.name) errors.name = "الاسم مطلوب";
    else if (form.name.length > 100) errors.name = "الاسم يجب أن يكون أقل من 100 حرف";
    if (form.rating < 1 || form.rating > 5) errors.rating = "التقييم يجب أن يكون بين 1 و 5 نجوم";
    if (!form.comment) errors.comment = "التعليق مطلوب";
    else if (form.comment.length > 1000) errors.comment = "التعليق يجب أن يكون أقل من 1000 حرف";
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();
    setFormErrors(errors);

    if (Object.keys(errors).length > 0) return;

    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/rating`, form);
      setForm({ name: "", rating: 0, comment: "" });
      setSuccess("تم إرسال التقييم بنجاح!");
      setError("");
    } catch (err) {
      console.error("Submit rating error:", err);
      setError(err.response?.data?.message || "⚠️ خطأ في إرسال التقييم");
      setSuccess("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="rating" className="py-20 text-white min-h-screen">
      <div className="container mx-auto px-4 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl font-bold text-yellow-400 mb-12"
        >
          قيّم طعامنا
        </motion.h2>

        {/* Rating Form */}
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-xl mx-auto bg-black/70 p-8 rounded-2xl shadow-lg border border-yellow-400/20 shadow-yellow-400"
          dir="rtl"
        >
          {error && <p className="text-red-400 text-center mb-4">{error}</p>}
          {success && <p className="text-green-400 text-center mb-4">{success}</p>}

          <div className="mb-6">
            <label htmlFor="name" className="block mb-2 text-white font-semibold">
              الاسم
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="اكتب اسمك"
              className={`w-full p-3 rounded-lg bg-gray-800 text-white border ${
                formErrors.name ? "border-yellow-400" : "border-gray-600"
              } focus:border-yellow-400 outline-none`}
            />
            {formErrors.name && (
              <p className="text-red-400 text-sm mt-1">{formErrors.name}</p>
            )}
          </div>

          <div className="mb-6">
            <label className="block mb-2 text-white font-semibold">
              التقييم
            </label>
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <FaStar
                  key={star}
                  size={30}
                  className={`cursor-pointer ${
                    (hoverRating || form.rating) >= star ? "text-yellow-400" : "text-gray-400"
                  }`}
                  onClick={() => setForm({ ...form, rating: star })}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                />
              ))}
            </div>
            {formErrors.rating && (
              <p className="text-red-400 text-sm mt-1">{formErrors.rating}</p>
            )}
          </div>

          <div className="mb-6">
            <label htmlFor="comment" className="block mb-2 text-white font-semibold">
              التعليق
            </label>
            <textarea
              id="comment"
              name="comment"
              value={form.comment}
              onChange={(e) => setForm({ ...form, comment: e.target.value })}
              rows="5"
              placeholder="اكتب تعليقك هنا..."
              className={`w-full p-3 rounded-lg bg-gray-800 text-white border ${
                formErrors.comment ? "border-yellow-400" : "border-gray-600"
              } focus:border-yellow-400 outline-none resize-none`}
            />
            {formErrors.comment && (
              <p className="text-red-400 text-sm mt-1">{formErrors.comment}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`cursor-pointer w-full py-3 rounded-lg bg-yellow-400 text-black font-bold text-lg hover:bg-yellow-300 transition ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "جارٍ الإرسال..." : "إرسال التقييم"}
          </button>
        </motion.form>
      </div>
    </section>
  );
}