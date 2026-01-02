# Pure Bhakti Base Mobile - Setup Instructions

## Prerequisites

### For iOS Development
- macOS computer
- Xcode 14+ installed from App Store
- iOS 13+ device or simulator
- Apple Developer Account (for device testing)
- CocoaPods: `sudo gem install cocoapods`

### For Android Development
- macOS, Windows, or Linux
- Android Studio installed
- Android SDK (API 24+)
- Java Development Kit (JDK) 17+
- Android device or emulator

## Complete Setup Steps

### Step 1: Navigate to Project
```bash
cd pbb_web
git checkout -b feature/mobile-proof-of-concept
cd pbb-frontend
```

### Step 2: Install Dependencies
```bash
# Install Node dependencies including Capacitor
npm install

# Specifically install Capacitor packages
npm install @capacitor/core @capacitor/cli @capacitor/ios @capacitor/android
```

### Step 3: Replace Configuration Files

Replace the following files with the artifacts provided:

1. **capacitor.config.json** - Create this new file in `pbb-frontend/`
2. **package.json** - Replace with updated version (new scripts)
3. **vite.config.js** - Replace with mobile-optimized version
4. **src/services/api.js** - Replace with mobile-compatible version

### Step 4: Build the Web Application
```bash
npm run build
```

This creates the `dist` folder that Capacitor will use.

### Step 5: Initialize Capacitor (First Time Only)
```bash
npx cap init "Pure Bhakti Base" "com.purebhaktibase.app"
```

**Note:** If you already have `capacitor.config.json`, this step will use those settings.

### Step 6: Add Platforms

#### For iOS:
```bash
npm run cap:add:ios
```

#### For Android:
```bash
npm run cap:add:android
```

#### Or add both:
```bash
npx cap add ios
npx cap add android
```

### Step 7: Configure API URL for Mobile

Edit `src/services/api.js` and update the mobile API URL:

```javascript
if (platform === 'ios' || platform === 'android') {
  // Option 1: Production server
  return 'https://purebhaktibase.com:8443';
  
  // Option 2: Local development (replace with your computer's IP)
  // return 'https://192.168.1.100:8443';
}
```

**To find your computer's IP:**
- **macOS/Linux**: `ifconfig | grep inet`
- **Windows**: `ipconfig`

### Step 8: Sync Web Code to Native Projects
```bash
# Sync both platforms
npm run cap:sync

# Or sync individually
npm run cap:sync:ios
npm run cap:sync:android
```

**Important:** Run this command every time you make changes to your web code!

### Step 9: Configure iOS (iOS Only)

1. Open the iOS project:
```bash
npm run cap:open:ios
```

2. In Xcode:
   - Select your target app in the project navigator
   - Go to "Signing & Capabilities"
   - Select your Team (Apple Developer Account)
   - Xcode will automatically create a Bundle Identifier
   - Go to "Info" tab and verify settings

3. Configure Info.plist for camera/photo access (if needed):
   - Right-click Info.plist → Open As → Source Code
   - Add permissions as needed

### Step 10: Configure Android (Android Only)

1. Open the Android project:
```bash
npm run cap:open:android
```

2. In Android Studio:
   - Wait for Gradle sync to complete
   - Go to Tools → AVD Manager to set up an emulator (or connect a device)
   - Check `android/app/build.gradle` for correct settings

3. Update AndroidManifest.xml if needed:
   - Located at `android/app/src/main/AndroidManifest.xml`
   - Add permissions as needed

### Step 11: Run on Device/Simulator

#### iOS:
```bash
# Run on connected device or simulator
npm run cap:run:ios

# Or manually in Xcode:
# 1. Open Xcode: npm run cap:open:ios
# 2. Select your device/simulator
# 3. Click Run (▶️) button
```

#### Android:
```bash
# Run on connected device or emulator
npm run cap:run:android

# Or manually in Android Studio:
# 1. Open Android Studio: npm run cap:open:android
# 2. Select your device/emulator
# 3. Click Run (▶️) button
```

