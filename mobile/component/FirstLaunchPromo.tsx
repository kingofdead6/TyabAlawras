import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import DelieveryPic from "../assets/delievery.png";

export default function FirstLaunchPromo() {
  const [show, setShow] = useState<boolean>(true); 
  const { width, height } = Dimensions.get("window");

  const handleContinue = () => {
    setShow(false);

  };

  if (!show) return null;

  return (
    <View
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width,
        height,
        justifyContent: "center",
        alignItems: "center",
        zIndex: 999, 
      }}
    >
      {/* Background Image */}
      <Image
        source={DelieveryPic}
        style={{
          position: "absolute",
          width,
          height,
          resizeMode: "cover",
        }}
      />

      {/* Overlay for blur/dark effect */}
      <View
        style={{
          position: "absolute",
          width,
          height,
          backgroundColor: "rgba(0,0,0,0.6)",
        }}
      />

      {/* X Button */}
      <TouchableOpacity
        style={{ position: "absolute", top: 50, right: 30 }}
        onPress={handleContinue}
      >
        <Ionicons name="close-circle" size={40} color="#FACC15" />
      </TouchableOpacity>

      {/* Promo Content */}
      <View style={{ alignItems: "center", paddingHorizontal: 20 }}>
        <Text
          style={{
            color: "#FACC15",
            fontSize: 32,
            fontWeight: "bold",
            textAlign: "center",
            marginBottom: 15,
          }}
        >
          الآن لدينا توصيل منزلي!
        </Text>

        <Text
          style={{
            color: "#fff",
            fontSize: 18,
            textAlign: "center",
            marginBottom: 30,
          }}
        >
          ادخل الآن واطلب وجبتك لتصلك مباشرة إلى بابك
        </Text>

        <TouchableOpacity
          style={{
            backgroundColor: "#FACC15",
            paddingVertical: 15,
            paddingHorizontal: 40,
            borderRadius: 30,
          }}
          onPress={handleContinue}
        >
          <Text style={{ color: "black", fontSize: 18, fontWeight: "bold" }}>
            الدخول للتطبيق
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
