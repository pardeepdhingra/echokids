import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ScrollView,
  Vibration,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { VocabularyItem, AppSettings } from "../types";
import { COLORS } from "../constants";
import { speak, playBeep } from "../utils/tts";

interface VocabularyGridProps {
  vocabulary: VocabularyItem[];
  settings: AppSettings;
  onItemPress: (item: VocabularyItem) => void;
  onItemLongPress: (item: VocabularyItem) => void;
  onItemDoublePress?: (item: VocabularyItem) => void;
  onToggleFavorite?: (item: VocabularyItem) => void;
  isChildMode?: boolean;
}

const { width } = Dimensions.get("window");

// Icon mapping for different categories and words - using common Ionicons
const ICON_MAP: { [key: string]: string } = {
  // Greetings
  hello: "hand-left",
  goodbye: "hand-right",
  "thank you": "heart",
  please: "heart-outline",
  "happy birthday": "gift",
  "i love you": "heart",

  // Food & Drink
  food: "restaurant",
  hungry: "pizza",
  water: "water",
  thirsty: "cafe",
  milk: "cafe",
  sandwich: "restaurant",
  burger: "restaurant",
  pizza: "restaurant",
  spaghetti: "restaurant",
  "cold drink": "cafe",
  juice: "cafe",
  breakfast: "restaurant",
  lunch: "restaurant",
  dinner: "restaurant",
  italian: "restaurant",
  indian: "restaurant",
  chinese: "restaurant",
  thai: "restaurant",
  mexican: "restaurant",
  apple: "restaurant",
  banana: "restaurant",
  orange: "restaurant",
  grapes: "restaurant",
  strawberry: "restaurant",
  watermelon: "restaurant",
  chips: "restaurant",
  "ice-cream": "restaurant",
  chocolate: "restaurant",
  cookies: "restaurant",

  // Basic Needs
  bathroom: "medical",
  help: "help-circle",
  tired: "bed",
  sleep: "moon",

  // Emotions
  happy: "happy",
  sad: "sad",
  angry: "flash",
  scared: "warning",
  excited: "star",
  cold: "thermometer",
  hot: "flame",
  surprised: "star",
  confused: "help-circle",
  proud: "star",

  // Activities
  play: "play",
  stop: "stop",
  more: "add",
  "all done": "checkmark",
  book: "book",
  cycling: "bicycle",
  scooter: "bicycle",
  tv: "tv",

      // People
    mom: "person",
    dad: "person",
    friend: "people",
    teacher: "school",
    brother: "person",
    sister: "person",
    grandpa: "person",
    grandma: "person",
    uncle: "person",
    aunt: "person",

  // Places
  home: "home",
  school: "school",
  park: "leaf",
  store: "storefront",
  playground: "happy",
  restaurant: "restaurant",
  "mcdonald's": "restaurant",
  hospital: "medical",
  library: "library",
  beach: "umbrella",
  soap: "water",
  shampoo: "water",
  spoon: "restaurant",
  fork: "restaurant",
  knife: "restaurant",
  scissors: "cut",
  toothbrush: "medical",
  towel: "water",
  paper: "document",
  pencil: "create",

  // Weather
  sunny: "sunny",
  rainy: "rainy",
  snowy: "snow",
  cloudy: "cloudy",
  windy: "leaf",
};

