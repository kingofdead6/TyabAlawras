import { motion } from "framer-motion";

export default function AboutIntro() {
  return (
    <section
      id="about"
      className="relative bg-cover bg-center bg-fixed min-h-screen flex items-center justify-center"
      style={{ backgroundImage: "url('https://res.cloudinary.com/dtwa3lxdk/image/upload/v1756901348/20250903_1308_Cozy_Algerian_Restaurant_simple_compose_01k47qjnyxf9tafjks7xrdp26a_a2xuzc.png')" }} // put your image in /public
    >
      <div className="absolute inset-0 bg-black/60"></div>
      <div className="relative z-10 max-w-4xl text-center text-white px-6">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl sm:text-5xl font-extrabold mb-6"
        >
          من نحن
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-lg sm:text-xl leading-relaxed text-gray-200"
        >
          في مطعم طياب الأوراس، نسعى إلى تقديم تجربة فريدة تجمع بين الأصالة والنكهة العصرية.  
من قلب الأوراس، نحضر لكم أشهى الأطباق التقليدية المطهوة بعناية، مع لمسة إبداعية تجعل كل وجبة رحلة لا تُنسى.  
هدفنا هو أن نصبح الوجهة الأولى لعشاق الطعام الأصيل، حيث يلتقي التراث مع الجودة والضيافة.

        </motion.p>
      </div>
    </section>
  );
}
