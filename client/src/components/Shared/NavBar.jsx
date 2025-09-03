import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaBars, FaTimes } from "react-icons/fa";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleScrollTo = (id) => {
    setMenuOpen(false);
    // wait a tick if we’re on a different page
    if (window.location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      }, 300);
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <motion.nav
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className={`fixed top-0 left-0 w-full z-50 transition-colors duration-300 ${
        scrolled ? "bg-black/90 shadow-lg" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto flex justify-between items-center py-4 px-6">
        {/* Logo */}
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-yellow-500 flex items-center justify-center shadow-[0_0_10px_#ff1a1a]">
            <img
              className="rounded-full"
              src="https://res.cloudinary.com/dtwa3lxdk/image/upload/v1756897359/465660711_1763361547537323_2674934284076407223_n_prlt48.jpg"
              alt="Logo"
            />
          </div>
          <h1 className="ml-3 text-xl font-bold text-white drop-shadow-[0_0_6px_#ff1a1a]">
            طياب الأوراس
          </h1>
        </div>

        {/* Desktop links */}
        <ul className="hidden md:flex gap-6 text-white font-medium text-lg">
          <li><Link to="/">الرئيسية</Link></li>
          <li><button onClick={() => handleScrollTo("menu")} className="hover:text-yellow-400">القائمة</button></li>
          <li><button onClick={() => handleScrollTo("gallery")} className="hover:text-yellow-400">المعرض</button></li>
          <li><button onClick={() => handleScrollTo("announcements")} className="hover:text-yellow-400">الإعلانات</button></li>
          <li><button onClick={() => handleScrollTo("contact")} className="hover:text-yellow-400">تواصل معنا</button></li>
          <li><Link to="/about" className="hover:text-yellow-400">من نحن</Link></li>
        </ul>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-white text-2xl"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <motion.ul
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="md:hidden bg-black/95 text-white flex flex-col items-center gap-6 py-8 shadow-lg"
        >
          <li><Link to="/" onClick={() => setMenuOpen(false)}>الرئيسية</Link></li>
          <li><button onClick={() => handleScrollTo("menu")}>القائمة</button></li>
          <li><button onClick={() => handleScrollTo("gallery")}>المعرض</button></li>
          <li><button onClick={() => handleScrollTo("announcements")}>الإعلانات</button></li>
          <li><button onClick={() => handleScrollTo("contact")}>تواصل معنا</button></li>
          <li><Link to="/about" onClick={() => setMenuOpen(false)}>من نحن</Link></li>
        </motion.ul>
      )}
    </motion.nav>
  );
}
