import { useDatabase } from "@/components/Providers";
import { getDataByBlok } from "@/lib/sqlite";
import { SampleData } from "@/types/SampleData";
import { FontAwesome } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import Toast from "react-native-toast-message";

type ValidationPreviewProps = {
  id: string;
};

const ITEM_HEIGHT = 180;
const SCREEN_WIDTH = Dimensions.get("window").width;

const ValidationPreview = ({ id }: ValidationPreviewProps) => {
  const [data, setData] = useState<SampleData[]>([]);
  const [loading, setLoading] = useState(true);
  const { db } = useDatabase();

  useEffect(() => {
    const getData = async () => {
      if (!db) return;
      try {
        const res = await getDataByBlok(Number(id), db);
        setData(res);
      } catch {
        Toast.show({
          type: "error",
          text1: "Gagal memuat data",
          text2: `Terjadi kesalahan saat memuat data untuk Blok ${id}.`,
          topOffset: 100,
        });
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, [id, db]);

  const renderCheck = (status: boolean) => (
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
        name={status ? "check" : "close"}
        size={16}
        color={status ? "lime" : "red"}
      />
    </View>
  );

  const renderItem = ({ item, index }: { item: SampleData; index: number }) => (
    <View
      className="bg-secondary p-4 rounded-2xl shadow-md mx-3 mb-6 border-2 border-primary flex flex-row gap-5"
      style={{ width: SCREEN_WIDTH - 24 }}
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
        <View className="flex flex-row justify-between items-center mb-2">
          <Text className="text-lg text-gray-600 font-medium">C:</Text>
          {renderCheck(item.circle)}
        </View>
        <View className="flex flex-row justify-between items-center mb-2">
          <Text className="text-lg text-gray-600 font-medium">G:</Text>
          {renderCheck(item.gawangan)}
        </View>
        <View className="flex flex-row justify-between items-center mb-2">
          <Text className="text-lg text-gray-600 font-medium">P:</Text>
          {renderCheck(item.pruning)}
        </View>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#2196F3" />
        <Text className="mt-2 text-gray-500">Memuat data...</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={data}
      keyExtractor={(_, index) => index.toString()}
      renderItem={renderItem}
      contentContainerStyle={{ paddingVertical: 8 }}
      initialNumToRender={10}
      maxToRenderPerBatch={20}
      windowSize={10}
      removeClippedSubviews={true}
      getItemLayout={(_, index) => ({
        length: ITEM_HEIGHT,
        offset: ITEM_HEIGHT * index,
        index,
      })}
    />
  );
};

export default ValidationPreview;
