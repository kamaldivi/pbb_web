# Platform-Specific Configurations

## iOS Configuration

### Info.plist Additions

Add these to `ios/App/App/Info.plist` if you need camera/photo access or other features:

```xml
<key>NSCameraUsageDescription</key>
<string>This app needs camera access to scan book covers</string>

<key>NSPhotoLibraryUsageDescription</key>
<string>This app needs photo library access to share images</string>

<key>NSPhotoLibraryAddUsageDescription</key>
<string>This app needs access to save images to your photo library</string>
```

### App Transport Security (for development with self-signed certs)

Add this to `Info.plist` ONLY for development:

```xml
<key>NSAppTransportSecurity</key>
<dict>
    <key>NSAllowsArbitraryLoads</key>
    <true/>
</dict>
```

**⚠️ REMOVE THIS FOR PRODUCTION!**

### Better approach for specific domains:

```xml
<key>NSAppTransportSecurity</key>
<dict>
    <key>NSExceptionDomains</key>
    <dict>
        <key>purebhaktibase.com</key>
        <dict>
            <key>NSExceptionAllowsInsecureHTTPLoads</key>
            <true/>
            <key>NSIncludesSubdomains</key>
            <true/>
        </dict>
        <key>192.168.1.100</key>
        <dict>
            <key>NSExceptionAllowsInsecureHTTPLoads</key>
            <true/>
        </dict>
    </dict>
</dict>
```

### Podfile Configuration

Location: `ios/App/Podfile`

Ensure minimum iOS version:

```ruby
platform :ios, '13.0'
```

## Android Configuration

### AndroidManifest.xml

Location: `android/app/src/main/AndroidManifest.xml`

Add permissions:

```xml
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
```

Enable cleartext traffic for development (local IP addresses):

```xml
<application
    ...
    android:usesCleartextTraffic="true"
    android:networkSecurityConfig="@xml/network_security_config">
```

### Network Security Config

Create: `android/app/src/main/res/xml/network_security_config.xml`

```xml
<?xml version="1.0" encoding="utf-8"?>
<network-security-config>
    <!-- For development: allow cleartext (HTTP) traffic -->
    <domain-config cleartextTrafficPermitted="true">
        <domain includeSubdomains="true">localhost</domain>
        <domain includeSubdomains="true">192.168.1.100</domain>
        <domain includeSubdomains="true">10.0.2.2</domain>
    </domain-config>
    
    <!-- For production: strict HTTPS -->
    <base-config cleartextTrafficPermitted="false" />
</network-security-config>
```

### build.gradle Configuration

Location: `android/app/build.gradle`

Verify these settings:

```gradle
android {
    compileSdkVersion 33
    
    defaultConfig {
        applicationId "com.purebhaktibase.app"
        minSdkVersion 24
        targetSdkVersion 33
        versionCode 1
        versionName "1.0"
    }
    
    buildTypes {
        release {
            minifyEnabled false
            proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
        }
    }
}
```

## Splash Screen Configuration

### iOS Splash Screen

1. Open Xcode
2. Navigate to `App/App/Assets.xcassets/Splash.imageset/`
3. Add your splash images:
   - splash.png (1x - 1170x2532)
   - splash@2x.png (2x - 2340x5064)
   - splash@3x.png (3x - 3510x7596)

### Android Splash Screen

1. Place images in:
   - `android/app/src/main/res/drawable/splash.png`
   - `android/app/src/main/res/drawable-land/splash.png`
   - `android/app/src/main/res/drawable-xxxhdpi/splash.png`

2. Update `android/app/src/main/res/values/styles.xml`:

```xml
<style name="AppTheme.NoActionBarLaunch" parent="AppTheme.NoActionBar">
    <item name="android:background">@drawable/splash</item>
</style>
```

## App Icons

### iOS App Icon

1. Open Xcode
2. Navigate to `App/App/Assets.xcassets/AppIcon.appiconset/`
3. Add icons for all required sizes (Xcode will show which sizes are needed)

Recommended tool: https://appicon.co/

### Android App Icon

