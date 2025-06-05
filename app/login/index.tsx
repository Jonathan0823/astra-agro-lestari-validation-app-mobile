import { Login } from "@/lib/auth";
import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import * as SecureStore from "expo-secure-store";
import { router } from "expo-router";

const Index = () => {
  const [id, setId] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const user = await Login(id, password);
      await SecureStore.setItemAsync("user", JSON.stringify(user));
      router.replace("/");
    } catch (err) {
      console.error("Login failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 items-center justify-center bg-white">
      <View
        className="w-full h-full px-4 justify-center bg-secondary rounded-3xl shadow-2xl"
        style={{
          maxWidth: 300,
          paddingTop: 20,
          paddingBottom: 20,
          maxHeight: 300,
          elevation: 10,
        }}
      >
        <Text
          style={{ alignItems: "center", alignSelf: "center" }}
          className="text-4xl font-bold text-primary mb-10"
        >
          ASTRA AGRO
        </Text>
        <TextInput
          className="flex rounded-lg px-4 mb-4 bg-white"
          placeholder="ID"
          autoCapitalize="none"
          onChangeText={(text) => setId(text)}
        ></TextInput>
        <TextInput
          className="flex rounded-lg px-4 mb-4 bg-white"
          placeholder="Password"
          autoCapitalize="none"
          secureTextEntry={true}
          onChangeText={(text) => setPassword(text)}
        ></TextInput>

        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" animating={loading} />
        ) : (
          <TouchableOpacity
            disabled={loading || !id || !password}
            className={`bg-primary rounded-lg px-4 py-2 mt-4 ${
              loading || !id || !password ? "opacity-50" : "opacity-100"
            }`}
            onPress={handleLogin}
          >
            <Text className="text-white text-center font-bold">Login</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default Index;
