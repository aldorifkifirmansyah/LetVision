import React from "react";
import { View, ActivityIndicator, Text } from "react-native";
import { Styles } from "../styles/Styles";

export const LoadingScreen = () => (
  <View style={Styles.loadingOverlay}>
    <ActivityIndicator size="large" color="#4CAF50" />
    <Text style={Styles.loadingText}>Loading...</Text>
  </View>
);