// Emoji fallback mapping
const EMOJI_MAP: { [key: string]: string } = {
  hello: "👋",
  goodbye: "👋",
  "thank you": "❤️",
  please: "🙏",
  "happy birthday": "🎂",
  "i love you": "💕",
  food: "🍽️",
  hungry: "🍕",
  water: "💧",
  thirsty: "🥤",
  milk: "🥛",
  sandwich: "🥪",
  burger: "🍔",
  pizza: "🍕",
  spaghetti: "🍝",
  "cold drink": "🥤",
  juice: "🧃",
  breakfast: "🍳",
  lunch: "🥪",
  dinner: "🍽️",
  italian: "🍝",
  indian: "🍛",
  chinese: "🥡",
  thai: "🍜",
  mexican: "🌮",
  apple: "🍎",
  banana: "🍌",
  orange: "🍊",
  grapes: "🍇",
  strawberry: "🍓",
  watermelon: "🍉",
  chips: "🍟",
  "ice-cream": "🍦",
  chocolate: "🍫",
  cookies: "🍪",
  bathroom: "🚽",
  help: "🆘",
  tired: "😴",
  sleep: "🌙",
  happy: "😊",
  sad: "😢",
  angry: "😠",
  scared: "😨",
  excited: "🎉",
  cold: "🥶",
  hot: "🥵",
  play: "🎮",
  stop: "🛑",
  more: "➕",
  "all done": "✅",
  book: "📚",
  mom: "👩",
  dad: "👨",
  friend: "👫",
  teacher: "👩‍🏫",
  brother: "👦",
  sister: "👧",
  grandpa: "👴",
  grandma: "👵",
  uncle: "👨‍🦱",
  aunt: "👩‍🦰",
  home: "🏠",
  school: "🏫",
  park: "🌳",
  store: "🏪",
  playground: "🎪",
  restaurant: "🍽️",
  "mcdonald's": "🍔",
  soap: "🧼",
  shampoo: "🧴",
  spoon: "🥄",
  fork: "🍴",
  knife: "🔪",
  scissors: "✂️",
  shower: "🚿",
  bath: "🛁",
  clothes: "👕",
  "wet nappy": "🩲",
  "dirty nappy": "🩲",
  clean: "🧼",
  dirty: "💩",

  // Weather
  sunny: "☀️",
  rainy: "🌧️",
  snowy: "❄️",
  cloudy: "☁️",
  windy: "💨",
};

const getIconForText = (text: string): string => {
  const lowerText = text.toLowerCase();
  return ICON_MAP[lowerText] || "chatbubble";
};

const getEmojiForText = (text: string): string => {
  const lowerText = text.toLowerCase();
  return EMOJI_MAP[lowerText] || "💬";
};

