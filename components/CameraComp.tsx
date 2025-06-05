import React from "react";
import { View, Button } from "react-native";
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
    <View className="items-center justify-center p-4">
      <Button title="Mulai Foto" onPress={openCamera} />
    </View>
  );
};

export default CameraComp;
