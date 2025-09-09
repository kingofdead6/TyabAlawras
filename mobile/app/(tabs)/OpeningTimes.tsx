import React, { useState, useEffect } from "react";
import { View, Text, ScrollView } from "react-native";
import { Feather } from "@expo/vector-icons";
import axios from "axios";
import { API_BASE_URL } from "../../api";
import Animated, { FadeInUp } from "react-native-reanimated";

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
    const fetchWorkingTimes = async () => {
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
      } catch (err: any) {
        setError(err.response?.data?.message || "⚠️ خطأ في جلب أوقات العمل");
      }
    };
    fetchWorkingTimes();
  }, []);

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
    <ScrollView
      className="flex-1 bg-black px-4 py-8"
      contentContainerStyle={{ paddingBottom: 40 }}
      showsVerticalScrollIndicator={false}
    >
      <Text className="text-4xl font-bold text-yellow-400 text-center mb-8">
        أوقات العمل
      </Text>

      {error && (
        <Text className="text-red-400 text-center mb-6">{error}</Text>
      )}

      <View className="flex-row flex-wrap justify-center">
        {workingSchedule.map((item, i) => (
          <Animated.View
            key={item._id}
            entering={FadeInUp.delay(i * 100).duration(600)}
            className="bg-black/40 shadow-yellow-400  backdrop-blur-md border border-gray-700 rounded-3xl p-5 m-2 min-w-[150px] flex items-center shadow-xl"
          >
            {item.isClosed ? (
              <Feather
                name="x-circle"
                size={32}
                color="#f87171"
                style={{ marginBottom: 12 }}
              />
            ) : (
              <Feather
                name="calendar"
                size={32}
                color="#facc15"
                style={{ marginBottom: 12 }}
              />
            )}

            <Text className="text-lg font-bold text-white mb-1">{item.day}</Text>

            {item.isClosed ? (
              <Text className="mt-2 text-red-400 font-semibold">مغلق</Text>
            ) : (
              <View className="flex-col items-center mt-2">
                <Text className="text-yellow-300 font-semibold">
                  {formatTime(item.open)}
                </Text>
                <Text className="text-gray-500 font-bold">—</Text>
                <Text className="text-yellow-300 font-semibold">
                  {formatTime(item.close)}
                </Text>
              </View>
            )}
          </Animated.View>
        ))}
      </View>
    </ScrollView>
  );
}
