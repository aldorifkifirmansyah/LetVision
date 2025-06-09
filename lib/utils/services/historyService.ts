import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  HistoryItem,
  GrowthHistoryItem,
  DiseaseHistoryItem,
  NutrisiRekomendasi,
  isGrowthHistoryItem,
  isDiseaseHistoryItem,
} from "../types/models";
import uuid from "react-native-uuid";
import { addMonths, isBefore, parseISO } from "date-fns";

// Kunci untuk penyimpanan history di AsyncStorage
const HISTORY_STORAGE_KEY = "@history";

// Dapatkan semua item history
const getHistory = async (): Promise<HistoryItem[]> => {
  try {
    const historyData = await AsyncStorage.getItem(HISTORY_STORAGE_KEY);
    if (!historyData) return [];

    const parsedData: HistoryItem[] = JSON.parse(historyData);

    // Pastikan semua item memiliki properti isPinned
    return parsedData.map((item) => ({
      ...item,
      isPinned: !!item.isPinned,
      label: item.label || "No Label",
    }));
  } catch (error) {
    console.error("Error retrieving history:", error);
    return [];
  }
};

// Simpan history baru
const saveHistory = async (
  item: Partial<GrowthHistoryItem | DiseaseHistoryItem>
): Promise<HistoryItem> => {
  try {
    // Buat item history baru dengan properti wajib
    const newItem: HistoryItem = {
      id: item.id || uuid.v4().toString(),
      imageUri: item.imageUri || "",
      tanggalDeteksi: new Date().toISOString(),
      detectionType: item.detectionType || "growth",
      isPinned: false,
      label: item.label || "No Label",
      ...(item as any), // Tambahkan semua properti lainnya
    };

    // Ambil history yang sudah ada
    const history = await getHistory();

    // Tambahkan item baru di awal array (item terbaru di atas)
    const updatedHistory = [newItem, ...history];

    // Simpan ke AsyncStorage
    await AsyncStorage.setItem(
      HISTORY_STORAGE_KEY,
      JSON.stringify(updatedHistory)
    );
    return newItem;
  } catch (error) {
    console.error("Error saving history:", error);
    throw error;
  }
};

// Hapus item history
const deleteHistory = async (id: string): Promise<void> => {
  try {
    const history = await getHistory();
    const updatedHistory = history.filter((item) => item.id !== id);
    await AsyncStorage.setItem(
      HISTORY_STORAGE_KEY,
      JSON.stringify(updatedHistory)
    );
  } catch (error) {
    console.error("Error deleting history:", error);
    throw error;
  }
};

// Hapus multiple item history
const deleteMultiple = async (ids: string[]): Promise<void> => {
  try {
    const history = await getHistory();
    const updatedHistory = history.filter((item) => !ids.includes(item.id));
    await AsyncStorage.setItem(
      HISTORY_STORAGE_KEY,
      JSON.stringify(updatedHistory)
    );
  } catch (error) {
    console.error("Error deleting multiple history items:", error);
    throw error;
  }
};

// Toggle pin status
const togglePin = async (id: string): Promise<void> => {
  try {
    const history = await getHistory();

    const updatedHistory = history.map((item) => {
      if (item.id === id) {
        return { ...item, isPinned: !item.isPinned };
      }
      return item;
    });

    // Urutkan ulang dengan memprioritaskan item yang di-pin
    updatedHistory.sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;

      // Jika status pin sama, urutkan berdasarkan tanggal (terbaru di atas)
      return (
        new Date(b.tanggalDeteksi).getTime() -
        new Date(a.tanggalDeteksi).getTime()
      );
    });

    await AsyncStorage.setItem(
      HISTORY_STORAGE_KEY,
      JSON.stringify(updatedHistory)
    );
  } catch (error) {
    console.error("Error toggling pin status:", error);
    throw error;
  }
};

// Update label pada item history
const updateLabel = async (id: string, newLabel: string): Promise<void> => {
  try {
    const history = await getHistory();

    const updatedHistory = history.map((item) => {
      if (item.id === id) {
        return { ...item, label: newLabel };
      }
      return item;
    });

    await AsyncStorage.setItem(
      HISTORY_STORAGE_KEY,
      JSON.stringify(updatedHistory)
    );
  } catch (error) {
    console.error("Error updating label:", error);
    throw error;
  }
};

// Fungsi untuk menghapus otomatis riwayat yang sudah lebih dari 3 bulan
const cleanupOldHistory = async (): Promise<string[]> => {
  try {
    // 1. Ambil semua riwayat
    const history = await getHistory();

    // 2. Hitung tanggal 3 bulan yang lalu
    const threeMonthsAgo = addMonths(new Date(), -3);

    // 3. Filter item yang lebih lama dari 3 bulan
    const oldItems = history.filter((item) => {
      const detectionDate = parseISO(item.tanggalDeteksi);
      return isBefore(detectionDate, threeMonthsAgo);
    });

    // 4. Jika ada item lama, hapus mereka
    if (oldItems.length > 0) {
      const oldItemIds = oldItems.map((item) => item.id);
      await deleteMultiple(oldItemIds);
      return oldItemIds; // Kembalikan ID yang dihapus
    }

    return []; // Tidak ada item yang dihapus
  } catch (error) {
    console.error("Error during automatic history cleanup:", error);
    return [];
  }
};

export const historyService = {
  getHistory,
  saveHistory,
  deleteHistory,
  deleteMultiple,
  togglePin,
  updateLabel,
  cleanupOldHistory,
};
