# TFC Pay React - Android APK Ready

A complete, production-ready React module for building the TFC Pay mobile app as an Android APK.

## 🚀 Quick Start for APK Development

### Prerequisites
- Node.js 18+
- Android Studio (with SDK installed)
- Java JDK 17+

### Step 1: Install Dependencies
```bash
cd TFCPayReact
npm install
```

### Step 2: Initialize Android Project (First Time Only)
```bash
npm run android:init
```

### Step 3: Build APK
```bash
# For Debug APK:
npm run apk:build
# APK will be at: android/app/build/outputs/apk/debug/app-debug.apk

# OR open in Android Studio:
npm run android:open
```

### Step 4: Run on Device/Emulator
```bash
npm run android:run
```

---

## 📁 Project Structure

```
TFCPayReact/
├── index.html              # App entry point
├── package.json            # Dependencies & scripts
├── vite.config.ts          # Vite build config
├── tailwind.config.js      # Tailwind CSS config
├── tsconfig.json           # TypeScript config
└── src/
    ├── main.tsx            # React entry point
    ├── index.ts            # Module exports
    ├── components/
    │   ├── TFCPayApp.tsx   # Main orchestrator
    │   ├── mobile/         # 8 mobile screens
    │   └── ui/             # 6 UI components
    ├── hooks/              # useWallet, useTheme
    ├── styles/             # CSS with theme variables
    └── types/              # TypeScript types
```

---

## 🎨 Features

| Feature | Description |
|---------|-------------|
| **8 Screens** | Home, Services, Offers, Support, Chat, AddMoney, Rewards, ProfileSettings |
| **Rolling Balance** | Animated number counter for wallet balance |
| **Scratch Cards** | Interactive Canvas-based scratch to reveal rewards |
| **Dark/Light Mode** | Toggle theme with system preference support |
| **Payment Flow** | Service selection → Form → Success animation |
| **Bottom Navigation** | 4-tab navigation with active state |

---

## 📱 NPM Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run android:init` | Initialize Android project (first time) |
| `npm run android:sync` | Sync web build to Android |
| `npm run android:open` | Open in Android Studio |
| `npm run android:run` | Build & run on device |
| `npm run apk:build` | Build debug APK |

---

## 🎯 Customization

### Change Brand Colors
Edit `src/styles/index.css`:
```css
:root {
  --primary: 142 71% 45%;  /* Change this for brand color */
}
```

### Add New Screens
1. Create component in `src/components/mobile/`
2. Export from `src/components/mobile/index.ts`
3. Add to TFCPayApp.tsx navigation

---

## 📦 Tech Stack
- React 18 + TypeScript
- Vite (build tool)
- Tailwind CSS (styling)
- Capacitor (Android wrapper)
- Lucide React (icons)
