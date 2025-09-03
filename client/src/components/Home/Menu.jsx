import { useState } from "react";
import { motion } from "framer-motion";

const dishes = [
  { name: "كسكس الأوراسي", price: "1200 دج", image: "https://res.cloudinary.com/dtwa3lxdk/image/upload/v1756898714/8593e92b-d20e-4d76-a64c-1ed0fed6469f_as4r7z.jpg", type: "أطباق رئيسية" },
  { name: "شوربة فريك", price: "500 دج", image: "https://res.cloudinary.com/dtwa3lxdk/image/upload/v1756898714/8593e92b-d20e-4d76-a64c-1ed0fed6469f_as4r7z.jpg", type: "شوربات" },
  { name: "طاجين لحم", price: "1500 دج", image: "https://res.cloudinary.com/dtwa3lxdk/image/upload/v1756898714/8593e92b-d20e-4d76-a64c-1ed0fed6469f_as4r7z.jpg", type: "أطباق رئيسية" },
  { name: "سلطة مشوية", price: "700 دج", image: "https://res.cloudinary.com/dtwa3lxdk/image/upload/v1756898714/8593e92b-d20e-4d76-a64c-1ed0fed6469f_as4r7z.jpg", type: "مقبلات" },
  { name: "بسطيلة", price: "1300 دج", image: "/images/bastila.jpg", type: "أطباق رئيسية" },
  { name: "حريرة", price: "600 دج", image: "/images/harira.jpg", type: "شوربات" },
  { name: "محاجب", price: "300 دج", image: "/images/mhadjeb.jpg", type: "مقبلات" },
  { name: "بريوش", price: "250 دج", image: "/images/brioche.jpg", type: "حلويات" },
  { name: "بسبوسة", price: "400 دج", image: "/images/basbousa.jpg", type: "حلويات" },
  { name: "شاي بالنعناع", price: "200 دج", image: "/images/tea.jpg", type: "مشروبات" },
  { name: "كسكس الأوراسي", price: "1200 دج", image: "https://res.cloudinary.com/dtwa3lxdk/image/upload/v1756898714/8593e92b-d20e-4d76-a64c-1ed0fed6469f_as4r7z.jpg", type: "أطباق رئيسية" },
  { name: "شوربة فريك", price: "500 دج", image: "https://res.cloudinary.com/dtwa3lxdk/image/upload/v1756898714/8593e92b-d20e-4d76-a64c-1ed0fed6469f_as4r7z.jpg", type: "شوربات" },
  { name: "طاجين لحم", price: "1500 دج", image: "https://res.cloudinary.com/dtwa3lxdk/image/upload/v1756898714/8593e92b-d20e-4d76-a64c-1ed0fed6469f_as4r7z.jpg", type: "أطباق رئيسية" },
  { name: "سلطة مشوية", price: "700 دج", image: "https://res.cloudinary.com/dtwa3lxdk/image/upload/v1756898714/8593e92b-d20e-4d76-a64c-1ed0fed6469f_as4r7z.jpg", type: "مقبلات" },
  { name: "بسطيلة", price: "1300 دج", image: "/images/bastila.jpg", type: "أطباق رئيسية" },
  { name: "حريرة", price: "600 دج", image: "/images/harira.jpg", type: "شوربات" },
  { name: "محاجب", price: "300 دج", image: "/images/mhadjeb.jpg", type: "مقبلات" },
  { name: "بريوش", price: "250 دج", image: "/images/brioche.jpg", type: "حلويات" },
  { name: "بسبوسة", price: "400 دج", image: "/images/basbousa.jpg", type: "حلويات" },
  { name: "شاي بالنعناع", price: "200 دج", image: "/images/tea.jpg", type: "مشروبات" },
  { name: "كسكس الأوراسي", price: "1200 دج", image: "https://res.cloudinary.com/dtwa3lxdk/image/upload/v1756898714/8593e92b-d20e-4d76-a64c-1ed0fed6469f_as4r7z.jpg", type: "أطباق رئيسية" },
  { name: "شوربة فريك", price: "500 دج", image: "https://res.cloudinary.com/dtwa3lxdk/image/upload/v1756898714/8593e92b-d20e-4d76-a64c-1ed0fed6469f_as4r7z.jpg", type: "شوربات" },
  { name: "طاجين لحم", price: "1500 دج", image: "https://res.cloudinary.com/dtwa3lxdk/image/upload/v1756898714/8593e92b-d20e-4d76-a64c-1ed0fed6469f_as4r7z.jpg", type: "أطباق رئيسية" },
  { name: "سلطة مشوية", price: "700 دج", image: "https://res.cloudinary.com/dtwa3lxdk/image/upload/v1756898714/8593e92b-d20e-4d76-a64c-1ed0fed6469f_as4r7z.jpg", type: "مقبلات" },
  { name: "بسطيلة", price: "1300 دج", image: "/images/bastila.jpg", type: "أطباق رئيسية" },
  { name: "حريرة", price: "600 دج", image: "/images/harira.jpg", type: "شوربات" },
  { name: "محاجب", price: "300 دج", image: "/images/mhadjeb.jpg", type: "مقبلات" },
  { name: "بريوش", price: "250 دج", image: "/images/brioche.jpg", type: "حلويات" },
  { name: "بسبوسة", price: "400 دج", image: "/images/basbousa.jpg", type: "حلويات" },
  { name: "شاي بالنعناع", price: "200 دج", image: "/images/tea.jpg", type: "مشروبات" },
  { name: "كسكس الأوراسي", price: "1200 دج", image: "https://res.cloudinary.com/dtwa3lxdk/image/upload/v1756898714/8593e92b-d20e-4d76-a64c-1ed0fed6469f_as4r7z.jpg", type: "أطباق رئيسية" },
  { name: "شوربة فريك", price: "500 دج", image: "https://res.cloudinary.com/dtwa3lxdk/image/upload/v1756898714/8593e92b-d20e-4d76-a64c-1ed0fed6469f_as4r7z.jpg", type: "شوربات" },
  { name: "طاجين لحم", price: "1500 دج", image: "https://res.cloudinary.com/dtwa3lxdk/image/upload/v1756898714/8593e92b-d20e-4d76-a64c-1ed0fed6469f_as4r7z.jpg", type: "أطباق رئيسية" },
  { name: "سلطة مشوية", price: "700 دج", image: "https://res.cloudinary.com/dtwa3lxdk/image/upload/v1756898714/8593e92b-d20e-4d76-a64c-1ed0fed6469f_as4r7z.jpg", type: "مقبلات" },
  { name: "بسطيلة", price: "1300 دج", image: "/images/bastila.jpg", type: "أطباق رئيسية" },
  { name: "حريرة", price: "600 دج", image: "/images/harira.jpg", type: "شوربات" },
  { name: "محاجب", price: "300 دج", image: "/images/mhadjeb.jpg", type: "مقبلات" },
  { name: "بريوش", price: "250 دج", image: "/images/brioche.jpg", type: "حلويات" },
  { name: "بسبوسة", price: "400 دج", image: "/images/basbousa.jpg", type: "حلويات" },
  { name: "شاي بالنعناع", price: "200 دج", image: "/images/tea.jpg", type: "مشروبات" },
  
];

