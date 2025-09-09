import React, { useState, useEffect } from "react";
import { View, Text, Image, FlatList } from "react-native";
import axios from "axios";
import { API_BASE_URL } from "../../api";
import Animated, { FadeInUp } from "react-native-reanimated";
import Toast from "react-native-toast-message";

interface Announcement {
  _id: string;
  title: string;
  description: string;
  image: string;
}

export default function Announcements() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.get<Announcement[]>(`${API_BASE_URL}/announcements`);
      setAnnouncements(response.data || []);
    } catch (err: any) {
      console.error("Fetch announcements error:", err);
      setError(err.response?.data?.message || "⚠️ خطأ في جلب الإعلانات");
      Toast.show({ type: "error", text1: "خطأ", text2: "فشل في جلب الإعلانات" });
    } finally {
      setLoading(false);
    }
  };

const renderItem = ({ item, index }: { item: Announcement; index: number }) => (
  <Animated.View
    entering={FadeInUp.delay(index * 200).duration(600)}
    className="bg-black/70 rounded-2xl overflow-hidden shadow-lg shadow-yellow-400 border border-yellow-400/20 mb-4"
  >
    <Image
      source={{ uri: item.image }}
      className="w-full h-56"
      style={{ resizeMode: "cover" }}
    />
    <View className="p-4 items-center">
      <Text className="text-2xl font-semibold text-yellow-300 mb-2 text-center">
        {item.title}
      </Text>
      <Text className="text-gray-200 text-sm text-center">
        {item.description}
      </Text>
    </View>
  </Animated.View>
);


  return (
    <View className="flex-1 bg-black py-8  -mt-5 px-4">
      <Text className="text-4xl font-bold text-yellow-400 text-center mb-8">
        الإعلانات
      </Text>

      {error ? (
        <Text className="text-red-400 text-center mb-6 font-medium">{error}</Text>
      ) : loading ? (
        <Text className="text-gray-400 text-center mt-10">جارٍ التحميل...</Text>
      ) : announcements.length > 0 ? (
        <FlatList
          data={announcements}
          renderItem={renderItem}
          keyExtractor={(item) => item._id}
          contentContainerStyle={{ paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <Text className="text-gray-400 text-center mt-10">
          لا توجد إعلانات متاحة
        </Text>
      )}

      <Toast />
      
    </View>
  );
}
