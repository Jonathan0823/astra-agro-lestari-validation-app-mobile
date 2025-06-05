import { router, Stack, useSegments } from "expo-router";
import "@/app/globals.css";
import { Image, View, Text, TouchableOpacity, Alert } from "react-native";
import { useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import { User } from "@/types/User";

export default function RootLayout() {
  const [headerName, setHeaderName] = useState("VALIDASI BLOK");
  const [user, setUser] = useState<User>();
  const segments = useSegments() as string[];

  useEffect(() => {
    const checkLogin = async () => {
      const user = await SecureStore.getItemAsync("user"); // misalnya simpan token atau ID
      if (user) {
        console.log("User is logged in, setting user state");
        setUser(JSON.parse(user)); // parse user data
      } else {
        console.log("No user found in SecureStore");
      }
      if (!user) {
        console.log("User not logged in, redirecting to login page");
        router.replace("/login"); // ganti halaman langsung ke login
      }
    };

    checkLogin();
  }, [segments]);

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

  const handleClickUser = () => {
    if (!user) {
      router.push("/login");
      return;
    }

    Alert.alert(
      "Logout",
      "Apakah kamu yakin ingin logout?",
      [
        { text: "Batal", style: "cancel" },
        {
          text: "Logout",
          style: "destructive",
          onPress: async () => {
            await SecureStore.deleteItemAsync("user");
            setUser(undefined);
            router.replace("/login");
          },
        },
      ],
      { cancelable: true },
    );
  };

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
        headerRight: () => (
          <TouchableOpacity onPress={handleClickUser}>
            <View
              className={`flex-row items-center mr-3 ${segments.length === 0 ? "w-20" : ""} `}
            >
              <Text className="text-md font-semibold text-gray-600">
                {user?.username || "SIGN IN"}
              </Text>
            </View>
          </TouchableOpacity>
        ),
        headerStyle: {
          backgroundColor: "white",
        },
      }}
    />
  );
}