## Development Workflow

### Making Changes to Web Code
```bash
# 1. Make your changes to React components
# 2. Build and sync
npm run cap:sync

# 3. App will hot-reload automatically in most cases
# Or manually reload in iOS/Android
```

### Quick Commands Reference
```bash
# Build web assets
npm run build

# Sync to all platforms
npm run cap:sync

# Sync to specific platform
npm run cap:sync:ios
npm run cap:sync:android

# Open in native IDE
npm run cap:open:ios
npm run cap:open:android

# Run on device
npm run cap:run:ios
npm run cap:run:android
```

## Troubleshooting

### iOS Issues

**Problem:** "No signing certificate"
- **Solution:** Go to Xcode → Preferences → Accounts → Add your Apple ID

**Problem:** "Could not launch app"
- **Solution:** 
  - Trust the developer on device: Settings → General → Device Management
  - Or use a valid provisioning profile

**Problem:** Images not loading
- **Solution:** Check that API URL is correct and reachable from device

### Android Issues

**Problem:** "SDK location not found"
- **Solution:** Create `android/local.properties`:
  ```
  sdk.dir=/Users/YOUR_USERNAME/Library/Android/sdk
  ```

**Problem:** Gradle build fails
- **Solution:** 
  - Update Android Studio
  - File → Invalidate Caches → Invalidate and Restart
  - Check Java version: `java -version` (should be JDK 17+)

**Problem:** App crashes on launch
- **Solution:** Check Android Studio Logcat for errors

### Network/API Issues

**Problem:** "Network request failed" or "Failed to fetch books"
- **Solution:**
  1. Verify API URL in `src/services/api.js`
  2. Check that your device can reach the API server
  3. For local development, use your computer's IP address
  4. Ensure SSL certificate is valid (or configure to allow self-signed for dev)

**Problem:** SSL certificate errors
- **Solution for Development:**
  - iOS: Configure App Transport Security in Info.plist
  - Android: Configure network security in `android/app/src/main/res/xml/network_security_config.xml`

## Testing on Real Devices

### iOS Device Testing
1. Connect iPhone/iPad via USB
2. In Xcode, select your device from the device dropdown
3. Click Run
4. On device: Trust the developer (Settings → General → Device Management)

### Android Device Testing
1. Enable Developer Mode on device:
   - Settings → About Phone → Tap "Build Number" 7 times
2. Enable USB Debugging:
   - Settings → Developer Options → USB Debugging
3. Connect device via USB
4. In Android Studio, select your device and click Run

## Known Limitations in PoC

1. **localStorage**: Works as expected in mobile WebView
2. **Image Loading**: Ensure images are bundled or API URLs are accessible
3. **Gestures**: May need platform-specific handling (especially iOS)
4. **Status Bar**: May need additional configuration for proper display
5. **Safe Area**: iOS notch/Dynamic Island may require SafeArea insets

## Next Steps After PoC

1. Add splash screen images
2. Configure app icons
3. Add native plugins (Camera, File System, etc.)
4. Implement native gestures for better UX
5. Add offline support with Capacitor Storage
6. Configure push notifications (if needed)
7. Implement biometric authentication (if needed)
8. Test on multiple device sizes
9. Performance optimization
10. Prepare for App Store/Play Store submission

## Resources

- [Capacitor Documentation](https://capacitorjs.com/docs)
- [iOS Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/ios)
- [Android Design Guidelines](https://developer.android.com/design)
- [React Router with Capacitor](https://capacitorjs.com/docs/guides/react-router)

## Support

For issues specific to Pure Bhakti Base:
- Check existing GitHub issues
- Create new issue with detailed description and logs

For Capacitor issues:
- [Capacitor GitHub](https://github.com/ionic-team/capacitor)
- [Capacitor Forums](https://forum.ionicframework.com/c/capacitor)