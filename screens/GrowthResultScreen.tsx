import React, { useEffect, useState, useRef, useMemo } from "react";
import { View, Text, ScrollView, BackHandler, Alert } from "react-native";
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

  useEffect(() => {
    const saveInitialData = async () => {
      if (!hasBeenSaved.current && stageData && !isLoading) {
        const adjustedClassId = prediction.class_id + 1;
        const harvestDateInfo =
          harvestDate || calculateHarvestDate(stageData.estimasi_waktu_panen);

        // Simpan dengan "No Label" di awal
        const savedItem = await historyService.saveHistory({
          id: processingImageId,
          imageUri: imageUri,
          tahapId: adjustedClassId,
          tahapNama: stageData.nama,
          estimasiPanen: stageData.estimasi_waktu_panen,
          detectionType: "growth",
          harvestDate: harvestDateInfo?.harvestDate,
          label: "No Label", // Default label
        });

        hasBeenSaved.current = true;
      }
    };

    saveInitialData();
  }, [stageData, isLoading, prediction?.class_id, imageUri, harvestDate]);

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
        <ScrollView>
          <View style={Styles.card}>
            <View style={Styles.resultContainer}>
              <Text style={Styles.title}>{growthStageName}</Text>
              <GrowthResultImage imageUri={imageUri} />
              {prediction.class_id + 1 !== 4 && (
                <LabelInput
                  onLabelSubmit={handleLabelLock}
                  isLocked={isLabelLocked}
                  initialValue={labelInput}
                  onInputChange={setLabelInput}
                />
              )}
              {harvestEstimation && (
                <HarvestEstimation estimation={harvestEstimation} />
              )}
              {harvestDate && (
                <HarvestDate
                  daysUntilHarvest={harvestDate.daysUntilHarvest}
                  harvestDate={harvestDate.harvestDate}
                />
              )}
              {nutrientRecommendations.length > 0 && (
                <NutrientList nutrients={nutrientRecommendations} />
              )}
            </View>
          </View>
        </ScrollView>
      )}
    </View>
  );
};
