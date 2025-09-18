import { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { API_BASE_URL } from "../../../api";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("today");
  const [selectedDay, setSelectedDay] = useState(null);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [timeError, setTimeError] = useState("");
  const [showCalendar, setShowCalendar] = useState(false);
  const [ws, setWs] = useState(null);

  useEffect(() => {
    fetchOrders();
    setupWebSocket();
    
    // Polling fallback every 30 seconds
    const pollingInterval = setInterval(fetchOrders, 30000);
    
    return () => {
      if (ws) {
        ws.close();
      }
      clearInterval(pollingInterval);
    };
  }, []);

  useEffect(() => {
    applyFilter();
  }, [orders, filter, selectedDay, startTime, endTime]);

  const setupWebSocket = () => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    const websocket = new WebSocket(`${API_BASE_URL.replace('http', 'ws')}/ws/orders?token=${token}`);
    
    websocket.onopen = () => {
      console.log("WebSocket connected");
    };

    websocket.onmessage = (event) => {
      try {
        const newOrder = JSON.parse(event.data);
        if (newOrder.type === "new_order") {
          setOrders((prevOrders) => {
            const updatedOrders = [newOrder.order, ...prevOrders].sort(
              (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
            toast.success("طلب جديد وصل!", {
              style: { background: "#fff", color: "#1a1a1a", borderRadius: "8px", border: "1px solid #e5e7eb" },
            });
            return updatedOrders;
          });
        }
      } catch (err) {
        console.error("WebSocket message error:", err);
      }
    };

    websocket.onclose = () => {
      console.log("WebSocket disconnected, attempting to reconnect...");
      setTimeout(setupWebSocket, 5000);
    };

    websocket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    setWs(websocket);
  };

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      const response = await axios.get(`${API_BASE_URL}/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const sorted = (response.data || []).sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      setOrders(sorted);
      console.log("Fetched orders:", sorted);
    } catch (err) {
      console.error("Fetch orders error:", err);
      toast.error("خطأ في جلب الطلبات", {
        style: { background: "#fff", color: "#1a1a1a", borderRadius: "8px", border: "1px solid #e5e7eb" },
      });
    } finally {
      setLoading(false);
    }
  };

  const parseTime = (timeStr) => {
    if (!timeStr) return null;
    timeStr = timeStr.trim().toLowerCase();
    
    const timeRegex = /^(\d{1,2})(?::(\d{2}))?\s*(am|pm|ص|م)?$/i;
    const match = timeStr.match(timeRegex);
    
    if (!match) {
      setTimeError("تنسيق الوقت غير صحيح. استخدم مثل: 8:00 ص أو 14:30");
      return null;
    }

    let [_, hours, minutes, period] = match;
    hours = parseInt(hours);
    minutes = parseInt(minutes) || 0;

    if (hours > 23 || minutes > 59) {
      setTimeError("الساعات يجب أن تكون بين 0-23 والدقائق بين 0-59");
      return null;
    }

    if (period === "pm" || period === "م") {
      if (hours !== 12) hours += 12;
    } else if ((period === "am" || period === "ص") && hours === 12) {
      hours = 0;
    }

    setTimeError("");
    return hours * 60 + minutes;
  };

  const applyFilter = () => {
    const now = new Date();
    let filtered = orders;

    let startMinutes = 0;
    let endMinutes = 24 * 60;
    let timeFilterValid = true;

    const needsTimeFilter = filter === "today" || (filter === "week" && selectedDay) || (filter === "month" && selectedDay);
    if (needsTimeFilter && (startTime || endTime)) {
      if (startTime) {
        const sm = parseTime(startTime);
        if (sm === null) {
          timeFilterValid = false;
        } else {
          startMinutes = sm;
        }
      }
      if (endTime) {
        const em = parseTime(endTime);
        if (em === null) {
          timeFilterValid = false;
        } else {
          endMinutes = em;
        }
      }
      if (!timeFilterValid) {
        setFilteredOrders([]);
        return;
      }
    }

    const applyTimeFilter = (orderTime) => {
      return orderTime >= startMinutes && orderTime <= endMinutes;
    };

    if (filter === "today") {
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      filtered = orders.filter((order) => {
        const created = new Date(order.createdAt);
        const createdDay = new Date(created.getFullYear(), created.getMonth(), created.getDate());
        if (createdDay.getTime() !== today.getTime()) return false;

        if (startTime || endTime) {
          const orderTime = created.getHours() * 60 + created.getMinutes();
          return applyTimeFilter(orderTime);
        }
        return true;
      });
    } else if (filter === "week") {
      let startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - 7);
      startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay() + 1);
      startOfWeek.setHours(0, 0, 0, 0);

      let endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      endOfWeek.setHours(23, 59, 59, 999);

      filtered = orders.filter((order) => {
        const created = new Date(order.createdAt);
        if (created < startOfWeek || created > endOfWeek) return false;

        if (selectedDay) {
          const createdDay = new Date(created.getFullYear(), created.getMonth(), created.getDate());
          const selectedDayNorm = new Date(selectedDay.getFullYear(), selectedDay.getMonth(), selectedDay.getDate());
          if (createdDay.getTime() !== selectedDayNorm.getTime()) return false;

          if (startTime || endTime) {
            const orderTime = created.getHours() * 60 + created.getMinutes();
            return applyTimeFilter(orderTime);
          }
          return true;
        }
        return true;
      });
    } else if (filter === "month") {
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
      const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

      filtered = orders.filter((order) => {
        const created = new Date(order.createdAt);
        if (created < monthStart || created > monthEnd) return false;

        if (selectedDay) {
          const createdDay = new Date(created.getFullYear(), created.getMonth(), created.getDate());
          const selectedDayNorm = new Date(selectedDay.getFullYear(), selectedDay.getMonth(), selectedDay.getDate());
          if (createdDay.getTime() !== selectedDayNorm.getTime()) return false;

          if (startTime || endTime) {
            const orderTime = created.getHours() * 60 + created.getMinutes();
            return applyTimeFilter(orderTime);
          }
          return true;
        }
        return true;
      });
    } else if (filter === "all") {
      filtered = orders;
    }

    setFilteredOrders(filtered);
    console.log("Filtered orders:", filtered);
  };

  const updateStatus = async (id, status) => {
    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      await axios.put(
        `${API_BASE_URL}/orders/${id}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === id ? { ...order, status } : order
        )
      );
      toast.success("تم تحديث الحالة", {
        style: { background: "#fff", color: "#1a1a1a", borderRadius: "8px", border: "1px solid #e5e7eb" },
      });
    } catch (err) {
      console.error("Update status error:", err);
      toast.error("خطأ في التحديث", {
        style: { background: "#fff", color: "#1a1a1a", borderRadius: "8px", border: "1px solid #e5e7eb" },
      });
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

  const getWeekDays = () => {
    const now = new Date();
    let startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - 7);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay() + 1);
    startOfWeek.setHours(0, 0, 0, 0);
    const days = [];
    for (let i = 1; i <= 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      days.push(day);
    }
    return days;
  };

  const weekDays = getWeekDays();

  return (
    <div className="min-h-screen text-white py-12 px-4 sm:px-6 lg:px-8 mt-20">
      <ToastContainer />
      <motion.div
        className="max-w-7xl mx-auto space-y-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-4xl font-bold text-yellow-400">إدارة الطلبات</h1>

        {/* Filters */}
        <div className="flex flex-wrap gap-4">
          {["today", "week", "month", "all"].map((f) => (
            <button
              key={f}
              onClick={() => {
                setFilter(f);
                setSelectedDay(null);
                setStartTime("");
                setEndTime("");
                setTimeError("");
              }}
              className={`cursor-pointer px-6 py-3 rounded-lg font-medium transition-colors ${
                filter === f
                  ? "bg-yellow-500 text-gray-900"
                  : "bg-gray-700 hover:bg-gray-600"
              }`}
            >
              {f === "today" && "اليوم"}
              {f === "week" && "الأسبوع الماضي"}
              {f === "month" && "هذا الشهر"}
              {f === "all" && "الكل"}
            </button>
          ))}
        </div>

        {/* Time Filters */}
        {(filter === "today" || (filter === "week" && selectedDay) || (filter === "month" && selectedDay)) && (
          <div className="flex flex-col sm:flex-row gap-6 max-w-md">
            <div className="flex-1">
              <label className="block text-gray-300 mb-2 text-lg">من الساعة:</label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="cursor-pointer bg-gray-800 text-white p-3 rounded-lg border border-gray-600 focus:border-yellow-500 w-full"
              />
            </div>

            <div className="flex-1">
              <label className="block text-gray-300 mb-2 text-lg">إلى الساعة:</label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="cursor-pointer bg-gray-800 text-white p-3 rounded-lg border border-gray-600 focus:border-yellow-500 w-full"
              />
            </div>
          </div>
        )}
        {timeError && (
          <p className="text-red-400 text-center text-sm">{timeError}</p>
        )}

        {/* Week Days Selection */}
        {filter === "week" && !selectedDay && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-yellow-400">اختر يومًا</h2>
            <div className="flex flex-wrap gap-3">
              {weekDays.map((day, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedDay(day)}
                  className="cursor-pointer px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors text-lg"
                >
                  {day.toLocaleDateString("ar-DZ", {
                    weekday: "long",
                    day: "2-digit",
                    month: "2-digit",
                  })}
                </button>
              ))}
            </div>
          </div>
        )}
        {filter === "month" && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-yellow-400">اختر يومًا</h2>
            <button
              onClick={() => setShowCalendar(true)}
              className="cursor-pointer px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold rounded-lg transition-colors duration-200"
            >
              فتح التقويم
            </button>

            {showCalendar && (
              <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
                <div className="p-4 rounded-lg">
                  <button
                    onClick={() => setShowCalendar(false)}
                    className="cursor-pointer mb-2 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    إغلاق
                  </button>
                  <Calendar
                    value={selectedDay}
                    onChange={(date) => {
                      setSelectedDay(date);
                      setShowCalendar(false);
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {loading ? (
          <p className="text-gray-400 text-center text-lg">جارٍ التحميل...</p>
        ) : filteredOrders.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredOrders.map((order) => (
              <motion.div
                key={order._id}
                className="bg-gray-800 p-6 rounded-2xl shadow-lg shadow-yellow-400/30 hover:shadow-yellow-400/50 transition-shadow"
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

                <div className="mt-4 grid grid-cols-2 gap-3">
                  {order.status === "pending" && (
                    <>
                      <button
                        onClick={() => updateStatus(order._id, "in_delivery")}
                        className="cursor-pointer px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                      >
                        بدء التوصيل
                      </button>
                      <button
                        onClick={() => updateStatus(order._id, "cancelled")}
                        className="cursor-pointer px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                      >
                        إلغاء
                      </button>
                    </>
                  )}
                  {order.status === "in_delivery" && (
                    <>
                      <button
                        onClick={() => updateStatus(order._id, "delivered")}
                        className="cursor-pointer px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
                      >
                        تم التوصيل
                      </button>
                      <button
                        onClick={() => updateStatus(order._id, "cancelled")}
                        className="cursor-pointer px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
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
          <p className="text-gray-400 text-center text-lg">لا توجد طلبات</p>
        )}
      </motion.div>
    </div>
  );
}