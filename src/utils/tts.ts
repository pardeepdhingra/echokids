import * as Speech from "expo-speech";
import { Audio } from "expo-av";
import { Vibration } from "react-native";

// Initialize audio session for iOS
const initializeAudio = async () => {
  try {
    console.log("🔊 Initializing audio session...");
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      staysActiveInBackground: true,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
      playThroughEarpieceAndroid: false,
      interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
      interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
    });
    console.log("✅ Audio session initialized successfully");
  } catch (error) {
    console.error("❌ Audio session init failed:", error);
    // Try alternative audio mode
    try {
      console.log("🔊 Trying alternative audio mode...");
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        staysActiveInBackground: true,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: false,
        playThroughEarpieceAndroid: false,
        interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
        interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
      });
      console.log("✅ Alternative audio session initialized");
    } catch (altError) {
      console.error("❌ Alternative audio session also failed:", altError);
    }
  }
};

export const speak = async (text: string, settings: any) => {
  console.log("🎤 SPEAK CALLED:", { text, settings });

  try {
    // Initialize audio session first
    await initializeAudio();

    // Stop any current speech first
    await Speech.stop();

    // Build TTS options with voice selection
    const ttsOptions: any = {
      language: "en-US",
      volume: settings.volume || 1.0,
      rate: settings.speechRate || 0.8,
    };

    // Try with voice parameter first
    if (settings.ttsVoice && (settings.ttsVoice.includes("com.apple.ttsbundle") || settings.ttsVoice.includes("com.apple.voice"))) {
      ttsOptions.voice = settings.ttsVoice;
      console.log("🎤 Using iOS voice:", settings.ttsVoice);
    } else {
      console.log("🎤 Using default voice");
    }

    console.log("🎤 Calling Speech.speak with text:", text);
    console.log("🎤 TTS options:", ttsOptions);
    
    try {
      await Speech.speak(text, ttsOptions);
      console.log("🎤 TTS completed successfully");
    } catch (voiceError) {
      console.log("🎤 Voice TTS failed, trying without voice parameter...");
      // Try without voice parameter
      const fallbackOptions = {
        language: "en-US",
        volume: settings.volume || 1.0,
        rate: settings.speechRate || 0.8,
      };
      await Speech.speak(text, fallbackOptions);
      console.log("🎤 Fallback TTS completed successfully");
    }
  } catch (error) {
    console.error("❌ TTS failed:", error);
    try {
      console.log("🔇 Falling back to beep...");
      await playBeep();
    } catch (beepError) {
      console.error("❌ Beep also failed:", beepError);
    }
  }
};

export const stop = async () => {
  try {
    await Speech.stop();
  } catch (error) {
    console.error("TTS Stop Error:", error);
  }
};

export const getAvailableVoices = async () => {
  try {
    const voices = await Speech.getAvailableVoicesAsync();
    console.log("🎤 Available voices:", voices?.length || 0);
    if (voices && voices.length > 0) {
      voices.forEach((voice, index) => {
        console.log(`🎤 Voice ${index + 1}: ${voice.name} (${voice.language})`);
      });
    }
    return voices || [];
  } catch (error) {
    console.error("Get Voices Error:", error);
    return [];
  }
};

// Test function to verify TTS is working
export const testTTS = async () => {
  try {
    console.log("🎤 Starting TTS test...");
    await initializeAudio();
    await Speech.stop();

    console.log("🎤 Testing basic TTS...");
    await Speech.speak("Hello, this is a TTS test", {
      language: "en-US",
      volume: 1.0,
      rate: 0.8,
      voice: "com.apple.voice.compact.en-US.Samantha",
    });

    console.log("✅ TTS test completed successfully");
    return true;
  } catch (error) {
    console.error("❌ TTS test failed:", error);
    return false;
  }
};

// Test device vibration
export const testVibration = () => {
  console.log("📳 Testing vibration...");
  try {
    Vibration.vibrate([100, 200, 100]);
    console.log("✅ Vibration test successful");
    return true;
  } catch (error) {
    console.error("❌ Vibration test failed:", error);
    return false;
  }
};

// Test if device can play any audio at all
export const testDeviceAudio = async () => {
  console.log("🔊 Testing device audio capability...");

  try {
    await initializeAudio();

    // Try to play a very simple sound
    const { sound } = await Audio.Sound.createAsync(
      { uri: "https://www.soundjay.com/misc/sounds/fail-buzzer-01.wav" },
      {
        shouldPlay: true,
        volume: 1.0,
        isLooping: false,
        rate: 1.0,
      }
    );

    console.log("✅ Device audio test: Sound created");

    // Wait longer for this test
    await new Promise((resolve) => setTimeout(resolve, 2000));

    await sound.unloadAsync();
    console.log("✅ Device audio test: Success");
    return true;
  } catch (error) {
    console.error("❌ Device audio test failed:", error);
    return false;
  }
};

// Simple beep sound that should work on iOS
export const playBeep = async () => {
  console.log("🔊 Playing beep sound...");

  try {
    await initializeAudio();

    // Use the working audio source from the device test
    const { sound } = await Audio.Sound.createAsync(
      { uri: "https://www.soundjay.com/misc/sounds/fail-buzzer-01.wav" },
      {
        shouldPlay: true,
        volume: 1.0,
        isLooping: false,
        rate: 1.0,
      }
    );

    console.log("✅ Beep sound created successfully");

    // Wait for sound to finish
    await new Promise((resolve) => setTimeout(resolve, 1000));

    await sound.unloadAsync();
    console.log("✅ Beep sound completed");
    return true;
  } catch (error) {
    console.error("❌ Beep sound failed:", error);
    return false;
  }
};

// Test if audio is working at all (not just TTS)
export const testAudio = async () => {
  console.log("🔊 Testing basic audio functionality...");

  // Initialize audio session first
  await initializeAudio();

  try {
    // Test if we can play a simple beep sound
    const { sound } = await Audio.Sound.createAsync(
      { uri: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav" },
      {
        shouldPlay: true,
        volume: 1.0,
        isLooping: false,
      }
    );

    console.log("✅ Audio test: Sound created");

    // Wait for sound to finish
    await new Promise((resolve) => setTimeout(resolve, 3000));

    await sound.unloadAsync();
    console.log("✅ Audio test: Success");
    return true;
  } catch (error) {
    console.error("❌ Audio test failed:", error);
    return false;
  }
};
