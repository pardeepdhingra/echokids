import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  Modal,
} from "react-native";
import * as Localization from "expo-localization";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { AppSettings } from "../types";
import {
  COLORS,
  GRID_SIZES,
  VOICE_OPTIONS,
  VOICE_CATEGORIES,
  BUTTON_SIZES,
  DEFAULT_CATEGORIES,
  updateVoiceOptions,
  getDefaultVoice,
  SUPPORTED_LANGUAGES,
} from "../constants";
import { saveSettings, loadSettings } from "../utils/storage";
import { speak, getAvailableVoices } from "../utils/tts";

interface SettingsScreenProps {
  navigation: any;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  navigation,
}) => {
  const [settings, setSettings] = useState<AppSettings>({
    gridSize: 3,
    ttsVoice: "en-US",
    volume: 1.0,
    speechRate: 0.8,
    buttonMode: "sentence",
    showText: true,
    theme: "colorful",
    enableChildFilter: false,
    textSize: "medium",
    hiddenCategories: [],
    language: "en",
  });
  const [isLocked, setIsLocked] = useState(false);
  const [showVoiceModal, setShowVoiceModal] = useState(false);
  const [selectedVoiceCategory, setSelectedVoiceCategory] = useState("all");
  const [selectedLanguage, setSelectedLanguage] = useState("all");
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [availableVoices, setAvailableVoices] = useState<
    Array<{ identifier: string; name: string }>
  >([]);
  const [deviceLanguage, setDeviceLanguage] = useState("en-US");

  useEffect(() => {
    const initializeApp = async () => {
      await loadSettingsData();
      await loadAvailableVoices();
      detectDeviceLanguage();
    };
    initializeApp();
  }, []);

  const detectDeviceLanguage = () => {
    const locale = Localization.getLocales()[0];
    console.log("🌍 Device locale:", locale);

    // Convert locale to language code (e.g., "en-US" from "en-US")
    const languageCode =
      locale.languageCode + "-" + (locale.regionCode || "US");
    setDeviceLanguage(languageCode);
    setSelectedLanguage(languageCode);

    console.log("🌍 Detected language:", languageCode);
  };

  const loadSettingsData = async () => {
    const savedSettings = await loadSettings();
    console.log("🔧 Settings Loaded:", savedSettings);
    console.log("🔧 Button Mode:", savedSettings.buttonMode);
    console.log("🔧 Theme:", savedSettings.theme);
    setSettings(savedSettings);
  };

  const loadAvailableVoices = async () => {
    const voices = await getAvailableVoices();
    console.log("🔧 Loaded available voices:", voices.length);
    setAvailableVoices(voices);

    // Update voice options with available voices
    updateVoiceOptions(voices);

    // Get current settings to validate voice
    const currentSettings = await loadSettings();

    // Validate current voice exists in available voices
    const currentVoiceExists = voices.some(
      (v) => v.identifier === currentSettings.ttsVoice
    );
    console.log("🔧 Current voice exists:", {
      ttsVoice: currentSettings.ttsVoice,
      exists: currentVoiceExists,
    });

    if (!currentVoiceExists) {
      // Current voice doesn't exist, set to default
      const defaultVoice = getDefaultVoice(voices);
      console.log("🔧 Setting default voice:", defaultVoice);
      await handleSettingChange("ttsVoice", defaultVoice);
    }
  };

  const handleSettingChange = async (key: keyof AppSettings, value: any) => {
    const newSettings = { ...settings, [key]: value };
    console.log("🔧 Setting Changed:", { key, value, newSettings });
    setSettings(newSettings);
    await saveSettings(newSettings);
  };

  const handleLockToggle = () => {
    setIsLocked(!isLocked);
    Alert.alert(
      isLocked ? "Unlock App" : "Lock App",
      isLocked
        ? "App is now unlocked. Child can access editing features."
        : "App is now locked. Child cannot access editing features."
    );
  };

  const handleResetData = () => {
    Alert.alert(
      "Reset All Data",
      "This will reset all vocabulary, settings, and favorites. This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reset",
          style: "destructive",
          onPress: async () => {
            Alert.alert("Success", "All data has been reset to defaults.");
          },
        },
      ]
    );
  };

  const handleVoiceSelect = async (voiceId: string) => {
    console.log("🎤 Voice Selected:", voiceId);
    await handleSettingChange("ttsVoice", voiceId);
    setShowVoiceModal(false);

    const selectedVoice = availableVoices.find((v) => v.identifier === voiceId);
    if (selectedVoice) {
      console.log("🎤 Previewing voice:", selectedVoice);
      await speak(`Hello, I'm ${selectedVoice.name}`, {
        ...settings,
        ttsVoice: voiceId,
      });
    }
  };

  const previewVoice = async (voiceId: string) => {
    console.log("🎤 Previewing voice ID:", voiceId);

    // Find the voice details from both arrays
    const voiceFromOptions = VOICE_OPTIONS.find((v) => v.id === voiceId);
    const voiceFromAvailable = availableVoices.find(
      (v) => v.identifier === voiceId
    );

    console.log("🎤 Voice from options:", voiceFromOptions);
    console.log("🎤 Voice from available:", voiceFromAvailable);

    // Create a proper settings object for TTS
    const previewSettings = {
      ttsVoice: voiceId,
      volume: settings.volume || 1.0,
      speechRate: settings.speechRate || 0.8,
    };
    console.log("🎤 Preview settings:", previewSettings);

    try {
      await speak("Hello, this is a voice preview", previewSettings);
      console.log("✅ Voice preview started");
    } catch (error) {
      console.error("❌ Voice preview failed:", error);
    }
  };

  const filteredVoices = VOICE_OPTIONS.filter((voice) => {
    // Filter by category
    if (selectedVoiceCategory !== "all") {
      if (selectedVoiceCategory === "adult-female") {
        return voice.category === "adult-female";
      }
      if (selectedVoiceCategory === "adult-male") {
        return voice.category === "adult-male";
      }
    }
    return true;
  });

  console.log("🔧 Voice filtering:", {
    selectedCategory: selectedVoiceCategory,
    totalVoices: VOICE_OPTIONS.length,
    filteredCount: filteredVoices.length,
    categories: VOICE_OPTIONS.map((v) => ({
      name: v.name,
      category: v.category,
    })),
  });

  const renderSettingItem = (
    title: string,
    subtitle: string,
    children: React.ReactNode
  ) => (
    <View style={styles.settingItem}>
      <View style={styles.settingHeader}>
        <Text style={styles.settingTitle}>{title}</Text>
        <Text style={styles.settingSubtitle}>{subtitle}</Text>
      </View>
      {children}
    </View>
  );

  const renderVoiceModal = () => (
    <Modal visible={showVoiceModal} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Select Voice</Text>
            <TouchableOpacity onPress={() => setShowVoiceModal(false)}>
              <Text style={{ fontSize: 24, color: COLORS.text }}>✕</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.voiceCategories}>
            <Text style={styles.filterLabel}>Language:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <TouchableOpacity
                style={[
                  styles.categoryChip,
                  selectedLanguage === "all" && styles.categoryChipActive,
                ]}
                onPress={() => setSelectedLanguage("all")}
              >
                <Text
                  style={[
                    styles.categoryChipText,
                    selectedLanguage === "all" && styles.categoryChipTextActive,
                  ]}
                >
                  All Languages
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.categoryChip,
                  selectedLanguage === deviceLanguage &&
                    styles.categoryChipActive,
                ]}
                onPress={() => setSelectedLanguage(deviceLanguage)}
              >
                <Text
                  style={[
                    styles.categoryChipText,
                    selectedLanguage === deviceLanguage &&
                      styles.categoryChipTextActive,
                  ]}
                >
                  {deviceLanguage}
                </Text>
              </TouchableOpacity>
            </ScrollView>

            <Text style={styles.filterLabel}>Voice Type:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {VOICE_CATEGORIES.map((category) => (
                <TouchableOpacity
                  key={category.id}
                  style={[
                    styles.categoryChip,
                    selectedVoiceCategory === category.id &&
                      styles.categoryChipActive,
                  ]}
                  onPress={() => setSelectedVoiceCategory(category.id)}
                >
                  <Text
                    style={[
                      styles.categoryChipText,
                      selectedVoiceCategory === category.id &&
                        styles.categoryChipTextActive,
                    ]}
                  >
                    {category.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <ScrollView style={styles.voiceList}>
            {filteredVoices.map((voice) => (
              <TouchableOpacity
                key={voice.id}
                style={[
                  styles.voiceOption,
                  settings.ttsVoice === voice.id && styles.voiceOptionActive,
                ]}
                onPress={() => handleVoiceSelect(voice.id)}
              >
                <View style={styles.voiceInfo}>
                  <Text style={styles.voiceName}>{voice.name}</Text>
                  <Text style={styles.voiceLanguage}>{voice.language}</Text>
                </View>
                <View style={styles.voiceActions}>
                  <TouchableOpacity
                    style={styles.previewButton}
                    onPress={() => previewVoice(voice.id)}
                  >
                    <Text style={{ fontSize: 16, color: COLORS.primary }}>
                      ▶️
                    </Text>
                  </TouchableOpacity>
                  {settings.ttsVoice === voice.id && (
                    <Text style={{ fontSize: 20, color: COLORS.success }}>
                      ✓
                    </Text>
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  const currentVoice =
    VOICE_OPTIONS.find((v) => v.id === settings.ttsVoice) ||
    availableVoices.find((v) => v.identifier === settings.ttsVoice);

  console.log("🔧 Voice selection debug:", {
    settingsTtsVoice: settings.ttsVoice,
    voiceOptionsLength: VOICE_OPTIONS.length,
    availableVoicesLength: availableVoices.length,
    currentVoice: currentVoice,
    voiceOptionsIds: VOICE_OPTIONS.map((v) => v.id),
    availableVoiceIds: availableVoices.map((v) => v.identifier),
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Text style={{ fontSize: 24, color: COLORS.primary }}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content}>
        {renderSettingItem(
          "Button Mode",
          "Choose between one-word, two-word, or sentence mode",
          <View style={styles.modeButtons}>
            <TouchableOpacity
              style={[
                styles.modeButton,
                settings.buttonMode === "one-word" && styles.modeButtonActive,
              ]}
              onPress={() => handleSettingChange("buttonMode", "one-word")}
            >
              <Text
                style={{
                  fontSize: 24,
                  color:
                    settings.buttonMode === "one-word"
                      ? COLORS.surface
                      : COLORS.primary,
                }}
              >
                📝
              </Text>
              <Text
                style={[
                  styles.modeButtonText,
                  settings.buttonMode === "one-word" &&
                    styles.modeButtonTextActive,
                ]}
              >
                One Word
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.modeButton,
                settings.buttonMode === "two-word" && styles.modeButtonActive,
              ]}
              onPress={() => handleSettingChange("buttonMode", "two-word")}
            >
              <Text
                style={{
                  fontSize: 24,
                  color:
                    settings.buttonMode === "two-word"
                      ? COLORS.surface
                      : COLORS.primary,
                }}
              >
                📋
              </Text>
              <Text
                style={[
                  styles.modeButtonText,
                  settings.buttonMode === "two-word" &&
                    styles.modeButtonTextActive,
                ]}
              >
                Two Words
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.modeButton,
                settings.buttonMode === "sentence" && styles.modeButtonActive,
              ]}
              onPress={() => handleSettingChange("buttonMode", "sentence")}
            >
              <Text
                style={{
                  fontSize: 24,
                  color:
                    settings.buttonMode === "sentence"
                      ? COLORS.surface
                      : COLORS.primary,
                }}
              >
                💬
              </Text>
              <Text
                style={[
                  styles.modeButtonText,
                  settings.buttonMode === "sentence" &&
                    styles.modeButtonTextActive,
                ]}
              >
                Sentence
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {renderSettingItem(
          "Grid Size",
          "Number of items per row",
          <View style={styles.pickerContainer}>
            <View style={styles.gridSizeButtons}>
              {GRID_SIZES.map((size) => (
                <TouchableOpacity
                  key={size}
                  style={[
                    styles.gridSizeButton,
                    settings.gridSize === size && styles.gridSizeButtonActive,
                  ]}
                  onPress={() => handleSettingChange("gridSize", size)}
                >
                  <Text
                    style={[
                      styles.gridSizeText,
                      settings.gridSize === size && styles.gridSizeTextActive,
                    ]}
                  >
                    {size}x{size}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {renderSettingItem(
          "TTS Voice",
          "Select voice for text-to-speech",
          <View>
            <TouchableOpacity
              style={styles.voiceSelector}
              onPress={() => setShowVoiceModal(true)}
            >
              <View style={styles.voiceSelectorContent}>
                <View>
                  <Text style={styles.currentVoiceName}>
                    {currentVoice?.name || "Default Voice"}
                  </Text>
                  <Text style={styles.currentVoiceLanguage}>
                    {(currentVoice as any)?.language || "en-US"}
                  </Text>
                </View>
                <Text style={{ fontSize: 20, color: COLORS.textSecondary }}>
                  →
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.testButton, { marginTop: 10 }]}
              onPress={async () => {
                console.log("🧪 Testing TTS...");
                try {
                  await speak("Hello, this is a TTS test", settings);
                  Alert.alert(
                    "TTS Test",
                    "TTS is working! You should have heard the test message."
                  );
                } catch (error) {
                  Alert.alert(
                    "TTS Test",
                    "TTS test failed. Check console for details."
                  );
                }
              }}
            >
              <Text style={styles.testButtonText}>🧪 Test TTS</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.testButton, { marginTop: 8 }]}
              onPress={async () => {
                console.log("🎤 Testing simple TTS...");
                try {
                  const { testSimpleTTS } = await import("../utils/tts");
                  const result = await testSimpleTTS();

                  Alert.alert(
                    "Simple TTS Test",
                    result ? "Simple TTS is working!" : "Simple TTS failed."
                  );
                } catch (error) {
                  Alert.alert("Simple TTS Test", "Simple TTS test failed.");
                }
              }}
            >
              <Text style={styles.testButtonText}>🎤 Test Simple TTS</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.testButton, { marginTop: 8 }]}
              onPress={async () => {
                console.log("🔊 Testing audio system...");
                try {
                  const {
                    testAudio,
                    testTTS,
                    testVibration,
                    testAudioSession,
                  } = await import("../utils/tts");

                  const results = await Promise.allSettled([
                    testAudioSession(),
                    testAudio(),
                    testTTS(),
                    Promise.resolve(testVibration()),
                  ]);

                  const sessionResult =
                    results[0].status === "fulfilled" && results[0].value;
                  const audioResult =
                    results[1].status === "fulfilled" && results[1].value;
                  const ttsResult =
                    results[2].status === "fulfilled" && results[2].value;
                  const vibrationResult =
                    results[3].status === "fulfilled" && results[3].value;

                  Alert.alert(
                    "Audio System Test",
                    `Session: ${sessionResult ? "✅" : "❌"}\nAudio: ${audioResult ? "✅" : "❌"}\nTTS: ${ttsResult ? "✅" : "❌"}\nVibration: ${vibrationResult ? "✅" : "❌"}`
                  );
                } catch (error) {
                  Alert.alert(
                    "Test Failed",
                    "Could not run audio system test."
                  );
                }
              }}
            >
              <Text style={styles.testButtonText}>🔊 Test Audio System</Text>
            </TouchableOpacity>
          </View>
        )}

        {renderSettingItem(
          "Volume",
          "Adjust speech volume",
          <View style={styles.sliderContainer}>
            <Text style={styles.volumeText}>
              {Math.round(settings.volume * 100)}%
            </Text>
            <View style={styles.volumeButtons}>
              {[0.25, 0.5, 0.75, 1.0].map((volume) => (
                <TouchableOpacity
                  key={volume}
                  style={[
                    styles.volumeButton,
                    settings.volume === volume && styles.volumeButtonActive,
                  ]}
                  onPress={() => handleSettingChange("volume", volume)}
                >
                  <Text
                    style={[
                      styles.volumeButtonText,
                      settings.volume === volume &&
                        styles.volumeButtonTextActive,
                    ]}
                  >
                    {Math.round(volume * 100)}%
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {renderSettingItem(
          "Speech Rate",
          "Adjust speech speed",
          <View style={styles.sliderContainer}>
            <Text style={styles.volumeText}>
              {Math.round(settings.speechRate * 100)}%
            </Text>
            <View style={styles.volumeButtons}>
              {[0.5, 0.75, 1.0, 1.25].map((rate) => (
                <TouchableOpacity
                  key={rate}
                  style={[
                    styles.volumeButton,
                    settings.speechRate === rate && styles.volumeButtonActive,
                  ]}
                  onPress={() => handleSettingChange("speechRate", rate)}
                >
                  <Text
                    style={[
                      styles.volumeButtonText,
                      settings.speechRate === rate &&
                        styles.volumeButtonTextActive,
                    ]}
                  >
                    {Math.round(rate * 100)}%
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {renderSettingItem(
          "Show Text",
          "Display text on buttons",
          <View style={styles.switchContainer}>
            <Switch
              value={settings.showText}
              onValueChange={(value) => handleSettingChange("showText", value)}
              trackColor={{ false: COLORS.border, true: COLORS.primary }}
              thumbColor={COLORS.surface}
            />
            <Text style={styles.switchLabel}>
              {settings.showText ? "Shown" : "Hidden"}
            </Text>
          </View>
        )}

        {renderSettingItem(
          "Language",
          "Choose the language for vocabulary buttons",
          <View style={styles.dropdownContainer}>
            <TouchableOpacity
              style={styles.dropdownButton}
              onPress={() => setShowLanguageDropdown(!showLanguageDropdown)}
            >
              <Text style={styles.dropdownButtonText}>
                {SUPPORTED_LANGUAGES.find(lang => lang.code === settings.language)?.nativeName || "Select Language"}
              </Text>
              <Text style={styles.dropdownArrow}>
                {showLanguageDropdown ? "▲" : "▼"}
              </Text>
            </TouchableOpacity>
            
            {showLanguageDropdown && (
              <View style={styles.dropdownList}>
                <ScrollView showsVerticalScrollIndicator={false}>
                  {SUPPORTED_LANGUAGES.map((lang) => (
                    <TouchableOpacity
                      key={lang.code}
                      style={[
                        styles.dropdownItem,
                        settings.language === lang.code && styles.dropdownItemActive,
                      ]}
                      onPress={() => {
                        handleSettingChange("language", lang.code);
                        setShowLanguageDropdown(false);
                      }}
                    >
                      <Text
                        style={[
                          styles.dropdownItemText,
                          settings.language === lang.code && styles.dropdownItemTextActive,
                        ]}
                      >
                        {lang.nativeName} ({lang.name})
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}
          </View>
        )}

        {renderSettingItem(
          "Text Size",
          "Adjust the size of text on buttons",
          <View style={styles.buttonGroup}>
            <TouchableOpacity
              style={[
                styles.sizeButton,
                settings.textSize === "small" && styles.sizeButtonActive,
              ]}
              onPress={() => handleSettingChange("textSize", "small")}
            >
              <Text
                style={[
                  styles.sizeButtonText,
                  settings.textSize === "small" && styles.sizeButtonTextActive,
                ]}
              >
                Small
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.sizeButton,
                settings.textSize === "medium" && styles.sizeButtonActive,
              ]}
              onPress={() => handleSettingChange("textSize", "medium")}
            >
              <Text
                style={[
                  styles.sizeButtonText,
                  settings.textSize === "medium" && styles.sizeButtonTextActive,
                ]}
              >
                Medium
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.sizeButton,
                settings.textSize === "large" && styles.sizeButtonActive,
              ]}
              onPress={() => handleSettingChange("textSize", "large")}
            >
              <Text
                style={[
                  styles.sizeButtonText,
                  settings.textSize === "large" && styles.sizeButtonTextActive,
                ]}
              >
                Large
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {renderSettingItem(
          "Child Mode Filter",
          "Enable category filter in child mode",
          <View style={styles.switchContainer}>
            <Switch
              value={settings.enableChildFilter}
              onValueChange={(value) => handleSettingChange("enableChildFilter", value)}
              trackColor={{ false: COLORS.border, true: COLORS.primary }}
              thumbColor={COLORS.surface}
            />
            <Text style={styles.switchLabel}>
              {settings.enableChildFilter ? "Enabled" : "Disabled"}
            </Text>
          </View>
        )}

        {renderSettingItem(
          "App Lock",
          "Prevent child from editing boards",
          <View style={styles.switchContainer}>
            <Switch
              value={isLocked}
              onValueChange={handleLockToggle}
              trackColor={{ false: COLORS.border, true: COLORS.primary }}
              thumbColor={COLORS.surface}
            />
            <Text style={styles.switchLabel}>
              {isLocked ? "Locked" : "Unlocked"}
            </Text>
          </View>
        )}

        {renderSettingItem(
          "Category Management",
          "Hide categories to simplify vocabulary for your child",
          <View style={styles.categoryManagementContainer}>
            {DEFAULT_CATEGORIES.map((category) => {
              const isHidden = (settings.hiddenCategories || []).includes(category.id);
              return (
                <TouchableOpacity
                  key={category.id}
                  style={[
                    styles.categoryToggleButton,
                    isHidden && styles.categoryToggleButtonHidden,
                  ]}
                  onPress={() => {
                    const currentHiddenCategories = settings.hiddenCategories || [];
                    const newHiddenCategories = isHidden
                      ? currentHiddenCategories.filter((id) => id !== category.id)
                      : [...currentHiddenCategories, category.id];
                    console.log("🔧 Settings: Toggling category", {
                      category: category.name,
                      isHidden,
                      currentHiddenCategories,
                      newHiddenCategories
                    });
                    handleSettingChange("hiddenCategories", newHiddenCategories);
                  }}
                >
                  <View style={styles.categoryToggleContent}>
                    <View
                      style={[
                        styles.categoryColorIndicator,
                        { backgroundColor: category.color },
                      ]}
                    />
                    <Text
                      style={[
                        styles.categoryToggleText,
                        isHidden && styles.categoryToggleTextHidden,
                      ]}
                    >
                      {category.name}
                    </Text>
                  </View>
                  <View style={styles.categoryToggleStatus}>
                    <Text
                      style={[
                        styles.categoryToggleStatusText,
                        isHidden && styles.categoryToggleStatusTextHidden,
                      ]}
                    >
                      {isHidden ? "Hidden" : "Visible"}
                    </Text>
                    <Text style={styles.categoryToggleIcon}>
                      {isHidden ? "👁️‍🗨️" : "👁️"}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        <TouchableOpacity
          style={[
            styles.dangerButton,
            { backgroundColor: COLORS.warning + "20" },
          ]}
          onPress={async () => {
            const newSettings = {
              ...settings,
              gridSize: 3, // Reset to 3x3 grid
            };
            setSettings(newSettings);
            await saveSettings(newSettings);
            Alert.alert("Grid Reset", "Grid size has been reset to 3x3");
          }}
        >
          <Text style={{ fontSize: 20, color: COLORS.warning }}>📱</Text>
          <Text style={[styles.dangerButtonText, { color: COLORS.warning }]}>
            Reset to 3x3 Grid
          </Text>
        </TouchableOpacity>



        <TouchableOpacity 
          style={[styles.dangerButton, { backgroundColor: COLORS.warning + "20" }]} 
          onPress={async () => {
            Alert.alert(
              "Reset Vocabulary to Default",
              "This will reset all vocabulary buttons to the default set including the new family member buttons (Brother, Sister, Grandpa, Grandma, Uncle, Aunt). This action cannot be undone. Continue?",
              [
                { text: "Cancel", style: "cancel" },
                {
                  text: "Reset Vocabulary",
                  style: "destructive",
                  onPress: async () => {
                    try {
                      // Clear the saved vocabulary completely
                      await AsyncStorage.removeItem("echo_kids_vocabulary");
                      Alert.alert(
                        "Vocabulary Reset Complete", 
                        "Vocabulary has been reset to default. The new family member buttons are now available!"
                      );
                    } catch (error) {
                      Alert.alert("Error", "Failed to reset vocabulary. Please try again.");
                    }
                  },
                },
              ]
            );
          }}
        >
          <Text style={{ fontSize: 20, color: COLORS.warning }}>🔄</Text>
          <Text style={[styles.dangerButtonText, { color: COLORS.warning }]}>
            Reset Vocabulary to Default
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.dangerButton} onPress={handleResetData}>
          <Text style={{ fontSize: 20, color: COLORS.error }}>🗑️</Text>
          <Text style={styles.dangerButtonText}>Reset All Data</Text>
        </TouchableOpacity>
      </ScrollView>

      {renderVoiceModal()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.text,
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  settingItem: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  settingHeader: {
    marginBottom: 12,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 4,
  },
  settingSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  modeButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  modeButton: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    backgroundColor: COLORS.background,
    borderRadius: 8,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  modeButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  modeButtonText: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: "500",
    color: COLORS.text,
    textAlign: "center",
  },
  modeButtonTextActive: {
    color: COLORS.surface,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    backgroundColor: COLORS.background,
  },
  gridSizeButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 8,
  },
  gridSizeButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 6,
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginHorizontal: 4,
    alignItems: "center",
  },
  gridSizeButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  gridSizeText: {
    fontSize: 14,
    fontWeight: "500",
    color: COLORS.text,
  },
  gridSizeTextActive: {
    color: COLORS.surface,
  },
  voiceSelector: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    backgroundColor: COLORS.background,
    padding: 12,
  },
  voiceSelectorContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  currentVoiceName: {
    fontSize: 16,
    fontWeight: "500",
    color: COLORS.text,
  },
  currentVoiceLanguage: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  sliderContainer: {
    alignItems: "center",
  },
  volumeText: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 12,
  },
  volumeButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  volumeButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginHorizontal: 4,
    alignItems: "center",
  },
  volumeButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  volumeButtonText: {
    fontSize: 12,
    fontWeight: "500",
    color: COLORS.text,
  },
  volumeButtonTextActive: {
    color: COLORS.surface,
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  switchLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: COLORS.text,
  },
  dangerButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 16,
    marginTop: 20,
    borderWidth: 1,
    borderColor: COLORS.error,
  },
  dangerButtonText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.error,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    width: "90%",
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.text,
  },
  voiceCategories: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 8,
    marginTop: 12,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  categoryChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  categoryChipText: {
    fontSize: 14,
    fontWeight: "500",
    color: COLORS.text,
  },
  categoryChipTextActive: {
    color: COLORS.surface,
  },
  textSizeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
  },
  textSizeButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: "center",
  },
  textSizeButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  textSizeButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: COLORS.text,
  },
  textSizeButtonTextActive: {
    color: COLORS.surface,
    fontWeight: "600",
  },
  voiceList: {
    padding: 20,
  },
  voiceOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  voiceOptionActive: {
    backgroundColor: COLORS.primary + "20",
    borderColor: COLORS.primary,
  },
  voiceInfo: {
    flex: 1,
  },
  voiceName: {
    fontSize: 16,
    fontWeight: "500",
    color: COLORS.text,
  },
  voiceLanguage: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  voiceActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  previewButton: {
    padding: 8,
    marginRight: 8,
    backgroundColor: COLORS.surface,
    borderRadius: 16,
  },
  testButton: {
    backgroundColor: COLORS.primary + "20",
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  testButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.primary,
  },
  categoryManagementContainer: {
    gap: 8,
  },
  categoryToggleButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    borderRadius: 8,
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  categoryToggleButtonHidden: {
    backgroundColor: COLORS.border,
    borderColor: COLORS.textSecondary,
  },
  categoryToggleContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  categoryColorIndicator: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 12,
  },
  categoryToggleText: {
    fontSize: 16,
    fontWeight: "500",
    color: COLORS.text,
  },
  categoryToggleTextHidden: {
    color: COLORS.textSecondary,
  },
  categoryToggleStatus: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  categoryToggleStatusText: {
    fontSize: 14,
    color: COLORS.success,
    fontWeight: "500",
  },
  categoryToggleStatusTextHidden: {
    color: COLORS.textSecondary,
  },
  categoryToggleIcon: {
    fontSize: 16,
  },
  buttonGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
  },
  sizeButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: "center",
  },
  sizeButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  sizeButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: COLORS.text,
  },
  sizeButtonTextActive: {
    color: COLORS.surface,
    fontWeight: "600",
  },
  dropdownContainer: {
    position: "relative",
    zIndex: 1000,
  },
  dropdownButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  dropdownButtonText: {
    fontSize: 16,
    color: COLORS.text,
    fontWeight: "500",
  },
  dropdownArrow: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  dropdownList: {
    position: "absolute",
    top: "100%",
    left: 0,
    right: 0,
    backgroundColor: COLORS.surface,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginTop: 4,
    maxHeight: 200,
    zIndex: 1001,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  dropdownItemActive: {
    backgroundColor: COLORS.primary,
  },
  dropdownItemText: {
    fontSize: 14,
    color: COLORS.text,
  },
  dropdownItemTextActive: {
    color: COLORS.surface,
    fontWeight: "600",
  },
});
