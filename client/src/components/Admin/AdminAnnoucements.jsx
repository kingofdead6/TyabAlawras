import { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { FaTrash, FaEdit, FaPlus } from "react-icons/fa";
import { API_BASE_URL } from "../../../api";

export default function AdminAnnouncements() {
  const [announcements, setAnnouncements] = useState([]);
  const [form, setForm] = useState({ title: "", description: "", image: null });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/announcements`);
      setAnnouncements(response.data);
    } catch (err) {
      setError("⚠️ خطأ في جلب الإعلانات");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("description", form.description);
    if (form.image) formData.append("image", form.image);

    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" } };

      if (editingId) {
        await axios.put(`${API_BASE_URL}/announcements/${editingId}`, formData, config);
      } else {
        await axios.post(`${API_BASE_URL}/announcements`, formData, config);
      }

      setForm({ title: "", description: "", image: null });
      setEditingId(null);
      setShowModal(false);
      fetchAnnouncements();
    } catch (err) {
      setError("⚠️ خطأ في حفظ الإعلان");
    }
  };

  const handleEdit = (announcement) => {
    setForm({ title: announcement.title, description: announcement.description, image: null });
    setEditingId(announcement._id);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      await axios.delete(`${API_BASE_URL}/announcements/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchAnnouncements();
    } catch (err) {
      setError("⚠️ خطأ في حذف الإعلان");
    }
  };

  return (
    <div className="min-h-screen text-white py-12 px-4 pt-20">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="max-w-6xl mx-auto"
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-yellow-400">إدارة الإعلانات</h1>
          <button
            onClick={() => {
              setEditingId(null);
              setForm({ title: "", description: "", image: null });
              setShowModal(true);
            }}
            className="cursor-pointer flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
          >
            <FaPlus /> إضافة إعلان
          </button>
        </div>

        {error && <p className="text-red-400 text-center mb-4">{error}</p>}

        {/* Announcements as Cards */}
        {announcements.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {announcements.map((announcement, i) => (
              <motion.div
                key={announcement._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className=" shadow-red-500 bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition"
              >
                {announcement.image && (
                  <img
                    src={announcement.image}
                    alt={announcement.title}
                    className="w-full h-40 object-cover"
                  />
                )}
                <div className="p-4">
                  <h2 className="text-xl font-semibold text-yellow-400">{announcement.title}</h2>
                  <p className="text-gray-300 mt-2 line-clamp-3">{announcement.description}</p>
                  <div className="flex gap-3 mt-4">
                    <button
                      onClick={() => handleEdit(announcement)}
                      className="cursor-pointer p-2 bg-blue-500 hover:bg-blue-600 rounded-lg"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(announcement._id)}
                      className="cursor-pointer p-2 bg-red-500 hover:bg-red-600 rounded-lg"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-400 mt-10">لا توجد إعلانات</p>
        )}

        {/* Add/Edit Modal */}
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
                className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md"
              >
                <h2 className="text-2xl font-bold text-yellow-400 mb-4 text-center">
                  {editingId ? "تعديل الإعلان" : "إضافة إعلان"}
                </h2>
                <form onSubmit={handleSubmit} dir="rtl" className="space-y-4">
                  <div>
                    <label className="block text-gray-200 mb-2">العنوان</label>
                    <input
                      type="text"
                      value={form.title}
                      onChange={(e) => setForm({ ...form, title: e.target.value })}
                      className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-200 mb-2">الوصف</label>
                    <textarea
                      value={form.description}
                      onChange={(e) => setForm({ ...form, description: e.target.value })}
                      className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-200 mb-2">الصورة</label>
                    <input
                      type="file"
                      onChange={(e) => setForm({ ...form, image: e.target.files[0] })}
                      className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-white"
                    />
                  </div>
                  <div className="flex justify-between mt-6">
                    <button
                      type="submit"
                      className="cursor-pointer bg-yellow-400 hover:bg-yellow-500 text-black px-6 py-2 rounded-lg font-bold"
                    >
                      {editingId ? "تحديث" : "إضافة"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="cursor-pointer bg-gray-600 hover:bg-gray-700 px-6 py-2 rounded-lg"
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
