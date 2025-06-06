import { Link, useFocusEffect } from "expo-router";
import { useCallback } from "react";
import { Alert, BackHandler, Text, TouchableOpacity, View } from "react-native";

export default function Index() {
  useFocusEffect(
    useCallback(() => {
      const backAction = () => {
        Alert.alert("Keluar", "Apakah kamu ingin keluar dari aplikasi?", [
          {
            text: "Batal",
            onPress: () => null,
            style: "cancel",
          },
          {
            text: "Ya",
            onPress: () => BackHandler.exitApp(),
          },
        ]);
        return true;
      };

      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        backAction,
      );

      return () => backHandler.remove();
    }, []),
  );

  return (
    <View className="flex-1 bg-white p-4 pb-10">
      <View className="flex flex-col h-full gap-6">
        {/* Kotak 1 */}
        <View className="flex-1">
          <Link href="/validate" asChild>
            <TouchableOpacity className="flex-1 w-full items-center justify-center bg-slate-200 border-2 border-slate-500 rounded-xl max-w-[550px]">
              <Text className="text-2xl font-bold text-slate-600">
                Mulai Validasi
              </Text>
            </TouchableOpacity>
          </Link>
        </View>

        {/* Kotak 2 */}
        <View className="flex-1">
          <Link href="/history" asChild>
            <TouchableOpacity className="flex-1 w-full items-center justify-center bg-slate-200 border-2 border-slate-500 rounded-xl max-w-[550px]">
              <Text className="text-2xl font-bold text-slate-600">
                Riwayat Validasi
              </Text>
            </TouchableOpacity>
          </Link>
        </View>

        {/* Kotak 3 */}
        <View className="flex-1">
          <Link href="/sample" asChild>
            <TouchableOpacity className="flex-1 w-full items-center justify-center bg-slate-200 border-2 border-slate-500 rounded-xl max-w-[550px]">
              <Text className="text-2xl font-bold text-slate-600">
                Data Sample
              </Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </View>
  );
}
