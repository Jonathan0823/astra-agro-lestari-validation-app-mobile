import { Stack } from "expo-router";
import "@/app/globals.css";
import { Image, View, Text } from "react-native";

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerTitleAlign: "center",
        headerTitle: () => (
          <View className="bg-secondary p-2 rounded-lg flex">
            <Text className="text-xl font-bold text-primary">
              VALIDASI BLOK
            </Text>
          </View>
        ),
        headerLeft: () => (
          <Image
            source={require("@/assets/images/company-logo.png")}
            className="w-12 h-12 ml-3"
          />
        ),
        headerStyle: {
          backgroundColor: "white",
        },
      }}
    />
  );
}
