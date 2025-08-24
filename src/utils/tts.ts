import * as Speech from "expo-speech";
import { Audio } from "expo-av";
import { Vibration } from "react-native";

let audioInitialized = false;

const initializeAudio = async () => {
  if (audioInitialized) {
    return;
  }

  try {
    console.log("🔊 Initializing audio session...");
    
    // Try the most basic and compatible audio mode first
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      staysActiveInBackground: false,
      playsInSilentModeIOS: true,
    });
    
    console.log("✅ Basic audio session initialized successfully");
    audioInitialized = true;
  } catch (error) {
    console.error("❌ Basic audio session init failed:", error);
    
    try {
      console.log("🔊 Trying minimal audio mode...");
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: false,
      });
      
      console.log("✅ Minimal audio session initialized");
      audioInitialized = true;
    } catch (altError) {
      console.error("❌ Minimal audio session failed:", altError);
      
      try {
        console.log("🔊 Trying Android-compatible mode...");
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
          shouldDuckAndroid: false,
          playThroughEarpieceAndroid: false,
        });
        
        console.log("✅ Android-compatible audio session initialized");
        audioInitialized = true;
      } catch (minimalError) {
        console.error("❌ All audio session attempts failed:", minimalError);
        console.log("⚠️ Continuing without audio session - some devices might work anyway");
        // Continue without audio session - some devices might work anyway
      }
    }
  }
};

export const speak = async (text: string, settings: any) => {
  console.log("🎤 SPEAK CALLED:", { text, settings });

  try {
    await initializeAudio();

    // Stop any current speech first
    try {
      await Speech.stop();
    } catch (stopError) {
      console.log("⚠️ Speech.stop() failed (this is often normal):", stopError);
    }

    // Build TTS options with minimal configuration
    const ttsOptions: any = {
      language: "en-US",
      volume: settings.volume || 1.0,
      rate: settings.speechRate || 0.8,
    };

    // Only add voice if it's a valid iOS voice identifier
    if (settings.ttsVoice && 
        (settings.ttsVoice.includes("com.apple.ttsbundle") || 
         settings.ttsVoice.includes("com.apple.voice") ||
         settings.ttsVoice.includes("en-US"))) {
      ttsOptions.voice = settings.ttsVoice;
      console.log("🎤 Using voice:", settings.ttsVoice);
    } else {
      console.log("🎤 Using default voice");
    }

    console.log("🎤 Calling Speech.speak with options:", ttsOptions);
    
    // Try TTS with voice first
    try {
      await Speech.speak(text, ttsOptions);
      console.log("✅ TTS completed successfully");
      return;
    } catch (voiceError) {
      console.log("🎤 Voice TTS failed, trying without voice parameter:", voiceError);
      
      // Try without voice parameter
      const fallbackOptions = {
        language: "en-US",
        volume: settings.volume || 1.0,
        rate: settings.speechRate || 0.8,
      };
      
      await Speech.speak(text, fallbackOptions);
      console.log("✅ Fallback TTS completed successfully");
      return;
    }
  } catch (error) {
    console.error("❌ TTS failed:", error);
    
    // Try to play a simple beep as fallback
    try {
      console.log("🔇 Falling back to beep...");
      await playBeep();
    } catch (beepError) {
      console.error("❌ Beep also failed:", beepError);
      // Last resort: try vibration
      try {
        Vibration.vibrate([100, 200, 100]);
        console.log("📳 Using vibration as final fallback");
      } catch (vibrationError) {
        console.error("❌ All audio feedback methods failed");
      }
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

export const testTTS = async () => {
  try {
    console.log("🎤 Starting TTS test...");
    await initializeAudio();
    
    try {
      await Speech.stop();
    } catch (stopError) {
      console.log("⚠️ Speech.stop() failed during test:", stopError);
    }

    console.log("🎤 Testing basic TTS...");
    await Speech.speak("Hello, this is a TTS test", {
      language: "en-US",
      volume: 1.0,
      rate: 0.8,
    });

    console.log("✅ TTS test completed successfully");
    return true;
  } catch (error) {
    console.error("❌ TTS test failed:", error);
    return false;
  }
};

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

export const testDeviceAudio = async () => {
  console.log("🔊 Testing device audio capability...");

  try {
    await initializeAudio();

    // Try to play a simple sound
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

    // Wait for sound to finish
    await new Promise((resolve) => setTimeout(resolve, 2000));

    await sound.unloadAsync();
    console.log("✅ Device audio test: Success");
    return true;
  } catch (error) {
    console.error("❌ Device audio test failed:", error);
    return false;
  }
};

export const testSimpleTTS = async () => {
  console.log("🎤 Testing simple TTS without audio session...");
  
  try {
    // Try TTS without any audio session setup
    await Speech.speak("Test", {
      language: "en-US",
      volume: 1.0,
      rate: 0.8,
    });
    
    console.log("✅ Simple TTS test passed");
    return true;
  } catch (error) {
    console.error("❌ Simple TTS test failed:", error);
    return false;
  }
};

export const playBeep = async () => {
  console.log("🔊 Playing beep sound...");

  try {
    await initializeAudio();

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

export const testAudio = async () => {
  console.log("🔊 Testing basic audio functionality...");

  try {
    await initializeAudio();

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

export const testAudioSession = async () => {
  console.log("🔊 Testing audio session specifically...");
  
  try {
    const { Audio } = await import("expo-av");
    
    // Test 1: Basic audio session
    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: true,
      });
      console.log("✅ Basic audio session test passed");
    } catch (error) {
      console.error("❌ Basic audio session test failed:", error);
    }
    
    // Test 2: Check if we can create a sound object
    try {
      const { sound } = await Audio.Sound.createAsync(
        { uri: "https://www.soundjay.com/misc/sounds/fail-buzzer-01.wav" },
        { shouldPlay: false }
      );
      await sound.unloadAsync();
      console.log("✅ Sound creation test passed");
    } catch (error) {
      console.error("❌ Sound creation test failed:", error);
    }
    
    return true;
  } catch (error) {
    console.error("❌ Audio session test failed:", error);
    return false;
  }
};
