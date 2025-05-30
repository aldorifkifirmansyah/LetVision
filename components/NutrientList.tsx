import React from "react";
import { View, Text } from "react-native";
import { Styles } from "../styles/Styles";

interface NutrientItem {
  nama: string;
  deskripsi: string;
}

interface Props {
  nutrients: NutrientItem[];
}

export const NutrientList: React.FC<Props> = ({ nutrients }) => (
  <View style={Styles.nutrientContainer}>
    <Text style={Styles.sectionTitle}>Rekomendasi Nutrisi:</Text>
    {nutrients.map((nutrient, index) => (
      <View key={index} style={Styles.nutrientItem}>
        <Text style={Styles.nutrientName}>{nutrient.nama}</Text>
        <Text style={Styles.nutrientDescription}>{nutrient.deskripsi}</Text>
      </View>
    ))}
  </View>
);
