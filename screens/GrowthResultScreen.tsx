import React, { useEffect, useState, useRef, useMemo } from "react";
import {
  View,
  Text,
  ScrollView,
  BackHandler,
  Alert,
  Image,
} from "react-native";
import { RouteProp, useFocusEffect } from "@react-navigation/native";
import { supabase } from "../lib/utils/services/supabaseService";
import { GrowthResultImage } from "../components/GrowthResultImage";
import { HarvestEstimation } from "../components/HarvestEstimation";
import { NutrientList } from "../components/NutrientList";
import { HarvestDate } from "../components/HarvestDate";
import { Styles } from "../styles/Styles";
import { LoadingScreen } from "../components/LoadingScreen";
import { historyService } from "../lib/utils/services/historyService";
import { format, addDays } from "date-fns";
import { id } from "date-fns/locale";
import { LabelInput } from "../components/LabelInput";
import { useNavigation } from "@react-navigation/native";
import { v4 as uuidv4 } from "uuid";

type PredictionType = {
  bbox: number[];
  class_id: number;
  class_name: string;
  confidence: number;
  id: number;
};

type RootStackParamList = {
  GrowthResult: {
    predictions: PredictionType[];
    imageUri: string;
  };
};

type GrowthResultRouteProp = RouteProp<RootStackParamList, "GrowthResult">;

type Props = {
  route: GrowthResultRouteProp;
};

type NutrientInfo = {
  nama_nutrisi: string;
  deskripsi: string;
};

type NutrientData = {
  nutrisi_info: NutrientInfo;
};

type HarvestDate = {
  daysUntilHarvest: number;
  harvestDate: string;
};

type HistoryItem = {
  id: string;
  tanggalDeteksi: string;
};

// Add this type definition at the top with other types
type StageData = {
  nama: string;
  estimasi_waktu_panen: string;
};

