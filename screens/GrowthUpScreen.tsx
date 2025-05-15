import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Camera } from "expo-camera";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

type RootStackParamList = {
  GrowthResult: { predictions: any };
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
      } as any);

      const response = await fetch("http://192.168.18.19:5000/detect-growth", {
        method: "POST",
        body: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const result = await response.json();
      console.log("AI Analysis Result:", result);

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
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <View style={styles.instructionContainer}>
          <Text style={styles.title}>CARA MENGAMBIL GAMBAR YANG BENAR</Text>
          <Image
            source={require("../assets/growth-guide.jpg")}
            style={styles.guideImage}
            resizeMode="contain"
          />
          <View style={styles.instructionList}>
            <View style={styles.instructionItem}>
              <View style={styles.bullet}>
                <Text style={styles.bulletText}>1</Text>
              </View>
              <Text style={styles.instruction}>Pastikan pencahayaan cukup</Text>
            </View>
            <View style={styles.instructionItem}>
              <View style={styles.bullet}>
                <Text style={styles.bulletText}>2</Text>
              </View>
              <Text style={styles.instruction}>
                Posisikan objek di tengah frame
              </Text>
            </View>
            <View style={styles.instructionItem}>
              <View style={styles.bullet}>
                <Text style={styles.bulletText}>3</Text>
              </View>
              <Text style={styles.instruction}>
                Jaga jarak 30-50cm dari objek
              </Text>
            </View>
            <View style={styles.instructionItem}>
              <View style={styles.bullet}>
                <Text style={styles.bulletText}>4</Text>
              </View>
              <Text style={styles.instruction}>
                Hindari pengambilan foto yang blur
              </Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#4CAF50" />
            <Text style={styles.loadingText}>Tunggu sebentar yah 😋</Text>
          </View>
        ) : (
          <>
            <TouchableOpacity
              style={[styles.button, styles.galleryButton]}
              onPress={pickImage}
            >
              <Text style={styles.buttonText}>Pilih dari Galeri</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.cameraButton]}
              onPress={takePhoto}
            >
              <Text style={styles.buttonText}>Ambil dari Kamera</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    margin: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  instructionContainer: {
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2C3E50",
    marginBottom: 20,
    textAlign: "center",
  },
  guideImage: {
    width: "100%",
    height: 300,
    marginBottom: 24,
    borderRadius: 12,
  },
  instructionList: {
    width: "100%",
    gap: 16,
  },
  instructionItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  bullet: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#4CAF50",
    justifyContent: "center",
    alignItems: "center",
  },
  bulletText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  instruction: {
    flex: 1,
    fontSize: 16,
    color: "#34495E",
    lineHeight: 24,
  },
  buttonContainer: {
    padding: 16,
    gap: 12,
  },
  button: {
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  galleryButton: {
    backgroundColor: "#4CAF50",
  },
  cameraButton: {
    backgroundColor: "#2196F3",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  loadingContainer: {
    alignItems: "center",
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
  },
});

export default GrowthUpScreen;
