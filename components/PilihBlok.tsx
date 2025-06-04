import { router } from "expo-router";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";

type PilihBlokProps = {
  type?: "validate" | "history" | "sample";
};

const PilihBlok = ({ type }: PilihBlokProps) => {
  const handlePress = (blokNumber: number) => {
    router.push(`/`);
  };
  return (
    <>
      <Text className="font-bold text-primary text-2xl my-2">PILIH BLOK :</Text>
      <ScrollView className="flex-1">
        <View className="flex-row flex-wrap justify-between gap-1 px-2">
          {[...Array(20)].map((_, i) => {
            const blokNum = i + 1;
            return (
              <TouchableOpacity
                key={blokNum}
                onPress={() => handlePress(blokNum)}
                className="bg-primary w-full h-24 rounded-xl justify-center items-center mb-4"
              >
                <Text className="text-white font-semibold text-xl">{`Blok ${blokNum}`}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </>
  );
};

export default PilihBlok;
