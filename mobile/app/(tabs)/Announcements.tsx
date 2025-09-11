import Announcementss from "../../component/Announcementss";
import React from "react";
import { ScrollView } from "react-native";
import OpeningTimes from "../../component/OpeningTimes";
import MenuPreview from "@/component/MenuPreview";
import GalleryMobile from "@/component/GalleryMobile";

export default function Announcements() {
  return (
    <ScrollView
      className="flex-1 bg-black px-4"
      contentContainerStyle={{ paddingBottom: 120 }} // ensures space below
      showsVerticalScrollIndicator={false}
    >
      <Announcementss />
      <OpeningTimes />
      <MenuPreview />
      <GalleryMobile />
    </ScrollView>
  );
}