Place icons in:
- `android/app/src/main/res/mipmap-mdpi/ic_launcher.png` (48x48)
- `android/app/src/main/res/mipmap-hdpi/ic_launcher.png` (72x72)
- `android/app/src/main/res/mipmap-xhdpi/ic_launcher.png` (96x96)
- `android/app/src/main/res/mipmap-xxhdpi/ic_launcher.png` (144x144)
- `android/app/src/main/res/mipmap-xxxhdpi/ic_launcher.png` (192x192)

## Safe Area Handling (iOS)

For iOS devices with notch/Dynamic Island, add to your main CSS:

```css
/* Add to src/index.css */

/* Safe area insets for iOS */
body {
  padding-top: env(safe-area-inset-top);
  padding-bottom: env(safe-area-inset-bottom);
  padding-left: env(safe-area-inset-left);
  padding-right: env(safe-area-inset-right);
}

/* Or use viewport-fit in your HTML */
/* Add to index.html <meta> tag: viewport-fit=cover */
```

## Dark Mode Support

### iOS

Add to `capacitor.config.json`:

```json
{
  "plugins": {
    "StatusBar": {
      "style": "dark"
    }
  }
}
```

### Android

Update `android/app/src/main/res/values/styles.xml`:

```xml
<style name="AppTheme" parent="Theme.AppCompat.Light.DarkActionBar">
    <item name="android:forceDarkAllowed">true</item>
</style>
```

## Performance Optimizations

### iOS WKWebView Configuration

Add to `capacitor.config.json`:

```json
{
  "ios": {
    "contentInset": "always",
    "allowsLinkPreview": false,
    "scrollEnabled": true
  }
}
```

### Android WebView Configuration

Add to `android/app/src/main/java/.../MainActivity.java`:

```java
@Override
public void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    
    // Enable hardware acceleration
    getWindow().setFlags(
        WindowManager.LayoutParams.FLAG_HARDWARE_ACCELERATED,
        WindowManager.LayoutParams.FLAG_HARDWARE_ACCELERATED
    );
}
```

## Debugging

### iOS Debugging

1. Open Safari
2. Enable Develop menu: Safari → Preferences → Advanced → "Show Develop menu"
3. Run app on simulator/device
4. Safari → Develop → [Your Device] → [Your App]

### Android Debugging

1. Open Chrome
2. Navigate to `chrome://inspect`
3. Run app on device/emulator
4. Click "Inspect" under your app name

### Console Logging

Add to your app for mobile-specific debugging:

```javascript
import { Capacitor } from '@capacitor/core';

if (Capacitor.isNativePlatform()) {
  console.log('Running on:', Capacitor.getPlatform());
}
```

## Device-Specific Testing

### Test on Multiple Screen Sizes

iOS Simulators to test:
- iPhone SE (small screen)
- iPhone 14 Pro (notch)
- iPhone 14 Pro Max (large screen)
- iPad (tablet)

Android Emulators to test:
- Pixel 4 (small)
- Pixel 6 (medium)
- Pixel 7 Pro (large)
- Pixel Tablet (tablet)

### Orientation Testing

Test both portrait and landscape modes, especially for:
- Reading pages
- Image viewer
- Navigation

## Common Platform-Specific Issues

### iOS

**Issue**: White screen on launch
- **Fix**: Check build errors in Xcode console

**Issue**: Network requests failing
- **Fix**: Check App Transport Security settings

**Issue**: Images not loading
- **Fix**: Verify image URLs are absolute and reachable

### Android

**Issue**: App crashes on startup
- **Fix**: Check Android Studio Logcat

**Issue**: SSL certificate errors
- **Fix**: Update network security config

**Issue**: Gradle build fails
- **Fix**: Update Android Studio and invalidate caches

## Production Checklist

Before submitting to App Store / Play Store:

- [ ] Remove development-only network security configs
- [ ] Update app icons for all sizes
- [ ] Add splash screens
- [ ] Test on real devices (not just simulators)
- [ ] Configure proper SSL certificates
- [ ] Remove console.log statements (or use proper logging)
- [ ] Test offline functionality
- [ ] Verify all images load correctly
- [ ] Test on multiple device sizes
- [ ] Test both orientations
- [ ] Implement proper error handling
- [ ] Add analytics (if needed)
- [ ] Configure proper deep linking
- [ ] Test bookmarks persistence
- [ ] Verify API endpoints are production URLs