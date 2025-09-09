import { Stack } from "expo-router";
import "../global.css";

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Tabs group */}
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

      {/* Modals group */}
      <Stack.Screen
        name="(modals)"
        options={{ presentation: "modal", headerShown: false }}
      />
    </Stack>
  );
}
