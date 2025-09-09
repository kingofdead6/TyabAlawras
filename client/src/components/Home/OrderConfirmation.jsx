import { useNavigate } from "react-router-dom";

export default function OrderConfirmation() {
  const navigate = useNavigate();

  return (
    <section className="min-h-screen flex items-center justify-center  text-center text-white">
      <div className="max-w-md px-6">
        <h2 className="text-3xl font-bold mb-6 text-yellow-400">
          تم تقديم الطلب!
        </h2>
        <p className="text-gray-300 mb-8">
          انتظر قليلاً وسيتصل بك أحد فريقنا للتأكيد.
        </p>
        <button
          onClick={() => navigate("/")}
          className="px-6 py-3 cursor-pointer bg-yellow-400 text-black font-semibold rounded-full shadow-md hover:bg-yellow-300 transition-all"
        >
          العودة إلى الصفحة الرئيسية
        </button>
      </div>
    </section>
  );
}
