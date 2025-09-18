import { useState } from "react";
import { motion } from "framer-motion";
import { FaInstagram, FaEnvelope, FaPhone, FaTiktok, FaFacebook, FaYoutube, FaWhatsapp } from "react-icons/fa";
import axios from "axios";
import { API_BASE_URL } from "../../../api";
import { useNavigate } from "react-router-dom";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [formError, setFormError] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const navigate = useNavigate();

  const validateForm = () => {
    if (!email) return "البريد الإلكتروني مطلوب";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "صيغة البريد غير صالحة";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validateForm();
    setFormError(err);
    if (err) return;

    setLoading(true);
    try {
      await axios.post(`${API_BASE_URL}/newsletter`, { email });
      setEmail("");
      setSuccess("تم الاشتراك بنجاح!");
      setError("");
    } catch (err) {
      console.error("Subscribe newsletter error:", err);
      setError(err.response?.data?.message || "⚠️ خطأ في الاشتراك بالنشرة البريدية");
      setSuccess("");
    } finally {
      setLoading(false);
    }
  };

  const handleScrollTo = (id, basePath) => {
    if (basePath && window.location.pathname !== basePath) {
      navigate(basePath);
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      }, 300);
    } else if (window.location.pathname !== "/" && !basePath) {
      navigate("/");
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      }, 300);
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const footerLinks = [
    { label: "الرئيسية", type: "scroll", value: "home", basePath: "/" },
    { label: "من نحن", type: "scroll", value: "about", basePath: "/about" },
    { label: "القائمة", type: "scroll", value: "menu" },
    { label: "تواصل معنا", type: "scroll", value: "contact" },
  ];

  return (
    <>
      <motion.footer
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="bg-gradient-to-r from-yellow-700 via-yellow-900 to-black text-gray-200 pt-12 pb-6 mt-16"
      >
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-start text-center md:text-right">
            {/* Logo + Info */}
            <div className="flex flex-col items-center md:items-start">
              <div className="w-24 h-24 bg-yellow-400 rounded-full flex items-center justify-center text-black font-bold text-2xl overflow-hidden">
                <img
                  className="rounded-full w-full h-full object-cover"
                  src="https://res.cloudinary.com/dtwa3lxdk/image/upload/v1756897359/465660711_1763361547537323_2674934284076407223_n_prlt48.jpg"
                  alt="طياب الأوراس"
                />
              </div>
              <h3 className="text-2xl font-bold text-white mt-3">طياب الأوراس</h3>
              <p className="text-sm mt-2 text-gray-300">
                مطعم يقدم أشهى الأطباق بلمسة أصيلة من الأوراس.
              </p>
              <p className="mt-3 text-sm text-yellow-400 ">
                صُنع بواسطة{" "}
                <a
                  href="https://softwebelevation.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  SoftWebElevation
                </a>
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold text-yellow-400 mb-4">روابط سريعة</h4>
              <ul className="space-y-2">
                {footerLinks.map((item, idx) => (
                  <li key={idx}>
                    <button
                      onClick={() => handleScrollTo(item.value, item.basePath)}
                      className="hover:text-yellow-400 transition cursor-pointer"
                    >
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>

              {/* Privacy Policy as Text Link */}
              <p
                onClick={() => setModalVisible(true)}
                className="mt-2 text-yellow-400 hover:underline cursor-pointer text-sm"
              >
                سياسة الخصوصية
              </p>
            </div>

            {/* Newsletter + Social + Contact */}
            <div>
              <h4 className="text-lg font-semibold text-yellow-400 mb-4">النشرة البريدية</h4>
              <p className="text-sm mb-3">اشترك ليصلك كل جديد وعروضنا الخاصة.</p>
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 mb-6">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="بريدك الإلكتروني"
                  className={`flex-1 px-4 py-2 rounded-lg bg-gray-800 border ${
                    formError ? "border-red-500" : "border-gray-700"
                  } focus:outline-none focus:border-yellow-400 text-white text-sm`}
                />
                <button
                  type="submit"
                  disabled={loading}
                  className={`cursor-pointer px-4 py-2 bg-yellow-400 text-black font-bold rounded-lg hover:bg-yellow-300 transition  ${
                    loading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {loading ? "جارٍ الاشتراك..." : "اشتراك"}
                </button>
              </form>
              {formError && <p className="text-red-400 text-sm mb-4">{formError}</p>}
              {error && <p className="text-red-400 text-sm mb-4">{error}</p>}
              {success && <p className="text-green-400 text-sm mb-4">{success}</p>}

              {/* Social + Contact Info */}
    <div className="flex flex-col md:flex-row justify-center md:justify-between items-center md:items-start gap-6 text-sm w-full">
                <div className="flex flex-col gap-3">
                  <div className="flex gap-4 mb-3">
                    <a href="https://www.tiktok.com/@ttyab_alawras05"target="_blank" className="hover:text-yellow-400 transition">
                      <FaTiktok size={22} />
                    </a>
                    <a href="https://www.instagram.com/tteyab_elawras05/" target="_blank"className="hover:text-yellow-400 transition">
                      <FaInstagram size={22} />
                    </a>
                    <a href="https://www.facebook.com/share/17VmU2KTS9/"target="_blank" className="hover:text-yellow-400 transition">
                      <FaFacebook size={22} />
                    </a>
                    <a href="https://youtube.com/@ttyab_elawras"target="_blank" className="hover:text-yellow-400 transition">
                      <FaYoutube size={22} />
                    </a>
                    <a
                      href="https://wa.me/0654768883"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-yellow-400 transition"
                    >
                      <FaWhatsapp size={22} />
                    </a>


                  </div>
                  <div className="flex items-center gap-2">
                    <FaEnvelope className="text-yellow-400" /> ttyabelawras@gmail.com
                  </div>
                  <div className="flex items-center gap-2" >
                    <FaPhone className="text-yellow-400" /> 0663733328
                  </div>
                </div>

                <div className="flex items-center">
                 <a
                   href="https://tyab-elawras-app-y4av.vercel.app/TyabElawras.apk"
                   rel="noopener noreferrer"
                   class="px-6 py-3 bg-yellow-400 text-black rounded-lg hover:bg-yellow-600 transition font-semibold"
                 >
                   حمل التطبيق
                 </a>

                </div>
              </div>
            </div>
          </div>

          {/* Bottom Line */}
          <div className="mt-8 border-t border-gray-700 pt-4 text-center text-xs text-gray-400 hover:text-yellow-400 transition">
            © 2025 طياب الأوراس - جميع الحقوق محفوظة
          </div>
        </div>
      </motion.footer>

      {/* Privacy Policy Modal */}
      {modalVisible && (
        <div className="fixed inset-0 bg-black/80 flex justify-center items-center p-4 z-50">
          <div className="bg-[#111] rounded-lg p-6 max-h-[80%] overflow-y-auto w-full max-w-2xl">
            <h2 className="text-yellow-400 text-2xl font-bold mb-4 text-center">
              سياسة الخصوصية
            </h2>
            <p className="text-gray-300 mb-2">
              نحن نحترم خصوصيتك ونلتزم بحماية المعلومات الشخصية التي تشاركها معنا عند استخدام تطبيقنا.
            </p>

            <h3 className="text-white font-bold mt-4">جمع المعلومات</h3>
            <p className="text-gray-300 mb-2">
              قد نجمع معلومات مثل اسمك، البريد الإلكتروني، وبيانات الاستخدام لتقديم تجربة أفضل وتحسين خدماتنا.
            </p>

            <h3 className="text-white font-bold mt-4">استخدام المعلومات</h3>
            <p className="text-gray-300 mb-2">
              تُستخدم المعلومات لتخصيص تجربتك داخل التطبيق، التواصل معك عند الحاجة، وتحليل الأداء لتحسين خدماتنا.
            </p>

            <h3 className="text-white font-bold mt-4">مشاركة المعلومات</h3>
            <p className="text-gray-300 mb-2">
              نحن لا نبيع أو نشارك معلوماتك الشخصية مع أطراف خارجية إلا إذا كان ذلك مطلوباً قانونياً.
            </p>

            <h3 className="text-white font-bold mt-4">الأمان</h3>
            <p className="text-gray-300 mb-2">
              نحن نتخذ تدابير معقولة لحماية معلوماتك الشخصية من الوصول غير المصرح به أو التعديل أو الكشف.
            </p>

            <h3 className="text-white font-bold mt-4">التغييرات على السياسة</h3>
            <p className="text-gray-300 mb-2">
              قد نقوم بتحديث سياسة الخصوصية من وقت لآخر. سيتم نشر أي تغييرات على هذه الصفحة.
            </p>

            <p className="text-gray-500 text-sm text-center mt-4">آخر تحديث: 2025-09-11</p>

            <p
              onClick={() => setModalVisible(false)}
              className="mt-6 bg-yellow-400 text-black font-bold px-6 py-2 rounded-lg hover:bg-yellow-300 transition text-center cursor-pointer"
            >
              إغلاق
            </p>
          </div>
        </div>
      )}
    </>
  );
}
