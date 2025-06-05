import { useLocalSearchParams } from "expo-router";
import { View, Text } from "react-native";

const Index = () => {
  const { id } = useLocalSearchParams();
  return (
    <View>
      <Text>Blok {id}</Text>
    </View>
  );
};

export default Index;
