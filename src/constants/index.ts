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
  textSize: "large",
  hiddenCategories: [],
  childAge: undefined,
  hasShownAgePrompt: false,
  symbolType: "emoji",
  language: "en",
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
    message: "Hello!",
    category: "greetings",
    color: "#4ECDC4",
    translations: {
      en: "Hello",
      hi: "नमस्ते",
      es: "Hola",
      fr: "Bonjour",
      zh: "你好",
    },
  },
  {
    id: "goodbye",
    text: "Goodbye",
    message: "Goodbye!",
    category: "greetings",
    color: "#4ECDC4",
    translations: {
      en: "Goodbye",
      hi: "अलविदा",
      es: "Adiós",
      fr: "Au revoir",
      zh: "再见",
    },
  },
  {
    id: "thank-you",
    text: "Thank you",
    message: "Thank you!",
    category: "greetings",
    color: "#4ECDC4",
    translations: {
      en: "Thank you",
      hi: "धन्यवाद",
      es: "Gracias",
      fr: "Merci",
      zh: "谢谢",
    },
  },
  {
    id: "please",
    text: "Please",
    message: "Please!",
    category: "greetings",
    color: "#4ECDC4",
    translations: {
      en: "Please",
      hi: "कृपया",
      es: "Por favor",
      fr: "S'il vous plaît",
      zh: "请",
    },
  },
  {
    id: "happy-birthday",
    text: "Happy Birthday",
    message: "Happy Birthday!",
    category: "greetings",
    color: "#FF6B6B",
    translations: {
      en: "Happy Birthday",
      hi: "जन्मदिन मुबारक",
      es: "Feliz Cumpleaños",
      fr: "Joyeux Anniversaire",
      zh: "生日快乐",
    },
  },
  {
    id: "i-love-you",
    text: "I love you",
    message: "I love you!",
    category: "greetings",
    color: "#FF6B6B",
    translations: {
      en: "I love you",
      hi: "मैं तुमसे प्यार करता हूं",
      es: "Te amo",
      fr: "Je t'aime",
      zh: "我爱你",
    },
  },

  // Food & Drink
  {
    id: "food",
    text: "Food",
    message: "I want food!",
    category: "food",
    color: "#FFA07A",
    translations: {
      en: "Food",
      hi: "खाना",
      es: "Comida",
      fr: "Nourriture",
      zh: "食物",
    },
  },
  {
    id: "hungry",
    text: "Hungry",
    message: "I'm hungry!",
    category: "food",
    color: "#FFA07A",
    translations: {
      en: "Hungry",
      hi: "भूखा",
      es: "Hambriento",
      fr: "Affamé",
      zh: "饿了",
    },
  },
  {
    id: "water",
    text: "Water",
    message: "I want water!",
    category: "food",
    color: "#45B7D1",
    translations: {
      en: "Water",
      hi: "पानी",
      es: "Agua",
      fr: "Eau",
      zh: "水",
    },
  },
  {
    id: "thirsty",
    text: "Thirsty",
    message: "I'm thirsty!",
    category: "food",
    color: "#45B7D1",
    translations: {
      en: "Thirsty",
      hi: "प्यासा",
      es: "Sediento",
      fr: "Assoiffé",
      zh: "渴了",
    },
  },
  {
    id: "milk",
    text: "Milk",
    message: "I want milk!",
    category: "food",
    color: "#45B7D1",
    translations: {
      en: "Milk",
      hi: "दूध",
      es: "Leche",
      fr: "Lait",
      zh: "牛奶",
    },
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
    translations: {
      en: "Ice Cream",
      hi: "आइसक्रीम",
      es: "Helado",
      fr: "Crème glacée",
      zh: "冰淇淋",
    },
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
    message: "I need to go to the bathroom!",
    category: "needs",
    color: "#98D8C8",
    translations: {
      en: "Bathroom",
      hi: "बाथरूम",
      es: "Baño",
      fr: "Salle de bain",
      zh: "浴室",
    },
  },
  {
    id: "help",
    text: "Help",
    message: "I need help!",
    category: "needs",
    color: "#FF6B6B",
    translations: {
      en: "Help",
      hi: "मदद",
      es: "Ayuda",
      fr: "Aide",
      zh: "帮助",
    },
  },
  {
    id: "tired",
    text: "Tired",
    message: "I'm tired!",
    category: "needs",
    color: "#607D8B",
    translations: {
      en: "Tired",
      hi: "थका हुआ",
      es: "Cansado",
      fr: "Fatigué",
      zh: "累了",
    },
  },
  {
    id: "sleep",
    text: "Sleep",
    message: "I want to sleep!",
    category: "needs",
    color: "#607D8B",
    translations: {
      en: "Sleep",
      hi: "नींद",
      es: "Dormir",
      fr: "Dormir",
      zh: "睡觉",
    },
  },

  // Emotions
  {
    id: "happy",
    text: "Happy",
    message: "I'm happy!",
    category: "emotions",
    color: "#4CAF50",
    translations: {
      en: "Happy",
      hi: "खुश",
      es: "Feliz",
      fr: "Heureux",
      zh: "开心",
    },
  },
  {
    id: "sad",
    text: "Sad",
    message: "I'm sad!",
    category: "emotions",
    color: "#2196F3",
    translations: {
      en: "Sad",
      hi: "दुखी",
      es: "Triste",
      fr: "Triste",
      zh: "伤心",
    },
  },
  {
    id: "angry",
    text: "Angry",
    message: "I'm angry!",
    category: "emotions",
    color: "#FF5722",
    translations: {
      en: "Angry",
      hi: "गुस्सा",
      es: "Enojado",
      fr: "En colère",
      zh: "生气",
    },
  },
  {
    id: "scared",
    text: "Scared",
    message: "I'm scared!",
    category: "emotions",
    color: "#9C27B0",
    translations: {
      en: "Scared",
      hi: "डरा हुआ",
      es: "Asustado",
      fr: "Effrayé",
      zh: "害怕",
    },
  },
  {
    id: "excited",
    text: "Excited",
    message: "I'm excited!",
    category: "emotions",
    color: "#FF9800",
    translations: {
      en: "Excited",
      hi: "उत्साहित",
      es: "Emocionado",
      fr: "Excité",
      zh: "兴奋",
    },
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
    translations: {
      en: "Surprised",
      hi: "हैरान",
      es: "Sorprendido",
      fr: "Surpris",
      zh: "惊讶",
    },
  },
  {
    id: "confused",
    text: "Confused",
    message: "I am confused.",
    twoWord: "Am confused",
    category: "emotions",
    color: "#9B59B6", // Purple
    translations: {
      en: "Confused",
      hi: "उलझन में",
      es: "Confundido",
      fr: "Confus",
      zh: "困惑",
    },
  },
  {
    id: "proud",
    text: "Proud",
    message: "I am proud.",
    twoWord: "Am proud",
    category: "emotions",
    color: "#F1C40F", // Yellow
    translations: {
      en: "Proud",
      hi: "गर्व",
      es: "Orgulloso",
      fr: "Fier",
      zh: "骄傲",
    },
  },
  {
    id: "clean",
    text: "Clean",
    message: "I am clean.",
    twoWord: "Am clean",
    category: "emotions",
    color: "#2ECC71", // Green
    translations: {
      en: "Clean",
      hi: "साफ",
      es: "Limpio",
      fr: "Propre",
      zh: "干净",
    },
  },
  {
    id: "dirty",
    text: "Dirty",
    message: "I am dirty.",
    twoWord: "Am dirty",
    category: "emotions",
    color: "#8E44AD", // Purple
    translations: {
      en: "Dirty",
      hi: "गंदा",
      es: "Sucio",
      fr: "Sale",
      zh: "脏",
    },
  },

  // Activities
  {
    id: "play",
    text: "Play",
    message: "I want to play!",
    category: "activities",
    color: "#4CAF50",
    translations: {
      en: "Play",
      hi: "खेलना",
      es: "Jugar",
      fr: "Jouer",
      zh: "玩",
    },
  },
  {
    id: "stop",
    text: "Stop",
    message: "Stop!",
    category: "activities",
    color: "#FF5722",
    translations: {
      en: "Stop",
      hi: "रुको",
      es: "Parar",
      fr: "Arrêter",
      zh: "停止",
    },
  },
  {
    id: "more",
    text: "More",
    message: "I want more!",
    category: "activities",
    color: "#FF9800",
    translations: {
      en: "More",
      hi: "और",
      es: "Más",
      fr: "Plus",
      zh: "更多",
    },
  },
  {
    id: "all-done",
    text: "All done",
    message: "All done!",
    category: "activities",
    color: "#4CAF50",
    translations: {
      en: "All done",
      hi: "सब हो गया",
      es: "Todo listo",
      fr: "Terminé",
      zh: "完成了",
    },
  },
  {
    id: "book",
    text: "Book",
    message: "I want to read a book!",
    category: "activities",
    color: "#2196F3",
    translations: {
      en: "Book",
      hi: "किताब",
      es: "Libro",
      fr: "Livre",
      zh: "书",
    },
  },
  {
    id: "cycling",
    text: "Cycling",
    message: "I want to go cycling.",
    twoWord: "Want cycling",
    category: "activities",
    color: "#2ECC71", // Green
    translations: {
      en: "Cycling",
      hi: "साइकिल चलाना",
      es: "Ciclismo",
      fr: "Vélo",
      zh: "骑自行车",
    },
  },
  {
    id: "scooter",
    text: "Scooter",
    message: "I want to ride my scooter.",
    twoWord: "Want scooter",
    category: "activities",
    color: "#F39C12", // Orange
    translations: {
      en: "Scooter",
      hi: "स्कूटर",
      es: "Patineta",
      fr: "Trottinette",
      zh: "滑板车",
    },
  },
  {
    id: "tv",
    text: "TV",
    message: "I want to watch TV.",
    twoWord: "Want TV",
    category: "activities",
    color: "#9B59B6", // Purple
    translations: {
      en: "TV",
      hi: "टीवी",
      es: "TV",
      fr: "TV",
      zh: "电视",
    },
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
    translations: {
      en: "Towel",
      hi: "तौलिया",
      es: "Toalla",
      fr: "Serviette",
      zh: "毛巾",
    },
  },
  {
    id: "paper",
    text: "Paper",
    message: "I need paper.",
    twoWord: "Need paper",
    category: "daily-items",
    color: "#F1C40F", // Yellow
    translations: {
      en: "Paper",
      hi: "कागज",
      es: "Papel",
      fr: "Papier",
      zh: "纸",
    },
  },
  {
    id: "pencil",
    text: "Pencil",
    message: "I need a pencil.",
    twoWord: "Need pencil",
    category: "daily-items",
    color: "#95A5A6", // Gray
    translations: {
      en: "Pencil",
      hi: "पेंसिल",
      es: "Lápiz",
      fr: "Crayon",
      zh: "铅笔",
    },
  },
  {
    id: "shower",
    text: "Shower",
    message: "I want to take a shower.",
    twoWord: "Want shower",
    category: "needs",
    color: "#3498DB", // Blue
    translations: {
      en: "Shower",
      hi: "शॉवर",
      es: "Ducha",
      fr: "Douche",
      zh: "淋浴",
    },
  },
  {
    id: "bath",
    text: "Bath",
    message: "I want to take a bath.",
    twoWord: "Want bath",
    category: "needs",
    color: "#45B7D1", // Sky blue
    translations: {
      en: "Bath",
      hi: "स्नान",
      es: "Baño",
      fr: "Bain",
      zh: "洗澡",
    },
  },
  {
    id: "clothes",
    text: "Clothes",
    message: "I need to change my clothes.",
    twoWord: "Need clothes",
    category: "needs",
    color: "#9B59B6", // Purple
    translations: {
      en: "Clothes",
      hi: "कपड़े",
      es: "Ropa",
      fr: "Vêtements",
      zh: "衣服",
    },
  },
  {
    id: "wet-nappy",
    text: "Wet Nappy",
    message: "My nappy is wet.",
    twoWord: "Wet nappy",
    category: "needs",
    color: "#98D8C8", // Mint green
    translations: {
      en: "Wet Nappy",
      hi: "गीला डायपर",
      es: "Pañal mojado",
      fr: "Couche mouillée",
      zh: "湿尿布",
    },
  },
  {
    id: "dirty-nappy",
    text: "Dirty Nappy",
    message: "My nappy is dirty.",
    twoWord: "Dirty nappy",
    category: "needs",
    color: "#E67E22", // Dark orange
    translations: {
      en: "Dirty Nappy",
      hi: "गंदा डायपर",
      es: "Pañal sucio",
      fr: "Couche sale",
      zh: "脏尿布",
    },
  },

  // People
  {
    id: "mom",
    text: "Mom",
    message: "Mom!",
    category: "people",
    color: "#E91E63",
    translations: {
      en: "Mom",
      hi: "माँ",
      es: "Mamá",
      fr: "Maman",
      zh: "妈妈",
    },
  },
  {
    id: "dad",
    text: "Dad",
    message: "Dad!",
    category: "people",
    color: "#2196F3",
    translations: {
      en: "Dad",
      hi: "पापा",
      es: "Papá",
      fr: "Papa",
      zh: "爸爸",
    },
  },
  {
    id: "friend",
    text: "Friend",
    message: "My friend!",
    category: "people",
    color: "#4CAF50",
    translations: {
      en: "Friend",
      hi: "दोस्त",
      es: "Amigo",
      fr: "Ami",
      zh: "朋友",
    },
  },
  {
    id: "teacher",
    text: "Teacher",
    message: "Teacher!",
    category: "people",
    color: "#FF9800",
    translations: {
      en: "Teacher",
      hi: "शिक्षक",
      es: "Maestro",
      fr: "Enseignant",
      zh: "老师",
    },
  },
  {
    id: "brother",
    text: "Brother",
    message: "I want to see my brother.",
    twoWord: "Want brother",
    category: "people",
    color: "#3498DB", // Blue
    translations: {
      en: "Brother",
      hi: "भाई",
      es: "Hermano",
      fr: "Frère",
      zh: "兄弟",
    },
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
    message: "I want to go home!",
    category: "places",
    color: "#4CAF50",
    translations: {
      en: "Home",
      hi: "घर",
      es: "Casa",
      fr: "Maison",
      zh: "家",
    },
  },
  {
    id: "school",
    text: "School",
    message: "I want to go to school!",
    category: "places",
    color: "#2196F3",
    translations: {
      en: "School",
      hi: "स्कूल",
      es: "Escuela",
      fr: "École",
      zh: "学校",
    },
  },
  {
    id: "park",
    text: "Park",
    message: "I want to go to the park!",
    category: "places",
    color: "#4CAF50",
    translations: {
      en: "Park",
      hi: "पार्क",
      es: "Parque",
      fr: "Parc",
      zh: "公园",
    },
  },
  {
    id: "store",
    text: "Store",
    message: "I want to go to the store!",
    category: "places",
    color: "#FF9800",
    translations: {
      en: "Store",
      hi: "दुकान",
      es: "Tienda",
      fr: "Magasin",
      zh: "商店",
    },
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
    translations: {
      en: "Restaurant",
      hi: "रेस्तरां",
      es: "Restaurante",
      fr: "Restaurant",
      zh: "餐厅",
    },
  },
  {
    id: "mcdonalds",
    text: "McDonald's",
    message: "I want to go to McDonald's.",
    twoWord: "Go McDonald's",
    category: "places",
    color: "#F39C12", // Orange
    translations: {
      en: "McDonald's",
      hi: "मैकडॉनल्ड्स",
      es: "McDonald's",
      fr: "McDonald's",
      zh: "麦当劳",
    },
  },
  {
    id: "hospital",
    text: "Hospital",
    message: "I need to go to the hospital.",
    twoWord: "Go hospital",
    category: "places",
    color: "#E74C3C", // Red
    translations: {
      en: "Hospital",
      hi: "अस्पताल",
      es: "Hospital",
      fr: "Hôpital",
      zh: "医院",
    },
  },
  {
    id: "library",
    text: "Library",
    message: "I want to go to the library.",
    twoWord: "Go library",
    category: "places",
    color: "#9B59B6", // Purple
    translations: {
      en: "Library",
      hi: "पुस्तकालय",
      es: "Biblioteca",
      fr: "Bibliothèque",
      zh: "图书馆",
    },
  },
  {
    id: "beach",
    text: "Beach",
    message: "I want to go to the beach.",
    twoWord: "Go beach",
    category: "places",
    color: "#F1C40F", // Yellow
    translations: {
      en: "Beach",
      hi: "समुद्र तट",
      es: "Playa",
      fr: "Plage",
      zh: "海滩",
    },
  },

  // Weather
  {
    id: "sunny",
    text: "Sunny",
    message: "It is sunny today.",
    twoWord: "Is sunny",
    category: "weather",
    color: "#F1C40F", // Yellow
    translations: {
      en: "Sunny",
      hi: "धूप",
      es: "Soleado",
      fr: "Ensoleillé",
      zh: "晴天",
    },
  },
  {
    id: "rainy",
    text: "Rainy",
    message: "It is raining.",
    twoWord: "Is raining",
    category: "weather",
    color: "#3498DB", // Blue
    translations: {
      en: "Rainy",
      hi: "बारिश",
      es: "Lluvioso",
      fr: "Pluvieux",
      zh: "雨天",
    },
  },
  {
    id: "snowy",
    text: "Snowy",
    message: "It is snowing.",
    twoWord: "Is snowing",
    category: "weather",
    color: "#FFFFFF", // White
    translations: {
      en: "Snowy",
      hi: "बर्फ",
      es: "Nevado",
      fr: "Neigeux",
      zh: "雪天",
    },
  },
  {
    id: "cloudy",
    text: "Cloudy",
    message: "It is cloudy.",
    twoWord: "Is cloudy",
    category: "weather",
    color: "#95A5A6", // Gray
    translations: {
      en: "Cloudy",
      hi: "बादल",
      es: "Nublado",
      fr: "Nuageux",
      zh: "多云",
    },
  },
  {
    id: "windy",
    text: "Windy",
    message: "It is windy.",
    twoWord: "Is windy",
    category: "weather",
    color: "#98D8C8", // Mint green
    translations: {
      en: "Windy",
      hi: "हवा",
      es: "Ventoso",
      fr: "Venteux",
      zh: "有风",
    },
  },
];

