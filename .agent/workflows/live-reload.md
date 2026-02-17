---
description: How to run the app with Live Reload for Android development
---

This workflow explains how to enable "Live Reload" so you can see changes instantly on your Android device or emulator without rebuilding the APK.

### Prerequisites
1. Ensure your Android device/emulator is on the same Wi-Fi network as your computer.
2. Your current local IP address is: `10.19.24.9` (This is already configured in `capacitor.config.ts`).

### Steps

1. **Start the Development Server**
   Open a terminal and run:
   ```bash
   npm run live
   ```
   This starts the Vite server on port `3000` and makes it accessible on your network.

2. **Run the App on Android**
   Open a **second** terminal and run:
   ```bash
   npm run android:debug
   ```
   This will launch the app on your connected device. Because `capacitor.config.ts` has the `server.url` set, the app will load from your computer's dev server.

3. **Develop!**
   Any changes you make to the code in `src/` will now automatically refresh on your Android device.

---
**Note:** To build a final production APK (without Live Reload), you should comment out the `server` block in `capacitor.config.ts` and run `npm run apk:build`.
