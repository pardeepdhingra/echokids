// Symbol mapping for Mulberry symbols from GitHub Pages CDN

// GitHub Pages CDN URL
const CDN_BASE_URL = "https://pardeepdhingra.github.io/mulberry-symbols-cdn";

// Interface for symbol information
interface SymbolInfo {
  id: string;
  filename: string;
  category: string;
  keywords: string[];
  description?: string;
}

// Map to store symbol information
export const SYMBOL_INFO: { [key: string]: SymbolInfo } = {
  // Greetings
  hello: {
    id: "hello",
    filename: "hello.svg",
    category: "greetings",
    keywords: ["hello", "hi", "greet"],
  },
  goodbye: {
    id: "goodbye",
    filename: "goodbye.svg",
    category: "greetings",
    keywords: ["goodbye", "bye"],
  },
  "thank-you": {
    id: "thank-you",
    filename: "thank_you.svg",
    category: "greetings",
    keywords: ["thank you", "thanks", "grateful"],
  },
  please: {
    id: "please",
    filename: "please.svg",
    category: "greetings",
    keywords: ["please", "request"],
  },
  "happy-birthday": {
    id: "happy-birthday",
    filename: "happy_birthday.svg",
    category: "greetings",
    keywords: ["happy birthday", "birthday", "celebration"],
  },
  "i-love-you": {
    id: "i-love-you",
    filename: "i_love_you.svg",
    category: "greetings",
    keywords: ["love", "affection"],
  },

  // Food & Drink
  food: {
    id: "food",
    filename: "food.svg",
    category: "food",
    keywords: ["food", "eat", "meal"],
  },
  hungry: {
    id: "hungry",
    filename: "hungry.svg",
    category: "food",
    keywords: ["hungry", "hunger", "appetite"],
  },
  water: {
    id: "water",
    filename: "water.svg",
    category: "drink",
    keywords: ["water", "drink"],
  },
  thirsty: {
    id: "thirsty",
    filename: "thirsty.svg",
    category: "drink",
    keywords: ["thirsty", "need drink"],
  },
  milk: {
    id: "milk",
    filename: "milk.svg",
    category: "drink",
    keywords: ["milk", "dairy"],
  },
  sandwich: {
    id: "sandwich",
    filename: "sandwich.svg",
    category: "food",
    keywords: ["sandwich", "bread", "lunch"],
  },
  burger: {
    id: "burger",
    filename: "hamburger.svg",
    category: "food",
    keywords: ["burger", "hamburger", "fast food"],
  },
  pizza: {
    id: "pizza",
    filename: "pizza.svg",
    category: "food",
    keywords: ["pizza", "italian"],
  },
  spaghetti: {
    id: "spaghetti",
    filename: "spaghetti.svg",
    category: "food",
    keywords: ["spaghetti", "pasta", "italian"],
  },
  "cold-drink": {
    id: "cold-drink",
    filename: "drink_cold.svg",
    category: "drink",
    keywords: ["cold drink", "beverage"],
  },
  juice: {
    id: "juice",
    filename: "apple_juice.svg",
    category: "drink",
    keywords: ["juice", "fruit juice"],
  },
  breakfast: {
    id: "breakfast",
    filename: "breakfast_1.svg",
    category: "food",
    keywords: ["breakfast", "morning meal"],
  },
  lunch: {
    id: "lunch",
    filename: "lunch_1.svg",
    category: "food",
    keywords: ["lunch", "midday meal"],
  },
  dinner: {
    id: "dinner",
    filename: "dinner.svg",
    category: "food",
    keywords: ["dinner", "evening meal"],
  },
  italian: {
    id: "italian",
    filename: "italian_food.svg",
    category: "cuisine",
    keywords: ["italian", "cuisine"],
  },
  indian: {
    id: "indian",
    filename: "takeaway_indian.svg",
    category: "cuisine",
    keywords: ["indian", "cuisine"],
  },
  chinese: {
    id: "chinese",
    filename: "takeaway_chinese.svg",
    category: "cuisine",
    keywords: ["chinese", "cuisine"],
  },
  thai: {
    id: "thai",
    filename: "thai_food.svg",
    category: "cuisine",
    keywords: ["thai", "cuisine"],
  },
  mexican: {
    id: "mexican",
    filename: "mexican_food.svg",
    category: "cuisine",
    keywords: ["mexican", "cuisine"],
  },
  apple: {
    id: "apple",
    filename: "apple.svg",
    category: "fruit",
    keywords: ["apple", "fruit"],
  },
  banana: {
    id: "banana",
    filename: "banana.svg",
    category: "fruit",
    keywords: ["banana", "fruit"],
  },
  orange: {
    id: "orange",
    filename: "orange.svg",
    category: "fruit",
    keywords: ["orange", "fruit"],
  },
  grapes: {
    id: "grapes",
    filename: "grapes.svg",
    category: "fruit",
    keywords: ["grapes", "fruit"],
  },
  strawberry: {
    id: "strawberry",
    filename: "strawberry.svg",
    category: "fruit",
    keywords: ["strawberry", "fruit"],
  },
  watermelon: {
    id: "watermelon",
    filename: "watermelon.svg",
    category: "fruit",
    keywords: ["watermelon", "fruit"],
  },
  chips: {
    id: "chips",
    filename: "chips.svg",
    category: "snack",
    keywords: ["chips", "crisps", "snack"],
  },
  "ice-cream": {
    id: "ice-cream",
    filename: "ice_cream.svg",
    category: "dessert",
    keywords: ["ice cream", "dessert"],
  },
  chocolate: {
    id: "chocolate",
    filename: "chocolate.svg",
    category: "snack",
    keywords: ["chocolate", "sweet"],
  },
  cookies: {
    id: "cookies",
    filename: "biscuit_chocolate_chip.svg",
    category: "snack",
    keywords: ["cookies", "biscuits"],
  },

  // Basic Needs
  bathroom: {
    id: "bathroom",
    filename: "bathroom.svg",
    category: "needs",
    keywords: ["bathroom", "toilet"],
  },
  help: {
    id: "help",
    filename: "help.svg",
    category: "needs",
    keywords: ["help", "assistance"],
  },
  tired: {
    id: "tired",
    filename: "tired.svg",
    category: "needs",
    keywords: ["tired", "sleepy"],
  },
  sleep: {
    id: "sleep",
    filename: "sleep_female_,_to.svg",
    category: "needs",
    keywords: ["sleep", "rest"],
  },

  // Emotions
  happy: {
    id: "happy",
    filename: "happy_man.svg",
    category: "emotions",
    keywords: ["happy", "joy"],
  },
  sad: {
    id: "sad",
    filename: "sad_man.svg",
    category: "emotions",
    keywords: ["sad", "unhappy"],
  },
  angry: {
    id: "angry",
    filename: "angry_man.svg",
    category: "emotions",
    keywords: ["angry", "mad"],
  },
  scared: {
    id: "scared",
    filename: "afraid_man.svg",
    category: "emotions",
    keywords: ["scared", "afraid"],
  },
  excited: {
    id: "excited",
    filename: "excited.svg",
    category: "emotions",
    keywords: ["excited", "thrilled"],
  },
  cold: {
    id: "cold",
    filename: "cold.svg",
    category: "feelings",
    keywords: ["cold", "chilly"],
  },
  hot: {
    id: "hot",
    filename: "hot.svg",
    category: "feelings",
    keywords: ["hot", "warm"],
  },
  surprised: {
    id: "surprised",
    filename: "surprised_man.svg",
    category: "emotions",
    keywords: ["surprised", "shocked"],
  },
  confused: {
    id: "confused",
    filename: "confused_man.svg",
    category: "emotions",
    keywords: ["confused", "puzzled"],
  },
  proud: {
    id: "proud",
    filename: "proud.svg",
    category: "emotions",
    keywords: ["proud", "achievement"],
  },
  clean: {
    id: "clean",
    filename: "clean_hands.svg",
    category: "hygiene",
    keywords: ["clean", "hygiene"],
  },
  dirty: {
    id: "dirty",
    filename: "dirty.svg",
    category: "hygiene",
    keywords: ["dirty", "unclean"],
  },

  // Activities
  play: {
    id: "play",
    filename: "play_,_to.svg",
    category: "activities",
    keywords: ["play", "fun"],
  },
  stop: {
    id: "stop",
    filename: "stop.svg",
    category: "actions",
    keywords: ["stop", "halt"],
  },
  more: {
    id: "more",
    filename: "more.svg",
    category: "actions",
    keywords: ["more", "additional"],
  },
  "all-done": {
    id: "all-done",
    filename: "all_done.svg",
    category: "actions",
    keywords: ["finished", "complete"],
  },
  book: {
    id: "book",
    filename: "book.svg",
    category: "objects",
    keywords: ["book", "reading"],
  },
  cycling: {
    id: "cycling",
    filename: "cycle_,_to.svg",
    category: "activities",
    keywords: ["cycling", "bike"],
  },
  scooter: {
    id: "scooter",
    filename: "scooter.svg",
    category: "activities",
    keywords: ["scooter", "ride"],
  },
  tv: {
    id: "tv",
    filename: "tv_drama.svg",
    category: "activities",
    keywords: ["tv", "television"],
  },

  // People
  mom: {
    id: "mom",
    filename: "mom.svg",
    category: "people",
    keywords: ["mom", "mother"],
  },
  dad: {
    id: "dad",
    filename: "dad_parent.svg",
    category: "people",
    keywords: ["dad", "father"],
  },
  friend: {
    id: "friend",
    filename: "friend.svg",
    category: "people",
    keywords: ["friend", "pal"],
  },
  teacher: {
    id: "teacher",
    filename: "teacher_1a.svg",
    category: "people",
    keywords: ["teacher", "instructor"],
  },
  brother: {
    id: "brother",
    filename: "brother.svg",
    category: "people",
    keywords: ["brother", "sibling"],
  },
  sister: {
    id: "sister",
    filename: "sister.svg",
    category: "people",
    keywords: ["sister", "sibling"],
  },
  grandpa: {
    id: "grandpa",
    filename: "grandfather.svg",
    category: "people",
    keywords: ["grandpa", "grandfather"],
  },
  grandma: {
    id: "grandma",
    filename: "grandmother.svg",
    category: "people",
    keywords: ["grandma", "grandmother"],
  },
  uncle: {
    id: "uncle",
    filename: "uncle_maternal.svg",
    category: "people",
    keywords: ["uncle", "relative"],
  },
  aunt: {
    id: "aunt",
    filename: "aunt_maternal.svg",
    category: "people",
    keywords: ["aunt", "relative"],
  },

  // Places
  home: {
    id: "home",
    filename: "home.svg",
    category: "places",
    keywords: ["home", "house"],
  },
  school: {
    id: "school",
    filename: "school.svg",
    category: "places",
    keywords: ["school", "education"],
  },
  park: {
    id: "park",
    filename: "park_,_to.svg",
    category: "places",
    keywords: ["park", "playground"],
  },
  store: {
    id: "store",
    filename: "shop.svg",
    category: "places",
    keywords: ["store", "shop"],
  },
  playground: {
    id: "playground",
    filename: "play_area.svg",
    category: "places",
    keywords: ["playground", "play area"],
  },
  restaurant: {
    id: "restaurant",
    filename: "restaurant.svg",
    category: "places",
    keywords: ["restaurant", "dining"],
  },
  mcdonalds: {
    id: "mcdonalds",
    filename: "mcdonalds.svg",
    category: "places",
    keywords: ["mcdonalds", "fast food"],
  },
  hospital: {
    id: "hospital",
    filename: "hospital.svg",
    category: "places",
    keywords: ["hospital", "medical"],
  },
  library: {
    id: "library",
    filename: "library.svg",
    category: "places",
    keywords: ["library", "books"],
  },
  beach: {
    id: "beach",
    filename: "beach.svg",
    category: "places",
    keywords: ["beach", "seaside"],
  },

  // Daily Items
  soap: {
    id: "soap",
    filename: "soap.svg",
    category: "hygiene",
    keywords: ["soap", "wash"],
  },
  shampoo: {
    id: "shampoo",
    filename: "shampoo.svg",
    category: "hygiene",
    keywords: ["shampoo", "hair wash"],
  },
  spoon: {
    id: "spoon",
    filename: "spoon.svg",
    category: "utensils",
    keywords: ["spoon", "cutlery"],
  },
  fork: {
    id: "fork",
    filename: "fork.svg",
    category: "utensils",
    keywords: ["fork", "cutlery"],
  },
  knife: {
    id: "knife",
    filename: "knife.svg",
    category: "utensils",
    keywords: ["knife", "cutlery"],
  },
  scissors: {
    id: "scissors",
    filename: "scissors.svg",
    category: "tools",
    keywords: ["scissors", "cut"],
  },
  toothbrush: {
    id: "toothbrush",
    filename: "toothbrush.svg",
    category: "hygiene",
    keywords: ["toothbrush", "dental"],
  },
  towel: {
    id: "towel",
    filename: "towel.svg",
    category: "hygiene",
    keywords: ["towel", "dry"],
  },
  paper: {
    id: "paper",
    filename: "paper.svg",
    category: "stationery",
    keywords: ["paper", "sheet"],
  },
  pencil: {
    id: "pencil",
    filename: "pencil.svg",
    category: "stationery",
    keywords: ["pencil", "write"],
  },

  // Needs
  shower: {
    id: "shower",
    filename: "shower.svg",
    category: "hygiene",
    keywords: ["shower", "wash"],
  },
  bath: {
    id: "bath",
    filename: "bath.svg",
    category: "hygiene",
    keywords: ["bath", "wash"],
  },
  clothes: {
    id: "clothes",
    filename: "clothes_generic.svg",
    category: "clothing",
    keywords: ["clothes", "dress"],
  },
  "wet-nappy": {
    id: "wet-nappy",
    filename: "wet.svg",
    category: "hygiene",
    keywords: ["wet nappy", "diaper"],
  },
  "dirty-nappy": {
    id: "dirty-nappy",
    filename: "dirty.svg",
    category: "hygiene",
    keywords: ["dirty nappy", "diaper"],
  },

  // Weather
  sunny: {
    id: "sunny",
    filename: "sunny.svg",
    category: "weather",
    keywords: ["sunny", "sun"],
  },
  rainy: {
    id: "rainy",
    filename: "rainy.svg",
    category: "weather",
    keywords: ["rainy", "rain"],
  },
  snowy: {
    id: "snowy",
    filename: "snowy.svg",
    category: "weather",
    keywords: ["snowy", "snow"],
  },
  cloudy: {
    id: "cloudy",
    filename: "cloudy.svg",
    category: "weather",
    keywords: ["cloudy", "clouds"],
  },
  windy: {
    id: "windy",
    filename: "windy.svg",
    category: "weather",
    keywords: ["windy", "wind"],
  },
};

