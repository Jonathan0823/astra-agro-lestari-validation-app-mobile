import { SQLiteDatabase } from "expo-sqlite";
import {
  collection,
  getDocs,
  orderBy,
  query,
  Timestamp,
  where,
} from "firebase/firestore";
import db from "@/firebaseConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";

const BATCH_SIZE = 200;

const LAST_SYNC_KEY = "lastSyncTimestamp";

export const syncFromFirebase = async (localDB: SQLiteDatabase) => {
  console.log("🔄 Syncing data from Firebase...");
  let transactionActive = false; // Flag untuk melacak status transaksi

  const lastSyncStr = await AsyncStorage.getItem(LAST_SYNC_KEY);
  const lastSync = lastSyncStr
    ? Timestamp.fromDate(new Date(lastSyncStr))
    : Timestamp.fromMillis(0);
  console.log(`Last sync timestamp: ${lastSync.toDate().toLocaleString()}`);

  try {
    const q = query(
      collection(db, "sample_data"),
      where("updated_at", ">", lastSync),
      orderBy("updated_at"),
    );
    const snapshot = await getDocs(q);
    const firebaseData = snapshot.docs.map((doc) => ({
      firebase_id: doc.id,
      data: doc.data(),
    }));

    console.log(`Found ${firebaseData.length} records to sync from Firebase.`);

    if (firebaseData.length === 0) {
      console.log("No new data to sync from Firebase.");
      return;
    }

    const existingIdsResult = await localDB.getAllAsync<{
      firebase_id: string;
    }>(`SELECT firebase_id FROM sample_data`);
    const existingFirebaseIds = new Set(
      existingIdsResult.map((row) => row.firebase_id),
    );

    const newRecords: any[][] = [];

    for (const { firebase_id, data } of firebaseData) {
      if (!existingFirebaseIds.has(firebase_id)) {
        newRecords.push([
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
        ]);
      }
    }

    if (newRecords.length > 0) {
      for (let i = 0; i < newRecords.length; i += BATCH_SIZE) {
        const batch = newRecords.slice(i, i + BATCH_SIZE);

        const insertStatements = batch
          .map((record) => {
            const values = record
              .map((val) => {
                if (val === null || typeof val === "undefined") return "NULL";
                if (typeof val === "string")
                  return `'${val.replace(/'/g, "''")}'`;
                if (typeof val === "boolean") return val ? 1 : 0;
                // Kalau tipe Timestamp masih ada, convert dulu
                if (val instanceof Timestamp)
                  return `'${val.toDate().toISOString()}'`;
                return val;
              })
              .join(", ");

            return `
            INSERT INTO sample_data
              (blok, nomor_baris, image_uri, circle, gawangan, pruning, created_at, updated_at, is_synced, firebase_id)
            VALUES (${values})
            ON CONFLICT(firebase_id) DO UPDATE SET
              blok = excluded.blok,
              nomor_baris = excluded.nomor_baris,
              image_uri = excluded.image_uri,
              circle = excluded.circle,
              gawangan = excluded.gawangan,
              pruning = excluded.pruning,
              created_at = excluded.created_at,
              updated_at = excluded.updated_at,
              is_synced = excluded.is_synced
            ;
          `;
          })
          .join("\n");

        const sql = `
          BEGIN TRANSACTION;
          ${insertStatements}
          COMMIT;
        `;
        // Menetapkan flag bahwa transaksi sedang aktif sebelum mencoba execAsync
        // Ini penting jika execAsync itu sendiri gagal di tengah jalan
        transactionActive = true;
        await localDB.execAsync(sql);
        transactionActive = false; // Transaksi berhasil di-commit
        console.log(
          `✅ Inserted batch ${Math.floor(i / BATCH_SIZE) + 1} (${
            batch.length
          } records)`,
        );
      }
      const newestTimestamp = snapshot.docs.reduce((max, doc) => {
        const updatedAt: Timestamp = doc.data().updated_at;
        const millis = updatedAt?.toMillis?.() ?? 0;
        return millis > max ? millis : max;
      }, lastSync.toMillis());

      console.log(
        `Newest record timestamp: ${new Date(newestTimestamp).toLocaleString()}`,
      );

      await AsyncStorage.setItem(
        LAST_SYNC_KEY,
        new Date(newestTimestamp).toISOString(),
      );
      console.log("newestTimestamp:", newestTimestamp);

      console.log(`✅ Synced ${newRecords.length} new records from Firebase.`);
    } else {
      console.log("No new records to insert into local DB.");
    }

    console.log("🎉 Sync from Firebase completed!");
  } catch (error) {
    console.error("❌ Error syncing from Firebase:", error);
    // Jika transaksi sedang aktif saat error terjadi, lakukan ROLLBACK
    if (transactionActive) {
      try {
        await localDB.execAsync("ROLLBACK;");
        console.log("⚠️ Transaction rolled back due to error.");
      } catch (rollbackError) {
        console.error("❌ Error rolling back transaction:", rollbackError);
      }
    }
  }
};
