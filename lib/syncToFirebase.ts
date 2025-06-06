import { SQLiteDatabase } from "expo-sqlite";
import NetInfo from "@react-native-community/netinfo";
import db from "@/firebaseConfig";
import { addDoc, collection } from "firebase/firestore";
import { SampleData } from "@/types/SampleData";

export const syncToFirebase = async (localDB: SQLiteDatabase) => {
  try {
    const state = await NetInfo.fetch();
    if (!state.isConnected) {
      console.log("No internet connection. Sync aborted.");
      return;
    }

    const unsyncedData = await localDB.getAllAsync<SampleData>(
      `SELECT * FROM sample_data WHERE is_synced = 0`,
    );
    if (unsyncedData.length === 0) {
      console.log("No unsynced data found.");
      return;
    }

    for (const item of unsyncedData) {
      const { id, ...dataToUpload } = item; // Jangan upload id SQLite

      const docRef = await addDoc(collection(db, "sample_data"), {
        ...dataToUpload,
        syncedAt: new Date().toISOString(),
      });

      // Tandai bahwa data ini sudah tersinkron
      await localDB.runAsync(
        `UPDATE sample_data SET is_synced = 1, firebase_id = ? WHERE id = ?`,
        [docRef.id, Number(item.id)],
      );
    }
  } catch {
    console.log("Error syncing data to Firebase");
  }
};
