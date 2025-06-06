import { useEffect } from "react";
import NetInfo, { NetInfoState } from "@react-native-community/netinfo";
import { syncToFirebase } from "@/lib/syncToFirebase";
import { syncFromFirebase } from "@/lib/syncFromFirebase";
import { useDatabase } from "@/components/Providers";

export const useSyncOnConnect = () => {
  const { db } = useDatabase();
  useEffect(() => {
    if (!db) return;

    const handleConnectivityChange = async (state: NetInfoState) => {
      if (state.isConnected) {
        await syncToFirebase(db);
        await syncFromFirebase(db);
      }
    };

    const unsubscribe = NetInfo.addEventListener(handleConnectivityChange);

    return () => unsubscribe();
  }, [db]);
};
