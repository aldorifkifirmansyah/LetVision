import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Styles } from "../styles/Styles";

type Props = {
  diseaseName: string;
};

export const TreatmentGuide: React.FC<Props> = ({ diseaseName }) => {
  const navigation = useNavigation<any>();

  const handleMoreInfo = () => {
    navigation.navigate("Artikel");
  };

  return (
    <View style={Styles.guideContainer}>
      <Text style={Styles.guideTitle}>Rekomendasi Penanganan</Text>
      <Text style={Styles.guideText}>
        Untuk informasi lebih lengkap tentang cara penanganan penyakit ini, Anda
        dapat membaca artikel-artikel terkait di fitur Artikel LetVision.
      </Text>
      <TouchableOpacity style={Styles.guideButton} onPress={handleMoreInfo}>
        <Text style={Styles.guideButtonText}>Buka Halaman Artikel</Text>
      </TouchableOpacity>
    </View>
  );
};
