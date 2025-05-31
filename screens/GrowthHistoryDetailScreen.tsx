import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, Image, BackHandler } from "react-native";
import { RouteProp } from "@react-navigation/native";
import { Styles } from "../styles/Styles";
import { LoadingScreen } from "../components/LoadingScreen";
import { supabase } from "../lib/utils/services/supabaseService";
import {
  isGrowthHistoryItem,
  GrowthHistoryItem,
  NutrisiRekomendasi,
} from "../lib/utils/types/models";

type RootStackParamList = {
  GrowthHistoryDetail: {
    historyItem: GrowthHistoryItem;
  };
};

type GrowthHistoryDetailRouteProp = RouteProp<
  RootStackParamList,
  "GrowthHistoryDetail"
>;

type Props = {
  route: GrowthHistoryDetailRouteProp;
};

export const GrowthHistoryDetailScreen: React.FC<Props> = ({ route }) => {
  const { historyItem } = route.params;
  const [isLoading, setIsLoading] = useState(true);
  const [nutrisiRekomendasiData, setNutrisiRekomendasiData] = useState<
    NutrisiRekomendasi[]
  >([]);

  useEffect(() => {
    // Handle back button
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        return false;
      }
    );

    const fetchDataIfNeeded = async () => {
      // Jika nutrisiRekomendasi tidak tersedia di historyItem, kita perlu mengambilnya
      if (
        (!historyItem.nutrisiRekomendasi ||
          historyItem.nutrisiRekomendasi.length === 0) &&
        historyItem.tahapId
      ) {
        try {
          // Fetch nutrient recommendations
          const { data: nutrientData, error: nutrientError } = await supabase
            .from("tahap_nutrisi")
            .select(
              `
              *,
              nutrisi_info!inner (
                id,
                nama_nutrisi,
                deskripsi
              )
            `
            )
            .eq("tahap_id", historyItem.tahapId);

          if (nutrientError) {
            console.error("Error fetching nutrients:", nutrientError);
          } else if (nutrientData && nutrientData.length > 0) {
            const recommendations = nutrientData.map((item) => ({
              id: item.nutrisi_info.id || 0,
              nama: item.nutrisi_info.nama_nutrisi,
              deskripsi: item.nutrisi_info.deskripsi,
            }));
            setNutrisiRekomendasiData(recommendations);
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      } else if (
        historyItem.nutrisiRekomendasi &&
        historyItem.nutrisiRekomendasi.length > 0
      ) {
        setNutrisiRekomendasiData(historyItem.nutrisiRekomendasi);
      }
      setIsLoading(false);
    };

    fetchDataIfNeeded();
    return () => backHandler.remove();
  }, [historyItem]);

  // Kalkulasi hari tersisa untuk panen
  const getDaysRemaining = () => {
    // Jika daysUntilHarvest tersedia di historyItem, gunakan itu
    if (historyItem.daysUntilHarvest) {
      return historyItem.daysUntilHarvest;
    }

    // Hitung dari harvestDate jika tersedia
    if (historyItem.harvestDate) {
      const today = new Date();
      const harvestDate = new Date(historyItem.harvestDate.split(",")[1]); // Asumsi format "Hari, DD MMMM YYYY"
      const diffTime = Math.abs(harvestDate.getTime() - today.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays;
    }

    // Hitung dari estimasiPanen jika tersedia
    if (historyItem.estimasiPanen) {
      const match = historyItem.estimasiPanen.match(/\d+/);
      if (match) {
        return parseInt(match[0], 10);
      }
    }

    return null;
  };

  return (
    <View style={Styles.container}>
      {isLoading ? (
        <LoadingScreen />
      ) : (
        <ScrollView contentContainerStyle={Styles.scrollContent}>
          <View style={Styles.resultCard}>
            <Text style={Styles.resultTitle}>{historyItem.tahapNama}</Text>

            <View style={Styles.sectionContainer}>
              <View style={Styles.resultImageContainer}>
                <Image
                  source={{ uri: historyItem.imageUri }}
                  style={Styles.resultImage}
                  resizeMode="cover"
                />
              </View>
            </View>

            {/* Label Display (read-only) */}
            <View style={Styles.sectionContainer}>
              <View style={Styles.labelDisplayContainer}>
                <Text style={Styles.labelDisplayTitle}>Label:</Text>
                <View style={Styles.labelDisplayValue}>
                  <Text
                    style={
                      !historyItem.label || historyItem.label === "No Label"
                        ? Styles.labelDefaultText
                        : Styles.labelText
                    }
                  >
                    {historyItem.label || "No Label"}
                  </Text>
                </View>
              </View>
            </View>

            {/* Perkiraan Tanggal Panen */}
            {historyItem.harvestDate && (
              <View style={Styles.sectionContainer}>
                <View style={Styles.harvestDateContainer}>
                  <Text style={Styles.harvestDateTitle}>
                    Perkiraan Tanggal Panen:
                  </Text>
                  <Text style={Styles.harvestDateValue}>
                    {historyItem.harvestDate}
                  </Text>
                  {getDaysRemaining() !== null && (
                    <Text style={Styles.harvestDaysText}>
                      (Sekitar {getDaysRemaining()} hari lagi)
                    </Text>
                  )}
                </View>
              </View>
            )}

            {/* Tambahkan indikator khusus untuk tahap siap panen (ID 4) */}
            {historyItem.tahapId === 4 && (
              <View style={[Styles.sectionContainer, { marginTop: 8 }]}>
                <View
                  style={{
                    backgroundColor: "#E3F2FD",
                    borderWidth: 1,
                    borderColor: "#2196F3",
                    borderRadius: 12,
                    padding: 16,
                    alignItems: "center",
                  }}
                >
                  <View
                    style={{
                      backgroundColor: "#2196F3",
                      width: 50,
                      height: 50,
                      borderRadius: 25,
                      justifyContent: "center",
                      alignItems: "center",
                      marginBottom: 12,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 24,
                        color: "#fff",
                        fontWeight: "bold",
                      }}
                    >
                      ✓
                    </Text>
                  </View>
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: "bold",
                      color: "#0D47A1",
                      marginBottom: 8,
                    }}
                  >
                    Siap Panen!
                  </Text>
                  <Text
                    style={{
                      textAlign: "center",
                      color: "#1565C0",
                      fontSize: 14,
                      lineHeight: 20,
                    }}
                  >
                    Tanaman selada Anda sudah mencapai tahap siap panen. Panen
                    selada saat daun masih segar dan belum menguning untuk hasil
                    terbaik.
                  </Text>
                </View>
              </View>
            )}

            {/* Rekomendasi Nutrisi */}
            {nutrisiRekomendasiData && nutrisiRekomendasiData.length > 0 && (
              <View style={Styles.sectionContainer}>
                <View style={Styles.nutrientContainer}>
                  <Text style={Styles.sectionTitle}>Rekomendasi Nutrisi</Text>
                  {nutrisiRekomendasiData.map((nutrient, index) => (
                    <View key={index} style={Styles.nutrientItem}>
                      <Text style={Styles.nutrientName}>{nutrient.nama}</Text>
                      <Text style={Styles.nutrientDescription}>
                        {nutrient.deskripsi}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </View>
        </ScrollView>
      )}
    </View>
  );
};
