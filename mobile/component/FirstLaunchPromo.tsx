import React, { useState, useEffect } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  withRepeat,
} from "react-native-reanimated";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL } from "../api";

interface MenuItem {
  _id: string;
  name: string;
  type: string;
  kind: string;
  price: number;
  image: string;
  quantity?: number;
}

export default function FirstLaunchPromo() {
  const [show, setShow] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [kindOptions, setKindOptions] = useState<string[]>([]);
  const router = useRouter();

  // Animation for motorcycle (floating up and down)
  const translateY = useSharedValue(0);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  // Fetch menu items
  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await axios.get<MenuItem[]>(`${API_BASE_URL}/menu`);
        const data = response.data || [];
        const kinds = Array.from(new Set(data.map((item) => item.kind))).filter(
          (kind) => kind
        );
        setKindOptions(kinds);
        await AsyncStorage.setItem("menu", JSON.stringify(data));
      } catch (err) {
        console.error("Fetch menu items error:", err);
        const cachedMenu = await AsyncStorage.getItem("menu");
        if (cachedMenu) {
          const data = JSON.parse(cachedMenu) as MenuItem[];
          const kinds = Array.from(
            new Set(data.map((item) => item.kind))
          ).filter((kind) => kind);
          setKindOptions(kinds);
        }
      }
    };

    fetchMenuItems();
  }, []);

  // Trigger animation when on delivery page
  useEffect(() => {
    if (currentPage === 0) {
      translateY.value = withRepeat(
        withTiming(20, { duration: 1000, easing: Easing.ease }),
        -1,
        true
      );
    } else {
      translateY.value = 0;
    }
  }, [currentPage]);

  const handleContinue = () => {
    if (currentPage === 0) {
      setCurrentPage(1);
    } else {
      setShow(false);
    }
  };

  const handleKindSelection = (kind: string) => {
    setShow(false);
    router.push({
      pathname: "/Menu",
      params: { selectedKind: kind },
    });
  };

  if (!show) return null;

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: currentPage === 0 ? "#000" : "transparent", // black bg for first page
        zIndex: 999,
      }}
    >
      {/* Background Image only on second page */}
      {currentPage === 1 && (
        <Image
          source={{
            uri: "https://res.cloudinary.com/dtwa3lxdk/image/upload/v1757978907/20250915_164946_wvkd7g.jpg",
          }}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: "100%",
            height: "100%",
            resizeMode: "cover",
          }}
        />
      )}

      {/* Overlay */}
      <View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0,0,0,0.6)",
        }}
      />

      {/* X Button */}
      <TouchableOpacity
        style={{ position: "absolute", top: 50, right: 30 }}
        onPress={() => setShow(false)}
      >
        <Ionicons name="close-circle" size={40} color="#FACC15" />
      </TouchableOpacity>

      {/* Page Content */}
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          paddingHorizontal: 20,
        }}
      >
        {currentPage === 0 ? (
          <>
            {/* Motorcycle Image */}
            <Animated.Image
              source={{
                uri: "https://res.cloudinary.com/dtwa3lxdk/image/upload/v1758150287/freepik__background__45413_tk9n4a.png",
              }}
              style={[
                {
                  width: 250,
                  height: 250,
                  marginBottom: 20,
                  resizeMode: "contain",
                },
                animatedStyle,
              ]}
            />

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
                التالي
              </Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <Text
              style={{
                color: "#FACC15",
                fontSize: 32,
                fontWeight: "bold",
                textAlign: "center",
                marginBottom: 15,
              }}
            >
              اكتشف أنواع المأكولات لدينا
            </Text>
            <Text
              style={{
                color: "#fff",
                fontSize: 18,
                textAlign: "center",
                marginBottom: 30,
              }}
            >
              اختر نوع الطعام المفضل لديك واستمتع بقائمتنا
            </Text>
            {kindOptions.length > 0 ? (
              <View
                style={{
                  flexDirection: "row",
                  flexWrap: "wrap",
                  justifyContent: "center",
                }}
              >
                {kindOptions.map((kind, index) => (
                  <TouchableOpacity
                    key={index}
                    style={{
                      backgroundColor: "#FACC15",
                      paddingVertical: 12,
                      paddingHorizontal: 20,
                      borderRadius: 20,
                      margin: 8,
                    }}
                    onPress={() => handleKindSelection(kind)}
                  >
                    <Text
                      style={{
                        color: "black",
                        fontSize: 16,
                        fontWeight: "bold",
                      }}
                    >
                      {kind}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            ) : (
              <Text
                style={{
                  color: "#fff",
                  fontSize: 18,
                  textAlign: "center",
                  marginBottom: 30,
                }}
              >
                لا توجد أنواع مأكولات متاحة حاليًا
              </Text>
            )}
            <TouchableOpacity
              style={{
                
                borderColor: "#FACC15",
                borderWidth: 2,
                paddingVertical: 12,
                paddingHorizontal: 40,
                borderRadius: 30,
                marginTop: 20,

              }}
              onPress={() => setShow(false)}
            >
              <Text
                style={{ color: "#FACC15" , fontSize: 18, fontWeight: "bold" }}
              >
                تخطي
              </Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
}
