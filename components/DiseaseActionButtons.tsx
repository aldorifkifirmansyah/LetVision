import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

type Props = {
  onTakePhoto: () => void;
  onPickImage: () => void;
  isLoading: boolean;
};

export const DiseaseActionButtons: React.FC<Props> = ({
  onTakePhoto,
  onPickImage,
  isLoading,
}) => (
  <View style={styles.fixedContainer}>
    <View style={styles.buttonsRow}>
      <TouchableOpacity
        style={[styles.button, styles.cameraButton]}
        onPress={onTakePhoto}
        disabled={isLoading}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Ionicons
            name="camera"
            size={24}
            color="white"
            style={{ marginRight: 10 }}
          />
          <Text style={styles.buttonText}>Ambil dari Kamera</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.button, styles.galleryButton]}
        onPress={onPickImage}
        disabled={isLoading}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Ionicons
            name="images"
            size={24}
            color="white"
            style={{ marginRight: 10 }}
          />
          <Text style={styles.buttonText}>Pilih dari Galeri</Text>
        </View>
      </TouchableOpacity>
    </View>
  </View>
);

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  fixedContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24, // Extra padding at bottom for devices with home indicator
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -3,
    },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 10,
    zIndex: 1000,
  },
  buttonsRow: {
    flexDirection: "column",
    gap: 12,
  },
  button: {
    width: "100%",
    height: 52,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cameraButton: {
    backgroundColor: "#FF5252",
  },
  galleryButton: {
    backgroundColor: "#FF5252",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
