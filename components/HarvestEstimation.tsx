import React from "react";
import { View, Text } from "react-native";
import { Styles } from "../styles/Styles";

interface Props {
  estimation: string;
}

export const HarvestEstimation: React.FC<Props> = ({ estimation }) => (
  <View style={Styles.estimationContainer}>
    <Text style={Styles.estimationText}>Estimasi Waktu Panen:</Text>
    <Text
      style={Styles.estimationValue}
      adjustsFontSizeToFit={true}
      numberOfLines={1}
    >
      {estimation}
    </Text>
  </View>
);
