import { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { FaTrash, FaEdit, FaPlus, FaSearch } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { API_BASE_URL } from "../../../api";

export default function AdminMenu() {
  const [menuItems, setMenuItems] = useState([]);
  const [form, setForm] = useState({ name: "", price: "", type: "", image: null });
  const [editingId, setEditingId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("الكل");

  // Extract unique types dynamically
  const types = ["الكل", ...new Set(menuItems.map((item) => item.type))];

  // Filter menu items by search term and selected type
  const filteredMenuItems = menuItems.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === "الكل" || item.type === selectedType;
    return matchesSearch && matchesType;
  });

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/menu`);
      setMenuItems(response.data || []);
    } catch (err) {
      console.error('Fetch menu items error:', err);
      toast.error(err.response?.data?.message || "⚠️ خطأ في جلب عناصر القائمة", {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!form.name) errors.name = "الاسم مطلوب";
    else if (form.name.length > 100) errors.name = "الاسم يجب أن يكون أقل من 100 حرف";
    if (!form.price) errors.price = "السعر مطلوب";
    else if (!/^\d+(\.\d{1,2})?$/.test(form.price)) errors.price = "السعر يجب أن يكون رقمًا صالحًا";
    if (!form.type) errors.type = "النوع مطلوب";
    else if (form.type.length > 50) errors.type = "النوع يجب أن يكون أقل من 50 حرف";
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();
    setFormErrors(errors);

    if (Object.keys(errors).length > 0) return;

    setLoading(true);
    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("price", form.price);
    formData.append("type", form.type);
    if (form.image) formData.append("image", form.image);

    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      if (!token) {
        toast.error("الرجاء تسجيل الدخول كمسؤول", { position: "top-right", autoClose: 3000 });
        setLoading(false);
        return;
      }
      const config = { headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" } };

      if (editingId) {
        await axios.put(`${API_BASE_URL}/menu/${editingId}`, formData, config);
        toast.success("تم تحديث عنصر القائمة بنجاح!", { position: "top-right", autoClose: 3000 });
      } else {
        await axios.post(`${API_BASE_URL}/menu`, formData, config);
        toast.success("تم إضافة عنصر القائمة بنجاح!", { position: "top-right", autoClose: 3000 });
      }

      setForm({ name: "", price: "", type: "", image: null });
      setEditingId(null);
      setShowModal(false);
      setFormErrors({});
      fetchMenuItems();
    } catch (err) {
      console.error('Save menu item error:', err);
      toast.error(err.response?.data?.message || "⚠️ خطأ في حفظ عنصر القائمة", {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item) => {
    setForm({ name: item.name, price: item.price.toString(), type: item.type, image: null });
    setEditingId(item._id);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("هل تريد حذف هذا العنصر؟")) return;
    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      if (!token) {
        toast.error("الرجاء تسجيل الدخول كمسؤول", { position: "top-right", autoClose: 3000 });
        return;
      }
      await axios.delete(`${API_BASE_URL}/menu/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("تم حذف عنصر القائمة بنجاح!", { position: "top-right", autoClose: 3000 });
      fetchMenuItems();
    } catch (err) {
      console.error('Delete menu item error:', err);
      toast.error(err.response?.data?.message || "⚠️ خطأ في حذف عنصر القائمة", {
        position: "top-right",
        autoClose: 3000,
      });
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
          <h1 className="text-3xl font-bold text-yellow-400">إدارة القائمة</h1>
          <button
            onClick={() => {
              setEditingId(null);
              setForm({ name: "", price: "", type: "", image: null });
              setShowModal(true);
            }}
            className="cursor-pointer flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow transition"
          >
            <FaPlus /> إضافة عنصر
          </button>
        </div>

        {/* Search and Type Filters */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div className="relative w-full max-w-md">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-yellow-400" />
            <input
              type="text"
              placeholder="البحث عن عنصر بالاسم..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
              dir="rtl"
            />
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {types.map((type, i) => (
              <button
                key={i}
                onClick={() => setSelectedType(type)}
                className={`cursor-pointer px-4 py-2 rounded-full border transition ${
                  selectedType === type
                    ? "bg-yellow-400 text-black font-semibold"
                    : "bg-transparent text-yellow-300 border-yellow-400 hover:bg-yellow-500 hover:text-black"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Menu Items */}
        {loading ? (
          <p className="text-center text-gray-400 mt-10">جارٍ التحميل...</p>
        ) : filteredMenuItems.length > 0 ? (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredMenuItems.map((item, i) => (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="shadow-red-500 bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition"
              >
                {item.image && (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-4">
                  <h2 className="text-xl font-semibold text-yellow-400">{item.name}</h2>
                  <p className="text-gray-300 mt-2">{item.price} د.ج - {item.type}</p>
                  <div className="flex gap-3 mt-4">
                    <button
                      onClick={() => handleEdit(item)}
                      className="cursor-pointer p-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="cursor-pointer p-2 bg-red-500 hover:bg-red-500 rounded-lg transition"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-400 mt-10">لا توجد عناصر في القائمة</p>
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
                  {editingId ? "تعديل عنصر القائمة" : "إضافة عنصر القائمة"}
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
                      type="text"
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
                  <div>
                    <label className="block text-gray-200 mb-2">النوع</label>
                    <input
                      type="text"
                      value={form.type}
                      onChange={(e) => setForm({ ...form, type: e.target.value })}
                      className={`w-full p-3 rounded-lg bg-gray-700 border ${
                        formErrors.type ? "border-red-500" : "border-gray-600"
                      } text-white`}
                    />
                    {formErrors.type && (
                      <p className="text-red-400 text-sm mt-1">{formErrors.type}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-gray-200 mb-2">الصورة</label>
                    <input
                      type="file"
                      accept="image/jpeg,image/png"
                      onChange={(e) => setForm({ ...form, image: e.target.files[0] })}
                      className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-white"
                    />
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