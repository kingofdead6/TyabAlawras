import React, { useState, useEffect, useRef } from "react";
import { View, Text, Dimensions, ActivityIndicator } from "react-native";
import Carousel from "react-native-reanimated-carousel";
import { Video } from "expo-av";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo";
import { API_BASE_URL } from "../../api";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  Easing,
  runOnJS,
} from "react-native-reanimated";

// Import a finger icon
import FingerIcon from "../../assets/tap.png";

interface VideoItem {
  _id: string;
  video: string;
}

export default function VideosMobile() {
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isOffline, setIsOffline] = useState<boolean>(false);
  const [showFinger, setShowFinger] = useState<boolean>(true);

  const carouselRef = useRef<any>(null);
  const { width, height } = Dimensions.get("window");
  const cardHeight = height * 0.7;

  // Reanimated shared value
  const fingerY = useSharedValue(0);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsOffline(!state.isConnected);
    });

    fetchVideos();

    return () => unsubscribe();
  }, []);

  const fetchVideos = async () => {
    setLoading(true);
    try {
      const response = await axios.get<VideoItem[]>(`${API_BASE_URL}/videos`);
      const data = response.data || [];
      setVideos(data);
      await AsyncStorage.setItem("videos", JSON.stringify(data));
    } catch (err) {
      console.error("Fetch videos error:", err);
      const cached = await AsyncStorage.getItem("videos");
      if (cached) setVideos(JSON.parse(cached));
    } finally {
      setLoading(false);
    }
  };

  // Run finger animation on mount
  useEffect(() => {
    if (showFinger) {
      fingerY.value = withRepeat(
        withTiming(-40, { duration: 600, easing: Easing.inOut(Easing.ease) }),
        4, // up and down twice
        true,
        () => runOnJS(setShowFinger)(false)
      );
    }
  }, []);

  // Animated style for the finger
  const fingerStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: fingerY.value }],
  }));

  return (
    <View style={{ flex: 1, backgroundColor: "black" }}>
      {isOffline && (
        <Text style={{ color: "#F97316", textAlign: "center", padding: 8 }}>
          📴 وضع عدم الاتصال — عرض الفيديوهات المخزنة
        </Text>
      )}

      <Text
        style={{
          color: "#FACC15",
          fontSize: 24,
          textAlign: "center",
          marginVertical: 10,
        }}
      >
        معرض الفيديوهات
      </Text>

      {loading ? (
        <ActivityIndicator size="large" color="#FACC15" style={{ flex: 1 }} />
      ) : videos.length > 0 ? (
        <View style={{ flex: 1 }}>
          <Carousel
            ref={carouselRef}
            vertical
            width={width}
            height={cardHeight + 40}
            data={videos}
            loop={false}
            scrollAnimationDuration={500}
            snapEnabled={true}
            renderItem={({ item }) => (
              <View
                style={{
                  width: width,
                  height: cardHeight,
                  justifyContent: "center",
                  alignItems: "center",
                  marginVertical: 10,
                }}
              >
                <Video
                  source={{
                    uri: item.video.startsWith("http")
                      ? item.video
                      : `${API_BASE_URL}/${item.video}`,
                  }}
                  style={{
                    width: width * 0.9,
                    height: cardHeight,
                    borderRadius: 16,
                  }}
                  resizeMode="cover"
                  isLooping
                  shouldPlay
                  isMuted={false}
                  useNativeControls={false}
                />
              </View>
            )}
          />

          {/* Finger scrolling hint */}
          {showFinger && (
            <Animated.Image
              source={FingerIcon}
              style={{
                width: 50,
                height: 50,
                position: "absolute",
                top: (height - 50) / 2, 
                left: (width - 50) / 2, 
                opacity: 0.8,
                ...fingerStyle,
              }}
            />
          )}
        </View>
      ) : (
        <Text style={{ color: "#9CA3AF", textAlign: "center", marginTop: 50 }}>
          لا توجد فيديوهات في المعرض
        </Text>
      )}
    </View>
  );
}
