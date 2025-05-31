import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  BackHandler,
  Alert,
  Image,
  TouchableOpacity,
  Linking, // Tambahkan impor Linking
} from "react-native";
import {
  RouteProp,
  useFocusEffect,
  useNavigation,
} from "@react-navigation/native";
import { supabase } from "../lib/utils/services/supabaseService";
import { Styles } from "../styles/Styles";
import { LoadingScreen } from "../components/LoadingScreen";
import { historyService } from "../lib/utils/services/historyService";
import { LabelInput } from "../components/LabelInput";
import { v4 as uuidv4 } from "uuid";
import { PenyakitInfo } from "../lib/utils/types/models";

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
  const navigation = useNavigation();
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

  // Tambahkan fungsi handleMoreInfo
  const handleMoreInfo = () => {
    if (diseaseInfo) {
      const searchQuery = `penyakit selada ${diseaseName}`;
      const encodedQuery = encodeURIComponent(searchQuery);
      const googleURL = `https://www.google.com/search?q=${encodedQuery}`;

      Linking.openURL(googleURL).catch(() => {
        Alert.alert("Gagal", "Tidak dapat membuka browser");
      });
    } else {
      Alert.alert("Info", "Informasi lebih lanjut tidak tersedia saat ini.");
    }
  };

  return (
    <View style={Styles.container}>
      {isLoading ? (
        <LoadingScreen />
      ) : (
        <ScrollView contentContainerStyle={Styles.scrollContent}>
          <View style={Styles.resultCard}>
            <Text style={Styles.resultTitle}>{diseaseName}</Text>

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

            <View style={Styles.sectionContainer}>
              <View style={Styles.infoContainer}>
                <Text style={Styles.infoTitle}>Informasi Penyakit</Text>
                <View style={Styles.infoContent}>
                  <Text style={Styles.infoText}>
                    {diseaseDescription || "Tidak ada informasi tersedia"}
                  </Text>
                </View>
              </View>
            </View>

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

            {/* Hanya tampilkan Panduan Lebih Lanjut jika penyakitnya BUKAN "Sehat" (ID 3) */}
            {diseaseInfo && diseaseInfo.id !== 3 && (
              <View style={Styles.sectionContainer}>
                <View style={Styles.guideContainer}>
                  <Text style={Styles.guideTitle}>Panduan Lebih Lanjut</Text>
                  <Text style={Styles.guideText}>
                    Dapatkan informasi lengkap tentang cara menangani{" "}
                    {diseaseName} dan mencegah penyebaran lebih lanjut.
                  </Text>
                  <TouchableOpacity
                    style={Styles.guideButton}
                    onPress={handleMoreInfo}
                  >
                    <Text style={Styles.guideButtonText}>
                      Pelajari Lebih Lanjut
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        </ScrollView>
      )}
    </View>
  );
};
