import React from "react";
import { View, TouchableHighlight, Text } from "react-native";
import * as ImagePicker from "expo-image-picker";

type CameraCompProps = {
  step: "form" | "validate";
  onTakingImage: (uri: string) => void;
  nomorBaris: string;
  onComplete: (type: string) => void;
};

const CameraComp = ({
  step,
  onTakingImage,
  nomorBaris,
  onComplete,
}: CameraCompProps) => {
  const openCamera = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      alert("Permission to access camera is required!");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      quality: 0.5,
    });

    if (!result.canceled) {
      const originalUri = result.assets[0].uri;
      onTakingImage(originalUri);
    }
  };

  return (
    <View className="items-center justify-center p-4 pb-10 gap-5 flex flex-row">
      {step === "validate" && (
        <TouchableHighlight
          className={`bg-primary rounded-lg p-4 ${!nomorBaris ? "opacity-60" : ""}`}
          onPress={() => onComplete("complete")}
          disabled={!nomorBaris}
        >
          <Text className="text-white font-bold text-lg">Selesai</Text>
        </TouchableHighlight>
      )}
      <TouchableHighlight
        className={`bg-primary rounded-lg p-4 ${!nomorBaris ? "opacity-60" : ""}`}
        onPress={async () => {
          if (step !== "form") {
            onComplete("next");
          }
          await openCamera();
        }}
        disabled={!nomorBaris}
      >
        <Text className="text-white font-bold text-lg">
          {step === "form" ? "Ambil Foto" : "Lanjut Foto"}
        </Text>
      </TouchableHighlight>
    </View>
  );
};

export default CameraComp;
