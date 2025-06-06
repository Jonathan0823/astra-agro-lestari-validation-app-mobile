import React, { createContext, useContext, useEffect, useState } from "react";
import * as SQLite from "expo-sqlite";

interface DatabaseContextType {
  db: SQLite.SQLiteDatabase | null;
  isLoading: boolean;
}

const DatabaseContext = createContext<DatabaseContextType>({
  db: null,
  isLoading: true,
});

export const useDatabase = () => useContext(DatabaseContext);

interface SQLiteProviderProps {
  children: React.ReactNode;
}

export const Providers: React.FC<SQLiteProviderProps> = ({ children }) => {
  const [db, setDb] = useState<SQLite.SQLiteDatabase | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeDatabase = async () => {
      try {
        const database = await SQLite.openDatabaseAsync("mydatabase.db");

        await database.execAsync(`
        PRAGMA journal_mode = WAL;
        CREATE TABLE IF NOT EXISTS sample_data (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          blok INTEGER NOT NULL,
          nomor_baris TEXT NOT NULL,
          image_uri TEXT,
          circle INTEGER DEFAULT 0,
          gawangan INTEGER DEFAULT 0,
          pruning INTEGER DEFAULT 0,
          created_at TEXT,
          updated_at TEXT,
          is_synced INTEGER DEFAULT 0,
          firebase_id TEXT
        );
      `);

        setDb(database);
        console.log("Database initialized successfully!");
      } catch (error) {
        console.error("Error opening database", error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeDatabase();
  }, []);

  return (
    <DatabaseContext.Provider value={{ db, isLoading }}>
      {children}
    </DatabaseContext.Provider>
  );
};
