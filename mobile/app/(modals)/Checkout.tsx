import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, Modal } from "react-native";
import { Picker } from '@react-native-picker/picker';
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { API_BASE_URL } from "../../api";
import Animated, { FadeInUp } from "react-native-reanimated";
import Toast from "react-native-toast-message";
import { useRouter } from "expo-router";

interface FormData {
  name: string;
  phone: string;
  area: string;
  address: string;
  notes: string;
}

interface DeliveryArea {
  _id: string;
  name: string;
  price: number;
}

interface MenuItem {
  _id: string;
  name: string;
  price: number;
  quantity: number;
}

export default function Checkout() {
  const [form, setForm] = useState<FormData>({ name: "", phone: "", area: "", address: "", notes: "" });
  const [areas, setAreas] = useState<DeliveryArea[]>([]);
  const [deliveryFee, setDeliveryFee] = useState<number>(0);
  const [cartItems, setCartItems] = useState<MenuItem[]>([]);
  const [subtotal, setSubtotal] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [showPopup, setShowPopup] = useState<boolean>(false);

const router = useRouter();
  useEffect(() => {
    fetchAreas();
    const fetchCart = async () => {
      const storedCart = JSON.parse((await AsyncStorage.getItem("cart")) || "[]") as MenuItem[];
      setCartItems(storedCart);
      const sum = storedCart.reduce((acc, item) => acc + item.price * item.quantity, 0);
      setSubtotal(sum);
      setTotal(sum + deliveryFee);
    };
    fetchCart();
  }, [deliveryFee]);

  const fetchAreas = async () => {
    try {
      const response = await axios.get<DeliveryArea[]>(`${API_BASE_URL}/delivery-areas`);
      setAreas(response.data || []);
    } catch (err: any) {
      Toast.show({ type: "error", text1: "خطأ", text2: "خطأ في جلب المناطق" });
    }
  };

  const handleChange = (name: keyof FormData, value: string) => {
    setForm({ ...form, [name]: value });
    if (name === "area") {
      const selectedArea = areas.find((a) => a._id === value);
      const fee = selectedArea ? selectedArea.price : 0;
      setDeliveryFee(fee);
      setTotal(subtotal + fee);
    }
  };

const handleSubmit = async () => {
  if (!form.name || !form.phone || !form.area || !form.address) {
    Toast.show({ type: "error", text1: "خطأ", text2: "يرجى ملء جميع الحقول" });
    return;
  }
  setLoading(true);
  try {
    const selectedArea = areas.find((a) => a._id === form.area);
    const orderData = {
      items: cartItems.map((item) => ({
        menuItem: item._id,
        quantity: item.quantity,
      })),
      totalAmount: total,
      deliveryFee,
      deliveryArea: selectedArea ? selectedArea.name : "غير محدد",
      customerName: form.name,
      customerPhone: form.phone,
      deliveryAddress: form.address,
      notes: form.notes || "",
      paymentMethod: "cash_on_delivery",
      status: "pending",
    };

    const response = await axios.post(`${API_BASE_URL}/orders`, orderData);

    console.log("Order response:", response.data);

    await AsyncStorage.removeItem("cart");


    setShowPopup(true);
    setTimeout(() => {
      setShowPopup(false);
      router.push("/(tabs)/Menu"); 
    }, 3000);

  } catch (err: any) {
    console.log("Order error:", err.response?.data || err.message);
    Toast.show({ type: "error", text1: "خطأ", text2: "خطأ في التقديم" });
  } finally {
    setLoading(false);
  }
};


  return (
    <SafeAreaView className="flex-1 bg-black px-4 py-6">
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        <Animated.Text
          entering={FadeInUp.duration(600)}
          className="text-5xl font-bold text-yellow-400 text-center mb-10"
        >
          الدفع والتوصيل
        </Animated.Text>

        <View className="bg-black/80 border-4 border-yellow-400 p-8 rounded-3xl space-y-10 shadow-lg">
          {/* Name */}
          <TextInput
            placeholder="الاسم الكامل"
            placeholderTextColor="rgba(255,255,255,0.5)"
            value={form.name}
            onChangeText={(value) => handleChange("name", value)}
            className="p-5 bg-black/50 border border-yellow-400 text-white rounded-xl text-lg mb-8"
          />

          {/* Phone */}
          <TextInput
            placeholder="رقم الهاتف"
            placeholderTextColor="rgba(255,255,255,0.5)"
            value={form.phone}
            onChangeText={(value) => handleChange("phone", value)}
            className="p-5 bg-black/50 border border-yellow-400 text-white rounded-xl text-lg mb-8"
            keyboardType="phone-pad"
          />

          {/* Area */}
          <View className="bg-black/50 border border-yellow-400 rounded-xl overflow-hidden mb-8">
            <Picker
              selectedValue={form.area}
              onValueChange={(value) => handleChange("area", value)}
              dropdownIconColor="white"
              style={{ color: "white", height: 60 }}
            >
              <Picker.Item label="اختر المنطقة" value="" />
              {areas.map((area) => (
                <Picker.Item key={area._id} label={`${area.name} - ${area.price} د.ج`} value={area._id} />
              ))}
            </Picker>
          </View>

          {/* Address */}
          <TextInput
            placeholder="العنوان التفصيلي"
            placeholderTextColor="rgba(255,255,255,0.5)"
            value={form.address}
            onChangeText={(value) => handleChange("address", value)}
            className="p-5 bg-black/50 border border-yellow-400 text-white rounded-xl text-lg mb-8"
          />

          {/* Notes */}
          <TextInput
            placeholder="ملاحظات إضافية"
            placeholderTextColor="rgba(255,255,255,0.5)"
            value={form.notes}
            onChangeText={(value) => handleChange("notes", value)}
            multiline
            className="p-5 bg-black/50 border border-yellow-400 text-white rounded-xl text-lg mb-8"
          />

          {/* Totals */}
          <View className="bg-black/60 p-5 rounded-xl space-y-2 mb-8">
            <Text className="text-white text-lg font-semibold">
              المجموع: <Text className="text-white">{subtotal} د.ج</Text>
            </Text>
            <Text className="text-white text-lg font-semibold">
              رسوم التوصيل: <Text className="text-white">{deliveryFee} د.ج</Text>
            </Text>
            <Text className="text-2xl font-bold text-yellow-400">
              الإجمالي: {total} د.ج
            </Text>
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            onPress={handleSubmit}
            disabled={loading}
            className={`p-5 rounded-2xl ${loading ? "bg-gray-500" : "bg-yellow-400"}`}
          >
            <Text className={`text-center font-bold text-lg ${loading ? "text-gray-300" : "text-black"}`}>
              {loading ? "جارٍ..." : "تقديم الطلب"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Popup Confirmation */}
      <Modal transparent visible={showPopup} animationType="fade">
        <View className="flex-1 justify-center items-center bg-black/70 px-4">
          <View className="bg-black/80 border-4 border-yellow-400 p-6 rounded-3xl w-full">
            <Animated.Text
              entering={FadeInUp.duration(600)}
              className="text-3xl font-bold text-yellow-400 mb-4 text-center"
            >
              تم تقديم الطلب!
            </Animated.Text>
            <Text className="text-white text-center text-lg">
              انتظر قليلاً وسيتصل بك أحد فريقنا للتأكيد.
            </Text>
          </View>
        </View>
      </Modal>

      <Toast />
    </SafeAreaView>
  );
}
