import React, { useState, useEffect } from "react";
import { View, Text, Image, FlatList, TouchableOpacity, TextInput } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { API_BASE_URL } from "../../api";
import Animated, { FadeInUp } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import NetInfo from "@react-native-community/netinfo";

interface MenuItem {
  _id: string;
  name: string;
  type: string;
  price: number;
  image: string;
  quantity?: number;
}

export default function Menu() {
  const insets = useSafeAreaInsets();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [visible, setVisible] = useState<number>(12);
  const [selectedType, setSelectedType] = useState<string>("الكل");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [isOffline, setIsOffline] = useState<boolean>(false);

  // store "added to cart" status for each item
  const [addedMap, setAddedMap] = useState<Record<string, boolean>>({});

  const types = ["الكل", ...Array.from(new Set(menuItems.map((item) => item.type)))];
  const filteredMenuItems = menuItems.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === "الكل" || item.type === selectedType;
    return matchesSearch && matchesType;
  });

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
      const data = response.data || [];
      setMenuItems(data);
      await AsyncStorage.setItem("menu", JSON.stringify(data));
    } catch (err: any) {
      console.error("Fetch menu items error:", err);
      setError("⚠️ لا يمكن الاتصال بالإنترنت. يتم عرض القائمة المحفوظة.");

      const cachedMenu = await AsyncStorage.getItem("menu");
      if (cachedMenu) {
        setMenuItems(JSON.parse(cachedMenu));
      }
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

    // show "added" message for this item
    setAddedMap((prev) => ({ ...prev, [item._id]: true }));
    setTimeout(() => {
      setAddedMap((prev) => ({ ...prev, [item._id]: false }));
    }, 1500);
  };

  const renderItem = ({ item, index }: { item: MenuItem; index: number }) => (
    <Animated.View
      entering={FadeInUp.delay(index * 100).duration(600)}
      className="bg-black/70 rounded-3xl shadow-lg border-yellow-400 border-2 p-4 m-2 flex items-center"
    >
      <Image
        source={{ uri: item.image }}
        className="w-full h-56 rounded-2xl mb-2"
        style={{ resizeMode: "cover" }}
      />

      {/* Added to cart message */}
      {addedMap[item._id] && (
        <View className="bg-green-500 px-3 py-1 rounded-full mb-2">
          <Text className="text-black font-semibold text-center">أضيف إلى السلة</Text>
        </View>
      )}

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

      {isOffline && (
        <Text className="text-orange-400 text-center mb-3">
          📴 وضع عدم الاتصال — يتم عرض البيانات المخزنة
        </Text>
      )}

      {error && <Text className="text-red-400 text-center mb-4">{error}</Text>}

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
