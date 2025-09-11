import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import axios from "axios";
import { API_BASE_URL } from "../api";
import Animated, { FadeInUp } from "react-native-reanimated";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo";

interface WorkingSchedule {
  _id: string;
  day: string;
  open: string | null;
  close: string | null;
  isClosed: boolean;
}

export default function OpeningTimes() {
  const [workingSchedule, setWorkingSchedule] = useState<WorkingSchedule[]>([]);
  const [error, setError] = useState<string>("");
  const [selectedDay, setSelectedDay] = useState<WorkingSchedule | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isOffline, setIsOffline] = useState<boolean>(false);

  const allDays = [
    "السبت",
    "الأحد",
    "الإثنين",
    "الثلاثاء",
    "الأربعاء",
    "الخميس",
    "الجمعة",
  ];

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsOffline(!state.isConnected);
    });

    fetchWorkingTimes();

    return () => unsubscribe();
  }, []);

  const fetchWorkingTimes = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.get<WorkingSchedule[]>(
        `${API_BASE_URL}/working-times`
      );
      const fullSchedule = allDays.map((day) => {
        const existing = response.data.find((item) => item.day === day);
        return (
          existing || {
            day,
            open: null,
            close: null,
            isClosed: false,
            _id: day,
          }
        );
      });
      setWorkingSchedule(fullSchedule);

      // ✅ Save for offline use
      await AsyncStorage.setItem("workingSchedule", JSON.stringify(fullSchedule));
    } catch (err: any) {
      setError("⚠️ لا يمكن الاتصال بالإنترنت. يتم عرض الأوقات المخزنة.");
      // ✅ Load cached schedule
      const cached = await AsyncStorage.getItem("workingSchedule");
      if (cached) {
        setWorkingSchedule(JSON.parse(cached));
      }
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (time: string | null): string => {
    if (!time) return "غير محدد";
    const [hours, minutes] = time.split(":");
    const hourNum = parseInt(hours, 10);
    const period = hourNum >= 12 ? "مساءً" : "صباحًا";
    const formattedHour =
      hourNum > 12 ? hourNum - 12 : hourNum === 0 ? 12 : hourNum;
    return `${formattedHour}:${minutes} ${period}`;
  };

  return (
    <View className="flex-1 bg-black px-4 py-8 mt-10 mb-6">
      {isOffline && (
        <Text className="text-orange-400 text-center mb-2">
          📴 وضع عدم الاتصال — عرض الأوقات المخزنة
        </Text>
      )}

      <Text className="text-4xl font-bold text-yellow-400 text-center mt-8">
        أوقات العمل
      </Text>

      {error && <Text className="text-red-400 text-center mb-6">{error}</Text>}

      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#facc15" />
          <Text className="text-gray-400 mt-3">جارٍ التحميل...</Text>
        </View>
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 10 }}
        >
          {workingSchedule.map((item, i) => (
            <TouchableOpacity
              key={item._id}
              onPress={() => setSelectedDay(item)}
            >
              <Animated.View
                entering={FadeInUp.delay(i * 100).duration(600)}
                className="bg-black/40 border border-yellow-400 rounded-3xl p-5 m-2 min-w-[100px] flex items-center justify-center shadow-lg"
              >
                {item.isClosed ? (
                  <Feather
                    name="x-circle"
                    size={28}
                    color="#f87171"
                    style={{ marginBottom: 8 }}
                  />
                ) : (
                  <Feather
                    name="calendar"
                    size={28}
                    color="#facc15"
                    style={{ marginBottom: 8 }}
                  />
                )}
                <Text className="text-base font-bold text-white">
                  {item.day}
                </Text>
              </Animated.View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {/* Popup Modal */}
      <Modal
        transparent
        visible={!!selectedDay}
        animationType="fade"
        onRequestClose={() => setSelectedDay(null)}
      >
        <View className="flex-1 bg-black/60 justify-center items-center">
          <View className="bg-black/90 border border-yellow-400/30 rounded-3xl p-6 w-4/5">
            <Text className="text-2xl text-yellow-400 font-bold text-center mb-4">
              {selectedDay?.day}
            </Text>

            {selectedDay?.isClosed ? (
              <Text className="text-red-400 text-lg text-center">مغلق</Text>
            ) : (
              <View className="flex-col items-center">
                <Text className="text-yellow-300 text-lg font-semibold">
                  {formatTime(selectedDay?.open || null)}
                </Text>
                <Text className="text-gray-500 font-bold">—</Text>
                <Text className="text-yellow-300 text-lg font-semibold">
                  {formatTime(selectedDay?.close || null)}
                </Text>
              </View>
            )}

            <TouchableOpacity
              onPress={() => setSelectedDay(null)}
              className="mt-6 bg-yellow-500 rounded-xl py-2 px-6"
            >
              <Text className="text-black text-center font-bold text-lg">
                إغلاق
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
