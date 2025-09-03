import { FaFacebook, FaInstagram, FaEnvelope, FaPhone } from "react-icons/fa";

export default function Footer() {
  return (
<footer className="bg-gradient-to-r from-yellow-700 via-yellow-900 to-black text-gray-200 pt-12 pb-6 mt-16">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-start text-center md:text-right">
          
          {/* Logo + Info */}
          <div className="flex flex-col items-center md:items-start">
            <div className="w-26 h-26 bg-yellow-400 rounded-full flex items-center justify-center text-black font-bold text-2xl shadow-[0_0_12px_red]">
                <img className="rounded-full" src="https://res.cloudinary.com/dtwa3lxdk/image/upload/v1756897359/465660711_1763361547537323_2674934284076407223_n_prlt48.jpg" />
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
            <form className="flex flex-col sm:flex-row gap-3 mb-6">
              <input
                type="email"
                placeholder="بريدك الإلكتروني"
                className="flex-1 px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:border-yellow-400 text-white text-sm"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-yellow-400 text-black font-bold rounded-lg hover:bg-yellow-300 transition shadow-[0_0_6px_red]"
              >
                اشتراك
              </button>
            </form>

            {/* Social + Contact Info */}
            <div className="flex flex-col items-center md:items-start gap-3 text-sm">
              <div className="flex gap-4">
                <a href="#" className="hover:text-yellow-400 transition"><FaFacebook size={22} /></a>
                <a href="#" className="hover:text-yellow-400 transition"><FaInstagram size={22} /></a>
              </div>
              <div className="flex items-center gap-2">
                <FaEnvelope className="text-yellow-400" /> info@tyabalawras.com
              </div>
              <div className="flex items-center gap-2">
                <FaPhone className="text-yellow-400" /> +213 555 123 456
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Line */}
        <div className="mt-8 border-t border-gray-700 pt-4 text-center text-xs text-gray-400">
          © 2025 طياب الأوراس - جميع الحقوق محفوظة
        </div>
      </div>
    </footer>
  );
}