export default function Menu() {
  const [visible, setVisible] = useState(12);
  const [selectedType, setSelectedType] = useState("الكل");

  const types = ["الكل", ...new Set(dishes.map((dish) => dish.type))];

  const filteredDishes =
    selectedType === "الكل"
      ? dishes
      : dishes.filter((dish) => dish.type === selectedType);

  return (
    <section id="menu" className="py-16">
      <div className="container mx-auto px-4 text-center">
        {/* Title */}
        <h2 className="text-3xl md:text-4xl font-bold mb-8 text-yellow-400 drop-shadow-lg">
          القائمة
        </h2>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {types.map((type, i) => (
            <button
              key={i}
              onClick={() => {
                setSelectedType(type);
                setVisible(12); // reset to 9 when changing type
              }}
              className={`cursor-pointer px-4 py-2 rounded-full border transition ${
                selectedType === type
                  ? "bg-yellow-400 text-black font-semibold"
                  : "bg-transparent text-yellow-300 border-yellow-400 hover:bg-yellow-500 hover:text-black"
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        {/* Menu Items */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {filteredDishes.slice(0, visible).map((dish, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05 }}
              className="bg-black/40 backdrop-blur-md border border-gray-700 rounded-2xl shadow-lg p-4 flex flex-col items-center text-white"
            >
              <img
                src={dish.image}
                alt={dish.name}
                className="w-60 h-40 object-cover rounded-xl mb-3"
              />
              <h3 className="text-lg font-semibold">{dish.name}</h3>
              <p className="text-yellow-400 mt-1">{dish.price}</p>
            </motion.div>
          ))}
        </div>

        {/* Show More Button */}
        {visible < filteredDishes.length && (
          <div className="mt-8">
            <button
              onClick={() => setVisible((prev) => prev + 9)}
              className="px-6 py-3 bg-yellow-400 text-black font-semibold rounded-full shadow-lg hover:bg-yellow-500 transition"
            >
              عرض المزيد
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
