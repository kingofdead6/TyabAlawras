import { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { FaTrash, FaEdit, FaPlus, FaSearch } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { API_BASE_URL } from "../../../api";

export default function AdminDeliveryAreas() {
  const [areas, setAreas] = useState([]);
  const [form, setForm] = useState({ name: "", price: "" });
  const [editingId, setEditingId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Filter areas by search term
  const filteredAreas = areas.filter((area) =>
    area.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    fetchAreas();
  }, []);

  const fetchAreas = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      const response = await axios.get(`${API_BASE_URL}/delivery-areas`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAreas(response.data || []);
    } catch (err) {
      toast.error("⚠️ خطأ في جلب المناطق", { position: "top-right", autoClose: 3000 });
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!form.name) errors.name = "الاسم مطلوب";
    if (!form.price || isNaN(form.price) || form.price < 0)
      errors.price = "السعر يجب أن يكون رقمًا إيجابيًا";
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setLoading(true);
    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };

      if (editingId) {
        await axios.put(`${API_BASE_URL}/delivery-areas/${editingId}`, form, config);
        toast.success("✅ تم تحديث المنطقة", { position: "top-right", autoClose: 3000 });
      } else {
        await axios.post(`${API_BASE_URL}/delivery-areas`, form, config);
        toast.success("✅ تم إضافة المنطقة", { position: "top-right", autoClose: 3000 });
      }

      setForm({ name: "", price: "" });
      setEditingId(null);
      setShowModal(false);
      setFormErrors({});
      fetchAreas();
    } catch (err) {
      toast.error("⚠️ خطأ في الحفظ", { position: "top-right", autoClose: 3000 });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (area) => {
    setForm({ name: area.name, price: area.price.toString() });
    setEditingId(area._id);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("هل تريد حذف هذه المنطقة؟")) return;
    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      await axios.delete(`${API_BASE_URL}/delivery-areas/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("🗑️ تم حذف المنطقة", { position: "top-right", autoClose: 3000 });
      fetchAreas();
    } catch (err) {
      toast.error("⚠️ خطأ في الحذف", { position: "top-right", autoClose: 3000 });
    }
  };

  return (
    <div className="min-h-screen text-white py-12 px-4 pt-20">
      <ToastContainer />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-6xl mx-auto"
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-yellow-400">إدارة مناطق التوصيل</h1>
          <button
            onClick={() => {
              setForm({ name: "", price: "" });
              setEditingId(null);
              setShowModal(true);
            }}
            className="cursor-pointer flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow transition"
          >
            <FaPlus /> إضافة منطقة
          </button>
        </div>

        {/* Search */}
        <div className="relative w-full max-w-md mb-8">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-yellow-400" />
          <input
            type="text"
            placeholder="ابحث عن منطقة..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
            dir="rtl"
          />
        </div>

        {/* Delivery Areas List */}
        {loading ? (
          <p className="text-center text-gray-400 mt-10">جارٍ التحميل...</p>
        ) : filteredAreas.length > 0 ? (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredAreas.map((area, i) => (
              <motion.div
                key={area._id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="bg-gray-800 rounded-xl shadow-lg p-4 hover:shadow-2xl transition shadow-yellow-400"
              >
                <h2 className="text-xl font-semibold text-yellow-400">{area.name}</h2>
                <p className="text-gray-300 mt-2">{area.price} د.ج</p>
                <div className="flex gap-3 mt-4">
                  <button
                    onClick={() => handleEdit(area)}
                    className="cursor-pointer p-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(area._id)}
                    className="cursor-pointer p-2 bg-red-500 hover:bg-red-600 rounded-lg transition"
                  >
                    <FaTrash />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-400 mt-10">لا توجد مناطق</p>
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
                  {editingId ? "تعديل المنطقة" : "إضافة منطقة"}
                </h2>
                <form onSubmit={handleSubmit} dir="rtl" className="space-y-4">
                  <div>
                    <label className="block text-gray-200 mb-2">الاسم</label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className={`w-full p-3 rounded-lg bg-gray-700 border ${
                        formErrors.name ? "border-red-500" : "border-gray-600"
                      } text-white`}
                    />
                    {formErrors.name && (
                      <p className="text-red-400 text-sm mt-1">{formErrors.name}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-gray-200 mb-2">السعر (د.ج)</label>
                    <input
                      type="number"
                      value={form.price}
                      onChange={(e) => setForm({ ...form, price: e.target.value })}
                      className={`w-full p-3 rounded-lg bg-gray-700 border ${
                        formErrors.price ? "border-red-500" : "border-gray-600"
                      } text-white`}
                    />
                    {formErrors.price && (
                      <p className="text-red-400 text-sm mt-1">{formErrors.price}</p>
                    )}
                  </div>
                  <div className="flex justify-between mt-6">
                    <button
                      type="submit"
                      disabled={loading}
                      className={`cursor-pointer bg-yellow-400 hover:bg-yellow-500 text-black px-6 py-2 rounded-lg font-bold transition ${
                        loading ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                    >
                      {loading ? "جارٍ الحفظ..." : editingId ? "تحديث" : "إضافة"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      disabled={loading}
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
