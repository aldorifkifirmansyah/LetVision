import React from "react";
import { View, Image, StyleSheet } from "react-native";

interface Props {
  imageUri: string;
}

export const GrowthResultImage: React.FC<Props> = ({ imageUri }) => {
  return (
    <View style={styles.resultImageContainer}>
      <Image
        source={{ uri: imageUri }}
        style={styles.resultImage}
        resizeMode="cover"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  resultImageContainer: {
    width: "100%",
    height: 250,
    borderRadius: 8,
    overflow: "hidden",
  },
  resultImage: {
    width: "100%",
    height: "100%",
  },
});
