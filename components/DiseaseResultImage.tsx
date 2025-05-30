import React from "react";
import { View, Image } from "react-native";
import { Styles } from "../styles/Styles";

type Props = {
  imageUri: string;
};

export const DiseaseResultImage: React.FC<Props> = ({ imageUri }) => {
  return (
    <View style={Styles.imageContainer}>
      <Image
        source={{ uri: imageUri }}
        style={Styles.image}
        resizeMode="contain"
      />
    </View>
  );
};
