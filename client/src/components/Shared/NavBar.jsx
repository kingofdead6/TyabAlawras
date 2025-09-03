import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaBars, FaTimes } from "react-icons/fa";
import { jwtDecode } from "jwt-decode";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [userType, setUserType] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserType(decoded.usertype);
      } catch (error) {
        setUserType(null);
      }
    } else {
      setUserType(null);
    }
  }, []);

  const handleScrollTo = (id) => {
    setMenuOpen(false);
    if (window.location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      }, 300);
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    setUserType(null);
    navigate("/login");
  };

  const navItems = [
    { label: "الرئيسية", path: "/" },
    { label: "القائمة", scrollTo: "menu" },
    { label: "المعرض", scrollTo: "gallery" },
    { label: "الإعلانات", scrollTo: "announcements" },
    { label: "تواصل معنا", scrollTo: "contact" },
    { label: "من نحن", path: "/about" },
  ];

  const adminNavItems = [
    { label: "لوحة التحكم", path: "/admin/dashboard" },
    { label: "إدارة الإعلانات", path: "/admin/announcements" },
    { label: "إدارة المعرض", path: "/admin/gallery" },
    { label: "إدارة القائمة", path: "/admin/menu" },
    { label: "إدارة الرسائل", path: "/admin/contact" },
    { label: "النشرة الإخبارية", path: "/admin/newsletter" },
  ];

  const superadminNavItems = [
    { label: "لوحة التحكم", path: "/admin/dashboard" },
    { label: "إدارة المستخدمين", path: "/admin/users" },
    { label: "إدارة الإعلانات", path: "/admin/announcements" },
    { label: "إدارة المعرض", path: "/admin/gallery" },
    { label: "إدارة القائمة", path: "/admin/menu" },
    { label: "إدارة الرسائل", path: "/admin/contact" },
    { label: "النشرة الإخبارية", path: "/admin/newsletter" },
  ];

  // Check if user is admin
  const isAdmin = userType === "admin" ;
  const isSuperAdmin = userType === "superadmin";
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
        <div className="hidden md:flex items-center gap-6">
          <ul className="flex gap-6 text-white font-medium text-lg">
            {!isAdmin && !isSuperAdmin &&
              navItems.map((item, index) => (
                <li key={index}>
                  {item.path ? (
                    <Link to={item.path} className="cursor-pointer hover:text-yellow-400">
                      {item.label}
                    </Link>
                  ) : (
                    <button
                      onClick={() => handleScrollTo(item.scrollTo)}
                      className="cursor-pointer hover:text-yellow-400"
                    >
                      {item.label}
                    </button>
                  )}
                </li>
              ))}
            {isAdmin &&
              adminNavItems.map((item, index) => (
                <li key={`admin-${index}`}>
                  <Link to={item.path} className="cursor-pointer hover:text-yellow-400">
                    {item.label}
                  </Link>
                </li>
              ))}
              {isSuperAdmin &&
              superadminNavItems.map((item, index) => (
                <li key={`admin-${index}`}>
                  <Link to={item.path} className="hover:text-yellow-400 cursor-pointer ">
                    {item.label}
                  </Link>
                </li>
              ))}
          </ul>
          {userType &&
            <button
              onClick={handleLogout}
              className="cursor-pointer px-4 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition"
            >
              تسجيل الخروج
            </button>
    }
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-white text-2xl cursor-pointer"
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
          {!isAdmin && !isSuperAdmin &&
            navItems.map((item, index) => (
              <li key={index}>
                {item.path ? (
                  <Link to={item.path} onClick={() => setMenuOpen(false)}>
                    {item.label}
                  </Link>
                ) : (
                  <button
                    onClick={() => {
                      handleScrollTo(item.scrollTo);
                      setMenuOpen(false);
                    }}
                    className="cursor-pointer"
                  >
                    {item.label}
                  </button>
                )}
              </li>
            ))}
          {isAdmin &&
            adminNavItems.map((item, index) => (
              <li key={`admin-${index}`}>
                <Link
                  to={item.path}
                  onClick={() => setMenuOpen(false)}
                  className="hover:text-yellow-400 cursor-pointer"
                >
                  {item.label}
                </Link>
              </li>
            ))}
            {isSuperAdmin &&
            superadminNavItems.map((item, index) => (
              <li key={`admin-${index}`}>
                <Link
                  to={item.path}
                  onClick={() => setMenuOpen(false)}
                  className="hover:text-yellow-400 cursor-pointer"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          
        </motion.ul>
      )}
    </motion.nav>
  );
}
