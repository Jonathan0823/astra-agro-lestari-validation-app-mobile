import { useLocalSearchParams } from "expo-router";
import { View, Text, TextInput, Image } from "react-native";
import CameraComp from "@/components/CameraComp";
import { useState } from "react";
import ValidationOptions from "@/components/ValidationOption";
import { StatusItem } from "@/types/StatusItem";

const initialStatusData: StatusItem[] = [
  { label: "CIRCLE", status1: true, status2: false },
  { label: "GAWANGAN", status1: true, status2: false },
  { label: "PRUNING", status1: true, status2: false },
];

const Index = () => {
  const { id } = useLocalSearchParams();
  const [nomorBaris, setNomorBaris] = useState("");
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [statusData, setStatusData] = useState<StatusItem[]>(initialStatusData);
  const [step, setStep] = useState<"form" | "validate">("form");

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
      />
    </View>
  );
};

export default Index;
