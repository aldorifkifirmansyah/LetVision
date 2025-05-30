import AsyncStorage from "@react-native-async-storage/async-storage";
import { HistoryItem } from "../types/models";
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";

const HISTORY_KEY = "@letvision_history";

export const historyService = {
  async saveHistory(data: Partial<HistoryItem>): Promise<HistoryItem> {
    try {
      const history = await this.getHistory();

      const newItem: HistoryItem = {
        id: data.id || uuidv4(),
        tanggalDeteksi: new Date().toISOString(),
        imageUri: data.imageUri || "",
        detectionType: data.detectionType || "growth",
        label: data.label || "No Label",
        ...data,
      } as HistoryItem;

      history.unshift(newItem);
      await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(history));
      return newItem;
    } catch (error) {
      throw error;
    }
  },

  async getHistory(): Promise<HistoryItem[]> {
    try {
      const history = await AsyncStorage.getItem(HISTORY_KEY);
      if (!history) return [];

      const parsedHistory: HistoryItem[] = JSON.parse(history);

      return parsedHistory.sort((a, b) => {
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;

        if (a.isPinned && b.isPinned) {
          if (a.pinnedAt && b.pinnedAt) {
            return (
              new Date(b.pinnedAt).getTime() - new Date(a.pinnedAt).getTime()
            );
          }
        }

        return (
          new Date(b.tanggalDeteksi).getTime() -
          new Date(a.tanggalDeteksi).getTime()
        );
      });
    } catch (error) {
      return [];
    }
  },

  async clearHistory(): Promise<void> {
    try {
      await AsyncStorage.removeItem(HISTORY_KEY);
    } catch (error) {
      // Handle error silently
    }
  },

  async deleteHistory(id: string): Promise<void> {
    try {
      const history = await this.getHistory();
      const updatedHistory = history.filter((item) => item.id !== id);
      await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(updatedHistory));
    } catch (error) {
      throw error;
    }
  },

  async deleteMultiple(ids: string[]): Promise<void> {
    try {
      const history = await this.getHistory();
      const updatedHistory = history.filter((item) => !ids.includes(item.id));
      await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(updatedHistory));
    } catch (error) {
      throw error;
    }
  },

  async updateLabel(id: string, newLabel: string): Promise<void> {
    try {
      const history = await this.getHistory();
      const updatedHistory = history.map((item) => {
        if (item.id === id) {
          return { ...item, label: newLabel };
        }
        return item;
      });

      await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(updatedHistory));
    } catch (error) {
      throw error;
    }
  },

  async togglePin(id: string): Promise<void> {
    try {
      const history = await this.getHistory();
      const updatedHistory = history.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            isPinned: !item.isPinned,
            pinnedAt: !item.isPinned ? new Date().toISOString() : undefined,
          };
        }
        return item;
      });

      const sortedHistory = updatedHistory.sort((a, b) => {
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;

        if (a.isPinned && b.isPinned) {
          if (a.pinnedAt && b.pinnedAt) {
            return (
              new Date(b.pinnedAt).getTime() - new Date(a.pinnedAt).getTime()
            );
          }
        }

        return (
          new Date(b.tanggalDeteksi).getTime() -
          new Date(a.tanggalDeteksi).getTime()
        );
      });

      await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(sortedHistory));
    } catch (error) {
      throw error;
    }
  },
};
