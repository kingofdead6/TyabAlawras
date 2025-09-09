import React, { useState, useEffect } from "react";
import { View, Text, Image, TextInput, TouchableOpacity, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { FadeInUp } from "react-native-reanimated";
import { useNavigation } from "@react-navigation/native";
import { FontAwesome } from "@expo/vector-icons";

interface CartItem {
  _id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

export default function Cart() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [total, setTotal] = useState<number>(0);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchCart = async () => {
      const storedCart = JSON.parse((await AsyncStorage.getItem("cart")) || "[]") as CartItem[];
      setCartItems(storedCart);
      calculateTotal(storedCart);
    };
    fetchCart();
  }, []);

  const calculateTotal = (items: CartItem[]) => {
    const sum = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    setTotal(sum);
  };

  const updateQuantity = async (id: string, quantity: number) => {
    const updatedCart = cartItems.map((item) =>
      item._id === id ? { ...item, quantity: Math.max(1, quantity) } : item
    );
    setCartItems(updatedCart);
    await AsyncStorage.setItem("cart", JSON.stringify(updatedCart));
    calculateTotal(updatedCart);
  };

  const removeItem = async (id: string) => {
    const updatedCart = cartItems.filter((item) => item._id !== id);
    setCartItems(updatedCart);
    await AsyncStorage.setItem("cart", JSON.stringify(updatedCart));
    calculateTotal(updatedCart);
  };

  const handleCheckout = () => {
    navigation.navigate("Checkout" as never);
  };

  return (
    <SafeAreaView className="flex-1 bg-black">
      {/* Title */}
      <View className="px-4 py-4">
        <Text className="text-4xl font-bold text-yellow-400 text-center mb-4">
          🛒 سلة التسوق
        </Text>
      </View>

      {/* Scrollable Cart Items */}
      <ScrollView
        className="flex-1 px-4"
        contentContainerStyle={{ paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
        dir="rtl"
      >
        {cartItems.length === 0 ? (
          <Animated.Text
            entering={FadeInUp.duration(600)}
            className="text-gray-400 text-center text-lg"
          >
            سلتك فارغة
          </Animated.Text>
        ) : (
          cartItems.map((item, index) => (
            <Animated.View
              key={item._id}
              entering={FadeInUp.delay(index * 100).duration(600)}
              className="mb-4 rounded-3xl overflow-hidden shadow-lg"
            >
              <LinearGradient
                colors={["#facc158c", "#000"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                className="flex-row items-center justify-between p-4 rounded-3xl mb-4"
              >
                {/* Left: Image + Text */}
                <View className="flex-row items-center gap-4 flex-1">
                  <Image
                    source={{ uri: item.image }}
                    className="w-20 h-20 rounded-xl border-2 border-yellow-400 "
                    style={{ resizeMode: "cover" }}
                  />
                  <View className="flex-1">
                    <Text className="text-lg font-bold text-white">{item.name}</Text>
                    <Text className="text-yellow-400 font-semibold">{item.price} د.ج</Text>
                  </View>
                </View>

                {/* Right: Quantity & Remove */}
                <View className="flex-row items-center gap-3">
                  <TextInput
                    value={item.quantity.toString()}
                    onChangeText={(value) =>
                      updateQuantity(item._id, parseInt(value) || 1)
                    }
                    keyboardType="numeric"
                    className="w-16 p-2 bg-zinc-800 border border-yellow-400 text-white rounded-lg text-center"
                  />
                  <TouchableOpacity onPress={() => removeItem(item._id)}>
                    <FontAwesome name="trash" size={24} color="#f87171" />
                  </TouchableOpacity>
                </View>
              </LinearGradient>
            </Animated.View>
          ))
        )}
      </ScrollView>

      {/* Total & Checkout (Fixed at Bottom) */}
      {cartItems.length > 0 && (
        <View className="bg-zinc-900 p-6 rounded-2xl shadow-lg mx-4 mb-4">
          <Text className="text-yellow-400 font-bold text-2xl text-right">
            الإجمالي: {total} د.ج
          </Text>
          <TouchableOpacity
            onPress={handleCheckout}
            className="mt-4 py-3 bg-yellow-400 rounded-full"
          >
            <Text className="text-black font-semibold text-center">الذهاب إلى الدفع</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}
