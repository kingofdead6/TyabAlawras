import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {jwtDecode} from "jwt-decode";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [userType, setUserType] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserType(decoded.usertype);
      } catch (error) {
        setUserType(null);
        navigate("/login");
      }
    } else {
      setUserType(null);
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    navigate("/login");
  };

  const adminSections = [
    {
      path: "/admin/announcements",
      title: "إدارة الإعلانات",
      description: "إنشاء، تعديل، وحذف الإعلانات",
    },
    {
      path: "/admin/gallery",
      title: "إدارة المعرض",
      description: "إضافة وحذف الصور",
    },
    {
      path: "/admin/menu",
      title: "إدارة القائمة",
      description: "إنشاء، تعديل، وحذف عناصر القائمة",
    },
    {
      path: "/admin/contact",
      title: "إدارة الرسائل",
      description: "عرض الرسائل المرسلة",
    },
    {
      path: "/admin/newsletter",
      title: "النشرة الإخبارية",
      description: "عرض المشتركين في النشرة الإخبارية",
    },
    {
      path: "/admin/working-times",
      title: "إدارة أوقات العمل",
      description: "تحديث أوقات العمل لكل يوم من أيام الأسبوع",
    }
  ];

  const superadminSections = [
    ...adminSections,
    {
      path: "/admin/users",
      title: "إدارة المستخدمين",
      description: "إنشاء، تعديل، وحذف حسابات المستخدمين",
    },
  ];

  const sections = userType === "superadmin" ? superadminSections : adminSections;

  return (
    <div className="min-h-screen  text-white py-12 px-4 pt-20">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto"
      >
        <h1 className="text-4xl font-bold text-yellow-400 text-center mb-12">
          لوحة تحكم الإدارة
        </h1>
        <div className="grid md:grid-cols-2 gap-6">
          {sections.map((section, index) => (
            <Link
              key={index}
              to={section.path}
              className="p-6 bg-gray-800 rounded-lg hover:bg-gray-700 transition text-center shadow-lg hover:shadow-2xl shadow-red-500"
            >
              <h2 className="text-2xl font-semibold text-yellow-400">{section.title}</h2>
              <p className="mt-2 text-gray-300">{section.description}</p>
            </Link>
          ))}
        </div>
      
      </motion.div>
    </div>
  );
}