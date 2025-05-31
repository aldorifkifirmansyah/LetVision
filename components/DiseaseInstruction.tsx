import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { DiseaseGuideImage } from "./DiseaseGuideImage";
import { Styles } from "../styles/Styles";

const instructions = [
  "Pastikan daun terlihat jelas dan tidak terhalang",
  "Ambil foto pada area yang menunjukkan gejala penyakit",
  "Hindari bayangan yang menutupi area dengan gejala",
  "Pastikan pencahayaan cukup terang",
];

export const DiseaseInstruction = () => (
  <View style={Styles.card}>
    <View style={styles.instructionContainer}>
      <Text style={Styles.title}>CARA MENGAMBIL GAMBAR PENYAKIT DAUN</Text>
      <DiseaseGuideImage />
      <View style={styles.instructionList}>
        {instructions.map((instruction, index) => (
          <View key={index} style={styles.instructionItem}>
            <View style={styles.bullet}>
              <Text style={styles.bulletText}>{index + 1}</Text>
            </View>
            <Text style={styles.instruction}>{instruction}</Text>
          </View>
        ))}
      </View>
    </View>
  </View>
);

const styles = StyleSheet.create({
  instructionContainer: {
    alignItems: "center",
  },
  instructionList: {
    width: "100%",
    gap: 16,
  },
  instructionItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  bullet: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#FF5252", // Warna yang berbeda untuk deteksi penyakit
    justifyContent: "center",
    alignItems: "center",
  },
  bulletText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  instruction: {
    flex: 1,
    fontSize: 16,
    color: "#34495E",
    lineHeight: 24,
  },
});
