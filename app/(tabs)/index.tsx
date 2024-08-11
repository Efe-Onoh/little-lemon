import { useState, useEffect } from "react";

import { Image, StyleSheet, Platform, Alert } from "react-native";

import { HelloWave } from "@/components/HelloWave";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import AsyncStorage from "@react-native-async-storage/async-storage";

import OnboardingScreen from "@/screens/OnboardingScreen";
import WelcomeScreen from "@/screens/WelcomeScreen";
import Profile from "@/screens/Profile";
import Home from "@/screens/Home";

const Stack = createNativeStackNavigator();

export default function HomeScreen() {
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  useEffect(() => {
    (async () => {
      try {
        const values = await AsyncStorage.multiGet(["firstname", "email"]);

        if (values[0][1] && values[1][1]) {
          setUserLoggedIn(true);
        }
      } catch (e) {
        Alert.alert(`An error occurreed: ${e.message}`);
      }
    })();
  }, []);

  return (
    <Stack.Navigator>
      {!userLoggedIn && <Stack.Screen name="" component={OnboardingScreen} />}
      <Stack.Screen name="Profile" component={Profile} />
      <Stack.Screen name="Welcome" component={Home} />
      <Stack.Screen name="Login" component={OnboardingScreen} />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#ecf0f1",
    padding: 8,
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
});
