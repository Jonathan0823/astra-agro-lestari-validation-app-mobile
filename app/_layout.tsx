import { Stack, useSegments } from "expo-router";
import "@/app/globals.css";
import { Image, View, Text } from "react-native";
import { useEffect, useState } from "react";

export default function RootLayout() {
  const [headerName, setHeaderName] = useState("VALIDASI BLOK");
  const segments = useSegments();
  const currentPage = segments[segments.length - 1] || "home";

  useEffect(() => {
    switch (currentPage) {
      case "validate":
        setHeaderName("VALIDASI BLOK");
        break;
      case "history":
        setHeaderName("RIWAYAT VALIDASI");
        break;
      case "sample":
        setHeaderName("DATA SAMPLE");
        break;
      default:
        setHeaderName("VALIDASI BLOK");
    }
  }, [currentPage]);

  console.log("Current Page:", currentPage);
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
