// TFC Pay React - Main Entry Point
// Import this component in your React app to use TFC Pay UI

export { default as TFCPayApp } from "./components/TFCPayApp";

// Export individual mobile screens
export {
    MobileHome,
    MobileServices,
    MobileOffers,
    MobileSupport,
    MobileChatScreen,
    MobileAddMoney,
    MobileRewards,
    MobileProfileSettings,
} from "./components/mobile";

// Export UI components
export {
    Button,
    Card,
    CardHeader,
    CardFooter,
    CardTitle,
    CardDescription,
    CardContent,
    Input,
    Badge,
    Avatar,
    AvatarImage,
    AvatarFallback,
    Switch,
} from "./components/ui";

// Export hooks
export { useWallet, useTheme } from "./hooks";

// Export types
export type {
    TabType,
    ThemeMode,
    Transaction,
    Service,
    Offer,
    QuickService,
    BankAccount,
    User,
} from "./types";
