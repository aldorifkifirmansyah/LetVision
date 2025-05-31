import React from "react";
import { Image, StyleSheet } from "react-native";

export const DiseaseGuideImage = () => (
  <Image
    source={require("../assets/disease-guide.jpg")}
    style={styles.guideImage}
    resizeMode="contain"
  />
);

const styles = StyleSheet.create({
  guideImage: {
    width: "100%",
    height: 300,
    marginBottom: 24,
    borderRadius: 12,
  },
});
