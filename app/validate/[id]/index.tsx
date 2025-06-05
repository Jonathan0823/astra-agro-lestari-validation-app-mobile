import { useLocalSearchParams } from "expo-router";
import { View, Text } from "react-native";
import CameraComp from "@/components/CameraComp";

const Index = () => {
  const { id } = useLocalSearchParams();

  return (
    <View className="flex-1 bg-white p-2">
      <Text className="font-bold text-primary text-2xl my-2">Blok {id}</Text>
      <CameraComp />
    </View>
  );
};

export default Index;
