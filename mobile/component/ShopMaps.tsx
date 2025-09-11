import React from "react";
import { View, TouchableOpacity, Text, Linking, Platform, Dimensions } from "react-native";
import { WebView } from "react-native-webview";

export default function ShopMaps() {
  const latitude = 35.5388058;
  const longitude = 6.181976;
  const label = "طياب الأوراس";

  const openInMaps = () => {
    const url = Platform.select({
      ios: `http://maps.apple.com/?ll=${latitude},${longitude}&q=${label}`,
      android: `geo:${latitude},${longitude}?q=${label}`,
    });
    if (url) {
      Linking.openURL(url);
    }
  };

  const { width } = Dimensions.get("window");

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "black", paddingVertical: 20 }}>
      {/* Map inside WebView */}
      <View
        style={{
          width: width * 0.9,
          height: 300,
          borderRadius: 12,
          overflow: "hidden",
          borderWidth: 1,
          borderColor: "#374151",
        }}
      >
        <WebView
          scrollEnabled={true}
          bounces={false}
          originWhitelist={["*"]}
          javaScriptEnabled
          domStorageEnabled
          source={{
            html: `
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3246.6030547769547!2d6.181976!3d35.5388058!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12f411007a9990b5%3A0x9f18f536aacfc566!2z2LfZitin2Kgg2KfZhNij2YjYsdin2LM!5e0!3m2!1sen!2sdz!4v1756932614835!5m2!1sen!2sdz&z=18"
                width="100%"
                height="100%"
                style="border:0;"
                allowfullscreen=""
                loading="lazy"
                referrerpolicy="no-referrer-when-downgrade"
              ></iframe>
            `,
          }}
        />
      </View>

      {/* Button to open native Maps */}
      <TouchableOpacity
        onPress={openInMaps}
        activeOpacity={0.8}
        style={{
          marginTop: 16,
          paddingVertical: 12,
          paddingHorizontal: 24,
          borderRadius: 16,
          backgroundColor: "#f59e0b", // amber-500
        }}
      >
        <Text style={{ color: "white", fontWeight: "600", fontSize: 16 }}>
          فتح في خرائط Google 
        </Text>
      </TouchableOpacity>

    </View>
  );
}
