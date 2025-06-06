import { useDatabase } from "@/components/Providers";
import { getDataByBlok } from "@/lib/sqlite";
import { SampleData } from "@/types/SampleData";
import { FontAwesome } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { View, Text, Image } from "react-native";

type ValidationPreviewProps = {
  id: string;
};

const ValidationPreview = ({ id }: ValidationPreviewProps) => {
  const [data, setData] = useState<SampleData[]>();
  const { db } = useDatabase();

  useEffect(() => {
    const getData = async () => {
      if (!db) return;
      try {
        const res = await getDataByBlok(Number(id), db);
        console.log("Data fetched:", res);
        setData(res);
      } catch {}
    };
    getData();
  }, [id, db]);
  return (
    <View className="flex-1 bg-white p-2">
      {(data?.length as number) > 0 &&
        data?.map((item, index) => (
          <View
            key={index}
            className="bg-secondary p-4 rounded-2xl shadow-md mx-3 mb-6 border-2 border-primary flex flex-row gap-5"
          >
            <View>
              {item.image_uri && (
                <Image
                  source={{ uri: item.image_uri }}
                  style={{ width: 98, height: 130, marginTop: 20 }}
                  className="rounded-lg shadow-md"
                />
              )}
            </View>
            <View className="flex-1">
              <Text className="text-xl text-gray-700 font-semibold mb-3">
                Sample {index + 1}
              </Text>
              <Text className="text-lg text-gray-600 font-medium mb-2">
                Nomor Baris: {item.nomor_baris}
              </Text>
              <View className="flex flex-row justify-between">
                <Text className="text-lg text-gray-600 font-medium mb-2">
                  C:
                </Text>
                <View
                  style={{
                    width: 24,
                    height: 24,
                    borderWidth: 1,
                    borderColor: "#000",
                    backgroundColor: "#000",
                    alignItems: "center",
                    justifyContent: "center",
                    marginHorizontal: 4,
                  }}
                >
                  <FontAwesome
                    name={item.circle ? "check" : "close"}
                    size={16}
                    color={item.circle ? "lime" : "red"}
                  />
                </View>
              </View>
              <View className="flex flex-row justify-between">
                <Text className="text-lg text-gray-600 font-medium mb-2">
                  G:
                </Text>
                <View
                  style={{
                    width: 24,
                    height: 24,
                    borderWidth: 1,
                    borderColor: "#000",
                    backgroundColor: "#000",
                    alignItems: "center",
                    justifyContent: "center",
                    marginHorizontal: 4,
                  }}
                >
                  <FontAwesome
                    name={item.gawangan ? "check" : "close"}
                    size={16}
                    color={item.gawangan ? "lime" : "red"}
                  />
                </View>
              </View>
              <View className="flex flex-row justify-between">
                <Text className="text-lg text-gray-600 font-medium mb-2">
                  P:
                </Text>
                <View
                  style={{
                    width: 24,
                    height: 24,
                    borderWidth: 1,
                    borderColor: "#000",
                    backgroundColor: "#000",
                    alignItems: "center",
                    justifyContent: "center",
                    marginHorizontal: 4,
                  }}
                >
                  <FontAwesome
                    name={item.pruning ? "check" : "close"}
                    size={16}
                    color={item.pruning ? "lime" : "red"}
                  />
                </View>
              </View>
            </View>
          </View>
        ))}
    </View>
  );
};

export default ValidationPreview;
