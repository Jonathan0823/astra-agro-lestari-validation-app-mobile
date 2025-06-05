import { Stack } from "expo-router";
import { SQLiteProvider } from "expo-sqlite";
import React from "react";
import { View } from "react-native";

const _layout = () => {
  return (
    <View className="flex-1">
      <SQLiteProvider
        databaseName="test.db"
        onInit={async (db) => {
          try {
            await db.execAsync(`
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
          updated_at TEXT
        );
      `);
            console.log("DB initialized");
          } catch (error) {
            console.error("Failed to init DB:", error);
          }
        }}
      >
        <Stack screenOptions={{ headerShown: false }} />
      </SQLiteProvider>
    </View>
  );
};

export default _layout;
