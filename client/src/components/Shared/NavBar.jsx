import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaBars, FaTimes, FaShoppingCart } from "react-icons/fa";
import { jwtDecode } from "jwt-decode";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [userType, setUserType] = useState(null);
  const navigate = useNavigate();

  // Scroll listener
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Function to decode and set user type
  const checkAuth = () => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserType(decoded.usertype);
      } catch {
        setUserType(null);
      }
    } else {
      setUserType(null);
    }
  };

  // Run once + listen for changes
  useEffect(() => {
    checkAuth();

    const handleAuthChange = () => checkAuth();
    window.addEventListener("storage", handleAuthChange);
    window.addEventListener("authChanged", handleAuthChange);

    return () => {
      window.removeEventListener("storage", handleAuthChange);
      window.removeEventListener("authChanged", handleAuthChange);
    };
  }, []);

  const handleScrollTo = (id, basePath) => {
    setMenuOpen(false);
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

  const handleLogout = () => {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    setUserType(null);
    window.dispatchEvent(new Event("authChanged"));
    navigate("/login");
  };

  // Navigation items for regular users
  const navItems = [
    { label: "الرئيسية", type: "scroll", value: "home", basePath: "/" },
    { label: "القائمة", type: "scroll", value: "menu" },
    { label: "أوقات العمل", type: "scroll", value: "Working-times" },
    { label: "المعرض", type: "scroll", value: "gallery" },
    { label: "الإعلانات", type: "scroll", value: "announcements" },
    { label: "تواصل معنا", type: "scroll", value: "contact" },
    { label: "من نحن", type: "scroll", value: "about", basePath: "/about" },
    { label: "الموقع", type: "scroll", value: "location", basePath: "/about" },
  ];

  // Navigation items for admins
  const adminNavItems = [
    { label: "لوحة التحكم", path: "/admin/dashboard" },
    { label: "إدارة الإعلانات", path: "/admin/announcements" },
    { label: "إدارة المعرض", path: "/admin/gallery" },
    { label: "إدارة الفيديوهات", path: "/admin/videos" },
    { label: "إدارة القائمة", path: "/admin/menu" },
    { label: "إدارة الرسائل", path: "/admin/contact" },
    { label: "النشرة الإخبارية", path: "/admin/newsletter" },
    { label: "أوقات العمل", path: "/admin/working-times" },
    { label: "إدارة الطلبات", path: "/admin/orders" },
    { label: "إدارة مناطق التوصيل", path: "/admin/delivery-areas" },
  ];

  // Navigation items for superadmins
  const superadminNavItems = [
    { label: "لوحة التحكم", path: "/admin/dashboard" },
    { label: "إدارة المستخدمين", path: "/admin/users" },
    { label: "إدارة الإعلانات", path: "/admin/announcements" },
    { label: "إدارة المعرض", path: "/admin/gallery" },
    { label: "إدارة الفيديوهات", path: "/admin/videos" },
    { label: "إدارة القائمة", path: "/admin/menu" },
    { label: "إدارة الرسائل", path: "/admin/contact" },
    { label: "النشرة الإخبارية", path: "/admin/newsletter" },
    { label: "أوقات العمل", path: "/admin/working-times" },
    { label: "إدارة الطلبات", path: "/admin/orders" },
    { label: "إدارة مناطق التوصيل", path: "/admin/delivery-areas" },
  ];

  const isAdmin = userType === "admin";
  const isSuperAdmin = userType === "superadmin";

  // Helper to render navItems
  const renderNavItems = (items) =>
    items.map((item, index) => (
      <li key={index}>
        {item.type === "path" ? (
          <Link
            to={item.value}
            onClick={() => setMenuOpen(false)}
            className="cursor-pointer hover:text-yellow-400"
          >
            {item.label}
          </Link>
        ) : (
          <button
            onClick={() => handleScrollTo(item.value, item.basePath)}
            className="cursor-pointer hover:text-yellow-400"
          >
            {item.label}
          </button>
        )}
      </li>
    ));

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
          <div className="w-12 h-12 rounded-full bg-yellow-500 flex items-center justify-center ">
            <img
              className="rounded-full"
              src="https://res.cloudinary.com/dtwa3lxdk/image/upload/v1756897359/465660711_1763361547537323_2674934284076407223_n_prlt48.jpg"
              alt="Logo"
            />
          </div>
          <h1 className="ml-3 text-xl font-bold text-white">طياب الأوراس</h1>
        </div>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-6">
          <ul className="flex gap-6 text-white font-medium text-lg">
            {!isAdmin && !isSuperAdmin && renderNavItems(navItems)}

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
                <li key={`superadmin-${index}`}>
                  <Link to={item.path} className="hover:text-yellow-400 cursor-pointer">
                    {item.label}
                  </Link>
                </li>
              ))}
          </ul>

          {/* Cart button (desktop) - only for normal users */}
          {!isAdmin && !isSuperAdmin && (
            <Link to="/cart" className="text-white text-2xl hover:text-yellow-400">
              <FaShoppingCart />
            </Link>
          )}

          {userType && (
            <button
              onClick={handleLogout}
              className="cursor-pointer px-4 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition"
            >
              تسجيل الخروج
            </button>
          )}
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
          {!isAdmin && !isSuperAdmin && renderNavItems(navItems)}

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
              <li key={`superadmin-${index}`}>
                <Link
                  to={item.path}
                  onClick={() => setMenuOpen(false)}
                  className="hover:text-yellow-400 cursor-pointer"
                >
                  {item.label}
                </Link>
              </li>
            ))}

          {/* Cart button (mobile) - only for normal users */}
          {!isAdmin && !isSuperAdmin && (
            <Link to="/cart" className="text-white text-2xl hover:text-yellow-400">
              <FaShoppingCart />
            </Link>
          )}

          {/* Logout only for admins/superadmins (mobile) */}
          {(isAdmin || isSuperAdmin) && (
            <button
              onClick={handleLogout}
              className="cursor-pointer px-4 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition"
            >
              تسجيل الخروج
            </button>
          )}
        </motion.ul>
      )}
    </motion.nav>
  );
}
