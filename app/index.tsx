import { Link } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

export default function Index() {
  return (
    <View className="flex-1 bg-white p-4">
      <View className="flex-1 border-4 border-blue-500 rounded-xl overflow-hidden">
        {/* Kotak 1 */}
        <View className="flex-1">
          <Link href="/validate" asChild>
            <TouchableOpacity className="flex-1 w-full items-center justify-center bg-red-200 border-b-2 border-white">
              <Text className="text-2xl font-bold text-slate-600">
                Mulai Validasi
              </Text>
            </TouchableOpacity>
          </Link>
        </View>

        {/* Kotak 2 */}
        <View className="flex-1 items-center justify-center bg-green-200 border-b-2 border-white">
          <Text className="text-2xl font-bold text-slate-600">
            Riwayat Validasi
          </Text>
        </View>

        {/* Kotak 3 */}
        <View className="flex-1 items-center justify-center bg-yellow-200">
          <Text className="text-2xl font-bold text-slate-600">Data Sample</Text>
        </View>
      </View>
    </View>
  );
}
