import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import axios from "axios";
import { API_BASE_URL } from "../../../api";

export default function Gallery() {
  const sliderRef = useRef(null);
  const [galleryImages, setGalleryImages] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const settings = {
    dots: false,
    infinite: true,
    speed: 5000,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 10,
    cssEase: "linear",
    pauseOnHover: false,
    arrows: false,
    centerMode: true,
    centerPadding: "0px",
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 3 } },
      { breakpoint: 768, settings: { slidesToShow: 2 } },
      { breakpoint: 480, settings: { slidesToShow: 1 } },
    ],
  };

  useEffect(() => {
    fetchGalleryImages();
  }, []);

  const fetchGalleryImages = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.get(`${API_BASE_URL}/gallery`);
      setGalleryImages(response.data.map((item) => item.image) || []);
    } catch (err) {
      console.error('Fetch gallery images error:', err);
      setError(err.response?.data?.message || "⚠️ خطأ في جلب الصور");
    } finally {
      setLoading(false);
    }
  };

  const renderSlides = () => {
    const slides = [];
    for (let i = 0; i < galleryImages.length; ) {
      // Big image
      if (i < galleryImages.length) {
        slides.push(
          <div
            key={`big-${i}`}
            className="inline-block w-[400px] h-[300px] px-[2px]"
          >
            <img
              src={galleryImages[i]}
              alt="Large"
              draggable={false}
              onClick={(e) => e.preventDefault()}
              className="w-full h-full object-cover rounded-xl shadow-lg pointer-events-none select-none"
            />
          </div>
        );
        i++;
      }
      // Two stacked smaller images
      if (i < galleryImages.length) {
        slides.push(
          <div
            key={`small-${i}`}
            className="w-[200px] h-[300px] px-[2px] flex flex-col justify-between"
          >
            <img
              src={galleryImages[i]}
              alt="Small 1"
              draggable={false}
              onClick={(e) => e.preventDefault()}
              className="w-full h-[48%] object-cover rounded-xl shadow-md mb-2 pointer-events-none select-none"
            />
            {galleryImages[i + 1] && (
              <img
                src={galleryImages[i + 1]}
                alt="Small 2"
                draggable={false}
                onClick={(e) => e.preventDefault()}
                className="w-full h-[48%] object-cover rounded-xl shadow-md pointer-events-none select-none"
              />
            )}
          </div>
        );
        i += 2;
      }
    }
    return slides;
  };

  return (
    <section id="gallery" className="py-16 relative" dir="rtl">
      <div className="container mx-auto text-center">
        <motion.h2
          initial={{ y: -30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 1 }}
          className="text-3xl md:text-4xl font-bold mb-10 text-yellow-400 drop-shadow-lg"
        >
          المعرض
        </motion.h2>

        {error && <p className="text-red-400 text-center mb-6 font-medium">{error}</p>}

        {loading ? (
          <p className="text-center text-gray-400 mt-10">جارٍ التحميل...</p>
        ) : galleryImages.length > 0 ? (
          <div className="relative max-w-9xl mx-auto">
            <Slider ref={sliderRef} {...settings}>
              {renderSlides()}
            </Slider>
          </div>
        ) : (
          <p className="text-center text-gray-400 mt-10">لا توجد صور في المعرض</p>
        )}
      </div>
    </section>
  );
}