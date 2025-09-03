import { FaPhone, FaMapMarkerAlt } from "react-icons/fa";

export default function Contact() {
  return (
    <section id="contact" className="py-20">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-4xl font-bold text-yellow-400 drop-shadow-[0_0_10px_red] mb-12">
          تواصل معنا
        </h2>

        {/* Contact Form */}
        <form className="max-w-xl mx-auto bg-black/70 p-8 rounded-2xl shadow-lg border border-yellow-400/20">
          <div className="mb-6 text-right">
            <label htmlFor="name" className="block mb-2 text-white font-semibold">
              الاسم الكامل
            </label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="اكتب اسمك"
              className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-600 focus:border-yellow-400 outline-none"
              required
            />
          </div>

          <div className="mb-6 text-right">
            <label htmlFor="email" className="block mb-2 text-white font-semibold">
              البريد الإلكتروني
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="example@email.com"
              className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-600 focus:border-yellow-400 outline-none"
              required
            />
          </div>

          <div className="mb-6 text-right">
            <label htmlFor="message" className="block mb-2 text-white font-semibold">
              رسالتك
            </label>
            <textarea
              id="message"
              name="message"
              rows="5"
              placeholder="اكتب رسالتك هنا..."
              className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-600 focus:border-yellow-400 outline-none resize-none"
              required
            />
          </div>

          <button
            type="submit"
            className="cursor-pointer w-full py-3 rounded-lg bg-yellow-400 text-black font-bold text-lg hover:bg-yellow-300 transition drop-shadow-[0_0_8px_red]"
          >
            إرسال
          </button>
        </form>
      </div>
    </section>
  );
}
