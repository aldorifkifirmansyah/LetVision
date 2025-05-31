import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { HomeScreen } from "./screens/HomeScreen";
import { GrowthUpScreen } from "./screens/GrowthScreen";
import { GrowthResult } from "./screens/GrowthResultScreen";
import { DiseaseScreen } from "./screens/DiseaseScreen";
import { DiseaseResult } from "./screens/DiseaseResultScreen";
import { HistoryScreen } from "./screens/HistoryScreen";
import { Ionicons } from "@expo/vector-icons";
import { MenuProvider } from "react-native-popup-menu";
import "react-native-get-random-values";
import { GrowthHistoryDetailScreen } from "./screens/GrowthHistoryDetailScreen";
import { DiseaseHistoryDetailScreen } from "./screens/DiseaseHistoryDetailScreen";
import { ArtikelScreen } from "./screens/ArtikelScreen";
import { ArtikelViewerScreen } from "./screens/ArtikelViewerScreen";

const Stack = createStackNavigator();

export default function App() {
  return (
    <MenuProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{ title: "Beranda" }}
          />
          <Stack.Screen
            name="GrowthUp"
            component={GrowthUpScreen}
            options={{ title: "Deteksi Tahap Pertumbuhan" }}
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
            name="History"
            component={HistoryScreen}
            options={{
              title: "Riwayat Deteksi",
              headerTitleStyle: {
                color: "#2C3E50",
                fontSize: 20,
              },
              headerStyle: {
                elevation: 0,
                shadowOpacity: 0,
              },
            }}
          />
          <Stack.Screen
            name="GrowthHistoryDetail"
            component={GrowthHistoryDetailScreen}
            options={{
              title: "Detail Pertumbuhan",
              headerBackTitleVisible: false,
            }}
          />
          <Stack.Screen
            name="DiseaseHistoryDetail"
            component={DiseaseHistoryDetailScreen}
            options={{
              title: "Detail Penyakit",
              headerBackTitleVisible: false,
            }}
          />
          <Stack.Screen
            name="Artikel"
            component={ArtikelScreen}
            options={{
              title: "Artikel",
              headerBackTitleVisible: false,
            }}
          />
          <Stack.Screen
            name="ArtikelViewer"
            component={ArtikelViewerScreen}
            options={({ route }) => ({
              title: route.params.title,
              headerBackTitleVisible: false,
            })}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </MenuProvider>
  );
}
