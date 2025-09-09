import { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { API_BASE_URL } from "../../../api";
import { FaTrash } from "react-icons/fa";
import { MdCloudUpload } from "react-icons/md";

export default function AdminVideos() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]);

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      const response = await axios.get(`${API_BASE_URL}/videos`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setVideos(response.data || []);
    } catch (err) {
      console.error("Fetch videos error:", err);
      setError(err.response?.data?.message || "⚠️ خطأ في جلب الفيديوهات");
      toast.error("خطأ في جلب الفيديوهات");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 5) {
      toast.error("لا يمكن رفع أكثر من 5 فيديوهات في المرة الواحدة");
      return;
    }
    setSelectedFiles(files);
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      toast.error("يرجى اختيار فيديو واحد على الأقل");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      const formData = new FormData();
      selectedFiles.forEach((file) => formData.append("videos", file));

      await axios.post(`${API_BASE_URL}/videos`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("تم رفع الفيديوهات بنجاح");
      setSelectedFiles([]);
      fetchVideos();
    } catch (err) {
      console.error("Upload videos error:", err);
      toast.error(err.response?.data?.message || "خطأ في رفع الفيديوهات");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("هل أنت متأكد من حذف هذا الفيديو؟")) return;

    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      await axios.delete(`${API_BASE_URL}/videos/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("تم حذف الفيديو بنجاح");
      fetchVideos();
    } catch (err) {
      console.error("Delete video error:", err);
      toast.error(err.response?.data?.message || "خطأ في حذف الفيديو");
    }
  };

  return (
    <div className="min-h-screen text-white py-12 px-4 pt-20" dir="rtl">
      <ToastContainer />
      <motion.div
        className="max-w-6xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-3xl font-bold text-yellow-400 mb-8">
          إدارة الفيديوهات
        </h1>

        {/* Upload Section */}
        <div className="mb-10 p-6 bg-gray-800 rounded-2xl shadow-lg">
          <h2 className="text-xl font-semibold mb-4">رفع فيديوهات جديدة</h2>
          <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-600 rounded-xl p-6 cursor-pointer hover:border-yellow-400 transition">
            <MdCloudUpload className="text-5xl text-yellow-400 mb-3" />
            <span className="text-gray-300 mb-2">
              اسحب الفيديوهات هنا أو اضغط للاختيار
            </span>
            <input
              type="file"
              accept="video/mp4"
              multiple
              onChange={handleFileChange}
              className="hidden"
            />
          </label>

          {/* Preview selected files */}
          {selectedFiles.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-3">
              {selectedFiles.map((file, i) => (
                <div
                  key={i}
                  className="bg-gray-900 p-2 rounded-lg text-sm text-gray-300"
                >
                  {file.name}
                </div>
              ))}
            </div>
          )}

          <button
            onClick={handleUpload}
            disabled={loading || selectedFiles.length === 0}
            className={`mt-5 px-6 py-2 rounded-lg font-semibold ${
              loading || selectedFiles.length === 0
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-yellow-400 text-black hover:bg-yellow-500"
            }`}
          >
            {loading ? "جارٍ الرفع..." : "رفع الفيديوهات"}
          </button>
        </div>

        {/* Videos List */}
        {error && <p className="text-red-400 text-center mb-6">{error}</p>}
        {loading ? (
          <p className="text-center text-gray-400">جارٍ التحميل...</p>
        ) : videos.length > 0 ? (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {videos.map((video) => (
              <motion.div
                key={video._id}
                className="bg-gray-800 rounded-2xl shadow-lg overflow-hidden relative"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                <video
                  src={video.video}
                  controls
                  className="w-full h-52 object-cover"
                />
                <button
                  onClick={() => handleDelete(video._id)}
                  className="absolute top-3 left-3 p-2 bg-red-600 hover:bg-red-700 rounded-full shadow-md"
                  title="حذف الفيديو"
                >
                  <FaTrash />
                </button>
              </motion.div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-400">لا توجد فيديوهات</p>
        )}
      </motion.div>
    </div>
  );
}
