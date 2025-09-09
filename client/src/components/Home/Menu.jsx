import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { API_BASE_URL } from "../../../api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Menu() {
  const [menuItems, setMenuItems] = useState([]);
  const [visible, setVisible] = useState(12);
  const [selectedType, setSelectedType] = useState("الكل");
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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

        <div className="flex flex-wrap justify-center gap-3 my-10">
          {types.map((type, i) => (
            <button
              key={i}
              onClick={() => {
                setSelectedType(type);
                setVisible(12);
              }}
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
                <p className="text-yellow-400 mt-1">{item.price} د.ج</p>
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