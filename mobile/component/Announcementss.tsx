import React, { useState, useEffect } from "react";
import { View, Text, Image, FlatList, Dimensions, ActivityIndicator } from "react-native";
import axios from "axios";
import { API_BASE_URL } from "../api";
import Animated, { FadeInUp } from "react-native-reanimated";
import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo";

interface Announcement {
  _id: string;
  title: string;
  description: string;
  image: string;
}

export default function Announcementss() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [isOffline, setIsOffline] = useState<boolean>(false);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsOffline(!state.isConnected);
    });

    fetchAnnouncements();

    return () => unsubscribe();
  }, []);

  const fetchAnnouncements = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.get<Announcement[]>(
        `${API_BASE_URL}/announcements`
      );
      const data = response.data || [];
      setAnnouncements(data);

      // ✅ Save for offline use
      await AsyncStorage.setItem("announcements", JSON.stringify(data));
    } catch (err: any) {
      console.error("Fetch announcements error:", err);
      setError("⚠️ لا يمكن الاتصال بالإنترنت. عرض الإعلانات المخزنة.");
      Toast.show({
        type: "error",
        text1: "خطأ",
        text2: "فشل في جلب الإعلانات",
      });

      // ✅ Load cached announcements if available
      const cached = await AsyncStorage.getItem("announcements");
      if (cached) {
        setAnnouncements(JSON.parse(cached));
      }
    } finally {
      setLoading(false);
    }
  };

  const { width } = Dimensions.get("window");

  const renderItem = ({ item, index }: { item: Announcement; index: number }) => (
    <Animated.View
      entering={FadeInUp.delay(index * 200).duration(600)}
      className="bg-black/70 rounded-2xl overflow-hidden shadow-lg shadow-yellow-400 border border-yellow-400 mt-10"
      style={{ width: width * 0.8, marginRight: 16 }}
    >
      <Image
        source={{ uri: item.image }}
        className="w-full h-56"
        resizeMode="cover"
      />
      <View className="p-4 items-center">
        <Text className="text-2xl font-semibold text-yellow-300 text-center">
          {item.title}
        </Text>
        <Text className="text-white text-sm text-center">
          {item.description}
        </Text>
      </View>
    </Animated.View>
  );

  return (
    <View className="bg-black py-8 -mt-2 mb-8">
      {isOffline && (
        <Text className="text-orange-400 text-center mb-2">
          📴 وضع عدم الاتصال — عرض الإعلانات المخزنة
        </Text>
      )}

      {error ? (
        <Text className="text-red-400 text-center mb-6 font-medium">
          {error}
        </Text>
      ) : loading ? (
        <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color="#facc15" />
        </View>
      ) : announcements.length > 0 ? (
        <FlatList
          data={announcements}
          renderItem={renderItem}
          keyExtractor={(item) => item._id}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16 }}
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
