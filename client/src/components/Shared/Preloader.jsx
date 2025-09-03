import { useEffect, useState } from "react";

export default function Preloader({ images, children }) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let count = 0;
    images.forEach(src => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        count++;
        if (count === images.length) setLoaded(true);
      };
    });
  }, [images]);

  if (!loaded) {
    return (
      <div className="h-screen flex items-center justify-center text-3xl font-bold">
        جاري التحميل...
      </div>
    );
  }

  return children;
}
