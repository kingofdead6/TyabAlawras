import { Stack } from "expo-router";

export default function ModalLayout() {
  return (
    <Stack screenOptions={{ presentation: "modal", headerShown: false }}>
      <Stack.Screen name="Cart" />
      <Stack.Screen name="Checkout" />
    </Stack>
  );
}
