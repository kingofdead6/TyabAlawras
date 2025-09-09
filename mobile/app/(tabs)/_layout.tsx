import { Tabs, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { View, Text, Image, TouchableOpacity, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TabsLayout() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-black" edges={["top", "left", "right"]}>
      {/* Custom Top Bar */}
      <View className="flex-row justify-between items-center px-4 py-2 bg-black">
        <View className="flex-row items-center gap-2">
          <Image
            source={{
              uri: "https://res.cloudinary.com/dtwa3lxdk/image/upload/v1756897359/465660711_1763361547537323_2674934284076407223_n_prlt48.jpg",
            }}
            className="w-16 h-16 rounded-full"
          />
          <Text className="text-white text-xl font-bold">طياب الأوراس</Text>
        </View>

        <TouchableOpacity onPress={() => router.push("/(modals)/Cart")}>
          <Ionicons name="cart-outline" size={40} color="white" />
        </TouchableOpacity>
      </View>

      {/* Bottom Tabs */}
      <Tabs
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarShowLabel: false,
          tabBarStyle: {
            backgroundColor: "#000",
            borderTopWidth: 0,
            height: Platform.OS === "ios" ? 50 : 47,
            paddingBottom: Platform.OS === "ios" ? 20 : 8,
            flexDirection: "row",
            justifyContent: "space-around",
          },
          tabBarActiveTintColor: "#FACC15",
          tabBarInactiveTintColor: "#9CA3AF",
          tabBarIcon: ({ color, size }) => {
            let iconName: keyof typeof Ionicons.glyphMap = "home-outline";
            let label = "";

            switch (route.name) {
              case "Announcements":
                iconName = "megaphone-outline";
                label = "الإعلانات";
                break;
              case "Menu":
                iconName = "restaurant-outline";
                label = "القائمة";
                break;
              case "OpeningTimes":
                iconName = "time-outline";
                label = "أوقات العمل";
                break;
              case "ShopLocationPage":
                iconName = "location-outline";
                label = "الموقع";
                break;
            }
            

            return (
              <View  style={{ alignItems: "center", width: 110 }}> 
                {/* wider width so label fits in one line */}
                <Ionicons className="border-1 border-white rounded-full" name={iconName} size={size + 4} color={color} />
                
              </View>
            );
          },
        })}
      >
        <Tabs.Screen name="Announcements" />
        <Tabs.Screen name="Menu" />
        <Tabs.Screen name="OpeningTimes" />
        <Tabs.Screen name="ShopLocationPage" />
      </Tabs>
    </SafeAreaView>
  );
}
