import React from "react";
import { View, Text } from "react-native";
import { Styles } from "../styles/Styles";

type Props = {
  steps: string[];
};

export const PreventionList: React.FC<Props> = ({ steps }) => {
  return (
    <View style={Styles.preventionContainer}>
      <Text style={Styles.preventionTitle}>Langkah Pencegahan</Text>
      <View style={Styles.preventionContent}>
        {steps.map((step, index) => (
          <View key={index} style={Styles.preventionItem}>
            <Text style={Styles.preventionNumber}>{index + 1}</Text>
            <Text style={Styles.preventionText}>{step}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};
