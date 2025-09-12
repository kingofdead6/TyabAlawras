import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { API_BASE_URL } from "../api";
import Animated, { FadeInUp } from "react-native-reanimated";
import NetInfo from "@react-native-community/netinfo";

interface MenuItem {
  _id: string;
  name: string;
  type: string;
  price: number;
  image: string;
  quantity?: number;
}

export default function MenuPreview() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedFood, setSelectedFood] = useState<MenuItem | null>(null);
  const [popupMessage, setPopupMessage] = useState<string>("");
  const [isOffline, setIsOffline] = useState<boolean>(false);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsOffline(!state.isConnected);
    });
    fetchMenuItems();
    return () => unsubscribe();
  }, []);

  const fetchMenuItems = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.get<MenuItem[]>(`${API_BASE_URL}/menu`);
      const shuffled = response.data.sort(() => 0.5 - Math.random());
      const menu = shuffled.slice(0, 8);
      setMenuItems(menu);

      // ✅ Save for offline use
      await AsyncStorage.setItem("menuItems", JSON.stringify(menu));
    } catch (err: any) {
      setError("⚠️ لا يمكن الاتصال بالإنترنت. عرض الأطباق المخزنة.");
      const cached = await AsyncStorage.getItem("menuItems");
      if (cached) setMenuItems(JSON.parse(cached));
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (item: MenuItem) => {
    const cart = JSON.parse((await AsyncStorage.getItem("cart")) || "[]") as MenuItem[];
    const existingItem = cart.find((cartItem) => cartItem._id === item._id);
    if (existingItem) {
      existingItem.quantity = (existingItem.quantity || 1) + 1;
    } else {
      cart.push({ ...item, quantity: 1 });
    }
    await AsyncStorage.setItem("cart", JSON.stringify(cart));

    setPopupMessage("✔ تم إضافة الطبق إلى السلة");
    setTimeout(() => setPopupMessage(""), 2000);
  };

  const getImageUri = (img?: string) => {
    if (!img) return "";
    return img.startsWith("http") ? img : `${API_BASE_URL}/${img}`;
  };

  return (
    <View className="flex-1 bg-black px-4 py-8 mb-10">
      {isOffline && (
        <Text className="text-orange-400 text-center mb-2">
          📴 وضع عدم الاتصال — عرض الأطباق المخزنة
        </Text>
      )}

      <Text className="text-4xl font-bold text-yellow-400 text-center mb-8">
        أطباق مقترحة
      </Text>

      {error && <Text className="text-red-400 text-center mb-6">{error}</Text>}

      {loading ? (
        <ActivityIndicator size="large" color="#facc15" style={{ marginTop: 20 }} />
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 10 }}
        >
          {menuItems.map((item, i) => (
            <TouchableOpacity key={item._id} onPress={() => setSelectedFood(item)}>
              <Animated.View
                entering={FadeInUp.delay(i * 100).duration(600)}
                className="bg-black/40 border border-yellow-400 rounded-3xl m-2 flex items-center shadow-lg"
                style={{ width: 180, height: 220, padding: 10 }}
              >
                <Image
                  source={{ uri: getImageUri(item.image) }}
                  style={{
                    width: "100%",
                    height: 130,
                    borderRadius: 16,
                  }}
                  resizeMode="cover"
                />
                <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                  <Text className="text-white font-bold text-center text-sm" numberOfLines={2}>
                    {item.name}
                  </Text>
                </View>
              </Animated.View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      <Modal
        transparent
        visible={!!selectedFood}
        animationType="fade"
        onRequestClose={() => setSelectedFood(null)}
      >
        <View className="flex-1 bg-black/60 justify-center items-center">
          <View className="bg-black border border-yellow-400 rounded-3xl p-6 "
            style={{ width: "75%" }}>
            <Image
              source={{ uri: getImageUri(selectedFood?.image) }}
              className="w-full h-56 rounded-2xl mb-4"
              resizeMode="cover"
            />

            <Text className="text-2xl text-yellow-400 font-bold text-center mb-2">
              {selectedFood?.name}
            </Text>

            <Text className="text-gray-300 text-center mb-2">
              النوع: {selectedFood?.type}
            </Text>

            <Text className="text-lg text-white text-center mb-4">
              السعر: {selectedFood?.price} د.ج
            </Text>

            <TouchableOpacity
              onPress={() => selectedFood && addToCart(selectedFood)}
              className="mt-2 bg-yellow-400 rounded-xl py-2 px-6"
            >
              <Text className="text-black text-center font-bold text-lg">
                إضافة إلى السلة
              </Text>
            </TouchableOpacity>

            {popupMessage !== "" && (
              <Text className="text-green-400 text-center mt-2 text-sm">{popupMessage}</Text>
            )}

            <TouchableOpacity
              onPress={() => setSelectedFood(null)}
              className="mt-3 border border-yellow-400 rounded-xl py-2 px-6"
            >
              <Text className="text-yellow-400 text-center font-bold text-lg">
                إغلاق
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
