import { useSyncOnConnect } from "@/lib/useSyncOnConnect";
import { Stack } from "expo-router";

const MainLayout = () => {
  useSyncOnConnect();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    />
  );
};

export default MainLayout;
