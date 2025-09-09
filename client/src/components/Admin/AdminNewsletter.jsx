import { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { FaTrash, FaPaperPlane } from "react-icons/fa";
import { API_BASE_URL } from "../../../api";

export default function AdminNewsletter() {
  const [subscribers, setSubscribers] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedSubscribers, setSelectedSubscribers] = useState([]);
  const [form, setForm] = useState({ subject: "", message: "", isHtml: false });
  const [formErrors, setFormErrors] = useState({});
  const [sendLoading, setSendLoading] = useState(false);

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const fetchSubscribers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      const response = await axios.get(`${API_BASE_URL}/newsletter`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSubscribers(response.data);
    } catch (err) {
      console.error("Fetch subscribers error:", err);
      setError(err.response?.data?.message || "⚠️ خطأ في جلب المشتركين");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      await axios.delete(`${API_BASE_URL}/newsletter/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchSubscribers();
    } catch (err) {
      console.error("Delete subscriber error:", err);
      setError(err.response?.data?.message || "⚠️ خطأ في حذف المشترك");
    } finally {
      setDeletingId(null);
    }
  };

  const validateForm = () => {
    const errors = {};
    if (selectedSubscribers.length === 0) {
      errors.subscribers = "يجب اختيار مشترك واحد على الأقل";
    }
    return errors;
  };

  const handleSendNewsletter = async (e) => {
    e.preventDefault();
    const errors = validateForm();
    setFormErrors(errors);

    if (Object.keys(errors).length > 0) return;

    setSendLoading(true);
    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      await axios.post(
        `${API_BASE_URL}/newsletter/send`,
        {
          subscriberIds: selectedSubscribers,
          subject: form.subject,
          message: form.message,
          isHtml: form.isHtml,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setForm({ subject: "", message: "", isHtml: false });
      setSelectedSubscribers([]);
      setShowModal(false);
      setFormErrors({});
    } catch (err) {
      console.error("Send newsletter error:", err);
      setError(err.response?.data?.message || "⚠️ خطأ في إرسال النشرة البريدية");
    } finally {
      setSendLoading(false);
    }
  };

  const toggleSubscriber = (id) => {
    setSelectedSubscribers((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedSubscribers.length === subscribers.length) {
      setSelectedSubscribers([]); 
    } else {
      setSelectedSubscribers(subscribers.map((s) => s._id)); 
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
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-yellow-400">إدارة النشرة البريدية</h1>
          <button
            onClick={() => {
              setForm({ subject: "", message: "", isHtml: false });
              setSelectedSubscribers([]);
              setShowModal(true);
            }}
            className="cursor-pointer flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow transition"
          >
            <FaPaperPlane /> إرسال نشرة بريدية
          </button>
        </div>

        {error && <p className="text-red-400 text-center mb-6 font-medium">{error}</p>}

        {loading ? (
          <p className="text-center text-gray-400">جارٍ التحميل...</p>
        ) : subscribers.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {subscribers.map((subscriber, i) => (
              <motion.div
                key={subscriber._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-2xl transition shadow-yellow-400"
                dir="rtl"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-semibold text-yellow-400">
                      {subscriber.email}
                    </h2>
                    <p className="text-gray-400 text-sm mt-2">
                      تاريخ الاشتراك:{" "}
                      {new Date(subscriber.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDelete(subscriber._id)}
                    disabled={deletingId === subscriber._id}
                    className={`cursor-pointer flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg shadow transition ${
                      deletingId === subscriber._id
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }`}
                  >
                    <FaTrash />
                    {deletingId === subscriber._id ? "جارٍ الحذف..." : "حذف"}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-400 mt-10">لا توجد اشتراكات</p>
        )}

        {/* Send Newsletter Modal */}
        <AnimatePresence>
          {showModal && (
            <motion.div
              className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.8 }}
                className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-lg"
              >
                <h2 className="text-2xl font-bold text-yellow-400 mb-4 text-center">
                  إرسال نشرة بريدية
                </h2>
                <form onSubmit={handleSendNewsletter} dir="rtl" className="space-y-4">
                  {/* Select All + Subscribers */}
                  <div>
                    <label className="block text-gray-200 mb-2">المستلمين</label>
                    <div className="flex items-center mb-2">
                      <input
                        type="checkbox"
                        checked={selectedSubscribers.length === subscribers.length}
                        onChange={toggleSelectAll}
                        className="cursor-pointer accent-amber-300 h-5 w-5 text-yellow-400 border-gray-600 rounded focus:ring-yellow-400"
                      />
                      <span className="mr-2">تحديد الكل</span>
                    </div>
                    <div className="max-h-40 overflow-y-auto space-y-2 bg-gray-700 p-3 rounded">
                      {subscribers.map((sub) => (
                        <div key={sub._id} className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={selectedSubscribers.includes(sub._id)}
                            onChange={() => toggleSubscriber(sub._id)}
                            className="accent-amber-300 h-4 w-4 text-yellow-400 border-gray-600 rounded focus:ring-yellow-400"
                          />
                          <span>{sub.email}</span>
                        </div>
                      ))}
                    </div>
                    {formErrors.subscribers && (
                      <p className="text-red-400 text-sm mt-1">{formErrors.subscribers}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-gray-200 mb-2">الموضوع</label>
                    <input
                      type="text"
                      value={form.subject}
                      onChange={(e) => setForm({ ...form, subject: e.target.value })}
                      className={`w-full p-3 rounded-lg bg-gray-700 border ${
                        formErrors.subject ? "border-red-500" : "border-gray-600"
                      } text-white`}
                    />
                    {formErrors.subject && (
                      <p className="text-red-400 text-sm mt-1">{formErrors.subject}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-gray-200 mb-2">الرسالة</label>
                    <textarea
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      rows="5"
                      className={`w-full p-3 rounded-lg bg-gray-700 border ${
                        formErrors.message ? "border-red-500" : "border-gray-600"
                      } text-white resize-none`}
                    />
                    {formErrors.message && (
                      <p className="text-red-400 text-sm mt-1">{formErrors.message}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={form.isHtml}
                      onChange={(e) => setForm({ ...form, isHtml: e.target.checked })}
                      className="cursor-pointer h-4 w-4 text-yellow-400 border-gray-600 rounded focus:ring-yellow-400 accent-amber-300"
                    />
                    <span>إرسال كـ HTML</span>
                  </div>
                  <div className="flex justify-between mt-6">
                    <button
                      type="submit"
                      disabled={sendLoading}
                      className={`cursor-pointer bg-yellow-400 hover:bg-yellow-500 text-black px-6 py-2 rounded-lg font-bold transition ${
                        sendLoading ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                    >
                      {sendLoading ? "جارٍ الإرسال..." : "إرسال"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      disabled={sendLoading}
                      className="cursor-pointer bg-gray-600 hover:bg-gray-700 px-6 py-2 rounded-lg transition"
                    >
                      إلغاء
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
