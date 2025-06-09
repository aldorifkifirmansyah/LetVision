import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { MenuButton } from "../components/MenuButton";
import { useNavigation } from "@react-navigation/native";

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation<any>();

  return (
    <View style={styles.container}>
      {/* Ganti teks LetVision dengan logo */}
      <View style={styles.headerContainer}>
        <Image
          source={require("../assets/logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      <MenuButton
        title="Deteksi Pertumbuhan"
        onPress={() => navigation.navigate("GrowthUp")}
      />
      <MenuButton
        title="Deteksi Penyakit"
        onPress={() => navigation.navigate("Disease")}
      />
      <MenuButton
        title="Riwayat Deteksi"
        onPress={() => navigation.navigate("History")}
      />
      <MenuButton
        title="Artikel"
        onPress={() => navigation.navigate("Artikel")}
      />
      {/* Fitur lain bisa ditambahkan di sini */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  logo: {
    width: 240,
    height: 120,
  }
});
