import React from "react";
import { View, Text, StyleSheet } from "react-native";

interface Props {
  estimationText: string;
}

export const HarvestEstimation: React.FC<Props> = ({ estimationText }) => {
  return (
    <View style={styles.estimationContainer}>
      <Text style={styles.estimationTitle}>Estimasi Pertumbuhan:</Text>
      <Text style={styles.estimationValue}>{estimationText}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  estimationContainer: {
    padding: 16,
    backgroundColor: "#E8F5E9",
    borderRadius: 8,
  },
  estimationTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2E7D32",
    marginBottom: 8,
  },
  estimationValue: {
    fontSize: 14,
    color: "#1B5E20",
  },
});
