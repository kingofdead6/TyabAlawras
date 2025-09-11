import React from "react";
import { View, Text, ScrollView } from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";

const steps = [
  {
    title: "البداية",
    description: "انطلق مطعم طياب الأوراس بحلم تقديم نكهة أصيلة من الأوراس.",
    icon: "🍽️",
  },
  {
    title: "النمو",
    description: "وسعنا قائمتنا لنقدم تشكيلة واسعة من الأطباق التي ترضي جميع الأذواق.",
    icon: "🔥",
  },
  {
    title: "التجربة",
    description: "ركزنا على جعل تجربة الزبون ممتعة، بدءاً من جودة الطعام وحتى الخدمة.",
    icon: "✨",
  },
  {
    title: "المستقبل",
    description: "نسعى لنكون الوجهة الأولى لعشاق الطعام الأصيل في المنطقة.",
    icon: "🚀",
  },
];

export default function AboutUsMobile() {
  return (
    <ScrollView
      className="flex-1 bg-black px-4 py-8"
      showsVerticalScrollIndicator={false}
    >
      {/* Intro */}
      <Animated.View entering={FadeInUp.duration(800)} className="mb-8 items-center">
        <Text className="text-3xl font-extrabold text-yellow-400 mb-4 text-center">
          من نحن
        </Text>
        <Text className="text-white text-base text-center leading-relaxed">
          في مطعم طياب الأوراس، نسعى إلى تقديم تجربة فريدة تجمع بين الأصالة والنكهة العصرية. من قلب الأوراس، نحضر لكم أشهى الأطباق التقليدية المطهوة بعناية، مع لمسة إبداعية تجعل كل وجبة رحلة لا تُنسى. هدفنا هو أن نصبح الوجهة الأولى لعشاق الطعام الأصيل، حيث يلتقي التراث مع الجودة والضيافة.
        </Text>
      </Animated.View>

      {/* Timeline / Steps */}
      <View className="space-y-4">
        {steps.map((step, index) => (
          <Animated.View
            key={index}
            entering={FadeInUp.delay(index * 100).duration(600)}
            className="bg-gray-800/70 p-4 rounded-xl border border-yellow-500/30 shadow-md"
          >
            <View className="flex-row items-center mb-2">
              <Text className="text-2xl mr-3">{step.icon}</Text>
              <Text className="text-white font-semibold text-lg">{step.title}</Text>
            </View>
            <Text className="text-gray-300 text-sm">{step.description}</Text>
          </Animated.View>
        ))}
      </View>
    </ScrollView>
  );
}