export const DEFAULT_VOCABULARY: VocabularyItem[] = BUTTON_TEMPLATES.map(
  (template, index) => ({
    id: template.id, // Use the template ID instead of numeric ID
    text: template.text,
    message: template.message,
    twoWord: template.twoWord,
    isFavorite: false,
    category: template.category,
    color: template.color,
    size: "medium" as const,
    translations: template.translations,
  })
);

export const DEFAULT_CATEGORIES: Category[] = [
  { id: "greetings", name: "Greetings", color: "#FF6B9D", icon: "hand-left" },
  { id: "food", name: "Food & Drink", color: "#FFB347", icon: "restaurant" },
  {
    id: "food-choices",
    name: "Food Choices",
    color: "#E91E63",
    icon: "restaurant",
  },
  { id: "needs", name: "Basic Needs", color: "#E74C3C", icon: "help-circle" },
  { id: "emotions", name: "Emotions", color: "#F1C40F", icon: "heart" },
  { id: "activities", name: "Activities", color: "#2ECC71", icon: "play" },
  { id: "people", name: "People", color: "#4ECDC4", icon: "people" },
  { id: "places", name: "Places", color: "#3498DB", icon: "location" },
  {
    id: "daily-items",
    name: "Daily Items",
    color: "#9B59B6",
    icon: "construct",
  },
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

export const getSuggestedCategoriesForAge = (age: number): string[] => {
  if (age <= 2) {
    // Very young children: basic needs, simple emotions, basic food
    return ["greetings", "needs", "emotions", "food"];
  } else if (age <= 4) {
    // Toddlers: add activities, people, basic places
    return ["greetings", "needs", "emotions", "food", "activities", "people"];
  } else if (age <= 6) {
    // Preschool: add places, daily items
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
    // Early school: add food choices, weather
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
    // Older children: all categories
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
