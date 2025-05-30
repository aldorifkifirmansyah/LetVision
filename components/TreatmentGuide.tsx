import React from "react";
import { View, Text, TouchableOpacity, Linking, Alert } from "react-native";
import { Styles } from "../styles/Styles";

type Props = {
  diseaseName: string;
};

export const TreatmentGuide: React.FC<Props> = ({ diseaseName }) => {
  const handleMoreInfo = () => {
    // Encode search term for Google search
    const searchTerm = encodeURIComponent(
      `cara mengatasi penyakit ${diseaseName} pada tanaman selada`
    );
    const url = `https://www.google.com/search?q=${searchTerm}`;

    Linking.openURL(url).catch(() => {
      Alert.alert(
        "Tidak dapat membuka browser",
        "Tidak dapat membuka link pencarian. Silakan coba lagi nanti."
      );
    });
  };

  return (
    <View style={Styles.guideContainer}>
      <Text style={Styles.guideTitle}>Rekomendasi Penanganan</Text>
      <Text style={Styles.guideText}>
        Untuk informasi lebih lengkap tentang cara penanganan penyakit ini, Anda
        dapat berkonsultasi dengan ahli pertanian atau mencari informasi
        tambahan.
      </Text>
      <TouchableOpacity style={Styles.guideButton} onPress={handleMoreInfo}>
        <Text style={Styles.guideButtonText}>Informasi Lebih Lanjut</Text>
      </TouchableOpacity>
    </View>
  );
};
