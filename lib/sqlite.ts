import db from "@/firebaseConfig";
import { SampleData } from "@/types/SampleData";
import { SQLiteDatabase } from "expo-sqlite";
import { deleteDoc, doc } from "firebase/firestore";

export const getDataByBlok = async (
  blok: number,
  db: SQLiteDatabase,
): Promise<any[]> => {
  try {
    const rows = await db.getAllAsync(
      `SELECT * FROM sample_data WHERE blok = ? ORDER BY created_at ASC`,
      [blok],
    );
    return rows;
  } catch (error) {
    console.error("Error fetching data by blok:", error);
    throw error;
  }
};

export const insertData = async (db: SQLiteDatabase, data: SampleData) => {
  const circleInt = data.circle ? 1 : 0;
  const gawanganInt = data.gawangan ? 1 : 0;
  const pruningInt = data.pruning ? 1 : 0;

  try {
    await db.runAsync(
      `INSERT INTO sample_data 
      (blok, nomor_baris, image_uri, circle, gawangan, pruning, created_at, updated_at) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        data.blok,
        data.nomor_baris,
        data.image_uri,
        circleInt,
        gawanganInt,
        pruningInt,
        data.createdAt,
        data.updatedAt,
      ],
    );
  } catch (error) {
    console.error("Error inserting data:", error);
    throw error;
  }
};

export const getSampleByBlok = async (
  blok: number,
  db: SQLiteDatabase,
): Promise<{
  total: number;
  circle: number;
  gawangan: number;
  pruning: number;
}> => {
  try {
    const result = await db.getFirstAsync<{
      total: number;
      circle: number;
      gawangan: number;
      pruning: number;
    }>(
      `
      SELECT 
        COUNT(*) AS total,
        SUM(circle) AS circle,
        SUM(gawangan) AS gawangan,
        SUM(pruning) AS pruning
      FROM sample_data
      WHERE blok = ?
      `,
      [blok],
    );

    return {
      total: result?.total || 0,
      circle: result?.circle || 0,
      gawangan: result?.gawangan || 0,
      pruning: result?.pruning || 0,
    };
  } catch (error) {
    console.error("Error fetching sample data by blok:", error);
    throw error;
  }
};

export const deleteDataByBlok = async (
  blok: number,
  localDB: SQLiteDatabase,
): Promise<void> => {
  try {
    const rows = await localDB.getAllAsync<{ firebase_id: string }>(
      `SELECT firebase_id FROM sample_data WHERE blok = ? AND firebase_id IS NOT NULL`,
      [blok],
    );

    for (const row of rows) {
      if (row.firebase_id) {
        const docRef = doc(db, "sample_data", row.firebase_id);
        await deleteDoc(docRef);
      }
    }

    await localDB.runAsync(`DELETE FROM sample_data WHERE blok = ?`, [blok]);
    console.log(`Deleted data with blok = ${blok} from SQLite and Firebase`);
  } catch (error) {
    console.error("Error deleting data by blok:", error);
    throw error;
  }
};
