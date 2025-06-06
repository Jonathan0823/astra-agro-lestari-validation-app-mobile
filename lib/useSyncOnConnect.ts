import { useEffect } from "react";
import NetInfo from "@react-native-community/netinfo";
import { syncToFirebase } from "@/lib/syncToFirebase";
import { syncFromFirebase } from "@/lib/syncFromFirebase";
import { useDatabase } from "@/components/Providers";

export const useSyncOnConnect = () => {
  const { db } = useDatabase();
  useEffect(() => {
    if (!db) return;

    const unsubscribe = NetInfo.addEventListener((state) => {
      if (state.isConnected) {
        syncToFirebase(db);
        syncFromFirebase(db);
      }
    });

    return () => unsubscribe();
  }, [db]);
};
