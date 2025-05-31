import React from "react";
import { View, Text } from "react-native";
import { Styles } from "../styles/Styles";

type Props = {
  description: string;
};

export const DiseaseInfo: React.FC<Props> = ({ description }) => {
  return (
    <View style={Styles.infoContainer}>
      <Text style={Styles.infoTitle}>Deskripsi Penyakit</Text>
      <View style={Styles.infoContent}>
        <Text style={Styles.infoText}>{description}</Text>
      </View>
    </View>
  );
};
