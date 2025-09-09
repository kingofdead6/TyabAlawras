import { Redirect } from "expo-router";

export default function Index() {
  // Redirect to a real screen inside (tabs), e.g. Menu
  return <Redirect href="/(tabs)/Menu" />;
}
