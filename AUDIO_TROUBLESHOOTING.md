# Audio Troubleshooting Guide

## Current Issue: "Primary audio session init failed"

### Problem Description

The app is experiencing audio session initialization failures on iOS, which prevents TTS and audio playback from working. Only vibration feedback is working.

### Root Cause Analysis

iOS audio session configuration can be restrictive and may fail due to:

1. **Audio session conflicts** with other apps
2. **iOS version compatibility** issues
3. **Device-specific audio limitations**
4. **Permission or configuration issues**

## Solutions Applied

### 1. Simplified Audio Session Configuration

**Before (Complex):**

```typescript
await Audio.setAudioModeAsync({
  allowsRecordingIOS: false,
  staysActiveInBackground: true,
  playsInSilentModeIOS: true,
  shouldDuckAndroid: true,
  playThroughEarpieceAndroid: false,
  interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
  interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
});
```

**After (Simplified):**

```typescript
await Audio.setAudioModeAsync({
  allowsRecordingIOS: false,
  staysActiveInBackground: false,
  playsInSilentModeIOS: true,
});
```

### 2. Multiple Fallback Modes

The app now tries 3 different audio session configurations:

1. **Basic Mode**: Minimal configuration
2. **Minimal Mode**: Even simpler configuration
3. **Android-Compatible Mode**: Cross-platform configuration

### 3. Enhanced Testing Tools

- **Audio Session Test**: Tests audio session setup specifically
- **Simple TTS Test**: Tests TTS without audio session
- **Comprehensive Audio Test**: Tests all audio components
- **Individual Component Tests**: Test each audio feature separately

## Testing Steps

### Step 1: Check Device Settings

1. **Silent Mode**: Ensure device is not on silent mode
2. **Volume**: Turn up device volume to maximum
3. **Audio Apps**: Close other audio apps (Music, Podcasts, etc.)
4. **Restart Device**: Sometimes a device restart is needed

### Step 2: Use In-App Testing Tools

1. **Open Settings** in the app
2. **Try "Test Simple TTS"** first (bypasses audio session)
3. **Try "Test TTS"** (uses full audio system)
4. **Try "Test Audio System"** (comprehensive test)

### Step 3: Check Console Logs

Look for these specific log messages:

- `🔊 Initializing audio session...`
- `✅ Basic audio session initialized successfully`
- `❌ Basic audio session init failed:`
- `🎤 Testing simple TTS without audio session...`

## Debugging Information

### Console Log Analysis

**If you see:**

```
❌ Basic audio session init failed: [Error details]
```

This means the primary audio session failed, but the app should try fallback modes.

**If you see:**

```
✅ Basic audio session initialized successfully
```

The audio session is working, but TTS might still fail.

**If you see:**

```
🎤 Testing simple TTS without audio session...
✅ Simple TTS test passed
```

TTS works without audio session, indicating the issue is with audio session configuration.

### Test Results Interpretation

**Audio System Test Results:**

- `Session: ❌` = Audio session setup failed
- `Audio: ❌` = Audio playback failed
- `TTS: ❌` = Text-to-speech failed
- `Vibration: ✅` = Vibration works (always should)

## Common Solutions

### Solution 1: Restart the App

1. Close the app completely
2. Restart the device
3. Open the app again
4. Try the tests again

### Solution 2: Check iOS Version

- iOS 13+ should work with current configuration
- Older iOS versions may have compatibility issues
- Update iOS if possible

### Solution 3: Audio Session Reset

1. Go to Settings > General > Reset
2. Reset All Settings (not content)
3. Try the app again

### Solution 4: Alternative Audio Configuration

If the current configuration fails, the app automatically tries:

1. Minimal audio session
2. Android-compatible mode
3. No audio session (TTS might still work)

## Expected Behavior

### Working Audio System

- **Session: ✅** - Audio session initializes
- **Audio: ✅** - Audio playback works
- **TTS: ✅** - Text-to-speech works
- **Vibration: ✅** - Vibration feedback works

### Partial Audio System

- **Session: ❌** - Audio session fails
- **Audio: ❌** - Audio playback fails
- **TTS: ✅** - TTS works without audio session
- **Vibration: ✅** - Vibration feedback works

### Minimal Audio System

- **Session: ❌** - Audio session fails
- **Audio: ❌** - Audio playback fails
- **TTS: ❌** - TTS fails
- **Vibration: ✅** - Only vibration works

## Fallback Mechanisms

The app has multiple fallback mechanisms to ensure user feedback:

1. **Primary**: TTS with selected voice
2. **Secondary**: TTS with default voice
3. **Tertiary**: Beep sound
4. **Quaternary**: Vibration feedback
5. **Final**: Silent (with console logging)

## Technical Details

### Audio Session Modes

**Mode 1: Basic (Primary)**

```typescript
{
  allowsRecordingIOS: false,
  staysActiveInBackground: false,
  playsInSilentModeIOS: true,
}
```

**Mode 2: Minimal (Secondary)**

```typescript
{
  allowsRecordingIOS: false,
  playsInSilentModeIOS: true,
  shouldDuckAndroid: false,
}
```

**Mode 3: Android-Compatible (Tertiary)**

```typescript
{
  allowsRecordingIOS: false,
  shouldDuckAndroid: false,
  playThroughEarpieceAndroid: false,
}
```

### Error Handling

- Each mode is tried in sequence
- If all modes fail, the app continues without audio session
- TTS may still work without audio session on some devices
- Vibration always works as final fallback

## Next Steps

If audio session continues to fail:

1. **Check device compatibility** with Expo Audio
2. **Test on different devices** to isolate the issue
3. **Consider alternative audio libraries** if needed
4. **Implement audio session recovery** mechanisms
5. **Add user notification** when audio fails

## Support Information

- **App Version**: Current
- **Expo Version**: ~53.0.22
- **expo-av Version**: ^15.1.7
- **expo-speech Version**: ^13.1.7
- **iOS Version**: Tested on iOS 13+

For additional support, check the console logs and provide the specific error messages.
