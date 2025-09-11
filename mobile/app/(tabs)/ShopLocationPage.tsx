import ContactUs from "@/component/ContactUs";
import ShopMaps from "@/component/ShopMaps";
import React from "react";
import { ScrollView } from "react-native";

export default function ShopMap() {

  return (
    <ScrollView
          className="bg-black px-4"
          contentContainerStyle={{ paddingBottom: 80 }} 
          showsVerticalScrollIndicator={false}
        >
          <ShopMaps />
          <ContactUs />
    </ScrollView>
  );
}
