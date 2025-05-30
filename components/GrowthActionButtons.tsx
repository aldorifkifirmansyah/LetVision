import React from "react";
import {
  View,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { Styles } from "../styles/Styles";

interface GrowthActionButtonsProps {
  isLoading: boolean;
  onPickImage: () => void;
  onTakePhoto: () => void;
}

export const GrowthActionButtons: React.FC<GrowthActionButtonsProps> = ({
  isLoading,
  onPickImage,
  onTakePhoto,
}) => (
  <View style={Styles.buttonContainer}>
    {isLoading ? (
      <View style={Styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={Styles.loadingText}>Tunggu sebentar yah 😋</Text>
      </View>
    ) : (
      <>
        <TouchableOpacity
          style={[Styles.button, styles.galleryButton]}
          onPress={onPickImage}
        >
          <Text style={Styles.buttonText}>Pilih dari Galeri</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[Styles.button, styles.cameraButton]}
          onPress={onTakePhoto}
        >
          <Text style={Styles.buttonText}>Ambil dari Kamera</Text>
        </TouchableOpacity>
      </>
    )}
  </View>
);

const styles = StyleSheet.create({
  galleryButton: {
    backgroundColor: "#4CAF50",
  },
  cameraButton: {
    backgroundColor: "#2196F3",
  },
});
