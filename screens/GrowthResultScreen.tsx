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
import { NutrientList } from "../components/NutrientList";
import { HarvestDate } from "../components/HarvestDate";
import { Styles } from "../styles/Styles";
import { LoadingScreen } from "../components/LoadingScreen";
import { historyService } from "../lib/utils/services/historyService";
import { format, addDays } from "date-fns";
import { id } from "date-fns/locale";
import { LabelInput } from "../components/LabelInput";
import { useNavigation } from "@react-navigation/native";
import uuid from "react-native-uuid";

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

// Update tipe StageData untuk mencakup semua kolom tabel tahap_pertumbuhan_baru
type StageData = {
  id: number;
  nama: string;
  estimasi_waktu_panen: string;
  ec_min: number;
  ec_max: number;
  ph_min: number;
  ph_max: number;
  keterangan?: string;
  // Hapus ab_mix_ml dan poc_ml dari tipe data
};

type FertilizerData = {
  id: number;
  nama_pupuk: string;
};

type FertilizerDose = {
  id: number;
  tahap_id: number;
  pupuk_id: number;
  dosis_ml: number;
  pupuk?: FertilizerData;
};

export const GrowthResult: React.FC<Props> = ({ route }) => {
  const navigation = useNavigation();
  const { predictions, imageUri } = route.params;
  const prediction = predictions[0];
  const [isLoading, setIsLoading] = useState(true);
  const [growthStageName, setGrowthStageName] = useState<string>("");
  // Tetap pertahankan state harvestEstimation karena mungkin digunakan di tempat lain
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
  const [processingImageId, setProcessingImageId] = useState<string>(
    uuid.v4().toString()
  );
  const [finalLabel, setFinalLabel] = useState<string | null>(null);
  const hasBeenSaved = useRef(false);

  useEffect(() => {
    const fetchGrowthStageInfo = async () => {
      setIsLoading(true);
      try {
        const adjustedClassId = prediction.class_id + 1;

        // Ambil data tahap pertumbuhan
        const { data: fetchedStageData, error: stageError } = await supabase
          .from("tahap_pertumbuhan")
          .select("*")
          .eq("id", adjustedClassId)
          .single();

        if (stageError) {
          console.error("Error fetching growth stage:", stageError);
          setGrowthStageName(prediction.class_name);
          setHarvestEstimation("");
        } else if (fetchedStageData) {
          // Update state
          setStageData(fetchedStageData);
          setGrowthStageName(fetchedStageData.nama);
          setHarvestEstimation(fetchedStageData.estimasi_waktu_panen);

          // Calculate and set harvest date
          const harvestDateInfo = calculateHarvestDate(
            fetchedStageData.estimasi_waktu_panen
          );
          setHarvestDate(harvestDateInfo);

          // Ambil dosis pupuk dengan join ke tabel pupuk
          const { data: fertilizerDoses, error: dosesError } = await supabase
            .from("dosis_pupuk")
            .select(
              `
            id,
            dosis_ml,
            pupuk_id,
            pupuk:pupuk_id(id, nama_pupuk)
          `
            )
            .eq("tahap_id", adjustedClassId);

          if (dosesError) {
            console.error("Error fetching fertilizer doses:", dosesError);
          }

          // Buat rekomendasi nutrisi
          const recommendations = [];

          // Tambahkan rekomendasi dosis pupuk
          if (fertilizerDoses && fertilizerDoses.length > 0) {
            fertilizerDoses.forEach((dose) => {
              if (dose.dosis_ml > 0 && dose.pupuk) {
                recommendations.push({
                  nama: dose.pupuk.nama_pupuk,
                  deskripsi: `Gunakan ${dose.dosis_ml}ml ${dose.pupuk.nama_pupuk} per liter air.`,
                });
              }
            });
          }

          // EC dan pH
          recommendations.push({
            nama: "Electrical Conductivity (EC)",
            deskripsi: `Pertahankan EC antara ${fetchedStageData.ec_min} - ${fetchedStageData.ec_max} mS/cm.`,
          });

          recommendations.push({
            nama: "pH Level",
            deskripsi: `Jaga pH pada rentang ${fetchedStageData.ph_min} - ${fetchedStageData.ph_max}.`,
          });

          // Tambahkan keterangan jika ada
          if (fetchedStageData.keterangan) {
            recommendations.push({
              nama: "Catatan Tambahan",
              deskripsi: fetchedStageData.keterangan,
            });
          }

          setNutrientRecommendations(recommendations);
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

  // Perbarui fungsi saveInitialData untuk tidak lagi mereferensikan ab_mix_ml dan poc_ml
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

        try {
          // Ambil data dosis pupuk untuk disimpan dalam riwayat
          const { data: fertilizerDoses, error: dosesError } = await supabase
            .from("dosis_pupuk")
            .select(
              `
            id,
            dosis_ml,
            pupuk_id,
            pupuk:pupuk_id(id, nama_pupuk)
          `
            )
            .eq("tahap_id", adjustedClassId);

          // Buat objek dengan data pupuk untuk disimpan
          const fertilizerData = fertilizerDoses
            ? fertilizerDoses.reduce((acc, dose) => {
                if (dose.pupuk) {
                  // Gunakan nama_pupuk sebagai key dan dosis_ml sebagai value
                  acc[dose.pupuk.nama_pupuk] = dose.dosis_ml;
                }
                return acc;
              }, {} as Record<string, number>)
            : {};

          // Simpan dengan data lengkap termasuk data nutrisi
          await historyService.saveHistory({
            id: processingImageId,
            imageUri: imageUri,
            tahapId: adjustedClassId,
            tahapNama: stageData.nama,
            estimasiPanen: stageData.estimasi_waktu_panen,
            detectionType: "growth",
            harvestDate: harvestDateInfo?.harvestDate,
            daysUntilHarvest: harvestDateInfo?.daysUntilHarvest,
            nutrisiRekomendasi: nutrientRecsWithId,
            label: "No Label",
            // Data EC dan pH dari tabel tahap_pertumbuhan
            ecMin: stageData.ec_min,
            ecMax: stageData.ec_max,
            phMin: stageData.ph_min,
            phMax: stageData.ph_max,
            // Tambahkan data pupuk dari fertilizerData
            ...fertilizerData,
            // Tambahkan keterangan jika tersedia
            ...(stageData.keterangan && { keterangan: stageData.keterangan }),
          });

          hasBeenSaved.current = true;
        } catch (error) {
          console.error("Error saving growth history:", error);
        }
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

            {/* Menggunakan GrowthResultImage Component */}
            <View style={Styles.sectionContainer}>
              <GrowthResultImage imageUri={imageUri} />
            </View>

            <View style={Styles.sectionContainer}>
              <LabelInput
                onLabelSubmit={handleLabelLock}
                isLocked={isLabelLocked}
                initialValue={labelInput}
                onInputChange={setLabelInput}
              />
            </View>

            {/* Perkiraan Tanggal Panen menggunakan HarvestDate Component */}
            {harvestDate && (
              <View style={Styles.sectionContainer}>
                <HarvestDate
                  harvestDate={harvestDate.harvestDate}
                  daysUntilHarvest={harvestDate.daysUntilHarvest}
                />
              </View>
            )}

            {/* Indikator tahap siap panen tetap sama */}
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
                  {/* Konten indikator siap panen tetap sama */}
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

            {/* Menggunakan NutrientList Component - hanya tampilkan jika BUKAN di tahap siap panen */}
            {nutrientRecommendations.length > 0 &&
              prediction.class_id + 1 !== 4 && (
                <View style={Styles.sectionContainer}>
                  <NutrientList nutrients={nutrientRecommendations} />
                </View>
              )}
          </View>
        </ScrollView>
      )}
    </View>
  );
};
