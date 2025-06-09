import React, { useEffect, useState } from "react";
import { View, Image, StyleSheet, Text, ActivityIndicator } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { historyService } from "../lib/utils/services/historyService";
import { addMonths, isBefore, parseISO } from "date-fns";

export const SplashScreen = () => {
  const navigation = useNavigation<any>();
  const [status, setStatus] = useState("Memuat aplikasi...");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Minimal display time untuk splash screen
        const minDisplayTime = new Promise((resolve) =>
          setTimeout(resolve, 1500)
        );

        // Lakukan pengecekan dan pembersihan riwayat
        setStatus("Memeriksa data riwayat...");
        setProgress(30);
        const cleanupResult = await cleanupOldHistory();

        setProgress(70);
        setStatus("Mempersiapkan aplikasi...");

        // Tunggu minimal display time selesai
        await minDisplayTime;

        setProgress(100);

        // Navigasi ke halaman utama (Home, bukan MainTabs)
        setTimeout(() => {
          navigation.replace("Home");
        }, 300);
      } catch (error) {
        console.error("Error during app initialization:", error);
        // Tetap navigasi ke halaman utama meskipun terjadi error
        setStatus("Terjadi kesalahan. Memuat aplikasi...");
        setTimeout(() => {
          navigation.replace("Home");
        }, 1000);
      }
    };

    initializeApp();
  }, []);

  // Fungsi untuk membersihkan riwayat lama (lebih dari 3 bulan)
  const cleanupOldHistory = async () => {
    try {
      // 1. Ambil semua riwayat
      const allHistory = await historyService.getHistory();

      // 2. Hitung tanggal 3 bulan yang lalu
      const threeMonthsAgo = addMonths(new Date(), -3);

      setProgress(40);

      // 3. Filter item yang lebih lama dari 3 bulan
      const oldItems = allHistory.filter((item) => {
        // Pastikan item memiliki tanggalDeteksi
        if (!item.tanggalDeteksi) return false;

        const detectionDate = parseISO(item.tanggalDeteksi);
        return isBefore(detectionDate, threeMonthsAgo);
      });

      setProgress(50);

      // 4. Jika ada item yang perlu dihapus
      if (oldItems.length > 0) {
        setStatus(`Membersihkan ${oldItems.length} data lama...`);

        // Untuk dataset besar, gunakan chunking
        if (oldItems.length > 20) {
          await deleteInChunks(oldItems.map((item) => item.id));
        } else {
          // Untuk dataset kecil, hapus sekaligus
          await historyService.deleteMultiple(oldItems.map((item) => item.id));
        }

        console.log(`${oldItems.length} riwayat lama telah dihapus otomatis.`);
      }

      setProgress(60);

      return {
        cleanedCount: oldItems.length,
        success: true,
      };
    } catch (error) {
      console.error("Error cleaning up old history:", error);
      return {
        cleanedCount: 0,
        success: false,
      };
    }
  };

  // Fungsi untuk menghapus data dalam chunk untuk menghindari freezing
  const deleteInChunks = async (itemIds: string[], chunkSize: number = 10) => {
    for (let i = 0; i < itemIds.length; i += chunkSize) {
      const chunk = itemIds.slice(i, i + chunkSize);
      setStatus(
        `Membersihkan data ${i + 1}-${Math.min(
          i + chunkSize,
          itemIds.length
        )} dari ${itemIds.length}...`
      );
      await historyService.deleteMultiple(chunk);

      // Beri waktu untuk UI thread
      await new Promise((resolve) => setTimeout(resolve, 50));

      // Update progress
      const progressValue = 50 + Math.min(10, (i / itemIds.length) * 10);
      setProgress(progressValue);
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/logo.png")}
        style={styles.logo}
        resizeMode="contain"
      />

      <View style={styles.progressBarContainer}>
        <View style={[styles.progressBar, { width: `${progress}%` }]} />
      </View>

      <Text style={styles.statusText}>{status}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#2E7D32", // Warna hijau yang lebih cerah
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  logo: {
    width: 180, // Ukuran logo diperbesar
    height: 180, // Ukuran logo diperbesar
    marginBottom: 32, // Margin ditambah
  },
  statusText: {
    position: "absolute",
    bottom: 60,
    color: "#E8F5E9",
    fontSize: 14,
  },
  progressBarContainer: {
    position: "absolute",
    bottom: 40,
    left: 30,
    right: 30,
    height: 4,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 2,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 2,
  },
});
