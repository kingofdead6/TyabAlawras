import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCartItems(storedCart);
    calculateTotal(storedCart);
  }, []);

  const calculateTotal = (items) => {
    const sum = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    setTotal(sum);
  };

  const updateQuantity = (id, quantity) => {
    const updatedCart = cartItems.map((item) =>
      item._id === id ? { ...item, quantity: Math.max(1, quantity) } : item
    );
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    calculateTotal(updatedCart);
  };

  const removeItem = (id) => {
    const updatedCart = cartItems.filter((item) => item._id !== id);
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    calculateTotal(updatedCart);
  };

  const handleCheckout = () => {
    navigate("/checkout");
  };

  return (
    <section className="py-20 min-h-screen  text-white">
      <div className="container mx-auto px-4 max-w-3xl">
        <h2 className="text-4xl font-extrabold mb-10 text-yellow-400 text-center drop-shadow-md">
          🛒 سلة التسوق
        </h2>

        {cartItems.length === 0 ? (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-gray-400 text-lg"
          >
            سلتك فارغة
          </motion.p>
        ) : (
          <>
            <div className="grid gap-6">
              {cartItems.map((item) => (
                <motion.div
                  key={item._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.02 }}
                 className="flex items-center justify-between bg-gradient-to-r from-yellow-400/70 to-black p-5 rounded-2xl shadow-lg"
                >
                  {/* Item details */}
                  <div className="flex items-center gap-5">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-xl border-2 border-yellow-400"
                    />
                    <div>
                      <h3 className="text-lg font-semibold">{item.name}</h3>
                      <p className="text-yellow-400 font-bold">{item.price} د.ج</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3">
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) =>
                        updateQuantity(item._id, parseInt(e.target.value))
                      }
                      className="w-16 p-2 bg-zinc-800 border border-yellow-400 rounded-lg text-center focus:outline-none"
                      min="1"
                    />
                    <button
                      onClick={() => removeItem(item._id)}
                      className="cursor-pointer text-red-500 hover:text-red-600 font-medium"
                    >
                      ✕
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Total & Checkout */}
            <div className="mt-10 bg-zinc-900 p-6 rounded-2xl shadow-md text-right">
              <p className="text-2xl font-bold text-yellow-400">
                الإجمالي: {total} د.ج
              </p>
              <button
                onClick={handleCheckout}
                className="cursor-pointer mt-6 w-full py-3 bg-yellow-400 text-black font-semibold rounded-full shadow-lg hover:bg-yellow-300 transition-all"
              >
                الذهاب إلى الدفع
              </button>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