export const GrowthResult: React.FC<Props> = ({ route }) => {
  const navigation = useNavigation();
  const { predictions, imageUri } = route.params;
  const prediction = predictions[0];
  const [isLoading, setIsLoading] = useState(true);
  const [growthStageName, setGrowthStageName] = useState<string>("");
  const [harvestEstimation, setHarvestEstimation] = useState<string>("");
  const [nutrientRecommendations, setNutrientRecommendations] = useState<
    Array<{
      nama: string;
      deskripsi: string;
    }>
  >([]);
  const [harvestDate, setHarvestDate] = useState<HarvestDate | null>(null);
  const [labelInput, setLabelInput] = useState("");
  const [isLabelLocked, setIsLabelLocked] = useState(false);
  const [stageData, setStageData] = useState<StageData | null>(null);
  const [processingImageId, setProcessingImageId] = useState<string>(uuidv4());
  const [finalLabel, setFinalLabel] = useState<string | null>(null);
  const hasBeenSaved = useRef(false);

  useEffect(() => {
    const fetchGrowthStageInfo = async () => {
      setIsLoading(true);
      try {
        const adjustedClassId = prediction.class_id + 1;

        const { data: fetchedStageData, error: stageError } = await supabase
          .from("tahap_pertumbuhan")
          .select("nama, estimasi_waktu_panen")
          .eq("id", adjustedClassId)
          .single();

        if (stageError) {
          console.error("Error fetching growth stage:", stageError);
          setGrowthStageName(prediction.class_name);
          setHarvestEstimation("");
        } else if (fetchedStageData) {
          setStageData(fetchedStageData);
          setGrowthStageName(fetchedStageData.nama);
          setHarvestEstimation(fetchedStageData.estimasi_waktu_panen);

          // Calculate and set harvest date
          const harvestDateInfo = calculateHarvestDate(
            fetchedStageData.estimasi_waktu_panen
          );
          setHarvestDate(harvestDateInfo);

          // Fetch nutrient recommendations
          const { data: nutrientData, error: nutrientError } = await supabase
            .from("tahap_nutrisi")
            .select(
              `
              *,
              nutrisi_info!inner (
                nama_nutrisi,
                deskripsi
              )
            `
            )
            .eq("tahap_id", adjustedClassId);

          if (nutrientError) {
            console.error("Error fetching nutrients:", nutrientError);
          } else if (nutrientData) {
            const recommendations = nutrientData.map((item) => ({
              nama: item.nutrisi_info.nama_nutrisi,
              deskripsi: item.nutrisi_info.deskripsi,
            }));
            setNutrientRecommendations(recommendations);
          }
        }
      } catch (error) {
        console.error("Error:", error);
        setGrowthStageName(prediction.class_name);
        setHarvestEstimation("");
      } finally {
        setIsLoading(false);
      }
    };

    fetchGrowthStageInfo();
  }, [prediction.class_id]);

  // Ganti handleLabelLock dengan versi yang melakukan update
  const handleLabelLock = async (newLabel: string) => {
    if (newLabel.trim()) {
      try {
        const trimmedLabel = newLabel.trim();

        // Update label di history berdasarkan ID
        await historyService.updateLabel(processingImageId, trimmedLabel);

        // Update state lokal
        setLabelInput(trimmedLabel);
        setFinalLabel(trimmedLabel);
        setIsLabelLocked(true);
      } catch (error) {
        console.error("Error updating label:", error);
        Alert.alert(
          "Gagal Menyimpan",
          "Terjadi kesalahan saat menyimpan label"
        );
      }
    }
  };

  // Kosongkan useFocusEffect karena data sudah disimpan di awal
  useFocusEffect(
    React.useCallback(() => {
      return () => {
        // Tidak perlu menyimpan apa-apa lagi di sini
      };
    }, [])
  );

  // Perbarui fungsi saveInitialData
  useEffect(() => {
    const saveInitialData = async () => {
      if (!hasBeenSaved.current && stageData && !isLoading) {
        const adjustedClassId = prediction.class_id + 1;
        const harvestDateInfo =
          harvestDate || calculateHarvestDate(stageData.estimasi_waktu_panen);

        // Tambahkan id ke nutrientRecommendations untuk menyesuaikan dengan NutrisiRekomendasi interface
        const nutrientRecsWithId = nutrientRecommendations.map(
          (rec, index) => ({
            id: index + 1, // Gunakan index sebagai id sementara
            nama: rec.nama,
            deskripsi: rec.deskripsi,
          })
        );

        // Simpan dengan data lengkap termasuk nutrisiRekomendasi dan daysUntilHarvest
        const savedItem = await historyService.saveHistory({
          id: processingImageId,
          imageUri: imageUri,
          tahapId: adjustedClassId,
          tahapNama: stageData.nama,
          estimasiPanen: stageData.estimasi_waktu_panen,
          detectionType: "growth",
          harvestDate: harvestDateInfo?.harvestDate,
          daysUntilHarvest: harvestDateInfo?.daysUntilHarvest, // Simpan daysUntilHarvest
          nutrisiRekomendasi: nutrientRecsWithId, // Simpan rekomendasi nutrisi dengan id
          label: "No Label", // Default label
        });

        hasBeenSaved.current = true;
      }
    };

    saveInitialData();
  }, [
    stageData,
    isLoading,
    prediction?.class_id,
    imageUri,
    harvestDate,
    nutrientRecommendations,
  ]);

  // Tambahkan handler untuk back button
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        return false;
      }
    );

    return () => backHandler.remove();
  }, []);

  const parseEstimationDays = (estimation: string): number => {
    const match = estimation.match(/\d+/);
    return match ? parseInt(match[0]) : NaN;
  };

  const calculateHarvestDate = (estimasiHari: string) => {
    const days = parseEstimationDays(estimasiHari);
    if (isNaN(days)) return null;

    const today = new Date();
    const targetDate = addDays(today, days);

    return {
      daysUntilHarvest: days,
      harvestDate: format(targetDate, "EEEE, dd MMMM yyyy", { locale: id }),
    };
  };

  const memoizedHarvestInfo = useMemo(() => {
    if (!stageData) return null;
    return calculateHarvestDate(stageData.estimasi_waktu_panen);
  }, [stageData]);

  return (
    <View style={Styles.container}>
      {isLoading ? (
        <LoadingScreen />
      ) : (
        <ScrollView contentContainerStyle={Styles.scrollContent}>
          <View style={Styles.resultCard}>
            <Text style={Styles.resultTitle}>{growthStageName}</Text>

            <View style={Styles.sectionContainer}>
              <View style={Styles.resultImageContainer}>
                <Image
                  source={{ uri: imageUri }}
                  style={Styles.resultImage}
                  resizeMode="cover"
                />
              </View>
            </View>

            <View style={Styles.sectionContainer}>
              <LabelInput
                onLabelSubmit={handleLabelLock}
                isLocked={isLabelLocked}
                initialValue={labelInput}
                onInputChange={setLabelInput}
              />
            </View>

            {/* Container Estimasi Pertumbuhan telah dihapus */}

            {/* Perkiraan Tanggal Panen dipindahkan ke posisi Estimasi Pertumbuhan */}
            {harvestDate && (
              <View style={Styles.sectionContainer}>
                <View style={Styles.harvestDateContainer}>
                  <Text style={Styles.harvestDateTitle}>
                    Perkiraan Tanggal Panen:
                  </Text>
                  <Text style={Styles.harvestDateValue}>
                    {harvestDate.harvestDate}
                  </Text>
                  <Text style={Styles.harvestDaysText}>
                    (Sekitar {harvestDate.daysUntilHarvest} hari lagi)
                  </Text>
                </View>
              </View>
            )}

            {/* Tambahkan indikator khusus untuk tahap siap panen (ID 4) */}
            {prediction.class_id + 1 === 4 && (
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

            {nutrientRecommendations.length > 0 && (
              <View style={Styles.sectionContainer}>
                <View style={Styles.nutrientContainer}>
                  <Text style={Styles.sectionTitle}>Rekomendasi Nutrisi</Text>
                  {nutrientRecommendations.map((nutrient, index) => (
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

            {/* Container Perkiraan Tanggal Panen lama telah dihapus */}
          </View>
        </ScrollView>
      )}
    </View>
  );
};
