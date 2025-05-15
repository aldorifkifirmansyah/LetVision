import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, ScrollView } from "react-native";
import {
  RouteProp,
  useNavigation,
  NavigationProp,
} from "@react-navigation/native";
import { supabase } from "../lib/utils/services/supabase";

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

export const GrowthResult: React.FC<Props> = ({ route }) => {
  // Remove the navigation constant if not needed
  const { predictions, imageUri } = route.params;
  const prediction = predictions[0];
  const [growthStageName, setGrowthStageName] = useState<string>("");
  const [harvestEstimation, setHarvestEstimation] = useState<string>("");
  const [nutrientRecommendations, setNutrientRecommendations] = useState<
    Array<{
      nama: string;
      deskripsi: string;
    }>
  >([]);

  // Remove custom navigation handling, let default back button behavior work

  useEffect(() => {
    const fetchGrowthStageInfo = async () => {
      try {
        const adjustedClassId = prediction.class_id + 1;

        // Fetch growth stage info
        const { data: stageData, error: stageError } = await supabase
          .from("tahap_pertumbuhan")
          .select("nama, estimasi_waktu_panen")
          .eq("id", adjustedClassId)
          .single();

        if (stageError) {
          console.error("Error fetching growth stage:", stageError);
          setGrowthStageName(prediction.class_name);
          setHarvestEstimation("");
        } else if (stageData) {
          setGrowthStageName(stageData.nama);
          setHarvestEstimation(stageData.estimasi_waktu_panen);

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
            console.log("Adjusted Class ID:", adjustedClassId); // Debug tahap_id
            console.log(
              "Raw Nutrient Data:",
              JSON.stringify(nutrientData, null, 2)
            ); // Debug full response
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
      }
    };

    fetchGrowthStageInfo();
  }, [prediction.class_id]);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <View style={styles.resultContainer}>
          <Text style={styles.title}>{growthStageName}</Text>

          <View style={styles.imageContainer}>
            <Image
              source={{ uri: imageUri }}
              style={styles.image}
              resizeMode="contain"
            />
          </View>

          {harvestEstimation && (
            <View style={styles.estimationContainer}>
              <Text style={styles.estimationText}>Estimasi Waktu Panen:</Text>
              <Text
                style={styles.estimationValue}
                adjustsFontSizeToFit={true}
                numberOfLines={1}
              >
                {harvestEstimation}
              </Text>
            </View>
          )}

          {nutrientRecommendations.length > 0 && (
            <View style={styles.nutrientContainer}>
              <Text style={styles.sectionTitle}>Rekomendasi Nutrisi:</Text>
              {nutrientRecommendations.map((nutrient, index) => (
                <View key={index} style={styles.nutrientItem}>
                  <Text style={styles.nutrientName}>{nutrient.nama}</Text>
                  <Text style={styles.nutrientDescription}>
                    {nutrient.deskripsi}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    margin: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  resultContainer: {
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2C3E50",
    marginBottom: 20,
    textAlign: "center",
  },
  imageContainer: {
    width: "100%",
    height: 300,
    marginBottom: 24,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#f5f5f5",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  estimationContainer: {
    width: "100%",
    padding: 16,
    backgroundColor: "#F8F9FA",
    borderRadius: 12,
    alignItems: "center",
  },
  estimationText: {
    fontSize: 16,
    color: "#34495E",
    marginBottom: 8,
  },
  estimationValue: {
    fontSize: 20,
    fontWeight: "600",
    color: "#4CAF50",
    textAlign: "center",
    minWidth: "80%", // Memberikan ruang yang cukup untuk text
  },
  nutrientContainer: {
    width: "100%",
    marginTop: 24,
    padding: 16,
    backgroundColor: "#F8F9FA",
    borderRadius: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2C3E50",
    marginBottom: 16,
  },
  nutrientItem: {
    marginBottom: 12,
    padding: 12,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: "#4CAF50",
  },
  nutrientName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2C3E50",
    marginBottom: 4,
  },
  nutrientDescription: {
    fontSize: 14,
    color: "#34495E",
    lineHeight: 20,
  },
});
