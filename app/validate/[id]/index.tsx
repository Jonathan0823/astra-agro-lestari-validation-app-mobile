import { useLocalSearchParams } from "expo-router";
import { View, Text, TextInput, Image } from "react-native";
import CameraComp from "@/components/CameraComp";
import { useState } from "react";

const Index = () => {
  const { id } = useLocalSearchParams();
  const [nomorBaris, setNomorBaris] = useState("");
  const [imageUri, setImageUri] = useState<string | null>(null);

  return (
    <View className="flex-1 bg-white p-2">
      <Text className="font-bold text-primary text-2xl my-2">Blok {id}</Text>
      <TextInput
        className="flex rounded-lg px-4 mb-4 bg-white border-2 border-gray-300"
        placeholder="Nomor Baris"
        value={nomorBaris}
        onChangeText={(text) => setNomorBaris(text)}
      />

      <View className="flex-1 items-center">
        {imageUri && (
          <Image
            source={{ uri: imageUri }}
            style={{ width: 300, height: 400, marginTop: 20 }}
          />
        )}
      </View>

      <CameraComp setImageUri={setImageUri} />
    </View>
  );
};

export default Index;
