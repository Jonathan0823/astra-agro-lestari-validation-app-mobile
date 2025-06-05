import { Stack, useSegments } from "expo-router";
import "@/app/globals.css";
import { Image, View, Text } from "react-native";
import { useEffect, useState } from "react";

export default function RootLayout() {
  const [headerName, setHeaderName] = useState("VALIDASI BLOK");
  const segments = useSegments() as string[];

  useEffect(() => {
    if (segments.includes("validate")) {
      setHeaderName("VALIDASI BLOK");
    } else if (segments.includes("history")) {
      setHeaderName("RIWAYAT VALIDASI");
    } else if (segments.includes("sample")) {
      setHeaderName("DATA SAMPLE");
    } else {
      setHeaderName("VALIDASI BLOK");
    }
  }, [segments]);

  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerTitleAlign: "center",
        headerTitle: () => (
          <View className="bg-secondary p-2 rounded-lg flex">
            <Text className="text-xl font-bold text-primary">{headerName}</Text>
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
