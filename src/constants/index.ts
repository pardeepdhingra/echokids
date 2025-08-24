import {
  AppSettings,
  VocabularyItem,
  Category,
  ButtonTemplate,
} from "../types";

export const DEFAULT_SETTINGS: AppSettings = {
  gridSize: 3,
  ttsVoice: "en-US", // Use language code instead of specific voice ID
  volume: 1.0,
  speechRate: 0.8,
  buttonMode: "sentence",
  showText: true,
  theme: "colorful",
  enableChildFilter: false,
  textSize: "medium",
};

// This will be populated dynamically with available voices
export let VOICE_OPTIONS: Array<{
  id: string;
  name: string;
  language: string;
  category: string;
}> = [];

// Function to update voice options with available voices
export const updateVoiceOptions = (availableVoices: any[]) => {
  if (!availableVoices || availableVoices.length === 0) {
    // Fallback to basic language options
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

  // Convert available voices to our format
  VOICE_OPTIONS = availableVoices.map((voice) => {
    const name = voice.name || voice.identifier;
    const lowerName = name.toLowerCase();

    // Better categorization logic
    let category = "adult-female"; // default
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

  // Sort by language and name
  VOICE_OPTIONS.sort((a, b) => {
    if (a.language !== b.language) {
      return a.language.localeCompare(b.language);
    }
    return a.name.localeCompare(b.name);
  });
};

// Function to get default voice from available voices
export const getDefaultVoice = (availableVoices: any[]): string => {
  if (!availableVoices || availableVoices.length === 0) {
    return "com.apple.voice.compact.en-US.Samantha";
  }

  // Try to find a good default voice
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

  // Fallback to first available voice
  return availableVoices[0].identifier;
};

export const VOICE_CATEGORIES = [
  { id: "all", name: "All Voices" },
  { id: "adult-female", name: "Female Voices" },
  { id: "adult-male", name: "Male Voices" },
];

export const BUTTON_TEMPLATES: ButtonTemplate[] = [
  // Greetings
  {
    id: "hello",
    text: "Hello",
    message: "Hello, how are you?",
    category: "greetings",
    color: "#FF6B9D", // Bright pink
  },
  {
    id: "goodbye",
    text: "Goodbye",
    message: "Goodbye, see you later.",
    category: "greetings",
    color: "#4ECDC4", // Turquoise
  },
  {
    id: "thank-you",
    text: "Thank you",
    message: "Thank you very much.",
    category: "greetings",
    color: "#9B59B6", // Purple
  },
  {
    id: "please",
    text: "Please",
    message: "Please help me.",
    category: "greetings",
    color: "#F1C40F", // Yellow
  },
  {
    id: "happy-birthday",
    text: "Happy Birthday",
    message: "Happy Birthday!",
    category: "greetings",
    color: "#FF69B4", // Hot pink
  },
  {
    id: "i-love-you",
    text: "I love you",
    message: "I love you!",
    category: "greetings",
    color: "#E91E63", // Deep pink
  },

  // Food & Drink
  {
    id: "food",
    text: "Food",
    message: "I want food.",
    category: "food",
    color: "#FFB347", // Warm orange
  },
  {
    id: "hungry",
    text: "Hungry",
    message: "I am hungry.",
    category: "food",
    color: "#E67E22", // Dark orange
  },
  {
    id: "water",
    text: "Water",
    message: "I want water.",
    category: "food",
    color: "#45B7D1", // Sky blue
  },
  {
    id: "thirsty",
    text: "Thirsty",
    message: "I am thirsty.",
    category: "food",
    color: "#3498DB", // Blue
  },
  {
    id: "milk",
    text: "Milk",
    message: "I want milk.",
    category: "food",
    color: "#98D8C8", // Mint green
  },

  // Basic Needs
  {
    id: "bathroom",
    text: "Bathroom",
    message: "I need to use the bathroom.",
    category: "needs",
    color: "#E74C3C", // Red
  },
  {
    id: "help",
    text: "Help",
    message: "I need help.",
    category: "needs",
    color: "#F39C12", // Orange
  },
  {
    id: "tired",
    text: "Tired",
    message: "I am tired.",
    category: "needs",
    color: "#8E44AD", // Purple
  },
  {
    id: "sleep",
    text: "Sleep",
    message: "I want to sleep.",
    category: "needs",
    color: "#2C3E50", // Dark blue
  },

  // Emotions
  {
    id: "happy",
    text: "Happy",
    message: "I am happy.",
    category: "emotions",
    color: "#F1C40F", // Yellow
  },
  {
    id: "sad",
    text: "Sad",
    message: "I am sad.",
    category: "emotions",
    color: "#3498DB", // Blue
  },
  {
    id: "angry",
    text: "Angry",
    message: "I am angry.",
    category: "emotions",
    color: "#E74C3C", // Red
  },
  {
    id: "scared",
    text: "Scared",
    message: "I am scared.",
    category: "emotions",
    color: "#8E44AD", // Purple
  },
  {
    id: "excited",
    text: "Excited",
    message: "I am excited!",
    category: "emotions",
    color: "#FF6B9D", // Pink
  },

  // Activities
  {
    id: "play",
    text: "Play",
    message: "I want to play.",
    category: "activities",
    color: "#2ECC71", // Green
  },
  {
    id: "stop",
    text: "Stop",
    message: "Please stop.",
    category: "activities",
    color: "#E74C3C", // Red
  },
  {
    id: "more",
    text: "More",
    message: "I want more.",
    category: "activities",
    color: "#F39C12", // Orange
  },
  {
    id: "all-done",
    text: "All Done",
    message: "I am all done.",
    category: "activities",
    color: "#9B59B6", // Purple
  },
  {
    id: "book",
    text: "Book",
    message: "I want to read a book.",
    category: "activities",
    color: "#45B7D1", // Sky blue
  },

  // People
  {
    id: "mom",
    text: "Mom",
    message: "I want my mom.",
    category: "people",
    color: "#FF6B9D", // Pink
  },
  {
    id: "dad",
    text: "Dad",
    message: "I want my dad.",
    category: "people",
    color: "#4ECDC4", // Turquoise
  },
  {
    id: "friend",
    text: "Friend",
    message: "I want to see my friend.",
    category: "people",
    color: "#F1C40F", // Yellow
  },
  {
    id: "teacher",
    text: "Teacher",
    message: "I need my teacher.",
    category: "people",
    color: "#9B59B6", // Purple
  },
  {
    id: "brother",
    text: "Brother",
    message: "I want to see my brother.",
    category: "people",
    color: "#3498DB", // Blue
  },
  {
    id: "sister",
    text: "Sister",
    message: "I want to see my sister.",
    category: "people",
    color: "#E91E63", // Pink
  },
  {
    id: "grandpa",
    text: "Grandpa",
    message: "I want to see my grandpa.",
    category: "people",
    color: "#8E44AD", // Purple
  },
  {
    id: "grandma",
    text: "Grandma",
    message: "I want to see my grandma.",
    category: "people",
    color: "#E67E22", // Orange
  },
  {
    id: "uncle",
    text: "Uncle",
    message: "I want to see my uncle.",
    category: "people",
    color: "#2ECC71", // Green
  },
  {
    id: "aunt",
    text: "Aunt",
    message: "I want to see my aunt.",
    category: "people",
    color: "#F39C12", // Yellow
  },

  // Places
  {
    id: "home",
    text: "Home",
    message: "I want to go home.",
    category: "places",
    color: "#2ECC71", // Green
  },
  {
    id: "school",
    text: "School",
    message: "I want to go to school.",
    category: "places",
    color: "#3498DB", // Blue
  },
  {
    id: "park",
    text: "Park",
    message: "I want to go to the park.",
    category: "places",
    color: "#98D8C8", // Mint green
  },
  {
    id: "store",
    text: "Store",
    message: "I want to go to the store.",
    category: "places",
    color: "#FFB347", // Orange
  },
  {
    id: "playground",
    text: "Playground",
    message: "I want to go to the playground.",
    category: "places",
    color: "#FF6B6B", // Coral red
  },
];

export const DEFAULT_VOCABULARY: VocabularyItem[] = BUTTON_TEMPLATES.map(
  (template, index) => ({
    id: (index + 1).toString(),
    text: template.text,
    message: template.message,
    isFavorite: false,
    category: template.category,
    color: template.color,
    size: "medium" as const,
  })
);

export const DEFAULT_CATEGORIES: Category[] = [
  { id: "greetings", name: "Greetings", color: "#FF6B9D", icon: "hand-left" },
  { id: "food", name: "Food & Drink", color: "#FFB347", icon: "restaurant" },
  { id: "needs", name: "Basic Needs", color: "#E74C3C", icon: "help-circle" },
  { id: "emotions", name: "Emotions", color: "#F1C40F", icon: "heart" },
  { id: "activities", name: "Activities", color: "#2ECC71", icon: "play" },
  { id: "people", name: "People", color: "#4ECDC4", icon: "people" },
  { id: "places", name: "Places", color: "#3498DB", icon: "location" },
];

export const COLORS = {
  primary: "#FF6B9D", // Bright pink
  secondary: "#4ECDC4", // Turquoise
  background: "#F8F9FF", // Light blue background
  surface: "#FFFFFF",
  text: "#2C3E50", // Dark blue text
  textSecondary: "#7F8C8D",
  border: "#E8F4FD", // Light blue border
  success: "#2ECC71", // Bright green
  warning: "#F39C12", // Orange
  error: "#E74C3C", // Red
  // Theme-specific colors
  default: {
    primary: "#FF6B9D", // Bright pink
    secondary: "#4ECDC4", // Turquoise
    background: "#F8F9FF", // Light blue background
    surface: "#FFFFFF",
    text: "#2C3E50", // Dark blue text
    border: "#E8F4FD", // Light blue border
  },
  colorful: {
    primary: "#FF6B9D", // Bright pink
    secondary: "#4ECDC4", // Turquoise
    accent: "#45B7D1", // Sky blue
    warm: "#FFB347", // Warm orange
    cool: "#98D8C8", // Mint green
    purple: "#9B59B6", // Purple
    yellow: "#F1C40F", // Yellow
    background: "#FFF5F5", // Light pink background
    surface: "#FFFFFF",
    text: "#2C3E50", // Dark blue text
    border: "#FFE0E0", // Light pink border
  },
  minimal: {
    primary: "#3498DB", // Blue
    secondary: "#2ECC71", // Green
    accent: "#E74C3C", // Red
    background: "#F8F9FA", // Light gray background
    surface: "#FFFFFF",
    text: "#2C3E50", // Dark blue text
    border: "#E9ECEF", // Light gray border
  },
};

export const GRID_SIZES = [1, 2, 3, 4, 5];
export const BUTTON_SIZES = ["small", "medium", "large"];
export const THEMES = ["default", "colorful", "minimal"];
