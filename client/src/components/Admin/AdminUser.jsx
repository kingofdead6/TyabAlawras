import { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { FaTrash, FaEdit, FaPlus, FaEye, FaEyeSlash } from "react-icons/fa";
import { API_BASE_URL } from "../../../api";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ email: "", password: "", usertype: "admin" });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      const response = await axios.get(`${API_BASE_URL}/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // hide super admins
      setUsers(response.data.filter((u) => u.usertype !== "superadmin"));
    } catch (err) {
      setError("خطأ في جلب المستخدمين");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };

      if (editingId) {
        await axios.put(`${API_BASE_URL}/users/${editingId}`, form, config);
      } else {
        await axios.post(`${API_BASE_URL}/users`, { ...form, usertype: "admin" }, config);
      }

      setForm({ email: "", password: "", usertype: "admin" });
      setEditingId(null);
      setShowModal(false);
      setShowPassword(false);
      fetchUsers();
    } catch (err) {
      setError("خطأ في حفظ المستخدم");
    }
  };

  const handleEdit = (user) => {
    setForm({ email: user.email, password: "", usertype: "admin" });
    setEditingId(user._id);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      await axios.delete(`${API_BASE_URL}/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchUsers();
    } catch (err) {
      setError("خطأ في حذف المستخدم");
    }
  };

  const filteredUsers = users.filter((u) =>
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen text-white py-12 px-4 pt-20">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="max-w-6xl mx-auto"
      >
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-yellow-400">إدارة الأدمن</h1>
          <button
            onClick={() => {
              setEditingId(null);
              setForm({ email: "", password: "", usertype: "admin" });
              setShowPassword(false);
              setShowModal(true);
            }}
            className="cursor-pointer flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
          >
            <FaPlus /> إضافة أدمن
          </button>
        </div>

        {error && <p className="text-red-400 text-center mb-4">{error}</p>}

        {/* Search */}
        <input
          type="text"
          placeholder="بحث عن مستخدم..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full mb-6 p-3 rounded-lg bg-gray-800 border border-gray-700 text-white"
        />

        {/* Users Table */}
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-700 rounded-lg overflow-hidden">
            <thead className="bg-gray-800 text-yellow-400">
              <tr>
                <th className="py-3 px-4 text-right">البريد الإلكتروني</th>
                <th className="py-3 px-4 text-right">العمليات</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr
                    key={user._id}
                    className="border-t border-gray-700 bg-gray-800 hover:bg-gray-700"
                  >
                    <td className="py-3 px-4">{user.email}</td>
                    <td className="py-3 px-4 flex gap-2">
                      <button
                        onClick={() => handleEdit(user)}
                        className="cursor-pointer p-2 bg-blue-500 hover:bg-blue-600 rounded-lg"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(user._id)}
                        className="cursor-pointer p-2 bg-red-500 hover:bg-red-600 rounded-lg"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="2" className="py-6 text-center text-gray-400">
                    لا يوجد مستخدمون
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

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
                  {editingId ? "تعديل الأدمن" : "إضافة أدمن"}
                </h2>
                <form onSubmit={handleSubmit} dir="rtl" className="space-y-4">
                  <div>
                    <label className="block text-gray-200 mb-2">البريد الإلكتروني</label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-200 mb-2">كلمة المرور</label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={form.password}
                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                        className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-white pr-10"
                        placeholder={editingId ? "اترك فارغًا لعدم التغيير" : ""}
                        required={!editingId}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="cursor-pointer absolute inset-y-0 left-3 flex items-center text-gray-400 hover:text-white"
                      >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
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
