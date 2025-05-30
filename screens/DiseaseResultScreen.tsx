import React, { useEffect, useState, useRef } from "react";
import { View, Text, ScrollView, BackHandler, Alert } from "react-native";
import { RouteProp, useFocusEffect } from "@react-navigation/native";
import { supabase } from "../lib/utils/services/supabaseService";
import { DiseaseResultImage } from "../components/DiseaseResultImage";
import { DiseaseInfo } from "../components/DiseaseInfo";
import { PreventionList } from "../components/PreventionList";
import { TreatmentGuide } from "../components/TreatmentGuide";
import { Styles } from "../styles/Styles";
import { LoadingScreen } from "../components/LoadingScreen";
import { historyService } from "../lib/utils/services/historyService";
import { LabelInput } from "../components/LabelInput";
import { v4 as uuidv4 } from "uuid";
import { PenyakitInfo, PenangananItem } from "../lib/utils/types/models";

type PredictionType = {
  bbox: number[];
  class_id: number;
  class_name: string;
  confidence: number;
  id: number;
};

type RootStackParamList = {
  DiseaseResult: {
    predictions: PredictionType[];
    imageUri: string;
  };
};

type DiseaseResultRouteProp = RouteProp<RootStackParamList, "DiseaseResult">;

type Props = {
  route: DiseaseResultRouteProp;
};

export const DiseaseResult: React.FC<Props> = ({ route }) => {
  const { predictions, imageUri } = route.params;
  const prediction = predictions[0];
  const [isLoading, setIsLoading] = useState(true);
  const [diseaseName, setDiseaseName] = useState<string>("");
  const [diseaseDescription, setDiseaseDescription] = useState<string>("");
  const [preventionSteps, setPreventionSteps] = useState<string[]>([]);
  const [diseaseInfo, setDiseaseInfo] = useState<PenyakitInfo | null>(null);
  const [labelInput, setLabelInput] = useState("");
  const [isLabelLocked, setIsLabelLocked] = useState(false);
  const [processingImageId, setProcessingImageId] = useState<string>(uuidv4());
  const hasBeenSaved = useRef(false);

  useEffect(() => {
    const fetchDiseaseInfo = async () => {
      setIsLoading(true);
      try {
        const adjustedClassId = prediction.class_id + 1;

        // Fetch penyakit info
        const { data: penyakitData, error: penyakitError } = await supabase
          .from("penyakit_info")
          .select("*")
          .eq("id", adjustedClassId)
          .single();

        if (penyakitError) {
          setDiseaseName(prediction.class_name);
          setDiseaseDescription("");
        } else if (penyakitData) {
          setDiseaseName(penyakitData.nama);
          setDiseaseDescription(penyakitData.deskripsi);
          setDiseaseInfo(penyakitData);

          // Fetch prevention steps
          const { data: preventionData, error: preventionError } =
            await supabase
              .from("penyakit_penanganan")
              .select(
                `
              penanganan_id,
              penanganan!inner (
                id,
                langkah
              )
            `
              )
              .eq("penyakit_id", adjustedClassId);

          if (!preventionError && preventionData) {
            const steps = preventionData.map((item) => item.penanganan.langkah);
            setPreventionSteps(steps);
          }
        }
      } catch (error) {
        setDiseaseName(prediction.class_name);
        setDiseaseDescription("");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDiseaseInfo();
  }, [prediction.class_id]);

  // Handle label update
  const handleLabelLock = async (newLabel: string) => {
    if (newLabel.trim()) {
      try {
        const trimmedLabel = newLabel.trim();

        // Update label di history berdasarkan ID
        await historyService.updateLabel(processingImageId, trimmedLabel);

        // Update state lokal
        setLabelInput(trimmedLabel);
        setIsLabelLocked(true);

        Alert.alert("Label Disimpan", "Label berhasil disimpan");
      } catch (error) {
        Alert.alert(
          "Gagal Menyimpan",
          "Terjadi kesalahan saat menyimpan label"
        );
      }
    }
  };

  // Save initial data when screen is loaded
  useEffect(() => {
    const saveInitialData = async () => {
      if (!hasBeenSaved.current && diseaseInfo && !isLoading) {
        // Simpan dengan "No Label" di awal
        await historyService.saveHistory({
          id: processingImageId,
          imageUri: imageUri,
          penyakitId: diseaseInfo.id,
          penyakitNama: diseaseInfo.nama,
          deskripsi: diseaseInfo.deskripsi,
          detectionType: "disease",
          label: "No Label", // Default label
        });

        hasBeenSaved.current = true;
      }
    };

    saveInitialData();
  }, [diseaseInfo, isLoading, imageUri]);

  // Handle back button
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        return false;
      }
    );

    return () => backHandler.remove();
  }, []);

  return (
    <View style={Styles.container}>
      {isLoading ? (
        <LoadingScreen />
      ) : (
        <ScrollView>
          <View style={Styles.card}>
            <View style={Styles.resultContainer}>
              <Text style={Styles.title}>{diseaseName}</Text>
              <DiseaseResultImage imageUri={imageUri} />

              <LabelInput
                onLabelSubmit={handleLabelLock}
                isLocked={isLabelLocked}
                initialValue={labelInput}
                onInputChange={setLabelInput}
              />

              <DiseaseInfo description={diseaseDescription} />

              {preventionSteps.length > 0 && (
                <PreventionList steps={preventionSteps} />
              )}

              <TreatmentGuide diseaseName={diseaseName} />
            </View>
          </View>
        </ScrollView>
      )}
    </View>
  );
};
