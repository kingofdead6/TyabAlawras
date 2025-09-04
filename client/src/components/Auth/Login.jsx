import { useState } from "react";
import { motion } from "framer-motion";
import { FaEye, FaEyeSlash, FaUser, FaLock } from "react-icons/fa";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../../../api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validate = () => {
    const e = {};
    if (!email.trim()) e.email = "الرجاء إدخال البريد الإلكتروني.";
    else if (!/^\S+@\S+\.\S+$/.test(email)) e.email = "صيغة البريد غير صحيحة.";
    if (!password) e.password = "الرجاء إدخال كلمة المرور.";
    else if (password.length < 6) e.password = "كلمة المرور قصيرة جداً (6 أحرف على الأقل).";
    return e;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      setLoading(true);
      try {
        const response = await axios.post(`${API_BASE_URL}/auth/login`, {
          email,
          password,
        });
        const { token, usertype } = response.data;
        if (remember) {
          localStorage.setItem("token", token);
        } else {
          sessionStorage.setItem("token", token);
        }
        window.dispatchEvent(new Event("authChanged"));
        setErrors({});
        if (usertype === "admin" || usertype === "superadmin") {
          navigate("/admin/dashboard");
        } else {
          setErrors({ form: "غير مصرح لك بالوصول إلى لوحة التحكم" });
        }
      } catch (error) {
        setErrors({ form: error.response?.data?.message || "خطأ في تسجيل الدخول" });
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <motion.div
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md bg-gray-900/70 backdrop-blur-md border border-gray-700 rounded-2xl p-6 shadow-xl"
      >
        <div className="text-center mb-6">
          <div className="mx-auto w-20 h-20 rounded-full bg-yellow-400 flex items-center justify-center text-black text-2xl font-bold shadow-[0_0_10px_red]">
            <img
              src="https://res.cloudinary.com/dtwa3lxdk/image/upload/v1756897359/465660711_1763361547537323_2674934284076407223_n_prlt48.jpg"
              alt="Logo"
              className="rounded-full"
            />
          </div>
          <h1 className="mt-4 text-2xl font-bold text-white">تسجيل الدخول</h1>
          <p className="mt-2 text-sm text-gray-300">أدخل بياناتك للمتابعة</p>
        </div>

        {errors.form && (
          <div className="mb-4 text-sm text-red-400 text-center">{errors.form}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4" dir="rtl" autoComplete="on">
          {/* Email */}
          <div>
            <label className="block text-sm text-gray-200 mb-2">البريد الإلكتروني</label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full pr-12 pl-4 py-3 rounded-lg bg-gray-800 border ${
                  errors.email ? "border-red-500" : "border-gray-700"
                } text-white outline-none focus:border-yellow-400`}
                placeholder="example@mail.com"
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? "email-error" : undefined}
              />
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-gray-400">
                <FaUser />
              </div>
            </div>
            {errors.email && (
              <p id="email-error" className="mt-2 text-xs text-red-400">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm text-gray-200 mb-2">كلمة المرور</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full pr-12 pl-4 py-3 rounded-lg bg-gray-800 border ${
                  errors.password ? "border-red-500" : "border-gray-700"
                } text-white outline-none focus:border-yellow-400`}
                placeholder="أدخل كلمة المرور"
                aria-invalid={!!errors.password}
                aria-describedby={errors.password ? "password-error" : undefined}
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="cursor-pointer absolute inset-y-0 left-0 px-3 flex items-center text-gray-400 hover:text-amber-400"
                aria-label={showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
              <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-gray-400 hover:text-amber-400">
                <FaLock />
              </div>
            </div>
            {errors.password && (
              <p id="password-error" className="mt-2 text-xs text-red-400">{errors.password}</p>
            )}
          </div>

        

          {/* Submit */}
          <div>
            <button
              type="submit"
              disabled={loading}
              className="cursor-pointer w-full py-3 rounded-lg bg-yellow-400 text-black font-bold hover:bg-yellow-300 transition disabled:opacity-60"
            >
              {loading ? "جاري الدخول..." : "دخول"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}