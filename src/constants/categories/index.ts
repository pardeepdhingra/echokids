import { Category } from "../../types";

export interface SubCategory {
  id: string;
  name: string;
  description?: string;
}

export interface CategoryWithSubs extends Category {
  subCategories?: SubCategory[];
  parentCategory?: string;
}

export const CATEGORIES: CategoryWithSubs[] = [
  {
    id: "home",
    name: "Home",
    color: "#4ECDC4",
    icon: "home",
    subCategories: [
      { id: "furniture", name: "Furniture" },
      { id: "electronics", name: "Electronics" },
      { id: "rooms", name: "Rooms" },
    ],
  },
  {
    id: "kitchen",
    name: "Kitchen",
    color: "#FFB347",
    icon: "restaurant",
    subCategories: [
      { id: "utensils", name: "Utensils" },
      { id: "containers", name: "Containers" },
    ],
  },
  {
    id: "bathroom",
    name: "Bathroom",
    color: "#45B7D1",
    icon: "medical",
    subCategories: [
      { id: "fixtures", name: "Fixtures" },
      { id: "hygiene", name: "Hygiene" },
    ],
  },
  {
    id: "clothing",
    name: "Clothing",
    color: "#9B59B6",
    icon: "shirt",
    subCategories: [
      { id: "tops", name: "Tops" },
      { id: "bottoms", name: "Bottoms" },
      { id: "accessories", name: "Accessories" },
    ],
  },
  {
    id: "food",
    name: "Food & Drink",
    color: "#E74C3C",
    icon: "restaurant",
    subCategories: [
      { id: "staples", name: "Staples" },
      { id: "proteins", name: "Proteins" },
      { id: "fruits", name: "Fruits" },
      { id: "vegetables", name: "Vegetables" },
      { id: "snacks", name: "Snacks" },
      { id: "drinks", name: "Drinks" },
    ],
  },
  {
    id: "emotions",
    name: "Feelings & Emotions",
    color: "#F1C40F",
    icon: "heart",
    subCategories: [
      { id: "positive", name: "Positive" },
      { id: "negative", name: "Negative" },
      { id: "neutral", name: "Neutral" },
    ],
  },
  {
    id: "pronouns",
    name: "Pronouns",
    color: "#FF8C42",
    icon: "person",
  },
  {
    id: "verbs",
    name: "Verbs",
    color: "#8E44AD",
    icon: "play-circle",
  },
  {
    id: "descriptors",
    name: "Descriptors",
    color: "#16A085",
    icon: "color-palette",
  },
  {
    id: "social",
    name: "Social",
    color: "#E67E22",
    icon: "chatbubbles",
  },
  {
    id: "questions",
    name: "Questions",
    color: "#2980B9",
    icon: "help-circle",
  },
  {
    id: "greetings",
    name: "Greetings",
    color: "#FF6B9D",
    icon: "hand-left",
  },
  {
    id: "needs",
    name: "Basic Needs",
    color: "#E74C3C",
    icon: "help-circle",
  },
  {
    id: "activities",
    name: "Activities",
    color: "#2ECC71",
    icon: "play",
  },
  {
    id: "people",
    name: "People",
    color: "#4ECDC4",
    icon: "people",
  },
  {
    id: "places",
    name: "Places",
    color: "#3498DB",
    icon: "location",
  },
  {
    id: "weather",
    name: "Weather",
    color: "#45B7D1",
    icon: "partly-sunny",
  },
  {
    id: "routines",
    name: "Needs & Routines",
    color: "#E67E22",
    icon: "medical",
  },
  {
    id: "play",
    name: "Play & Activities",
    color: "#2ECC71",
    icon: "game-controller",
  },
  {
    id: "animals",
    name: "Animals",
    color: "#8E44AD",
    icon: "paw",
  },
  {
    id: "colors-shapes",
    name: "Colors & Shapes",
    color: "#F39C12",
    icon: "color-palette",
  },
  {
    id: "numbers-time",
    name: "Numbers, Time, Weather",
    color: "#2980B9",
    icon: "time",
  },
  {
    id: "school",
    name: "School & Technology",
    color: "#16A085",
    icon: "school",
  },
];

export const getCategoryById = (id: string): CategoryWithSubs | undefined => {
  return CATEGORIES.find((cat) => cat.id === id);
};

export const getSubCategoryById = (
  categoryId: string,
  subCategoryId: string
): SubCategory | undefined => {
  const category = getCategoryById(categoryId);
  return category?.subCategories?.find((sub) => sub.id === subCategoryId);
};

export const getAllCategories = (): Category[] => {
  return CATEGORIES.map((cat) => ({
    id: cat.id,
    name: cat.name,
    color: cat.color,
    icon: cat.icon,
  }));
};
