import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { API_BASE_URL } from "../../../api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaSearch } from "react-icons/fa";

export default function Menu() {
  const [menuItems, setMenuItems] = useState([]);
  const [visible, setVisible] = useState(12);
  const [selectedType, setSelectedType] = useState("الكل");
  const [selectedKind, setSelectedKind] = useState("الكل");
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Define kind options for filter
  const kindOptions = ["الكل", "ماكولات سريعة", "مأكولات تقليدية", "مشاوي"];

  // Compute kinds that have items
  const availableKinds = kindOptions.filter((kind) => {
    if (kind === "الكل") return true;
    return menuItems.some((item) => item.kind === kind);
  });

  // Compute types based on selected kind, only including types with items
  const filteredItemsForTypes = menuItems.filter((item) =>
    selectedKind === "الكل" || item.kind === selectedKind
  );
  const types = ["الكل", ...new Set(filteredItemsForTypes.map((item) => item.type))].filter((type) => {
    if (type === "الكل") return true;
    return filteredItemsForTypes.some((item) => item.type === type);
  });

  // Filter menu items by search term, selected type, and selected kind
  const filteredMenuItems = menuItems.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === "الكل" || item.type === selectedType;
    const matchesKind = selectedKind === "الكل" || item.kind === selectedKind;
    return matchesSearch && matchesType && matchesKind;
  });

  useEffect(() => {
    fetchMenuItems();
  }, []);

  useEffect(() => {
    setSelectedType("الكل"); // Reset type filter when kind changes
  }, [selectedKind]);

  const fetchMenuItems = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.get(`${API_BASE_URL}/menu`);
      setMenuItems(response.data || []);
    } catch (err) {
      console.error('Fetch menu items error:', err);
      setError(err.response?.data?.message || "⚠️ خطأ في جلب عناصر القائمة");
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (item) => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existingItem = cart.find((cartItem) => cartItem._id === item._id);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({ ...item, quantity: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(cart));

    toast.success(`${item.name} أضيف إلى السلة!`, {
      autoClose: 1000,
    });
  };

  return (
    <section id="menu" className="py-16">
      <div className="container mx-auto px-4 text-center">
        {/* Title */}
        <h2 className="text-3xl md:text-4xl font-bold mb-8 text-yellow-400 drop-shadow-lg">
          القائمة
        </h2>

        {error && <p className="text-red-400 text-center mb-6 font-medium">{error}</p>}

        {/* Search and Filters */}
        <div className="flex flex-col items-center gap-4 mb-8 sticky top-0 z-10 bg-black/80 backdrop-blur-md pt-4">
          {/* Search Bar - Top */}
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
          {/* Filters - Below */}
          <div className="flex flex-col w-full mt-10">
            {/* Kind Filters */}
            <div className="flex overflow-x-auto gap-3 mb-4 pb-2 sm:flex-wrap sm:overflow-x-visible sm:justify-center">
              {availableKinds.map((kind, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setSelectedKind(kind);
                    setVisible(12);
                  }}
                  className={`cursor-pointer px-4 py-2 rounded-full border transition flex-shrink-0 ${
                    selectedKind === kind
                      ? "bg-yellow-400 text-black font-semibold"
                      : "bg-transparent text-yellow-300 border-yellow-400 hover:bg-yellow-500 hover:text-black"
                  }`}
                >
                  {kind}
                </button>
              ))}
            </div>
            {/* Type Filters */}
            <div className="flex overflow-x-auto gap-3 pb-2 sm:flex-wrap sm:overflow-x-visible sm:justify-center">
              {types.map((type, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setSelectedType(type);
                    setVisible(12);
                  }}
                  className={`cursor-pointer px-4 py-2 rounded-full border transition flex-shrink-0 ${
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
        </div>

        {/* Menu Items */}
        {loading ? (
          <p className="text-center text-gray-400 mt-10">جارٍ التحميل...</p>
        ) : filteredMenuItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {filteredMenuItems.slice(0, visible).map((item, i) => (
              <motion.div
                key={item._id}
                whileHover={{ scale: 1.05 }}
                className="bg-black/40 backdrop-blur-md border border-gray-700 rounded-2xl shadow-yellow-400 shadow-lg p-4 flex flex-col items-center text-white"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-60 h-40 object-cover rounded-xl mb-3"
                />
                <h3 className="text-lg font-semibold">{item.name}</h3>
                <p className="text-yellow-400 mt-1">{item.price} د.ج - {item.kind}</p>
                <button
                  onClick={() => addToCart(item)}
                  className="cursor-pointer mt-2 px-4 py-2 bg-yellow-400 text-black rounded-full hover:scale-110 duration-300 transform"
                >
                  إضافة إلى السلة
                </button>
              </motion.div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-400 mt-10">لا توجد عناصر في القائمة</p>
        )}

        {/* Show More Button */}
        {visible < filteredMenuItems.length && (
          <div className="mt-8">
            <button
              onClick={() => setVisible((prev) => prev + 9)}
              className="cursor-pointer px-6 py-3 bg-yellow-400 text-black font-semibold rounded-full shadow-lg hover:bg-yellow-500 transition"
            >
              عرض المزيد
            </button>
          </div>
        )}
      </div>
      <ToastContainer />
    </section>
  );
}