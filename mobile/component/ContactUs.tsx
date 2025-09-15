import React, { useState } from "react";
import {
  View,
  Text,
  Linking,
  TouchableOpacity,
  ScrollView,
  Modal,
  Pressable,
} from "react-native";
import { FontAwesome, MaterialIcons, Entypo } from "@expo/vector-icons";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import AntDesign from '@expo/vector-icons/AntDesign';

export default function ContactUs() {
  const [modalVisible, setModalVisible] = useState(false);

  const openLink = (url: string) => {
    Linking.openURL(url).catch((err) =>
      console.error("Failed to open URL:", err)
    );
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#000" }}
      contentContainerStyle={{ padding: 20, alignItems: "center" }}
      showsVerticalScrollIndicator={false}
    >
      <View style={{ marginBottom: 30, alignItems: "center" }}>
        {/* Title */}
        <Text
          style={{
            color: "#FACC15",
            fontSize: 30,
            fontWeight: "bold",
            marginBottom: 10,
            textAlign: "center",
          }}
        >
          تواصل معنا
        </Text>

        {/* Email */}
        <TouchableOpacity
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 10,
          }}
          onPress={() => openLink("mailto:info@tyabalawras.com")}
        >
          <Entypo name="mail" size={20} color="#FACC15" />
          <Text style={{ color: "#FFF", marginLeft: 10 }}>
            info@tyabalawras.com
          </Text>
        </TouchableOpacity>

        {/* Phone */}
        <TouchableOpacity
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 10,
          }}
          onPress={() => openLink("tel:0663733328")}
        >
          <MaterialIcons name="phone" size={20} color="#FACC15" />
          <Text style={{ color: "#FFF", marginLeft: 10 }}>0663733328</Text>
        </TouchableOpacity>

        {/* Social Media */}
        <View style={{ flexDirection: "row", marginTop: 20, gap: 25 }}>
          <TouchableOpacity
            onPress={() => openLink("https://www.tiktok.com/@ttyab_alawras05")}
          >
            <FontAwesome5 name="tiktok" size={30} color="#FFF" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => openLink("https://www.instagram.com/tteyab_elawras05/")}
          >
            <FontAwesome name="instagram" size={30} color="#FFF" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => openLink("https://www.facebook.com/share/17VmU2KTS9/")}
          >
            <FontAwesome name="facebook" size={30} color="#FFF" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => openLink("https://youtube.com/@ttyab_elawras")}
          >
          <AntDesign name="youtube" size={30} color="#FFF" />          
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => openLink("https://wa.me/213654768883")}
          >
            <FontAwesome name="whatsapp" size={30} color="#FFF" />
          </TouchableOpacity>
        </View>

        {/* Privacy Policy Button */}
        <TouchableOpacity style={{ marginTop: 30 }} onPress={() => setModalVisible(true)}>
          <Text style={{ color: "#FACC15", textDecorationLine: "underline" }}>
            سياسة الخصوصية
          </Text>
        </TouchableOpacity>
      </View>

      {/* Privacy Policy Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.8)",
            justifyContent: "center",
            alignItems: "center",
            padding: 20,
          }}
        >
          <View
            style={{
              backgroundColor: "#111",
              borderRadius: 10,
              padding: 20,
              maxHeight: "80%",
              width: "100%",
            }}
          >
            <ScrollView>
              <Text
                style={{
                  color: "#FACC15",
                  fontSize: 24,
                  fontWeight: "bold",
                  marginBottom: 10,
                  textAlign: "center",
                }}
              >
                سياسة الخصوصية
              </Text>
              <Text style={{ color: "#CCC", marginBottom: 10 }}>
                نحن نحترم خصوصيتك ونلتزم بحماية المعلومات الشخصية التي تشاركها
                معنا عند استخدام تطبيقنا.
              </Text>

              <Text style={{ color: "#FFF", fontWeight: "bold", marginTop: 10 }}>
                جمع المعلومات
              </Text>
              <Text style={{ color: "#CCC", marginBottom: 10 }}>
                قد نجمع معلومات مثل اسمك، البريد الإلكتروني، وبيانات الاستخدام
                لتقديم تجربة أفضل وتحسين خدماتنا.
              </Text>

              <Text style={{ color: "#FFF", fontWeight: "bold", marginTop: 10 }}>
                استخدام المعلومات
              </Text>
              <Text style={{ color: "#CCC", marginBottom: 10 }}>
                تُستخدم المعلومات لتخصيص تجربتك داخل التطبيق، التواصل معك عند
                الحاجة، وتحليل الأداء لتحسين خدماتنا.
              </Text>

              <Text style={{ color: "#FFF", fontWeight: "bold", marginTop: 10 }}>
                مشاركة المعلومات
              </Text>
              <Text style={{ color: "#CCC", marginBottom: 10 }}>
                نحن لا نبيع أو نشارك معلوماتك الشخصية مع أطراف خارجية إلا إذا
                كان ذلك مطلوباً قانونياً.
              </Text>

              <Text style={{ color: "#FFF", fontWeight: "bold", marginTop: 10 }}>
                الأمان
              </Text>
              <Text style={{ color: "#CCC", marginBottom: 10 }}>
                نحن نتخذ تدابير معقولة لحماية معلوماتك الشخصية من الوصول غير
                المصرح به أو التعديل أو الكشف.
              </Text>

              <Text style={{ color: "#FFF", fontWeight: "bold", marginTop: 10 }}>
                التغييرات على السياسة
              </Text>
              <Text style={{ color: "#CCC", marginBottom: 10 }}>
                قد نقوم بتحديث سياسة الخصوصية من وقت لآخر. سيتم نشر أي تغييرات
                على هذه الصفحة.
              </Text>

              <Text
                style={{
                  color: "#888",
                  fontSize: 12,
                  textAlign: "center",
                  marginTop: 10,
                }}
              >
                آخر تحديث: 2025-09-11
              </Text>

              <Pressable
                style={{
                  marginTop: 20,
                  alignSelf: "center",
                  padding: 10,
                  backgroundColor: "#FACC15",
                  borderRadius: 5,
                }}
                onPress={() => setModalVisible(false)}
              >
                <Text style={{ color: "#000", fontWeight: "bold" }}>إغلاق</Text>
              </Pressable>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}
