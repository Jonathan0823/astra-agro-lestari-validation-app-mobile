import { useDatabase } from "@/components/Providers";
import { deleteDataByBlok } from "@/lib/sqlite";
import { router } from "expo-router";
import { View, Text, TouchableOpacity, ScrollView, Alert } from "react-native";
import Toast from "react-native-toast-message";

type PilihBlokProps = {
  type?: "validate" | "history" | "sample";
};

const PilihBlok = ({ type }: PilihBlokProps) => {
  const { db } = useDatabase();
  const handlePress = (blokNumber: number) => {
    if (type === "history") {
      router.push(`/history/${blokNumber}`);
      return;
    } else if (type === "sample") {
      router.push(`/sample/${blokNumber}`);
      return;
    }
    router.push(`/validate/${blokNumber}`);
  };

  const handleDelete = async (blokNumber: number) => {
    if (!db) return;
    try {
      Alert.alert(
        "Hapus Data",
        `Apakah Anda yakin ingin menghapus data pada Blok ${blokNumber}?`,
        [
          {
            text: "Batal",
            style: "cancel",
          },
          {
            text: "Hapus",
            onPress: async () => {
              await deleteDataByBlok(blokNumber, db);
              Toast.show({
                type: "success",
                text1: "Data berhasil dihapus",
                text2: `Data pada Blok ${blokNumber} telah berhasil dihapus.`,
                topOffset: 100,
              });
            },
          },
        ],
      );
    } catch {
      Toast.show({
        type: "error",
        text1: "Gagal menghapus data",
        text2: `Terjadi kesalahan saat menghapus data pada Blok ${blokNumber}.`,
        topOffset: 100,
      });
    }
  };

  const renderBloks = () => {
    return [...Array(20)].map((_, i) => {
      const blokNum = i + 1;

      if (type === "sample" || type === "history") {
        return (
          <View
            key={blokNum}
            className="flex-row rounded-xl bg-primary items-center h-16 justify-between w-full mb-3 px-3"
          >
            <Text className="text-xl font-bold text-white">{`BLOK ${blokNum}`}</Text>

            <View className="flex-row gap-2">
              <TouchableOpacity
                className="px-3 py-2 rounded"
                style={{ backgroundColor: "#effbeb" }}
                onPress={() => handlePress(blokNum)}
              >
                <Text className="font-semibold text-sm text-black">
                  LIHAT {type === "sample" ? "DATA" : "RIWAYAT"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="px-3 py-2 rounded"
                style={{ backgroundColor: "red" }}
                onPress={() => handleDelete(blokNum)}
              >
                <Text className="text-white font-semibold text-sm">
                  HAPUS DATA
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        );
      }

      return (
        <TouchableOpacity
          key={blokNum}
          onPress={() => handlePress(blokNum)}
          className="bg-primary w-full h-16 rounded-xl justify-center items-center mb-4"
        >
          <Text className="text-white font-semibold text-xl">{`Blok ${blokNum}`}</Text>
        </TouchableOpacity>
      );
    });
  };

  return (
    <>
      <Text className="font-bold text-primary text-2xl my-2">PILIH BLOK :</Text>
      <ScrollView className="flex-1">
        <View className="flex-row flex-wrap justify-between gap-1 px-2">
          {renderBloks()}
        </View>
      </ScrollView>
    </>
  );
};

export default PilihBlok;
