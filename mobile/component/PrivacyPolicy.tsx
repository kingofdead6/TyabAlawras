import React from "react";
import { View, Text, ScrollView } from "react-native";

export default function PrivacyPolicy() {
  return (
    <ScrollView className="flex-1 bg-black p-4">
      <Text className="text-3xl font-bold text-yellow-400 mb-4 text-center">
        سياسة الخصوصية
      </Text>

      <Text className="text-gray-200 text-base mb-4">
        نحن نحترم خصوصيتك ونلتزم بحماية المعلومات الشخصية التي تشاركها معنا عند استخدام تطبيقنا.
      </Text>

      <Text className="text-xl font-semibold text-white mb-2">
        جمع المعلومات
      </Text>
      <Text className="text-gray-200 mb-4">
        قد نجمع معلومات مثل اسمك، البريد الإلكتروني، وبيانات الاستخدام لتقديم تجربة أفضل وتحسين خدماتنا.
      </Text>

      <Text className="text-xl font-semibold text-white mb-2">
        استخدام المعلومات
      </Text>
      <Text className="text-gray-200 mb-4">
        تُستخدم المعلومات لتخصيص تجربتك داخل التطبيق، التواصل معك عند الحاجة، وتحليل الأداء لتحسين خدماتنا.
      </Text>

      <Text className="text-xl font-semibold text-white mb-2">
        مشاركة المعلومات
      </Text>
      <Text className="text-gray-200 mb-4">
        نحن لا نبيع أو نشارك معلوماتك الشخصية مع أطراف خارجية إلا إذا كان ذلك مطلوباً قانونياً.
      </Text>

      <Text className="text-xl font-semibold text-white mb-2">
        الأمان
      </Text>
      <Text className="text-gray-200 mb-4">
        نحن نتخذ تدابير معقولة لحماية معلوماتك الشخصية من الوصول غير المصرح به أو التعديل أو الكشف.
      </Text>

      <Text className="text-xl font-semibold text-white mb-2">
        التغييرات على السياسة
      </Text>
      <Text className="text-gray-200 mb-4">
        قد نقوم بتحديث سياسة الخصوصية من وقت لآخر. سيتم نشر أي تغييرات على هذه الصفحة.
      </Text>

      <Text className="text-gray-400 text-sm text-center mt-6">
        آخر تحديث: 2025-09-11
      </Text>
    </ScrollView>
  );
}
