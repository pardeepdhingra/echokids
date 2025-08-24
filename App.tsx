import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { ParentVocabularyScreen } from "./src/screens/ParentVocabularyScreen";
import { ChildVocabularyScreen } from "./src/screens/ChildVocabularyScreen";
import { SettingsScreen } from "./src/screens/SettingsScreen";
import { FavoritesScreen } from "./src/screens/FavoritesScreen";
import { ModeSelectionScreen } from "./src/screens/ModeSelectionScreen";

const Stack = createStackNavigator();

export default function App() {
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
