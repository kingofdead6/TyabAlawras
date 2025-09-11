import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import Carousel from "react-native-reanimated-carousel";
import axios from "axios";
import { API_BASE_URL } from "../api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo";

interface GalleryImage {
  _id: string;
  image: string;
}

export default function GalleryMobile() {
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [isOffline, setIsOffline] = useState<boolean>(false);

  const { width } = Dimensions.get("window");

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsOffline(!state.isConnected);
    });

    fetchGalleryImages();

    return () => unsubscribe();
  }, []);

  const fetchGalleryImages = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.get<GalleryImage[]>(
        `${API_BASE_URL}/gallery`
      );
      const data = response.data || [];
      setGalleryImages(data);

      // ✅ Cache for offline use
      await AsyncStorage.setItem("galleryImages", JSON.stringify(data));
    } catch (err: any) {
      console.error("Fetch gallery error:", err);
      setError("⚠️ لا يمكن الاتصال بالإنترنت. عرض الصور المخزنة.");

      // ✅ Load cached images if available
      const cached = await AsyncStorage.getItem("galleryImages");
      if (cached) {
        setGalleryImages(JSON.parse(cached));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="bg-black py-8 ">
      {isOffline && (
        <Text className="text-orange-400 text-center mb-2">
          📴 وضع عدم الاتصال — عرض الصور المخزنة
        </Text>
      )}

      <Text className="text-4xl font-bold mb-6 text-center text-yellow-400">
        المعرض
      </Text>

      {error ? (
        <Text className="text-red-400 text-center mb-6 font-medium">
          {error}
        </Text>
      ) : loading ? (
        <ActivityIndicator
          size="large"
          color="#facc15"
          style={{ marginTop: 20 }}
        />
      ) : galleryImages.length > 0 ? (
        <Carousel
          loop
          width={width}
          height={250}
          autoPlay
          autoPlayInterval={0} // autoplay delay
          data={galleryImages}
          scrollAnimationDuration={3000}
          renderItem={({ item }) => (
            <View className="flex-1 px-2">
              <Image
                source={{
                  uri: item.image.startsWith("http")
                    ? item.image
                    : `${API_BASE_URL}/${item.image}`,
                }}
                style={{ width: "90%", height: "100%", borderRadius: 12 }}
                resizeMode="cover"
              />
            </View>
          )}
        />
      ) : (
        <Text className="text-gray-400 text-center mt-10">
          لا توجد صور في المعرض
        </Text>
      )}
    </View>
  );
}
