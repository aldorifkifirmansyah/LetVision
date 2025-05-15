import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { HomeScreen } from "./screens/HomeScreen";
import { GrowthUpScreen } from "./screens/GrowthUpScreen";
import { GrowthResult } from "./screens/GrowthResultScreen";

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: "LetVision" }}
        />
        <Stack.Screen
          name="GrowthUp"
          component={GrowthUpScreen}
          options={{ title: "Deteksi Pertumbuhan" }}
        />
        <Stack.Screen
          name="GrowthResult"
          component={GrowthResult}
          options={{ title: "Hasil Analisis" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
