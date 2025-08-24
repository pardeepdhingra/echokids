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
  buttonMode: "two-word",
  showText: true,
  theme: "colorful",
  enableChildFilter: false,
  textSize: "medium",
  hiddenCategories: [],
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
    twoWord: "Hello there",
    category: "greetings",
    color: "#FF6B9D", // Bright pink
  },
  {
    id: "goodbye",
    text: "Goodbye",
    message: "Goodbye, see you later.",
    twoWord: "Goodbye now",
    category: "greetings",
    color: "#4ECDC4", // Turquoise
  },
  {
    id: "thank-you",
    text: "Thank you",
    message: "Thank you very much.",
    twoWord: "Thank you",
    category: "greetings",
    color: "#9B59B6", // Purple
  },
  {
    id: "please",
    text: "Please",
    message: "Please help me.",
    twoWord: "Please help",
    category: "greetings",
    color: "#F1C40F", // Yellow
  },
  {
    id: "happy-birthday",
    text: "Happy Birthday",
    message: "Happy Birthday!",
    twoWord: "Happy Birthday",
    category: "greetings",
    color: "#FF69B4", // Hot pink
  },
  {
    id: "i-love-you",
    text: "I love you",
    message: "I love you!",
    twoWord: "I love",
    category: "greetings",
    color: "#E91E63", // Deep pink
  },

  // Food & Drink
  {
    id: "food",
    text: "Food",
    message: "I want food.",
    twoWord: "Want food",
    category: "food",
    color: "#FFB347", // Warm orange
  },
  {
    id: "hungry",
    text: "Hungry",
    message: "I am hungry.",
    twoWord: "Am hungry",
    category: "food",
    color: "#E67E22", // Dark orange
  },
  {
    id: "water",
    text: "Water",
    message: "I want water.",
    twoWord: "Want water",
    category: "food",
    color: "#45B7D1", // Sky blue
  },
  {
    id: "thirsty",
    text: "Thirsty",
    message: "I am thirsty.",
    twoWord: "Am thirsty",
    category: "food",
    color: "#3498DB", // Blue
  },
  {
    id: "milk",
    text: "Milk",
    message: "I want milk.",
    twoWord: "Want milk",
    category: "food",
    color: "#98D8C8", // Mint green
  },
  {
    id: "sandwich",
    text: "Sandwich",
    message: "I want a sandwich.",
    twoWord: "Want sandwich",
    category: "food",
    color: "#F39C12", // Orange
  },
  {
    id: "burger",
    text: "Burger",
    message: "I want a burger.",
    twoWord: "Want burger",
    category: "food",
    color: "#E67E22", // Dark orange
  },
  {
    id: "pizza",
    text: "Pizza",
    message: "I want pizza.",
    twoWord: "Want pizza",
    category: "food",
    color: "#E74C3C", // Red
  },
  {
    id: "spaghetti",
    text: "Spaghetti",
    message: "I want spaghetti.",
    twoWord: "Want spaghetti",
    category: "food",
    color: "#FF6B9D", // Pink
  },
  {
    id: "cold-drink",
    text: "Cold Drink",
    message: "I want a cold drink.",
    twoWord: "Want drink",
    category: "food",
    color: "#3498DB", // Blue
  },
  {
    id: "juice",
    text: "Juice",
    message: "I want juice.",
    twoWord: "Want juice",
    category: "food",
    color: "#FFB347", // Warm orange
  },
  {
    id: "apple",
    text: "Apple",
    message: "I want an apple.",
    twoWord: "Want apple",
    category: "food",
    color: "#E74C3C", // Red
  },
  {
    id: "banana",
    text: "Banana",
    message: "I want a banana.",
    twoWord: "Want banana",
    category: "food",
    color: "#F1C40F", // Yellow
  },
  {
    id: "orange",
    text: "Orange",
    message: "I want an orange.",
    twoWord: "Want orange",
    category: "food",
    color: "#FF8C00", // Dark orange
  },
  {
    id: "grapes",
    text: "Grapes",
    message: "I want grapes.",
    twoWord: "Want grapes",
    category: "food",
    color: "#8E44AD", // Purple
  },
  {
    id: "strawberry",
    text: "Strawberry",
    message: "I want strawberries.",
    twoWord: "Want strawberries",
    category: "food",
    color: "#E91E63", // Pink
  },
  {
    id: "watermelon",
    text: "Watermelon",
    message: "I want watermelon.",
    twoWord: "Want watermelon",
    category: "food",
    color: "#2ECC71", // Green
  },
  {
    id: "chips",
    text: "Chips",
    message: "I want chips.",
    twoWord: "Want chips",
    category: "food",
    color: "#F1C40F", // Yellow
  },
  {
    id: "ice-cream",
    text: "Ice Cream",
    message: "I want ice cream.",
    twoWord: "Want ice cream",
    category: "food",
    color: "#98D8C8", // Mint green
  },
  {
    id: "chocolate",
    text: "Chocolate",
    message: "I want chocolate.",
    twoWord: "Want chocolate",
    category: "food",
    color: "#8E44AD", // Purple
  },
  {
    id: "cookies",
    text: "Cookies",
    message: "I want cookies.",
    twoWord: "Want cookies",
    category: "food",
    color: "#D35400", // Dark orange
  },
  {
    id: "breakfast",
    text: "Breakfast",
    message: "I want breakfast.",
    twoWord: "Want breakfast",
    category: "food",
    color: "#FFB347", // Warm orange
  },
  {
    id: "lunch",
    text: "Lunch",
    message: "I want lunch.",
    twoWord: "Want lunch",
    category: "food",
    color: "#E67E22", // Dark orange
  },
  {
    id: "dinner",
    text: "Dinner",
    message: "I want dinner.",
    twoWord: "Want dinner",
    category: "food",
    color: "#D35400", // Darker orange
  },

  // Food Choices
  {
    id: "italian",
    text: "Italian",
    message: "I want Italian food.",
    twoWord: "Want Italian",
    category: "food-choices",
    color: "#E74C3C", // Red
  },
  {
    id: "indian",
    text: "Indian",
    message: "I want Indian food.",
    twoWord: "Want Indian",
    category: "food-choices",
    color: "#FF6B9D", // Pink
  },
  {
    id: "chinese",
    text: "Chinese",
    message: "I want Chinese food.",
    twoWord: "Want Chinese",
    category: "food-choices",
    color: "#F39C12", // Orange
  },
  {
    id: "thai",
    text: "Thai",
    message: "I want Thai food.",
    twoWord: "Want Thai",
    category: "food-choices",
    color: "#E67E22", // Dark orange
  },
  {
    id: "mexican",
    text: "Mexican",
    message: "I want Mexican food.",
    twoWord: "Want Mexican",
    category: "food-choices",
    color: "#2ECC71", // Green
  },

  // Basic Needs
  {
    id: "bathroom",
    text: "Bathroom",
    message: "I need to use the bathroom.",
    twoWord: "Need bathroom",
    category: "needs",
    color: "#E74C3C", // Red
  },
  {
    id: "help",
    text: "Help",
    message: "I need help.",
    twoWord: "Need help",
    category: "needs",
    color: "#F39C12", // Orange
  },
  {
    id: "tired",
    text: "Tired",
    message: "I am tired.",
    twoWord: "Am tired",
    category: "needs",
    color: "#8E44AD", // Purple
  },
  {
    id: "sleep",
    text: "Sleep",
    message: "I want to sleep.",
    twoWord: "Want sleep",
    category: "needs",
    color: "#2C3E50", // Dark blue
  },

  // Emotions
  {
    id: "happy",
    text: "Happy",
    message: "I am happy.",
    twoWord: "Am happy",
    category: "emotions",
    color: "#F1C40F", // Yellow
  },
  {
    id: "sad",
    text: "Sad",
    message: "I am sad.",
    twoWord: "Am sad",
    category: "emotions",
    color: "#3498DB", // Blue
  },
  {
    id: "angry",
    text: "Angry",
    message: "I am angry.",
    twoWord: "Am angry",
    category: "emotions",
    color: "#E74C3C", // Red
  },
  {
    id: "scared",
    text: "Scared",
    message: "I am scared.",
    twoWord: "Am scared",
    category: "emotions",
    color: "#8E44AD", // Purple
  },
  {
    id: "excited",
    text: "Excited",
    message: "I am excited!",
    twoWord: "Am excited",
    category: "emotions",
    color: "#FF6B9D", // Pink
  },
  {
    id: "cold",
    text: "Cold",
    message: "I am cold.",
    twoWord: "Am cold",
    category: "emotions",
    color: "#3498DB", // Blue
  },
  {
    id: "hot",
    text: "Hot",
    message: "I am hot.",
    twoWord: "Am hot",
    category: "emotions",
    color: "#E74C3C", // Red
  },
  {
    id: "surprised",
    text: "Surprised",
    message: "I am surprised!",
    twoWord: "Am surprised",
    category: "emotions",
    color: "#FF6B9D", // Pink
  },
  {
    id: "confused",
    text: "Confused",
    message: "I am confused.",
    twoWord: "Am confused",
    category: "emotions",
    color: "#9B59B6", // Purple
  },
  {
    id: "proud",
    text: "Proud",
    message: "I am proud.",
    twoWord: "Am proud",
    category: "emotions",
    color: "#F1C40F", // Yellow
  },
  {
    id: "clean",
    text: "Clean",
    message: "I am clean.",
    twoWord: "Am clean",
    category: "emotions",
    color: "#2ECC71", // Green
  },
  {
    id: "dirty",
    text: "Dirty",
    message: "I am dirty.",
    twoWord: "Am dirty",
    category: "emotions",
    color: "#8E44AD", // Purple
  },

  // Activities
  {
    id: "play",
    text: "Play",
    message: "I want to play.",
    twoWord: "Want play",
    category: "activities",
    color: "#2ECC71", // Green
  },
  {
    id: "stop",
    text: "Stop",
    message: "Please stop.",
    twoWord: "Please stop",
    category: "activities",
    color: "#E74C3C", // Red
  },
  {
    id: "more",
    text: "More",
    message: "I want more.",
    twoWord: "Want more",
    category: "activities",
    color: "#F39C12", // Orange
  },
  {
    id: "all-done",
    text: "All Done",
    message: "I am all done.",
    twoWord: "All done",
    category: "activities",
    color: "#9B59B6", // Purple
  },
  {
    id: "book",
    text: "Book",
    message: "I want to read a book.",
    twoWord: "Want book",
    category: "activities",
    color: "#45B7D1", // Sky blue
  },
  {
    id: "cycling",
    text: "Cycling",
    message: "I want to go cycling.",
    twoWord: "Want cycling",
    category: "activities",
    color: "#2ECC71", // Green
  },
  {
    id: "scooter",
    text: "Scooter",
    message: "I want to ride my scooter.",
    twoWord: "Want scooter",
    category: "activities",
    color: "#F39C12", // Orange
  },
  {
    id: "tv",
    text: "TV",
    message: "I want to watch TV.",
    twoWord: "Want TV",
    category: "activities",
    color: "#9B59B6", // Purple
  },

  // Daily Items
  {
    id: "soap",
    text: "Soap",
    message: "I need soap.",
    twoWord: "Need soap",
    category: "daily-items",
    color: "#98D8C8", // Mint green
  },
  {
    id: "shampoo",
    text: "Shampoo",
    message: "I need shampoo.",
    twoWord: "Need shampoo",
    category: "daily-items",
    color: "#45B7D1", // Sky blue
  },
  {
    id: "spoon",
    text: "Spoon",
    message: "I need a spoon.",
    twoWord: "Need spoon",
    category: "daily-items",
    color: "#F1C40F", // Yellow
  },
  {
    id: "fork",
    text: "Fork",
    message: "I need a fork.",
    twoWord: "Need fork",
    category: "daily-items",
    color: "#E67E22", // Dark orange
  },
  {
    id: "knife",
    text: "Knife",
    message: "I need a knife.",
    twoWord: "Need knife",
    category: "daily-items",
    color: "#95A5A6", // Gray
  },
  {
    id: "scissors",
    text: "Scissors",
    message: "I need scissors.",
    twoWord: "Need scissors",
    category: "daily-items",
    color: "#3498DB", // Blue
  },
  {
    id: "toothbrush",
    text: "Toothbrush",
    message: "I need my toothbrush.",
    twoWord: "Need toothbrush",
    category: "daily-items",
    color: "#45B7D1", // Sky blue
  },
  {
    id: "towel",
    text: "Towel",
    message: "I need a towel.",
    twoWord: "Need towel",
    category: "daily-items",
    color: "#98D8C8", // Mint green
  },
  {
    id: "paper",
    text: "Paper",
    message: "I need paper.",
    twoWord: "Need paper",
    category: "daily-items",
    color: "#F1C40F", // Yellow
  },
  {
    id: "pencil",
    text: "Pencil",
    message: "I need a pencil.",
    twoWord: "Need pencil",
    category: "daily-items",
    color: "#95A5A6", // Gray
  },
  {
    id: "shower",
    text: "Shower",
    message: "I want to take a shower.",
    twoWord: "Want shower",
    category: "needs",
    color: "#3498DB", // Blue
  },
  {
    id: "bath",
    text: "Bath",
    message: "I want to take a bath.",
    twoWord: "Want bath",
    category: "needs",
    color: "#45B7D1", // Sky blue
  },
  {
    id: "clothes",
    text: "Clothes",
    message: "I need to change my clothes.",
    twoWord: "Need clothes",
    category: "needs",
    color: "#9B59B6", // Purple
  },
  {
    id: "wet-nappy",
    text: "Wet Nappy",
    message: "My nappy is wet.",
    twoWord: "Wet nappy",
    category: "needs",
    color: "#98D8C8", // Mint green
  },
  {
    id: "dirty-nappy",
    text: "Dirty Nappy",
    message: "My nappy is dirty.",
    twoWord: "Dirty nappy",
    category: "needs",
    color: "#E67E22", // Dark orange
  },

  // People
  {
    id: "mom",
    text: "Mom",
    message: "I want my mom.",
    twoWord: "Want mom",
    category: "people",
    color: "#FF6B9D", // Pink
  },
  {
    id: "dad",
    text: "Dad",
    message: "I want my dad.",
    twoWord: "Want dad",
    category: "people",
    color: "#4ECDC4", // Turquoise
  },
  {
    id: "friend",
    text: "Friend",
    message: "I want to see my friend.",
    twoWord: "Want friend",
    category: "people",
    color: "#F1C40F", // Yellow
  },
  {
    id: "teacher",
    text: "Teacher",
    message: "I need my teacher.",
    twoWord: "Need teacher",
    category: "people",
    color: "#9B59B6", // Purple
  },
  {
    id: "brother",
    text: "Brother",
    message: "I want to see my brother.",
    twoWord: "Want brother",
    category: "people",
    color: "#3498DB", // Blue
  },
  {
    id: "sister",
    text: "Sister",
    message: "I want to see my sister.",
    twoWord: "Want sister",
    category: "people",
    color: "#E91E63", // Pink
  },
  {
    id: "grandpa",
    text: "Grandpa",
    message: "I want to see my grandpa.",
    twoWord: "Want grandpa",
    category: "people",
    color: "#8E44AD", // Purple
  },
  {
    id: "grandma",
    text: "Grandma",
    message: "I want to see my grandma.",
    twoWord: "Want grandma",
    category: "people",
    color: "#E67E22", // Orange
  },
  {
    id: "uncle",
    text: "Uncle",
    message: "I want to see my uncle.",
    twoWord: "Want uncle",
    category: "people",
    color: "#2ECC71", // Green
  },
  {
    id: "aunt",
    text: "Aunt",
    message: "I want to see my aunt.",
    twoWord: "Want aunt",
    category: "people",
    color: "#F39C12", // Yellow
  },

  // Places
  {
    id: "home",
    text: "Home",
    message: "I want to go home.",
    twoWord: "Go home",
    category: "places",
    color: "#2ECC71", // Green
  },
  {
    id: "school",
    text: "School",
    message: "I want to go to school.",
    twoWord: "Go school",
    category: "places",
    color: "#3498DB", // Blue
  },
  {
    id: "park",
    text: "Park",
    message: "I want to go to the park.",
    twoWord: "Go park",
    category: "places",
    color: "#98D8C8", // Mint green
  },
  {
    id: "store",
    text: "Store",
    message: "I want to go to the store.",
    twoWord: "Go store",
    category: "places",
    color: "#FFB347", // Orange
  },
  {
    id: "playground",
    text: "Playground",
    message: "I want to go to the playground.",
    twoWord: "Go playground",
    category: "places",
    color: "#FF6B6B", // Coral red
  },
  {
    id: "restaurant",
    text: "Restaurant",
    message: "I want to go to a restaurant.",
    twoWord: "Go restaurant",
    category: "places",
    color: "#E74C3C", // Red
  },
  {
    id: "mcdonalds",
    text: "McDonald's",
    message: "I want to go to McDonald's.",
    twoWord: "Go McDonald's",
    category: "places",
    color: "#F39C12", // Orange
  },
  {
    id: "hospital",
    text: "Hospital",
    message: "I need to go to the hospital.",
    twoWord: "Go hospital",
    category: "places",
    color: "#E74C3C", // Red
  },
  {
    id: "library",
    text: "Library",
    message: "I want to go to the library.",
    twoWord: "Go library",
    category: "places",
    color: "#9B59B6", // Purple
  },
  {
    id: "beach",
    text: "Beach",
    message: "I want to go to the beach.",
    twoWord: "Go beach",
    category: "places",
    color: "#F1C40F", // Yellow
  },

  // Weather
  {
    id: "sunny",
    text: "Sunny",
    message: "It is sunny today.",
    twoWord: "Is sunny",
    category: "weather",
    color: "#F1C40F", // Yellow
  },
  {
    id: "rainy",
    text: "Rainy",
    message: "It is raining.",
    twoWord: "Is raining",
    category: "weather",
    color: "#3498DB", // Blue
  },
  {
    id: "snowy",
    text: "Snowy",
    message: "It is snowing.",
    twoWord: "Is snowing",
    category: "weather",
    color: "#FFFFFF", // White
  },
  {
    id: "cloudy",
    text: "Cloudy",
    message: "It is cloudy.",
    twoWord: "Is cloudy",
    category: "weather",
    color: "#95A5A6", // Gray
  },
  {
    id: "windy",
    text: "Windy",
    message: "It is windy.",
    twoWord: "Is windy",
    category: "weather",
    color: "#98D8C8", // Mint green
  },
];

