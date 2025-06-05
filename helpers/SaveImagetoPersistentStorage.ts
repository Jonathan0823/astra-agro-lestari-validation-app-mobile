import * as FileSystem from "expo-file-system";

export const saveImageToPersistentStorage = async (
  uri: string,
): Promise<string> => {
  const fileName = uri.split("/").pop(); // Ambil nama file dari path
  const newPath = `${FileSystem.documentDirectory}images/${fileName}`;

  // Pastikan folder /images sudah ada
  await FileSystem.makeDirectoryAsync(`${FileSystem.documentDirectory}images`, {
    intermediates: true,
  });

  // Salin file ke path baru
  await FileSystem.copyAsync({
    from: uri,
    to: newPath,
  });

  return newPath;
};
