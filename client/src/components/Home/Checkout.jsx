// ✅ Updated Checkout.jsx
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../../../api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Checkout() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    area: "",
    address: "",
    notes: "",
  });
  const [areas, setAreas] = useState([]);
  const [deliveryFee, setDeliveryFee] = useState(0);
  const [cartItems, setCartItems] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAreas();
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCartItems(storedCart);
    const sum = storedCart.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
    setSubtotal(sum);
    setTotal(sum + deliveryFee);
  }, [deliveryFee]);

  const fetchAreas = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/delivery-areas`);
      setAreas(response.data || []);
    } catch (err) {
      toast.error("خطأ في جلب المناطق");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    if (name === "area") {
      const selectedArea = areas.find((a) => a._id === value);
      const fee = selectedArea ? selectedArea.price : 0;
      setDeliveryFee(fee);
      setTotal(subtotal + fee);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.area || !form.address) {
      toast.error("يرجى ملء جميع الحقول");
      return;
    }
    setLoading(true);

    try {
      const selectedArea = areas.find((a) => a._id === form.area);
      const orderData = {
        items: cartItems.map((item) => ({
          menuItem: item._id,
          quantity: item.quantity,
        })),
        totalAmount: total,
        deliveryFee,
        deliveryArea: selectedArea ? selectedArea.name : "",
        customerName: form.name,
        customerPhone: form.phone,
        deliveryAddress: form.address,
        notes: form.notes,
        paymentMethod: "cash_on_delivery",
        status: "pending",
      };

      await axios.post(`${API_BASE_URL}/orders`, orderData);
      toast.success("تم تقديم الطلب!");
      localStorage.removeItem("cart");
      navigate("/order-confirmation");
    } catch (err) {
      toast.error("خطأ في التقديم");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-20 min-h-screen  text-white">
      <ToastContainer />
      <div className="container mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-extrabold mb-10 text-yellow-400 text-center drop-shadow-md"
        >
          الدفع والتوصيل
        </motion.h2>

        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-lg mx-auto bg-zinc-900 p-8 rounded-2xl shadow-lg space-y-5"
          dir="rtl"
        >
          <input
            name="name"
            placeholder="الاسم الكامل"
            value={form.name}
            onChange={handleChange}
            className="w-full p-3 bg-zinc-800 border border-yellow-400/40 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
          <input
            name="phone"
            placeholder="رقم الهاتف"
            value={form.phone}
            onChange={handleChange}
            className="w-full p-3 bg-zinc-800 border border-yellow-400/40 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
          <select
            name="area"
            value={form.area}
            onChange={handleChange}
            className="w-full p-3 bg-zinc-800 border border-yellow-400/40 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
          >
            <option value="">اختر المنطقة</option>
            {areas.map((area) => (
              <option key={area._id} value={area._id}>
                {area.name} - {area.price} د.ج
              </option>
            ))}
          </select>
          <input
            name="address"
            placeholder="العنوان التفصيلي"
            value={form.address}
            onChange={handleChange}
            className="w-full p-3 bg-zinc-800 border border-yellow-400/40 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
          <textarea
            name="notes"
            placeholder="ملاحظات إضافية"
            value={form.notes}
            onChange={handleChange}
            className="w-full p-3 bg-zinc-800 border border-yellow-400/40 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />

          {/* Totals */}
          <div className="bg-black/50 p-4 rounded-lg">
            <p className="text-lg font-semibold text-gray-300">
              المجموع: <span className="text-white">{subtotal} د.ج</span>
            </p>
            <p className="text-lg font-semibold text-gray-300">
              رسوم التوصيل:{" "}
              <span className="text-white">{deliveryFee} د.ج</span>
            </p>
            <p className="text-2xl font-bold text-yellow-400 mt-2">
              الإجمالي: {total} د.ج
            </p>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full px-6 py-3 font-semibold rounded-full shadow-lg transition-all 
              ${
                loading
                  ? "bg-gray-500 cursor-not-allowed"
                  : "bg-yellow-400 text-black hover:bg-yellow-300 cursor-pointer"
              }`}
          >
            {loading ? "جارٍ..." : "تقديم الطلب"}
          </button>
        </motion.form>
      </div>
    </section>
  );
}
