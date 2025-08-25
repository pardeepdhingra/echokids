import { ButtonTemplate } from "../../types";
import { getTranslationsForWord } from "../translations";

export const QUESTIONS_VOCABULARY: ButtonTemplate[] = [
  {
    id: "what",
    text: "What",
    message: "What?",
    twoWord: "What",
    category: "questions",
    color: "#2980B9",
    translations: getTranslationsForWord("what"),
  },
  {
    id: "where",
    text: "Where",
    message: "Where?",
    twoWord: "Where",
    category: "questions",
    color: "#2980B9",
    translations: getTranslationsForWord("where"),
  },
  {
    id: "who",
    text: "Who",
    message: "Who?",
    twoWord: "Who",
    category: "questions",
    color: "#2980B9",
    translations: getTranslationsForWord("who"),
  },
  {
    id: "when",
    text: "When",
    message: "When?",
    twoWord: "When",
    category: "questions",
    color: "#2980B9",
    translations: getTranslationsForWord("when"),
  },
  {
    id: "why",
    text: "Why",
    message: "Why?",
    twoWord: "Why",
    category: "questions",
    color: "#2980B9",
    translations: getTranslationsForWord("why"),
  },
  {
    id: "how",
    text: "How",
    message: "How?",
    twoWord: "How",
    category: "questions",
    color: "#2980B9",
    translations: getTranslationsForWord("how"),
  },
];
