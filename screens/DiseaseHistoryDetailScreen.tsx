import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  BackHandler,
  TouchableOpacity, // Mungkin masih diperlukan untuk UI lain
  Alert,
} from "react-native";
import { RouteProp } from "@react-navigation/native";
import { Styles } from "../styles/Styles";
import { LoadingScreen } from "../components/LoadingScreen";
import { supabase } from "../lib/utils/services/supabaseService";
import { isDiseaseHistoryItem } from "../lib/utils/types/models";
import { TreatmentGuide } from "../components/TreatmentGuide";

type RootStackParamList = {
  DiseaseHistoryDetail: {
    historyItem: any;
  };
};

type DiseaseHistoryDetailRouteProp = RouteProp<
  RootStackParamList,
  "DiseaseHistoryDetail"
>;

type Props = {
  route: DiseaseHistoryDetailRouteProp;
};

export const DiseaseHistoryDetailScreen: React.FC<Props> = ({ route }) => {
  const { historyItem } = route.params;
  const [isLoading, setIsLoading] = useState(false);
  const [preventionSteps, setPreventionSteps] = useState<string[]>([]);

  // Ambil langkah penanganan dari database
  useEffect(() => {
    const fetchPreventionSteps = async () => {
      if (!isDiseaseHistoryItem(historyItem)) return;

      try {
        const { data: preventionData, error: preventionError } = await supabase
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
          .eq("penyakit_id", historyItem.penyakitId);

        if (!preventionError && preventionData) {
          const steps = preventionData.map((item) => item.penanganan.langkah);
          setPreventionSteps(steps);
        }
      } catch (error) {
        console.error("Error fetching prevention steps:", error);
      }
    };

    fetchPreventionSteps();
  }, [historyItem]);

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

  if (!isDiseaseHistoryItem(historyItem)) {
    return (
      <View style={Styles.container}>
        <Text>Data tidak valid</Text>
      </View>
    );
  }

  return (
    <View style={Styles.container}>
      {isLoading ? (
        <LoadingScreen />
      ) : (
        <ScrollView contentContainerStyle={Styles.scrollContent}>
          <View style={Styles.resultCard}>
            <Text style={Styles.resultTitle}>{historyItem.penyakitNama}</Text>

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
                      historyItem.label === "No Label"
                        ? Styles.labelDefaultText
                        : Styles.labelText
                    }
                  >
                    {historyItem.label || "No Label"}
                  </Text>
                </View>
              </View>
            </View>

            {/* Informasi Penyakit */}
            <View style={Styles.sectionContainer}>
              <View style={Styles.infoContainer}>
                <Text style={Styles.infoTitle}>Informasi Penyakit</Text>
                <View style={Styles.infoContent}>
                  <Text style={Styles.infoText}>
                    {historyItem.deskripsi || "Tidak ada informasi tersedia"}
                  </Text>
                </View>
              </View>
            </View>

            {/* Langkah Penanganan */}
            {preventionSteps.length > 0 && (
              <View style={Styles.sectionContainer}>
                <View style={Styles.preventionContainer}>
                  <Text style={Styles.preventionTitle}>Langkah Penanganan</Text>
                  <View style={Styles.preventionContent}>
                    {preventionSteps.map((step, index) => (
                      <View key={index} style={Styles.preventionItem}>
                        <Text style={Styles.preventionNumber}>{index + 1}</Text>
                        <Text style={Styles.preventionText}>{step}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              </View>
            )}

            {/* 4. Ganti bagian "Panduan Lebih Lanjut" dengan TreatmentGuide */}
            {/* Panduan Lebih Lanjut - hanya tampilkan jika penyakitnya BUKAN "Sehat" (ID 3) */}
            {historyItem.penyakitId !== 3 && (
              <View style={Styles.sectionContainer}>
                <TreatmentGuide diseaseName={historyItem.penyakitNama} />
              </View>
            )}
          </View>
        </ScrollView>
      )}
    </View>
  );
};
