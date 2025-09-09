import { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { FaTrash } from "react-icons/fa";
import { API_BASE_URL } from "../../../api";

export default function AdminContact() {
  const [contacts, setContacts] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      const response = await axios.get(`${API_BASE_URL}/contact`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setContacts(response.data);
    } catch (err) {
      console.error('Fetch contacts error:', err);
      setError(err.response?.data?.message || "⚠️ خطأ في جلب الرسائل");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      await axios.delete(`${API_BASE_URL}/contact/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchContacts();
    } catch (err) {
      console.error('Delete contact error:', err);
      setError(err.response?.data?.message || "⚠️ خطأ في حذف الرسالة");
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
          إدارة الرسائل
        </h1>

        {error && <p className="text-red-400 text-center mb-6 font-medium">{error}</p>}

        {loading ? (
          <p className="text-center text-gray-400">جارٍ التحميل...</p>
        ) : contacts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {contacts.map((contact, i) => (
              <motion.div
                key={contact._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-2xl transition shadow-yellow-400"
                dir="rtl"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-semibold text-yellow-400">{contact.name}</h2>
                    <p className="text-gray-300 mt-2">البريد: {contact.email}</p>
                    <p className="text-gray-300 mt-2">الرسالة: {contact.message}</p>
                    <p className="text-gray-400 text-sm mt-2">
                      تاريخ: {new Date(contact.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDelete(contact._id)}
                    disabled={deletingId === contact._id}
                    className={`cursor-pointer flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg shadow transition ${
                      deletingId === contact._id ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    <FaTrash /> {deletingId === contact._id ? "جارٍ الحذف..." : "حذف"}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-400 mt-10">لا توجد رسائل</p>
        )}
      </motion.div>
    </div>
  );
}