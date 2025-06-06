import ValidationPreview from "@/components/ValidationPreview";
import { useLocalSearchParams } from "expo-router";
import { View, Text } from "react-native";

const Index = () => {
  const { id } = useLocalSearchParams();
  return (
    <View className="flex-1 bg-white p-2">
      <Text className="font-bold text-primary text-2xl my-2 mb-4">
        Blok {id}
      </Text>
      <ValidationPreview id={String(id)} />
    </View>
  );
};

export default Index;
