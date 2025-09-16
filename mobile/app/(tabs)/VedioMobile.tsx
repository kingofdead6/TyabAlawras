import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  Dimensions,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
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
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useFocusEffect } from "@react-navigation/native";

interface VideoItem {
  _id: string;
  video: string;
  createdAt?: string;
}

export default function VideosMobile() {
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isOffline, setIsOffline] = useState<boolean>(false);
  const [showFinger, setShowFinger] = useState<boolean>(true);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [pausedMap, setPausedMap] = useState<Record<string, boolean>>({});

  const carouselRef = useRef<any>(null);
  const videoRefs = useRef<(Video | null)[]>([]);
  const { width, height } = Dimensions.get("window");
  const cardHeight = height * 0.9;

  // animation
  const fingerY = useSharedValue(0);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsOffline(!state.isConnected);
    });

    fetchVideos();

    return () => {
      setPausedMap({});
      videoRefs.current.forEach((ref) => {
        if (ref) {
          ref.stopAsync?.();
        }
      });
      unsubscribe();
    };
  }, []);

  const fetchVideos = async () => {
    setLoading(true);
    try {
      const response = await axios.get<VideoItem[]>(`${API_BASE_URL}/videos`);
      const data = response.data || [];
      const sortedData = data.sort((a, b) => {
        if (a.createdAt && b.createdAt) {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        return b._id.localeCompare(a._id);
      });
      setVideos(sortedData);
      await AsyncStorage.setItem("videos", JSON.stringify(sortedData));
      setPausedMap(
        sortedData.reduce(
          (acc, item, idx) => ({ ...acc, [item._id]: idx !== 0 }),
          {}
        )
      );
    } catch (err) {
      console.error("Fetch videos error:", err);
      const cached = await AsyncStorage.getItem("videos");
      if (cached) {
        const cachedData = JSON.parse(cached);
        const sortedCachedData = cachedData.sort((a: VideoItem, b: VideoItem) => {
          if (a.createdAt && b.createdAt) {
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          }
          return b._id.localeCompare(a._id);
        });
        setVideos(sortedCachedData);
        setPausedMap(
          sortedCachedData.reduce(
            (acc: VideoItem, idx: number) => ({
              ...acc,
              [cachedData[idx]._id]: idx !== 0,
            }),
            {}
          )
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // update play state on active index change
  useEffect(() => {
    if (videos.length === 0) return;
    setPausedMap(
      videos.reduce(
        (acc, item, idx) => ({ ...acc, [item._id]: idx !== activeIndex }),
        {}
      )
    );
  }, [activeIndex]);

  const togglePlayPause = (videoId: string) => {
    setPausedMap((prev) => ({ ...prev, [videoId]: !prev[videoId] }));
  };

  // Finger animation
  useEffect(() => {
    if (showFinger) {
      fingerY.value = withRepeat(
        withTiming(-20, { duration: 600, easing: Easing.inOut(Easing.ease) }),
        3,
        true,
        () => {
          fingerY.value = 0;
          runOnJS(setShowFinger)(false);
        }
      );
    }
  }, []);

  const fingerStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: fingerY.value }],
  }));

  // Pause all videos when leaving the page
  useFocusEffect(
    React.useCallback(() => {
      return () => {
        videoRefs.current.forEach((ref) => {
          if (ref) {
            ref.pauseAsync?.();
          }
        });
      };
    }, [])
  );

  return (
    <View style={styles.container} className="-mt-12">
      {isOffline && (
        <Text style={styles.offlineText}>
          📴 وضع عدم الاتصال — عرض الفيديوهات المخزنة
        </Text>
      )}


      {loading ? (
        <ActivityIndicator size="large" color="#FACC15" style={styles.loader} />
      ) : videos.length > 0 ? (
        <View style={styles.carouselContainer}>
          <Carousel
            ref={carouselRef}
            vertical
            width={width}
            height={cardHeight}
            data={videos}
            loop={false}
            scrollAnimationDuration={500}
            snapEnabled={true}
            onSnapToItem={(index) => setActiveIndex(index)}
            renderItem={({ item, index }) => (
              <View style={styles.videoContainer}>
                <Video
                  ref={(ref) => (videoRefs.current[index] = ref)}
                  source={{
                    uri: item.video.startsWith("http")
                      ? item.video
                      : `${API_BASE_URL}/${item.video}`,
                  }}
                  style={styles.video}
                  resizeMode="cover"
                  isLooping
                  shouldPlay={!pausedMap[item._id]}
                  isMuted={false}
                  useNativeControls
                />
                
              </View>
            )}
          />
        </View>
      ) : (
        <Text style={styles.emptyText}>لا توجد فيديوهات في المعرض</Text>
      )}

      {showFinger && (
        <View style={styles.fingerWrapper}>
          <Animated.View style={fingerStyle}>
            <MaterialCommunityIcons name="gesture-swipe-up" size={50} color="white" />
          </Animated.View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "black" },
  offlineText: {
    color: "#F97316",
    textAlign: "center",
    padding: 8,
    fontSize: 16,
  },
  headerText: {
    color: "#FACC15",
    fontSize: 24,
    textAlign: "center",
    marginVertical: 10,
  },
  loader: { flex: 1 },
  carouselContainer: { flex: 1 },
  videoContainer: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height * 0.9,
    justifyContent: "center",
    alignItems: "center",
  },
  video: {
    width: Dimensions.get("window").width * 0.9, // smaller video
    height: Dimensions.get("window").height * 0.7, // reduced height
    borderRadius: 16,
    overflow: "hidden",
  },
  playPauseButton: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -20 }, { translateY: -20 }],
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 50,
    padding: 10,
  },
  fingerWrapper: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    pointerEvents: "none",
  },
  emptyText: {
    color: "#9CA3AF",
    textAlign: "center",
    marginTop: 50,
    fontSize: 16,
  },
});
