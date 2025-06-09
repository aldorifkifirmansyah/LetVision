import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { MenuProvider } from "react-native-popup-menu";

import { Ionicons } from "@expo/vector-icons";

// Import screen
import { SplashScreen } from "./screens/SplashScreen";
import { HomeScreen } from "./screens/HomeScreen";
import { GrowthUpScreen } from "./screens/GrowthScreen";
import { GrowthResult } from "./screens/GrowthResultScreen";
import { DiseaseScreen } from "./screens/DiseaseScreen";
import { DiseaseResult } from "./screens/DiseaseResultScreen";
import { ArtikelScreen } from "./screens/ArtikelScreen";
import { ArtikelViewerScreen } from "./screens/ArtikelViewerScreen"; // Pastikan file ini ada
import { HistoryScreen } from "./screens/HistoryScreen";
import { GrowthHistoryDetailScreen } from "./screens/GrowthHistoryDetailScreen";
import { DiseaseHistoryDetailScreen } from "./screens/DiseaseHistoryDetailScreen";

// Hanya gunakan Stack Navigator
const Stack = createStackNavigator();

export default function App() {
  return (
    <MenuProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Splash"
          screenOptions={{
            headerTintColor: "#4CAF50",
            headerTitleStyle: { fontWeight: "bold" },
            headerBackTitleVisible: false,
          }}
        >
          {/* SplashScreen - layar pertama yang dimuat */}
          <Stack.Screen
            name="Splash"
            component={SplashScreen}
            options={{ headerShown: false }}
          />

          {/* HomeScreen - layar setelah splash selesai */}
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{
              title: "LetVision",
              // Perbaikan sintaks headerLeft
              headerLeft: () => null, // Sintaks yang benar
            }}
          />

          {/* Fitur Utama */}
          <Stack.Screen
            name="GrowthUp"
            component={GrowthUpScreen}
            options={{ title: "Deteksi Pertumbuhan" }}
          />
          <Stack.Screen
            name="GrowthResult"
            component={GrowthResult}
            options={{ title: "Hasil Deteksi Pertumbuhan" }}
          />
          <Stack.Screen
            name="Disease"
            component={DiseaseScreen}
            options={{ title: "Deteksi Penyakit" }}
          />
          <Stack.Screen
            name="DiseaseResult"
            component={DiseaseResult}
            options={{ title: "Hasil Deteksi Penyakit" }}
          />
          <Stack.Screen
            name="Artikel"
            component={ArtikelScreen}
            options={{ title: "Artikel" }}
          />
          <Stack.Screen
            name="ArtikelViewer"
            component={ArtikelViewerScreen}
            options={{ title: "Artikel" }}
          />

          {/* Riwayat */}
          <Stack.Screen
            name="History"
            component={HistoryScreen}
            options={{ title: "Riwayat" }}
          />
          <Stack.Screen
            name="GrowthHistoryDetail"
            component={GrowthHistoryDetailScreen}
            options={{ title: "Detail Pertumbuhan" }}
          />
          <Stack.Screen
            name="DiseaseHistoryDetail"
            component={DiseaseHistoryDetailScreen}
            options={{ title: "Detail Penyakit" }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </MenuProvider>
  );
}
