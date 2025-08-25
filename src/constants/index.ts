import {
  AppSettings,
  VocabularyItem,
  Category,
  ButtonTemplate,
} from "../types";
import { CATEGORIES, getAllCategories } from "./categories";
import { getAllVocabularyItems, getAllVocabulary } from "./vocabulary";

export const DEFAULT_SETTINGS: AppSettings = {
  gridSize: 3,
  ttsVoice: "en-US",
  volume: 1.0,
  speechRate: 0.8,
  buttonMode: "two-word",
  showText: true,
  theme: "colorful",
  enableChildFilter: false,
  textSize: "large",
  hiddenCategories: [],
  childAge: undefined,
  hasShownAgePrompt: false,
  symbolType: "emoji",
  language: "en",
};

export let VOICE_OPTIONS: Array<{
  id: string;
  name: string;
  language: string;
  category: string;
}> = [];

export const updateVoiceOptions = (availableVoices: any[]) => {
  if (!availableVoices || availableVoices.length === 0) {
    VOICE_OPTIONS = [
      {
        id: "en-US",
        name: "English (US)",
        language: "en-US",
        category: "adult-female",
      },
      {
        id: "en-GB",
        name: "English (UK)",
        language: "en-GB",
        category: "adult-female",
      },
      {
        id: "en-AU",
        name: "English (Australia)",
        language: "en-AU",
        category: "adult-female",
      },
    ];
    return;
  }

  VOICE_OPTIONS = availableVoices.map((voice) => {
    const name = voice.name || voice.identifier;
    const lowerName = name.toLowerCase();

    let category = "adult-female";
    if (
      lowerName.includes("male") ||
      lowerName.includes("alex") ||
      lowerName.includes("david") ||
      lowerName.includes("james")
    ) {
      category = "adult-male";
    } else if (
      lowerName.includes("female") ||
      lowerName.includes("samantha") ||
      lowerName.includes("karen") ||
      lowerName.includes("martha")
    ) {
      category = "adult-female";
    }

    console.log(`🎤 Voice: ${name} -> Category: ${category}`);

    return {
      id: voice.identifier,
      name: name,
      language: voice.language || "en-US",
      category: category,
    };
  });

  VOICE_OPTIONS.sort((a, b) => {
    if (a.language !== b.language) {
      return a.language.localeCompare(b.language);
    }
    return a.name.localeCompare(b.name);
  });
};

export const getDefaultVoice = (availableVoices: any[]): string => {
  if (!availableVoices || availableVoices.length === 0) {
    return "com.apple.voice.compact.en-US.Samantha";
  }

  const preferredVoices = [
    "com.apple.ttsbundle.Samantha-compact",
    "com.apple.ttsbundle.Alex-compact",
    "com.apple.ttsbundle.Karen-compact",
    "en-US",
    "en-GB",
  ];

  for (const preferred of preferredVoices) {
    const found = availableVoices.find(
      (voice) => voice.identifier === preferred || voice.language === preferred
    );
    if (found) {
      return found.identifier;
    }
  }

  return availableVoices[0].identifier;
};

export const VOICE_CATEGORIES = [
  { id: "all", name: "All Voices" },
  { id: "adult-female", name: "Female Voices" },
  { id: "adult-male", name: "Male Voices" },
];

// Use the new modular vocabulary system
export const DEFAULT_VOCABULARY: VocabularyItem[] = getAllVocabularyItems();

// Use the new modular categories system
export const DEFAULT_CATEGORIES: Category[] = getAllCategories();

// Legacy BUTTON_TEMPLATES for backward compatibility
export const BUTTON_TEMPLATES: ButtonTemplate[] = getAllVocabulary();

export const COLORS = {
  primary: "#FF6B9D",
  secondary: "#4ECDC4",
  background: "#F8F9FF",
  surface: "#FFFFFF",
  text: "#2C3E50",
  textSecondary: "#7F8C8D",
  border: "#E8F4FD",
  success: "#2ECC71",
  warning: "#F39C12",
  error: "#E74C3C",
  default: {
    primary: "#FF6B9D",
    secondary: "#4ECDC4",
    background: "#F8F9FF",
    surface: "#FFFFFF",
    text: "#2C3E50",
    border: "#E8F4FD",
  },
  colorful: {
    primary: "#FF6B9D",
    secondary: "#4ECDC4",
    accent: "#45B7D1",
    warm: "#FFB347",
    cool: "#98D8C8",
    purple: "#9B59B6",
    yellow: "#F1C40F",
    background: "#FFF5F5",
    surface: "#FFFFFF",
    text: "#2C3E50",
    border: "#FFE0E0",
  },
  minimal: {
    primary: "#3498DB",
    secondary: "#2ECC71",
    accent: "#E74C3C",
    background: "#F8F9FA",
    surface: "#FFFFFF",
    text: "#2C3E50",
    border: "#E9ECEF",
  },
};

export const GRID_SIZES = [1, 2, 3, 4, 5];
export const BUTTON_SIZES = ["small", "medium", "large"];
export const THEMES = ["default", "colorful", "minimal"];

export const getSuggestedCategoriesForAge = (age: number): string[] => {
  if (age <= 2) {
    return ["greetings", "needs", "emotions", "food"];
  } else if (age <= 4) {
    return ["greetings", "needs", "emotions", "food", "activities", "people"];
  } else if (age <= 6) {
    return [
      "greetings",
      "needs",
      "emotions",
      "food",
      "activities",
      "people",
      "places",
      "daily-items",
    ];
  } else if (age <= 8) {
    return [
      "greetings",
      "needs",
      "emotions",
      "food",
      "food-choices",
      "activities",
      "people",
      "places",
      "daily-items",
      "weather",
    ];
  } else {
    return [
      "greetings",
      "needs",
      "emotions",
      "food",
      "food-choices",
      "activities",
      "people",
      "places",
      "daily-items",
      "weather",
      "pronouns",
      "verbs",
      "descriptors",
      "social",
      "questions",
    ];
  }
};

// Language options
export const SUPPORTED_LANGUAGES = [
  { code: "en", name: "English", nativeName: "English" },
  { code: "hi", name: "Hindi", nativeName: "हिंदी" },
  { code: "es", name: "Spanish", nativeName: "Español" },
  { code: "fr", name: "French", nativeName: "Français" },
  { code: "zh", name: "Chinese", nativeName: "中文" },
];
