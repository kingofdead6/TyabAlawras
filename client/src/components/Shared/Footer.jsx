import { useState } from "react";
import axios from "axios";
import { FaFacebook, FaInstagram, FaEnvelope, FaPhone, FaTiktok } from "react-icons/fa";
import { API_BASE_URL } from "../../../api";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [formError, setFormError] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    if (!email) return "البريد الإلكتروني مطلوب";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "صيغة البريد غير صالحة";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const error = validateForm();
    setFormError(error);

    if (error) return;

    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/newsletter`, { email });
      setEmail("");
      setSuccess("تم الاشتراك بنجاح!");
      setError("");
    } catch (err) {
      console.error('Subscribe newsletter error:', err);
      setError(err.response?.data?.message || "⚠️ خطأ في الاشتراك بالنشرة البريدية");
      setSuccess("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="bg-gradient-to-r from-yellow-700 via-yellow-900 to-black text-gray-200 pt-12 pb-6 mt-16">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-start text-center md:text-right">
          {/* Logo + Info */}
          <div className="flex flex-col items-center md:items-start">
            <div className="w-24 h-24 bg-yellow-400 rounded-full flex items-center justify-center text-black font-bold text-2xl shadow-[0_0_12px_red] overflow-hidden">
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
            <p className="mt-3 text-sm text-yellow-400 drop-shadow-[0_0_6px_red]">
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
              <li><a href="#hero" className="hover:text-yellow-400 transition">الرئيسية</a></li>
              <li><a href="#about" className="hover:text-yellow-400 transition">من نحن</a></li>
              <li><a href="#menu" className="hover:text-yellow-400 transition">القائمة</a></li>
              <li><a href="#gallery" className="hover:text-yellow-400 transition">المعرض</a></li>
              <li><a href="#contact" className="hover:text-yellow-400 transition">تواصل معنا</a></li>
            </ul>
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
                className={`cursor-pointer px-4 py-2 bg-yellow-400 text-black font-bold rounded-lg hover:bg-yellow-300 transition shadow-[0_0_6px_red] ${
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
            <div className="flex flex-col items-center md:items-start gap-3 text-sm">
              <div className="flex gap-4">
                <a href="https://www.tiktok.com/@ttyab_alawras05?_t=ZM-8y2EiKikxDZ&_r=1&fbclid=PAZXh0bgNhZW0CMTEAAacDEjb8q2Jazevh_E6YibPVSfXq9hLbTpnZFcw4JuIQUCWfxfn4mFQ8aGZAMg_aem_HBfQaCDG9lw6B_11NghDxA" className="hover:text-yellow-400 transition"><FaTiktok size={22} /></a>
                <a href="https://www.instagram.com/tteyab_elawras05/" className="hover:text-yellow-400 transition"><FaInstagram size={22} /></a>
              </div>
              <div className="flex items-center gap-2">
                <FaEnvelope className="text-yellow-400" /> info@tyabalawras.com
              </div>
              <div className="flex items-center gap-2">
                <FaPhone className="text-yellow-400" /> 0654768883
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Line */}
        <div className="mt-8 border-t border-gray-700 pt-4 text-center text-xs text-gray-400 hover:text-yellow-400 transition">
          © 2025 طياب الأوراس - جميع الحقوق محفوظة
        </div>
      </div>
    </footer>
  );
}