// Function to get the CDN URL for a symbol
export const getSymbolUrl = (itemId: string): string => {
  const symbolInfo = SYMBOL_INFO[itemId];
  if (!symbolInfo) {
    return "";
  }

  return `${CDN_BASE_URL}/${symbolInfo.filename}`;
};

// Function to check if a symbol exists
export const hasMulberrySymbol = (itemId: string): boolean => {
  return !!SYMBOL_INFO[itemId];
};

// Function to get symbol information
export const getSymbolInfo = (itemId: string): SymbolInfo | null => {
  return SYMBOL_INFO[itemId] || null;
};

// Function to search symbols by keyword
export const searchSymbolsByKeyword = (keyword: string): SymbolInfo[] => {
  const normalizedKeyword = keyword.toLowerCase().trim();
  return Object.values(SYMBOL_INFO).filter(
    (symbol) =>
      symbol.keywords.some((k) =>
        k.toLowerCase().includes(normalizedKeyword)
      ) ||
      symbol.category.toLowerCase().includes(normalizedKeyword) ||
      symbol.id.toLowerCase().includes(normalizedKeyword)
  );
};

// Function to get symbols by category
export const getSymbolsByCategory = (category: string): SymbolInfo[] => {
  return Object.values(SYMBOL_INFO).filter(
    (symbol) => symbol.category.toLowerCase() === category.toLowerCase()
  );
};

// Function to get local asset path (for development/testing)
export const getSymbolPath = (
  itemId: string,
  symbolType: "emoji" | "mulberry"
): string => {
  if (symbolType === "emoji") {
    return "";
  }

  return getSymbolUrl(itemId);
};
