import { SampleData } from "@/types/SampleData";
import { SQLiteDatabase } from "expo-sqlite";

export const getDataByBlok = async (
  blok: number,
  db: SQLiteDatabase,
): Promise<any[]> => {
  try {
    const rows = await db.getAllAsync(
      `SELECT * FROM sample_data WHERE blok = ? ORDER BY created_at DESC`,
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
        data.nomorBaris,
        data.imageUri,
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
