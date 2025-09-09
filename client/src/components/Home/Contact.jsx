import { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { API_BASE_URL } from "../../../api";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [formErrors, setFormErrors] = useState({});
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    const errors = {};
    if (!form.name) errors.name = "الاسم مطلوب";
    else if (form.name.length > 100) errors.name = "الاسم يجب أن يكون أقل من 100 حرف";
    if (!form.email) errors.email = "البريد الإلكتروني مطلوب";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = "صيغة البريد غير صالحة";
    if (!form.message) errors.message = "الرسالة مطلوبة";
    else if (form.message.length > 1000) errors.message = "الرسالة يجب أن تكون أقل من 1000 حرف";
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();
    setFormErrors(errors);

    if (Object.keys(errors).length > 0) return;

    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/contact`, form);
      setForm({ name: "", email: "", message: "" });
      setSuccess("تم إرسال الرسالة بنجاح!");
      setError("");
    } catch (err) {
      console.error('Submit contact error:', err);
      setError(err.response?.data?.message || "⚠️ خطأ في إرسال الرسالة");
      setSuccess("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-20  text-white">
      <div className="container mx-auto px-4 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl font-bold text-yellow-400 mb-12"
        >
          تواصل معنا
        </motion.h2>

        {/* Contact Form */}
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
              الاسم الكامل
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
            <label htmlFor="email" className="block mb-2 text-white font-semibold">
              البريد الإلكتروني
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="example@email.com"
              className={`w-full p-3 rounded-lg bg-gray-800 text-white border ${
                formErrors.email ? "border-yellow-400" : "border-gray-600"
              } focus:border-yellow-400 outline-none`}
            />
            {formErrors.email && (
              <p className="text-red-400 text-sm mt-1">{formErrors.email}</p>
            )}
          </div>

          <div className="mb-6">
            <label htmlFor="message" className="block mb-2 text-white font-semibold">
              رسالتك
            </label>
            <textarea
              id="message"
              name="message"
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              rows="5"
              placeholder="اكتب رسالتك هنا..."
              className={`w-full p-3 rounded-lg bg-gray-800 text-white border ${
                formErrors.message ? "border-yellow-400" : "border-gray-600"
              } focus:border-yellow-400 outline-none resize-none`}
            />
            {formErrors.message && (
              <p className="text-red-400 text-sm mt-1">{formErrors.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`cursor-pointer w-full py-3 rounded-lg bg-yellow-400 text-black font-bold text-lg hover:bg-yellow-300 transition ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "جارٍ الإرسال..." : "إرسال"}
          </button>
        </motion.form>
      </div>
    </section>
  );
}