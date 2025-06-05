import { router, useLocalSearchParams } from "expo-router";
import { View, Text, TextInput, Image } from "react-native";
import CameraComp from "@/components/CameraComp";
import { useState } from "react";
import ValidationOptions from "@/components/ValidationOption";
import { StatusItem } from "@/types/StatusItem";
import Toast from "react-native-toast-message";
import { saveImageToPersistentStorage } from "@/helpers/SaveImagetoPersistentStorage";
import { SampleData } from "@/types/SampleData";
import { useSQLiteContext } from "expo-sqlite";
import { insertData } from "@/lib/sqlite";

const initialStatusData: StatusItem[] = [
  { label: "CIRCLE", status: true },
  { label: "GAWANGAN", status: true },
  { label: "PRUNING", status: true },
];

const Index = () => {
  const { id } = useLocalSearchParams();
  const [nomorBaris, setNomorBaris] = useState("");
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [statusData, setStatusData] = useState<StatusItem[]>(initialStatusData);
  const [step, setStep] = useState<"form" | "validate">("form");
  const db = useSQLiteContext();

  const handleComplete = async (type: string) => {
    if (!nomorBaris || !imageUri) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Nomor Baris dan Foto harus diisi!",
        position: "top",
        topOffset: 100,
      });
      return;
    }

    try {
      const savedUri = await saveImageToPersistentStorage(imageUri);
      const payload: SampleData = {
        blok: Number(id),
        nomor_baris: nomorBaris,
        circle: statusData[0].status,
        gawangan: statusData[1].status,
        pruning: statusData[2].status,
        image_uri: savedUri,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await insertData(db, payload);
      console.log("Data saved successfully:", payload);
      setImageUri(null);
      setStatusData(initialStatusData);

      if (type === "complete") {
        router.push("/");
      }
    } catch {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Terjadi kesalahan saat menyimpan data!",
        position: "top",
        topOffset: 100,
      });
    }
  };

  return (
    <View className="flex-1 bg-white p-2">
      <Text className="font-bold text-primary text-2xl my-2 mb-4">
        Blok {id}
      </Text>
      {step === "form" && (
        <>
          <Text className="text-gray-500 mb-2 text-xl font-semibold">
            Nomor Baris :
          </Text>
          <TextInput
            className="flex rounded-lg px-4 mb-4 bg-white border-2 border-gray-300"
            placeholder="Nomor Baris"
            value={nomorBaris}
            onChangeText={(text) => setNomorBaris(text)}
          />
        </>
      )}

      <View className="flex-1 items-center">
        {imageUri && step === "validate" && (
          <>
            <Image
              source={{ uri: imageUri }}
              style={{ width: 263, height: 350, marginTop: 20 }}
            />

            <ValidationOptions
              statusData={statusData}
              setStatusData={setStatusData}
            />
          </>
        )}
      </View>

      <CameraComp
        step={step}
        onTakingImage={(imageUrl) => {
          setImageUri(imageUrl);
          setStep("validate");
        }}
        nomorBaris={nomorBaris}
        onComplete={handleComplete}
      />
    </View>
  );
};

export default Index;
