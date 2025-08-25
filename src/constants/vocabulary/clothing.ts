import { ButtonTemplate } from "../../types";
import { getTranslationsForWord } from "../translations";

export const CLOTHING_VOCABULARY: ButtonTemplate[] = [
  // Tops
  {
    id: "shirt",
    text: "Shirt",
    message: "I want to wear a shirt.",
    twoWord: "Want shirt",
    category: "clothing",
    subCategory: "tops",
    color: "#9B59B6",
    translations: getTranslationsForWord("shirt"),
  },
  {
    id: "dress",
    text: "Dress",
    message: "I want to wear a dress.",
    twoWord: "Want dress",
    category: "clothing",
    subCategory: "tops",
    color: "#9B59B6",
    translations: getTranslationsForWord("dress"),
  },
  {
    id: "jacket",
    text: "Jacket",
    message: "I want to wear a jacket.",
    twoWord: "Want jacket",
    category: "clothing",
    subCategory: "tops",
    color: "#9B59B6",
    translations: getTranslationsForWord("jacket"),
  },
  {
    id: "coat",
    text: "Coat",
    message: "I want to wear a coat.",
    twoWord: "Want coat",
    category: "clothing",
    subCategory: "tops",
    color: "#9B59B6",
    translations: getTranslationsForWord("coat"),
  },

  // Bottoms
  {
    id: "pants",
    text: "Pants",
    message: "I want to wear pants.",
    twoWord: "Want pants",
    category: "clothing",
    subCategory: "bottoms",
    color: "#9B59B6",
    translations: getTranslationsForWord("pants"),
  },

  // Accessories
  {
    id: "shoes",
    text: "Shoes",
    message: "I want to wear shoes.",
    twoWord: "Want shoes",
    category: "clothing",
    subCategory: "accessories",
    color: "#9B59B6",
    translations: getTranslationsForWord("shoes"),
  },
  {
    id: "socks",
    text: "Socks",
    message: "I want to wear socks.",
    twoWord: "Want socks",
    category: "clothing",
    subCategory: "accessories",
    color: "#9B59B6",
    translations: getTranslationsForWord("socks"),
  },
  {
    id: "hat",
    text: "Hat",
    message: "I want to wear a hat.",
    twoWord: "Want hat",
    category: "clothing",
    subCategory: "accessories",
    color: "#9B59B6",
    translations: getTranslationsForWord("hat"),
  },
];
