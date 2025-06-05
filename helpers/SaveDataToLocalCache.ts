import AsyncStorage from "@react-native-async-storage/async-storage";

export const saveDataToLocalCache = async (data: any) => {
  const existing = await AsyncStorage.getItem("offlineQueue");
  const parsed = existing ? JSON.parse(existing) : [];

  parsed.push(data);

  await AsyncStorage.setItem("offlineQueue", JSON.stringify(parsed));
  console.log("Data saved to local cache:", data);
};
