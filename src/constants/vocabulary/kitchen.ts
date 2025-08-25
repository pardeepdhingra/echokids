import { ButtonTemplate } from "../../types";
import { getTranslationsForWord } from "../translations";

export const KITCHEN_VOCABULARY: ButtonTemplate[] = [
  // Utensils
  {
    id: "plate",
    text: "Plate",
    message: "I want a plate.",
    twoWord: "Want plate",
    category: "kitchen",
    subCategory: "utensils",
    color: "#FFB347",
    translations: getTranslationsForWord("plate"),
  },
  {
    id: "cup",
    text: "Cup",
    message: "I want a cup.",
    twoWord: "Want cup",
    category: "kitchen",
    subCategory: "utensils",
    color: "#FFB347",
    translations: getTranslationsForWord("cup"),
  },
  {
    id: "spoon",
    text: "Spoon",
    message: "I want a spoon.",
    twoWord: "Want spoon",
    category: "kitchen",
    subCategory: "utensils",
    color: "#FFB347",
    translations: getTranslationsForWord("spoon"),
  },
  {
    id: "fork",
    text: "Fork",
    message: "I want a fork.",
    twoWord: "Want fork",
    category: "kitchen",
    subCategory: "utensils",
    color: "#FFB347",
    translations: getTranslationsForWord("fork"),
  },
  {
    id: "knife",
    text: "Knife",
    message: "I want a knife.",
    twoWord: "Want knife",
    category: "kitchen",
    subCategory: "utensils",
    color: "#FFB347",
    translations: getTranslationsForWord("knife"),
  },

  // Containers
  {
    id: "bowl",
    text: "Bowl",
    message: "I want a bowl.",
    twoWord: "Want bowl",
    category: "kitchen",
    subCategory: "containers",
    color: "#FFB347",
    translations: getTranslationsForWord("bowl"),
  },
  {
    id: "bottle",
    text: "Bottle",
    message: "I want a bottle.",
    twoWord: "Want bottle",
    category: "kitchen",
    subCategory: "containers",
    color: "#FFB347",
    translations: getTranslationsForWord("bottle"),
  },
];
