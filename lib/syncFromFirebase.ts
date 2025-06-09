import { SQLiteDatabase } from "expo-sqlite";
import { collection, getDocs } from "firebase/firestore";
import db from "@/firebaseConfig";

const BATCH_SIZE = 200;

export const syncFromFirebase = async (localDB: SQLiteDatabase) => {
  console.log("🔄 Syncing data from Firebase...");
  let transactionActive = false; // Flag untuk melacak status transaksi

  try {
    const snapshot = await getDocs(collection(db, "sample_data"));
    const firebaseData = snapshot.docs.map((doc) => ({
      firebase_id: doc.id,
      data: doc.data(),
    }));

    const totalRecords = firebaseData.length;
    console.log(`📊 Total records to sync from Firebase: ${totalRecords}`);

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
                if (val === null || typeof val === "undefined") {
                  return "NULL";
                }
                if (typeof val === "string") {
                  return `'${val.replace(/'/g, "''")}'`;
                }
                if (typeof val === "boolean") {
                  return val ? 1 : 0;
                }
                return val;
              })
              .join(", ");

            return `INSERT INTO sample_data (blok, nomor_baris, image_uri, circle, gawangan, pruning, created_at, updated_at, is_synced, firebase_id) VALUES (${values});`;
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
