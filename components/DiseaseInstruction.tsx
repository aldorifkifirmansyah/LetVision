import React from "react";
import { View, Text } from "react-native";
import { Styles } from "../styles/Styles";

export const DiseaseInstruction = () => {
  return (
    <View style={Styles.instructionContainer}>
      <Text style={Styles.instructionTitle}>Deteksi Penyakit Daun Selada</Text>
      <Text style={Styles.instructionText}>
        Ambil gambar yang jelas dari daun selada yang terindikasi memiliki
        penyakit:
      </Text>
      <View style={Styles.instructionList}>
        <Text style={Styles.instructionItem}>
          • Pastikan daun terlihat jelas dan tidak terhalang
        </Text>
        <Text style={Styles.instructionItem}>
          • Ambil foto pada area yang menunjukkan gejala penyakit
        </Text>
        <Text style={Styles.instructionItem}>
          • Hindari bayangan yang menutupi area dengan gejala
        </Text>
        <Text style={Styles.instructionItem}>
          • Pastikan pencahayaan cukup terang
        </Text>
      </View>
    </View>
  );
};