export const VocabularyGrid: React.FC<VocabularyGridProps> = ({
  vocabulary,
  settings,
  onItemPress,
  onItemLongPress,
  onToggleFavorite,
  isChildMode = false,
}) => {
  const [pressedItemId, setPressedItemId] = useState<string | null>(null);
  const gridSize = settings.gridSize;
  // Calculate item size based on screen width, accounting for margins and gaps
  const screenPadding = 20; // Left and right padding
  const gapSize = 8; // Gap between items
  const totalGaps = gridSize - 1; // Number of gaps in a row
  const availableWidth = width - screenPadding * 2 - totalGaps * gapSize;

  // Dynamic sizing based on grid size - larger buttons for smaller grids
  let maxItemSize;
  if (gridSize === 1) {
    maxItemSize = Math.min(availableWidth, 250); // Very large for 1x1
  } else if (gridSize === 2) {
    maxItemSize = Math.min(availableWidth / gridSize, 180); // Large for 2x2
  } else if (gridSize === 3) {
    maxItemSize = Math.min(availableWidth / gridSize, 140); // Medium for 3x3
  } else if (gridSize === 4) {
    maxItemSize = Math.min(availableWidth / gridSize, 110); // Smaller for 4x4
  } else {
    maxItemSize = Math.min(availableWidth / gridSize, 90); // Smallest for 5x5
  }

  const itemSize = maxItemSize;

  const handleItemPress = async (item: VocabularyItem) => {
    console.log("🎯 Item pressed:", item.text);

    // Add visual feedback
    setPressedItemId(item.id);
    setTimeout(() => setPressedItemId(null), 200);

    // Add stronger vibration feedback with pattern
    try {
      // Create a vibration pattern: short-long-short
      Vibration.vibrate([50, 100, 50]);
      console.log("📳 Vibration pattern triggered");
    } catch (vibrationError) {
      console.log("📳 Vibration failed:", vibrationError);
    }

    const textToSpeak = (() => {
      switch (settings.buttonMode) {
        case "sentence":
          return item.message || item.text;
        case "two-word":
          return item.twoWord || item.text;
        case "one-word":
        default:
          return item.text;
      }
    })();

    console.log("🎤 Button Mode Debug:", {
      buttonMode: settings.buttonMode,
      hasMessage: !!item.message,
      itemText: item.text,
      itemMessage: item.message,
      textToSpeak,
    });
    console.log("🎤 Button Pressed:", {
      item: item.text,
      textToSpeak,
      settings: {
        ttsVoice: settings.ttsVoice,
        buttonMode: settings.buttonMode,
        speechRate: settings.speechRate,
        volume: settings.volume,
      },
    });

    // Try TTS first, then fallback to beep
    try {
      console.log("🎤 Attempting to speak:", textToSpeak);
      console.log("🎤 Using voice:", settings.ttsVoice);
      console.log("🎤 Full settings:", settings);

      // Create a proper settings object for TTS
      const ttsSettings = {
        ttsVoice: settings.ttsVoice,
        volume: settings.volume || 1.0,
        speechRate: settings.speechRate || 0.8,
        buttonMode: settings.buttonMode,
        gridSize: settings.gridSize,
        showText: settings.showText,
        theme: settings.theme,
      };

      console.log("🎤 TTS settings:", ttsSettings);
      await speak(textToSpeak, ttsSettings);
      console.log("✅ TTS completed successfully");
    } catch (error) {
      console.log("🎤 TTS failed, trying beep fallback:", error);
      try {
        await playBeep();
        console.log("✅ Beep fallback successful");
      } catch (beepError) {
        console.log("🎤 Both TTS and beep failed, using vibration only");
        // Last resort: just vibration
        try {
          Vibration.vibrate([100, 200, 100]);
        } catch (vibrationError) {
          console.log("🎤 All feedback methods failed");
        }
      }
    }

    // Always call onItemPress, even if TTS fails
    try {
      console.log("📞 Calling onItemPress with:", item);
      onItemPress(item);
      console.log("✅ onItemPress completed successfully");
    } catch (error) {
      console.log("❌ onItemPress failed:", error);
    }
  };

  const handleItemLongPress = (item: VocabularyItem) => {
    if (!isChildMode) {
      onItemLongPress(item);
    }
  };

  const getButtonColor = (item: VocabularyItem) => {
    if (item.color) return item.color;

    switch (settings.theme) {
      case "colorful":
        return COLORS.colorful.primary;
      case "minimal":
        return COLORS.minimal.primary;
      default:
        return COLORS.default.primary;
    }
  };

  const getThemeColors = () => {
    switch (settings.theme) {
      case "colorful":
        return COLORS.colorful;
      case "minimal":
        return COLORS.minimal;
      default:
        return COLORS.default;
    }
  };

  const getButtonSize = (item: VocabularyItem) => {
    const baseSize = itemSize;
    switch (item.size) {
      case "small":
        return baseSize * 0.8;
      case "large":
        return baseSize * 1.2;
      default:
        return baseSize;
    }
  };

  const renderGridItem = (item: VocabularyItem, index: number) => {
    const buttonSize = getButtonSize(item);
    const buttonColor = getButtonColor(item);
    const iconName = getIconForText(item.text);



    const isPressed = pressedItemId === item.id;

    return (
      <TouchableOpacity
        key={item.id}
        style={[
          styles.gridItem,
          {
            width: buttonSize,
            height: buttonSize,
            backgroundColor: isPressed ? themeColors.surface : buttonColor,
            borderRadius: isChildMode ? 25 : 15,
            borderWidth: isChildMode ? 3 : 2,
            borderColor: isPressed ? themeColors.primary : themeColors.surface,
            transform: [{ scale: isPressed ? 0.95 : 1 }],
          },
        ]}
        onPress={() => handleItemPress(item)}
        {...(isChildMode
          ? {}
          : { onLongPress: () => handleItemLongPress(item) })}
        activeOpacity={0.8}
      >
        <View
                      style={[
              styles.itemContent,
              {
                padding: settings.showText ? (isChildMode ? 12 : 15) : 0, // Much more padding for better spacing
                justifyContent: settings.showText ? "space-between" : "center",
                alignItems: "center",
              },
            ]}
        >
          {settings.showText ? (
            // Text mode - icon with text below
            <>
              <View
                style={[
                  styles.itemIcon,
                  {
                    width: buttonSize * (gridSize <= 3 ? 0.7 : 0.6),
                    height: buttonSize * (gridSize <= 3 ? 0.7 : 0.6),
                    borderRadius: 20,
                    justifyContent: "center",
                    alignItems: "center",
                    marginBottom: isChildMode ? 2 : 4,
                    shadowColor: "#000",
                    shadowOffset: {
                      width: 0,
                      height: 3,
                    },
                    shadowOpacity: 0.3,
                    shadowRadius: 6,
                    elevation: 8,
                  },
                ]}
              >
                <Text
                  style={{
                    fontSize: Math.min(buttonSize * (gridSize <= 3 ? 0.5 : 0.4), gridSize <= 3 ? 70 : 50),
                    textAlign: "center",
                    textShadowColor: "rgba(0,0,0,0.3)",
                    textShadowOffset: { width: 1, height: 1 },
                    textShadowRadius: 2,
                  }}
                >
                  {getEmojiForText(item.text)}
                </Text>
              </View>

              <Text
                style={[
                  styles.itemLabel,
                  {
                    fontSize: (() => {
                      const baseSize = Math.min(
                        isChildMode ? 12 : 10,
                        buttonSize * (gridSize <= 3 ? 0.12 : 0.1)
                      );
                      // Reduce font size for longer texts
                      const textLength = item.text.length;
                      let sizeMultiplier = 1;
                      if (textLength > 10) sizeMultiplier = 0.8;
                      if (textLength > 15) sizeMultiplier = 0.7;
                      
                      switch (settings.textSize) {
                        case "small":
                          return baseSize * (gridSize <= 3 ? 0.9 : 0.8) * sizeMultiplier;
                        case "large":
                          return baseSize * (gridSize <= 3 ? 1.6 : 1.5) * sizeMultiplier;
                        default: // medium
                          return baseSize * (gridSize <= 3 ? 1.1 : 1.0) * sizeMultiplier;
                      }
                    })(),
                    color: themeColors.surface,
                    fontWeight: isChildMode ? "800" : "700",
                    textShadowColor: "rgba(0,0,0,0.3)",
                    textShadowOffset: { width: 1, height: 1 },
                    textShadowRadius: 2,
                    width: buttonSize * 0.9,
                    textAlign: "center",
                  },
                ]}
                numberOfLines={isChildMode ? 2 : 1}
                adjustsFontSizeToFit={true}
                minimumFontScale={isChildMode ? 0.5 : 0.7}
                ellipsizeMode="tail"
              >
                {item.text}
              </Text>
            </>
          ) : (
            // Image-only mode - large emoji covering the entire button
            <View
              style={[
                styles.fullSizeIcon,
                {
                  width: buttonSize * 0.8,
                  height: buttonSize * 0.8,
                  justifyContent: "center",
                  alignItems: "center",
                },
              ]}
            >
              <Text
                style={{
                  fontSize: Math.min(buttonSize * 0.5, 60), // Smaller emoji
                  textAlign: "center",
                }}
              >
                {getEmojiForText(item.text)}
              </Text>
            </View>
          )}

          {!isChildMode && onToggleFavorite && (
            <TouchableOpacity
              style={styles.favoriteButton}
              onPress={() => onToggleFavorite(item)}
            >
              <Text
                style={{
                  fontSize: 14,
                  color: item.isFavorite ? "#FFD700" : "#CCC",
                }}
              >
                {item.isFavorite ? "⭐" : "☆"}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const themeColors = getThemeColors();

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: themeColors.background }]}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
      bounces={true}
    >
      <View style={styles.grid}>
        {vocabulary.map((item, index) => renderGridItem(item, index))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 100, // Extra space at bottom for FAB buttons
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    gap: 8,
  },
  gridItem: {
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  itemContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 8,
  },
  itemIcon: {
    marginBottom: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  fullSizeIcon: {
    justifyContent: "center",
    alignItems: "center",
  },
  itemLabel: {
    textAlign: "center",
    lineHeight: 22,
  },
  favoriteBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: COLORS.surface,
    borderRadius: 10,
    padding: 2,
  },
  favoriteButton: {
    position: "absolute",
    top: 4,
    right: 4,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 10,
    padding: 4,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
});
