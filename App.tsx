import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { ParentVocabularyScreen } from "./src/screens/ParentVocabularyScreen";
import { ChildVocabularyScreen } from "./src/screens/ChildVocabularyScreen";
import { SettingsScreen } from "./src/screens/SettingsScreen";
import { FavoritesScreen } from "./src/screens/FavoritesScreen";
import { ModeSelectionScreen } from "./src/screens/ModeSelectionScreen";

const Stack = createStackNavigator();

export default function App() {
  useEffect(() => {
    const initializeAudio = async () => {
      try {
        const { Audio } = await import("expo-av");
        console.log("🔊 Initializing app audio session...");
        
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
          staysActiveInBackground: false,
          playsInSilentModeIOS: true,
        });
        
        console.log("✅ App audio session initialized");
      } catch (error) {
        console.error("❌ App audio initialization failed:", error);
        // Try a simpler configuration
        try {
          console.log("🔊 Trying simpler app audio session...");
          await Audio.setAudioModeAsync({
            allowsRecordingIOS: false,
            playsInSilentModeIOS: true,
          });
          console.log("✅ Simple app audio session initialized");
        } catch (simpleError) {
          console.error("❌ Simple app audio also failed:", simpleError);
        }
      }
    };

    initializeAudio();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="ModeSelection"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="ModeSelection" component={ModeSelectionScreen} />
        <Stack.Screen
          name="ParentVocabulary"
          component={ParentVocabularyScreen}
        />
        <Stack.Screen
          name="ChildVocabulary"
          component={ChildVocabularyScreen}
        />
        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen name="Favorites" component={FavoritesScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
