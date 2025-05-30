import React from "react";
import { View, Image } from "react-native";
import { Styles } from "../styles/Styles";

interface Props {
  imageUri: string;
}

export const GrowthResultImage: React.FC<Props> = ({ imageUri }) => (
  <View style={Styles.imageContainer}>
    <Image
      source={{ uri: imageUri }}
      style={Styles.image}
      resizeMode="contain"
    />
  </View>
);
