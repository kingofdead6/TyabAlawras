import React, { useState, useEffect } from "react";
import { View, Text, Image, FlatList, TouchableOpacity, TextInput } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { API_BASE_URL } from "../../api";
import Animated, { FadeInUp } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface MenuItem {
  _id: string;
  name: string;
  type: string;
  price: number;
  image: string;
  quantity?: number;
}

export default function Menu() {
    const insets = useSafeAreaInsets(); // 👈 get safe area values
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [visible, setVisible] = useState<number>(12);
  const [selectedType, setSelectedType] = useState<string>("الكل");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");

  const types = ["الكل", ...Array.from(new Set(menuItems.map((item) => item.type)))];
  const filteredMenuItems = menuItems.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === "الكل" || item.type === selectedType;
    return matchesSearch && matchesType;
  });

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.get<MenuItem[]>(`${API_BASE_URL}/menu`);
      setMenuItems(response.data || []);
    } catch (err: any) {
      console.error("Fetch menu items error:", err);
      setError(err.response?.data?.message || "⚠️ خطأ في جلب عناصر القائمة");
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
    setMessage(`${item.name} أضيف إلى السلة`);
    setTimeout(() => setMessage(""), 2000);
  };

  const renderItem = ({ item, index }: { item: MenuItem; index: number }) => (
    <Animated.View
      entering={FadeInUp.delay(index * 100).duration(600)}
      className="bg-black/70 rounded-3xl shadow-lg border-yellow-400 border-2 p-4 m-2 flex items-center"
    >
      <Image
        source={{ uri: item.image }}
        className="w-full h-56 rounded-2xl mb-3"
        style={{ resizeMode: "cover" }}
      />
      <Text className="text-lg font-bold text-white text-center">{item.name}</Text>
      <Text className="text-yellow-400 mt-1 font-semibold">{item.price} د.ج</Text>
      <TouchableOpacity
        onPress={() => addToCart(item)}
        className="mt-3 px-4 py-2 bg-yellow-400 rounded-full w-full"
      >
        <Text className="text-black font-semibold text-center">إضافة إلى السلة</Text>
      </TouchableOpacity>
    </Animated.View>
  );

  const renderHeader = () => (
    <View className="px-4 py-6 bg-black">
      <Text className="text-4xl font-bold text-yellow-400 text-center mb-6">القائمة</Text>

      {error ? <Text className="text-red-400 text-center mb-4">{error}</Text> : null}
      {message ? <Text className="text-green-400 text-center mb-4 font-semibold">{message}</Text> : null}

      <TextInput
        placeholder="ابحث عن عنصر..."
        placeholderTextColor="#aaa"
        value={searchTerm}
        onChangeText={setSearchTerm}
        className="bg-zinc-800 text-white p-3 rounded-lg mb-4 border border-yellow-400/40"
      />

      <FlatList
        horizontal
        data={types}
        keyExtractor={(type, i) => i.toString()}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item: type }) => (
          <TouchableOpacity
            onPress={() => {
              setSelectedType(type);
              setVisible(12);
            }}
            className={`px-4 py-2 rounded-full border m-1 ${
              selectedType === type ? "bg-yellow-400" : "border-yellow-400"
            }`}
          >
            <Text
              className={`font-semibold ${
                selectedType === type ? "text-black" : "text-yellow-300"
              }`}
            >
              {type}
            </Text>
          </TouchableOpacity>
        )}
        className="-mb-4"
      />
    </View>
  );

   return (
    <View className="flex-1 bg-black">
      {loading ? (
        <Text className="text-gray-400 text-center mt-10">جارٍ التحميل...</Text>
      ) : filteredMenuItems.length > 0 ? (
        <FlatList
          data={filteredMenuItems.slice(0, visible)}
          renderItem={renderItem}
          keyExtractor={(item) => item._id}
          numColumns={1}
          ListHeaderComponent={renderHeader}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: insets.bottom + 90, 
            // 👆 leave space: safe area + tab bar height (~80–90)
          }}
          ListFooterComponent={
            visible < filteredMenuItems.length ? (
              <TouchableOpacity
                onPress={() => setVisible((prev) => prev + 9)}
                className="mt-4 px-6 py-3 bg-yellow-400 rounded-full mx-auto mb-6"
              >
                <Text className="text-black font-semibold text-center">عرض المزيد</Text>
              </TouchableOpacity>
            ) : null
          }
        />
      ) : (
        <View className="flex-1 justify-center items-center">
          <Text className="text-gray-400 text-center">لا توجد عناصر في القائمة</Text>
        </View>
      )}
    </View>
  );
}
