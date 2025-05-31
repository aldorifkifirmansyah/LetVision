import React from "react";
import { Image, View } from "react-native";
import { Styles } from "../styles/Styles";

type Props = {
  imageUri: string;
};

export const DiseaseResultImage: React.FC<Props> = ({ imageUri }) => {
  return (
    <View style={Styles.resultImageContainer}>
      <Image
        source={{ uri: imageUri }}
        style={Styles.resultImage}
        resizeMode="cover"
      />
    </View>
  );
};
