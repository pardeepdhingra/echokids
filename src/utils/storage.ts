import AsyncStorage from "@react-native-async-storage/async-storage";
import { AppState, VocabularyItem, AppSettings, Category } from "../types";
import {
  DEFAULT_SETTINGS,
  DEFAULT_VOCABULARY,
  DEFAULT_CATEGORIES,
} from "../constants";

const STORAGE_KEYS = {
  VOCABULARY: "echo_kids_vocabulary",
  SETTINGS: "echo_kids_settings",
  CATEGORIES: "echo_kids_categories",
  FAVORITES: "echo_kids_favorites",
};

export const loadVocabulary = async (): Promise<VocabularyItem[]> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.VOCABULARY);
    return data ? JSON.parse(data) : DEFAULT_VOCABULARY;
  } catch (error) {
    return DEFAULT_VOCABULARY;
  }
};

export const saveVocabulary = async (
  vocabulary: VocabularyItem[]
): Promise<void> => {
  try {
    await AsyncStorage.setItem(
      STORAGE_KEYS.VOCABULARY,
      JSON.stringify(vocabulary)
    );
  } catch (error) {
    console.error("Error saving vocabulary:", error);
  }
};

export const loadSettings = async (): Promise<AppSettings> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.SETTINGS);
    console.log("🔧 Storage: Loading settings, data:", data);
    const settings = data ? JSON.parse(data) : DEFAULT_SETTINGS;
    console.log("🔧 Storage: Loaded settings:", settings);
    return settings;
  } catch (error) {
    console.error("🔧 Storage: Error loading settings:", error);
    return DEFAULT_SETTINGS;
  }
};

export const saveSettings = async (settings: AppSettings): Promise<void> => {
  try {
    console.log("🔧 Storage: Saving settings:", settings);
    await AsyncStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    console.log("🔧 Storage: Settings saved successfully");
  } catch (error) {
    console.error("🔧 Storage: Error saving settings:", error);
  }
};

export const loadCategories = async (): Promise<Category[]> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.CATEGORIES);
    return data ? JSON.parse(data) : DEFAULT_CATEGORIES;
  } catch (error) {
    return DEFAULT_CATEGORIES;
  }
};

export const saveCategories = async (categories: Category[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(
      STORAGE_KEYS.CATEGORIES,
      JSON.stringify(categories)
    );
  } catch (error) {
    console.error("Error saving categories:", error);
  }
};

export const loadFavorites = async (): Promise<VocabularyItem[]> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.FAVORITES);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    return [];
  }
};

export const saveFavorites = async (
  favorites: VocabularyItem[]
): Promise<void> => {
  try {
    await AsyncStorage.setItem(
      STORAGE_KEYS.FAVORITES,
      JSON.stringify(favorites)
    );
  } catch (error) {
    console.error("Error saving favorites:", error);
  }
};

export const clearAllData = async (): Promise<void> => {
  try {
    await AsyncStorage.multiRemove(Object.values(STORAGE_KEYS));
  } catch (error) {
    console.error("Error clearing data:", error);
  }
};