export const DEFAULT_VOCABULARY: VocabularyItem[] = BUTTON_TEMPLATES.map(
  (template, index) => ({
    id: (index + 1).toString(),
    text: template.text,
    message: template.message,
    twoWord: template.twoWord,
    isFavorite: false,
    category: template.category,
    color: template.color,
    size: "medium" as const,
  })
);

export const DEFAULT_CATEGORIES: Category[] = [
  { id: "greetings", name: "Greetings", color: "#FF6B9D", icon: "hand-left" },
  { id: "food", name: "Food & Drink", color: "#FFB347", icon: "restaurant" },
  { id: "food-choices", name: "Food Choices", color: "#E91E63", icon: "restaurant" },
  { id: "needs", name: "Basic Needs", color: "#E74C3C", icon: "help-circle" },
  { id: "emotions", name: "Emotions", color: "#F1C40F", icon: "heart" },
  { id: "activities", name: "Activities", color: "#2ECC71", icon: "play" },
  { id: "people", name: "People", color: "#4ECDC4", icon: "people" },
  { id: "places", name: "Places", color: "#3498DB", icon: "location" },
  { id: "daily-items", name: "Daily Items", color: "#9B59B6", icon: "construct" },
  { id: "weather", name: "Weather", color: "#45B7D1", icon: "partly-sunny" },
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
