import React, { useState } from "react";
import { ScrollView, Alert, View, ActivityIndicator, Text } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Camera } from "expo-camera";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { GrowthInstruction } from "../components/GrowthInstruction";
import { GrowthActionButtons } from "../components/GrowthActionButtons";
import { Styles } from "../styles/Styles";
import { BASE_URL } from "../lib/utils/services/serverService";

type RootStackParamList = {
  GrowthResult: { predictions: any; imageUri: string };
};

type NavigationProp = StackNavigationProp<RootStackParamList, "GrowthResult">;

export const GrowthUpScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  React.useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const uploadImage = async (uri: string) => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("image", {
        uri: uri,
        type: "image/jpeg",
        name: "upload.jpg",
      } as unknown as Blob);

      const response = await fetch(`${BASE_URL}/detect-growth`, {
        method: "POST",
        body: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const result = await response.json();

      if (result.predictions && result.predictions.length === 0) {
        Alert.alert("Gagal", "Deteksi gagal. Silakan coba lagi.", [
          { text: "OK" },
        ]);
      } else {
        navigation.navigate("GrowthResult", {
          predictions: result.predictions,
          imageUri: uri,
        });
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      Alert.alert("Gagal", "Deteksi gagal. Silakan coba lagi.", [
        { text: "OK" },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [3, 4],
      quality: 1,
    });

    if (!result.canceled) {
      await uploadImage(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [3, 4],
      quality: 1,
    });

    if (!result.canceled) {
      await uploadImage(result.assets[0].uri);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={Styles.container}>
        <GrowthInstruction />
        <GrowthActionButtons
          isLoading={false} // Remove loading state from buttons
          onPickImage={pickImage}
          onTakePhoto={takePhoto}
        />
      </ScrollView>
      {isLoading && (
        <View style={Styles.loadingOverlay}>
          <View style={Styles.loadingContainer}>
            <ActivityIndicator size="large" color="#4CAF50" />
            <Text style={Styles.loadingText}>Loading...</Text>
          </View>
        </View>
      )}
    </View>
  );
};

export default GrowthUpScreen;
