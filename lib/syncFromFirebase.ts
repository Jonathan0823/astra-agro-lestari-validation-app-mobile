import { SQLiteDatabase } from "expo-sqlite";
import { SampleData } from "@/types/SampleData";
import { collection, getDocs } from "firebase/firestore";
import db from "@/firebaseConfig";

export const syncFromFirebase = async (localDB: SQLiteDatabase) => {
  try {
    console.log("🔄 Syncing data from Firebase...");

    const snapshot = await getDocs(collection(db, "sample_data"));

    for (const doc of snapshot.docs) {
      const firebase_id = doc.id;
      const data = doc.data();

      // Cek apakah data dengan firebase_id ini sudah ada di SQLite
      const existing = await localDB.getFirstAsync<SampleData>(
        `SELECT * FROM sample_data WHERE firebase_id = ?`,
        [firebase_id],
      );

      if (!existing) {
        await localDB.runAsync(
          `INSERT INTO sample_data 
            (blok, nomor_baris, image_uri, circle, gawangan, pruning, created_at, updated_at, is_synced, firebase_id) 
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            data.blok,
            data.nomor_baris,
            data.image_uri,
            data.circle ? 1 : 0,
            data.gawangan ? 1 : 0,
            data.pruning ? 1 : 0,
            data.createdAt,
            data.updatedAt,
            1, // is_synced = true
            firebase_id,
          ],
        );

        console.log(`✅ Synced data from Firebase ID: ${firebase_id}`);
      } else {
        console.log(`⏩ Data sudah ada (firebase_id: ${firebase_id}), skip.`);
      }
    }

    console.log("🎉 Sync from Firebase completed!");
  } catch (error) {
    console.error("❌ Error syncing from Firebase:", error);
  }
};
