import { motion } from "framer-motion";

const news = [
  {
    title: "افتتاح رسمي يوم الجمعة",
    description: "انضموا إلينا في يوم الافتتاح الكبير مع أجواء مميزة وضيافة رائعة.",
    image: "https://res.cloudinary.com/dtwa3lxdk/image/upload/v1756897472/20250903_1202_Modern_Cozy_Restaurant_simple_compose_01k47ks0w7eg39483aee1108ca_dwogna.png",
  },
  {
    title: "خصم 20% على جميع الأطباق",
    description: "بمناسبة الافتتاح، استمتعوا بخصم 20% على كل وجبة.",
    image: "https://res.cloudinary.com/dtwa3lxdk/image/upload/v1756897472/20250903_1202_Modern_Cozy_Restaurant_simple_compose_01k47ks0w7eg39483aee1108ca_dwogna.png",
  },
  
];

export default function Announcements() {
  return (
    <section id="announcements" className="py-20">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-4xl font-bold text-yellow-400 drop-shadow-[0_0_10px_red] mb-12">
          الإعلانات
        </h2>

        <div className="grid md:grid-cols-2 gap-8">
          {news.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.2 }}
              viewport={{ once: true }}
              className="bg-black/70 rounded-2xl overflow-hidden shadow-lg hover:shadow-yellow-500/40 border border-yellow-400/20"
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-56 object-cover"
              />
              <div className="p-6 text-white">
                <h3 className="text-2xl font-semibold mb-3 text-yellow-300 drop-shadow-[0_0_5px_red]">
                  {item.title}
                </h3>
                <p className="text-gray-200 text-sm leading-relaxed">
                  {item.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
