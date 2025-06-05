import React from "react";
import { View, TouchableHighlight, Text } from "react-native";
import * as ImagePicker from "expo-image-picker";

type CameraCompProps = {
  setImageUri: (uri: string) => void;
};

const CameraComp = ({ setImageUri }: CameraCompProps) => {
  const openCamera = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      alert("Permission to access camera is required!");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  return (
    <View className="items-center justify-center p-4 pb-10">
      <TouchableHighlight
        className="bg-primary rounded-lg p-4"
        onPress={openCamera}
      >
        <Text className="text-white font-bold text-lg">Open Camera</Text>
      </TouchableHighlight>
    </View>
  );
};

export default CameraComp;
