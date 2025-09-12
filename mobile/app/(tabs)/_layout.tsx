import { Tabs, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BlurView } from "expo-blur";
import FirstLaunchPromo from "@/component/FirstLaunchPromo";
import Logo from "../../assets/Logo.png"

export default function TabsLayout() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-black" edges={["top", "left", "right"]}>
      <FirstLaunchPromo />
      {/* Top Bar */}
      <View className="flex-row justify-between items-center px-4 py-2 bg-black">
        <View className="flex-row items-center gap-2">
          <Image
            source={Logo}
            className="w-16 h-16 rounded-full"
          />
          <Text className="text-white text-xl font-bold">طياب الأوراس</Text>
        </View>

        <TouchableOpacity onPress={() => router.push("/(modals)/Cart")}>
          <Ionicons name="cart-outline" size={40} color="white" />
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <Tabs
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarShowLabel: false,
          tabBarStyle: {
            position: "absolute",
            bottom: 40,
            left: 70,
            height: 60,
            width: 300, 
            borderRadius: 100,
            borderWidth: 2,
            borderColor: "#FACC15",
            backgroundColor: "transparent",
            overflow: "hidden",
            justifyContent: "space-around",
            flexDirection: "row",
            marginLeft: 40,
          },
          tabBarBackground: () => (
            <BlurView
              intensity={120}
              tint="dark"
              style={{
                flex: 1,
                borderRadius: 100,
              }}
            />
          ),
          tabBarActiveTintColor: "#FACC15",
          tabBarInactiveTintColor: "#9CA3AF",
          tabBarIcon: ({ color, size }) => {
            let iconName: keyof typeof Ionicons.glyphMap = "home-outline";
            switch (route.name) {
              case "Announcements":
                iconName = "home-outline";
                break;
              case "Menu":
                iconName = "restaurant-outline";
                break;
              case "VedioMobile":
                iconName = "tv-outline";
                break;
              case "ShopLocationPage":
                iconName = "location-outline";
                break;
            }

            return (
              <View style={{ alignItems: "center", justifyContent: "center", flex: 1 }} className="-mb-4">
                <Ionicons name={iconName} size={size + 4} color={color} />
              </View>
            );
          },
        })}
      >
        <Tabs.Screen name="Announcements" />
        <Tabs.Screen name="Menu" />
        <Tabs.Screen name="VedioMobile" />
        <Tabs.Screen name="ShopLocationPage" />
      </Tabs>
    </SafeAreaView>
  );
}
