import { useDatabase } from "@/components/Providers";
import { getSampleByBlok } from "@/lib/sqlite";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { View, Text } from "react-native";

type SampleData = {
  total: number;
  circle: number;
  gawangan: number;
  pruning: number;
};

const Index = () => {
  const { id } = useLocalSearchParams();
  const [data, setData] = useState<SampleData>();
  const { db } = useDatabase();

  useEffect(() => {
    const getData = async () => {
      if (!db) return;
      try {
        const data = await getSampleByBlok(Number(id), db);
        setData(data);
      } catch {}
    };

    getData();
  }, [id, db]);

  return (
    <View className="flex-1 bg-white p-2">
      <Text className="font-bold text-primary text-2xl my-2 mb-4">
        Blok {id}
      </Text>

      <View className="bg-secondary p-4 rounded-2xl shadow-md mx-3 mb-6 border-2 border-primary">
        <Text className="text-xl text-gray-700 font-semibold mb-3">
          Jumlah Sample
        </Text>
        <Text className="text-3xl font-extrabold text-primary mb-6">
          {data?.total || 0}
        </Text>

        <Text className="text-xl font-semibold text-gray-700 mb-3">
          Sample Standard
        </Text>

        <View className="gap-2">
          <View className="flex-row justify-between">
            <Text className="text-lg text-gray-600 font-medium">Circle</Text>
            <Text className="text-lg text-gray-800 font-semibold">
              {data?.circle || 0}
            </Text>
          </View>
          <View className="flex-row justify-between">
            <Text className="text-lg text-gray-600 font-medium">Gawangan</Text>
            <Text className="text-lg text-gray-800 font-semibold">
              {data?.gawangan || 0}
            </Text>
          </View>
          <View className="flex-row justify-between">
            <Text className="text-lg text-gray-600 font-medium">Pruning</Text>
            <Text className="text-lg text-gray-800 font-semibold">
              {data?.pruning || 0}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default Index;
