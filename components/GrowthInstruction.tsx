import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { GrowthGuideImage } from "./GrowthGuideImage";
import { Styles } from "../styles/Styles";

const instructions = [
  "Pastikan pencahayaan cukup dan merata (usahakan tanpa bayangan)",
  "Posisikan satu tanaman selada yang akan diperiksa di tengah-tengah frame",
  "Ambil gambar dari atas secara tegak lurus",
  "Pastikan seluruh bagian tanaman selada terlihat dalam frame",
  "Ambil jarak sekitar 30–50 cm dari tanaman",
  "Hindari pengambilan gambar yang blur atau goyang",
  "Jangan sampai ada objek asing yang menutupi tanaman selada"
];


export const GrowthInstruction = () => (
  <View style={Styles.card}>
    <View style={styles.instructionContainer}>
      <Text style={Styles.title}>CARA MENGAMBIL GAMBAR YANG BENAR</Text>
      <GrowthGuideImage />
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
    backgroundColor: "#4CAF50",
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
