import React from "react";
import { Image, StyleSheet } from "react-native";

export const GrowthGuideImage = () => (
  <Image
    source={require("../assets/growth-guide.jpg")}
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
