import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";

import { VocabularyItem, AppSettings } from "../types";
import { COLORS } from "../constants";
import { VocabularyGrid } from "../components/VocabularyGrid";
import { loadFavorites, saveFavorites, loadSettings } from "../utils/storage";
import { speak } from "../utils/tts";

interface FavoritesScreenProps {
  navigation: any;
}

export const FavoritesScreen: React.FC<FavoritesScreenProps> = ({
  navigation,
}) => {
  const [favorites, setFavorites] = useState<VocabularyItem[]>([]);
  const [settings, setSettings] = useState<AppSettings>({
    gridSize: 3,
    ttsVoice: "en-US",
    volume: 1.0,
    speechRate: 0.8,
    buttonMode: "sentence",
    showText: true,
    theme: "colorful",
    enableChildFilter: false,
    textSize: "medium",
  });

  useFocusEffect(
    React.useCallback(() => {
      console.log("🔄 Favorites screen focused - reloading data");
      loadData();
    }, [])
  );

  const loadData = async () => {
    const [favoritesData, settingsData] = await Promise.all([
      loadFavorites(),
      loadSettings(),
    ]);

    setFavorites(favoritesData);
    setSettings(settingsData);
  };

  const handleItemPress = async (item: VocabularyItem) => {
    const textToSpeak =
      settings.buttonMode === "sentence" && item.message
        ? item.message
        : item.text;

    try {
      await speak(textToSpeak, settings);
    } catch (error) {
      console.error("TTS failed in favorites:", error);
    }
  };

  const handleItemLongPress = (item: VocabularyItem) => {
    Alert.alert(
      "Remove from Favorites",
      `Remove "${item.text}" from favorites?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: async () => {
            const updatedFavorites = favorites.filter((f) => f.id !== item.id);
            setFavorites(updatedFavorites);
            await saveFavorites(updatedFavorites);
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Text style={{ fontSize: 24, color: COLORS.primary }}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Favorites</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.content}>
        {favorites.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={{ fontSize: 64, color: COLORS.textSecondary }}>☆</Text>
            <Text style={styles.emptyText}>No favorites yet</Text>
            <Text style={styles.emptySubtext}>
              Go to Parent Mode and tap ⭐ on vocabulary items to add them to
              favorites
            </Text>
          </View>
        ) : (
          <VocabularyGrid
            vocabulary={favorites}
            settings={settings}
            onItemPress={handleItemPress}
            onItemLongPress={handleItemLongPress}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backButton: {
    padding: 8,
  },
  addButton: {
    padding: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.text,
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingTop: 20,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 18,
    color: COLORS.textSecondary,
    textAlign: "center",
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: "center",
  },
});
