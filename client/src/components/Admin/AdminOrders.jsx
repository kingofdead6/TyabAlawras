import { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { API_BASE_URL } from "../../../api";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("today"); // default: اليوم

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    applyFilter();
  }, [orders, filter]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");
      const response = await axios.get(`${API_BASE_URL}/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // sort newest first
      const sorted = (response.data || []).sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

      setOrders(sorted);
    } catch (err) {
      toast.error("خطأ في جلب الطلبات");
    } finally {
      setLoading(false);
    }
  };

  const applyFilter = () => {
    const now = new Date();
    let filtered = orders;

    if (filter === "today") {
      filtered = orders.filter((order) => {
        const created = new Date(order.createdAt);
        return (
          created.getDate() === now.getDate() &&
          created.getMonth() === now.getMonth() &&
          created.getFullYear() === now.getFullYear()
        );
      });
    } else if (filter === "week") {
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - now.getDay()); // Sunday
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6); // Saturday

      filtered = orders.filter((order) => {
        const created = new Date(order.createdAt);
        return created >= startOfWeek && created <= endOfWeek;
      });
    } else if (filter === "month") {
      filtered = orders.filter((order) => {
        const created = new Date(order.createdAt);
        return (
          created.getMonth() === now.getMonth() &&
          created.getFullYear() === now.getFullYear()
        );
      });
    }

    setFilteredOrders(filtered);
  };

  const updateStatus = async (id, status) => {
    try {
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");
      await axios.put(
        `${API_BASE_URL}/orders/${id}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("تم تحديث الحالة");
      fetchOrders();
    } catch (err) {
      toast.error("خطأ في التحديث");
    }
  };

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleString("ar-DZ", {
      weekday: "long",
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen text-white py-12 px-4 pt-20">
      <ToastContainer />
      <motion.div
        className="max-w-6xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-3xl font-bold text-yellow-400 mb-6">
          إدارة الطلبات
        </h1>

        {/* فلاتر */}
        <div className="flex gap-3 mb-6">
          <button
            onClick={() => setFilter("today")}
            className={`cursor-pointer px-4 py-2 rounded-lg ${
              filter === "today"
                ? "bg-yellow-500"
                : "bg-gray-700 hover:bg-gray-600"
            }`}
          >
            اليوم
          </button>
          <button
            onClick={() => setFilter("week")}
            className={`cursor-pointer px-4 py-2 rounded-lg ${
              filter === "week"
                ? "bg-yellow-500"
                : "bg-gray-700 hover:bg-gray-600"
            }`}
          >
            هذا الأسبوع
          </button>
          <button
            onClick={() => setFilter("month")}
            className={`cursor-pointer px-4 py-2 rounded-lg ${
              filter === "month"
                ? "bg-yellow-500"
                : "bg-gray-700 hover:bg-gray-600"
            }`}
          >
            هذا الشهر
          </button>
          <button
            onClick={() => setFilter("all")}
            className={`cursor-pointer px-4 py-2 rounded-lg ${
              filter === "all"
                ? "bg-yellow-500"
                : "bg-gray-700 hover:bg-gray-600"
            }`}
          >
            الكل
          </button>
        </div>

        {loading ? (
          <p className="text-gray-400">جارٍ التحميل...</p>
        ) : filteredOrders.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredOrders.map((order) => (
              <motion.div
                key={order._id}
                className="bg-gray-800 p-6 rounded-2xl shadow-lg shadow-yellow-400 hover:shadow-2xl"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                <p className="font-bold text-lg mb-2">الطلب #: {order._id}</p>
                <p className="text-gray-300">
                  🕒 تاريخ الطلب: {formatDate(order.createdAt)}
                </p>
                <p className="text-gray-300">
                  👤 العميل: {order.customerName} - {order.customerPhone}
                </p>
                <p className="text-gray-300">
                  📍 المنطقة: {order.deliveryArea} ({order.deliveryFee} د.ج)
                </p>
                <p className="text-gray-300">🏠 العنوان: {order.deliveryAddress}</p>
                <p className="text-gray-300 font-semibold">
                  💰 الإجمالي: {order.totalAmount} د.ج
                </p>
                <p className="text-gray-300">
                  📦 الحالة الحالية:{" "}
                  <span className="font-bold text-yellow-400">
                    {order.status}
                  </span>
                </p>

                {/* أزرار الحالة */}
                <div className="mt-4 grid grid-cols-2 gap-3">
                  {order.status === "pending" && (
                    <>
                      <button
                        onClick={() => updateStatus(order._id, "in_delivery")}
                        className="cursor-pointer px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg"
                      >
                        بدء التوصيل
                      </button>
                      <button
                        onClick={() => updateStatus(order._id, "cancelled")}
                        className="cursor-pointer px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg"
                      >
                        إلغاء
                      </button>
                    </>
                  )}

                  {order.status === "in_delivery" && (
                    <>
                      <button
                        onClick={() => updateStatus(order._id, "delivered")}
                        className="cursor-pointer px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg"
                      >
                        تم التوصيل
                      </button>
                      <button
                        onClick={() => updateStatus(order._id, "cancelled")}
                        className="cursor-pointer px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg"
                      >
                        إلغاء
                      </button>
                    </>
                  )}

                  {order.status === "delivered" && (
                    <p className="col-span-2 text-center text-green-400 font-bold">
                      ✅ تم تسليم الطلب
                    </p>
                  )}

                  {order.status === "cancelled" && (
                    <p className="col-span-2 text-center text-red-400 font-bold">
                      ❌ تم إلغاء الطلب
                    </p>
                  )}
                </div>

                <div className="mt-6 bg-gray-900 p-4 rounded-xl">
                  <h4 className="font-semibold mb-2">🛒 العناصر:</h4>
                  <ul className="list-disc list-inside space-y-1">
                    {order.items.map((item, i) => (
                      <li key={i} className="text-gray-300">
                        {(item.menuItem?.name || "عنصر غير معروف")} ×{" "}
                        {item.quantity} — {item.menuItem?.price || 0} د.ج
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400">لا توجد طلبات</p>
        )}
      </motion.div>
    </div>
  );
}
