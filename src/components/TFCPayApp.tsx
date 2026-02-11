import { useState } from "react";
import { Home, Grid, Gift, Headphones, AlertTriangle } from "lucide-react";
import {
    MobileHome,
    MobileServices,
    MobileOffers,
    MobileSupport,
    MobileAddMoney,
    MobileRewards,
    MobileProfileSettings,
    MobileNotifications,
    MobileLogin,
    MobileOTPVerification,
    MobilePasswordVerification,
    MobileSignup,
    AppLock,
} from "./mobile";
import type { SignupData } from "./mobile/MobileSignup";
import { useWallet } from "../hooks/useWallet";
import { useTheme } from "../hooks/useTheme";
import { useAuth } from "../hooks/useAuth";
import type { TabType } from "../types";

interface TFCPayAppProps {
    initialTab?: TabType;
    initialTheme?: "dark" | "light";
}

const TFCPayApp = ({ initialTab = "home", initialTheme = "dark" }: TFCPayAppProps) => {
    const {
        isAuthenticated, login, logout, signup,
        hasPinSet, appLockEnabled, biometricEnabled,
        setPin, changePin, removePin, setAppLockEnabled, setBiometricEnabled
    } = useAuth();
    const { balance, previousBalance, transactions, addMoney, processPayment, onBalanceSeen } = useWallet();
    const { isDarkMode, toggleTheme } = useTheme(initialTheme);

    const [activeTab, setActiveTab] = useState<TabType>(initialTab);
    const [showSettings, setShowSettings] = useState(false);
    const [showAddMoney, setShowAddMoney] = useState(false);
    const [showRewards, setShowRewards] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [settingsSubPanel, setSettingsSubPanel] = useState<string | null>(null);
    const [selectedService, setSelectedService] = useState<string | null>(null);
    const [lowBalanceWarning, setLowBalanceWarning] = useState(false);
    const [loginIdentifier, setLoginIdentifier] = useState<string>('');
    const [loginType, setLoginType] = useState<'email' | 'mobile' | 'userid'>('mobile');
    const [showOTP, setShowOTP] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showSignup, setShowSignup] = useState(false);
    const [rememberMe, setRememberMe] = useState(true);
    const [unreadNotifications, setUnreadNotifications] = useState(3);
    const [isLocked, setIsLocked] = useState(appLockEnabled && hasPinSet); // App starts locked if PIN is set and lock is enabled

    // Handle navigation
    const handleNavigate = (tab: TabType) => {
        setActiveTab(tab);
        setSelectedService(null);
    };

    // Handle profile/settings click
    const handleProfileClick = (subPanel?: string) => {
        if (subPanel) {
            setSettingsSubPanel(subPanel);
        }
        setShowSettings(true);
    };

    // Handle service selection from home
    const handleServiceSelect = (serviceTitle: string) => {
        setSelectedService(serviceTitle);
        setActiveTab("services");
    };

    // Handle payment
    const handlePayment = (amount: number, serviceName: string): boolean => {
        if (amount > balance) {
            setLowBalanceWarning(true);
            setTimeout(() => setLowBalanceWarning(false), 3000);
            return false;
        }
        return processPayment(amount, serviceName);
    };

    // Handle login flow
    const handleLoginContinue = (identifier: string, type: 'email' | 'mobile' | 'userid', rememberMe: boolean) => {
        setLoginIdentifier(identifier);
        setLoginType(type);
        setRememberMe(rememberMe);

        // Route based on login type
        if (type === 'mobile') {
            setShowOTP(true); // Mobile uses OTP
        } else {
            setShowPassword(true); // Email/UserID uses password
        }
    };

    const handleOTPVerify = () => {
        login(loginIdentifier, loginType, rememberMe);
        setShowOTP(false);
    };

    const handleOTPBack = () => {
        setShowOTP(false);
    };

    const handlePasswordVerify = (password: string) => {
        // In a real app, verify password against stored credentials
        login(loginIdentifier, loginType, rememberMe);
        setShowPassword(false);
    };

    const handlePasswordBack = () => {
        setShowPassword(false);
    };

    const handleSignup = (data: SignupData) => {
        // Auto-detect type from identifier
        const detectType = (value: string): 'email' | 'mobile' | 'userid' => {
            if (value.includes('@') && value.includes('.')) return 'email';
            if (/^\d{10}$/.test(value.replace(/\s/g, ''))) return 'mobile';
            return 'userid';
        };

        const type = detectType(data.identifier);
        // In a real app, this would create an account via API
        signup(data.identifier, type, true, data.pin); // Auto-login after signup with PIN
        setShowSignup(false);
    };

    const handleLogout = () => {
        logout();
        setShowSettings(false);
        setActiveTab('home');
    };

    const handleNotificationsOpened = () => {
        setUnreadNotifications(0);
    };

    // Tab navigation items
    const tabs = [
        { id: "home" as TabType, label: "Home", icon: Home },
        { id: "services" as TabType, label: "Services", icon: Grid },
        { id: "offers" as TabType, label: "Offers", icon: Gift },
        { id: "profile" as TabType, label: "Support", icon: Headphones },
    ];

    // Render content based on active tab
    const renderContent = () => {
        switch (activeTab) {
            case "home":
                return (
                    <MobileHome
                        onNavigate={handleNavigate}
                        onProfileClick={handleProfileClick}
                        isDarkMode={isDarkMode}
                        balance={balance}
                        previousBalance={previousBalance}
                        onBalanceSeen={onBalanceSeen}
                        transactions={transactions}
                        onAddMoney={() => setShowAddMoney(true)}
                        onServiceSelect={handleServiceSelect}
                        onRewardsClick={() => setShowRewards(true)}
                        onNotificationsClick={() => setShowNotifications(true)}
                        unreadNotifications={unreadNotifications}
                    />
                );
            case "services":
                return (
                    <MobileServices
                        isDarkMode={isDarkMode}
                        onPayment={handlePayment}
                        initialService={selectedService}
                        onServiceConsumed={() => setSelectedService(null)}
                        onNavigate={handleNavigate}
                    />
                );
            case "offers":
                return <MobileOffers />;
            case "profile":
                return <MobileSupport />;
            default:
                return <MobileHome onNavigate={handleNavigate} />;
        }
    };

    // App Lock Screen 
    if (isLocked && hasPinSet && (appLockEnabled || !isAuthenticated)) {
        return (
            <AppLock
                onUnlock={() => {
                    setIsLocked(false);
                    if (!isAuthenticated) {
                        // If we were at the login screen, clicking unlock should log us in
                        const lastId = localStorage.getItem('tfc_last_identifier') || 'User';
                        const lastType = (localStorage.getItem('tfc_last_type') as any) || 'mobile';
                        login(lastId, lastType, true);
                    }
                }}
                onSwitchAccount={() => {
                    logout();
                    setIsLocked(false);
                    // Don't auto-login if they want to switch account
                }}
                savedPin={localStorage.getItem('tfc_pin')}
                biometricEnabled={biometricEnabled}
            />
        );
    }

    // Show login/signup/verification screens if not authenticated
    if (!isAuthenticated) {
        if (showSignup) {
            return (
                <MobileSignup
                    onSignup={handleSignup}
                    onBackToLogin={() => setShowSignup(false)}
                    isDarkMode={isDarkMode}
                />
            );
        }

        if (showOTP) {
            return (
                <MobileOTPVerification
                    identifier={loginIdentifier}
                    type={loginType}
                    onVerify={handleOTPVerify}
                    onBack={handleOTPBack}
                    isDarkMode={isDarkMode}
                />
            );
        }

        if (showPassword) {
            return (
                <MobilePasswordVerification
                    identifier={loginIdentifier}
                    type={loginType as 'email' | 'userid'}
                    onVerify={handlePasswordVerify}
                    onBack={handlePasswordBack}
                    onForgotPassword={() => {/* TODO: Handle forgot password */ }}
                    isDarkMode={isDarkMode}
                />
            );
        }

        return (
            <MobileLogin
                onContinue={handleLoginContinue}
                onSignupClick={() => setShowSignup(true)}
                onPinLoginClick={() => setIsLocked(true)}
                hasPinSet={hasPinSet}
                isDarkMode={isDarkMode}
            />
        );
    }

    return (
        <div className={`h-screen w-full max-w-md mx-auto flex flex-col ${isDarkMode ? "dark" : ""}`}>
            <div className="flex-1 flex flex-col bg-background text-foreground relative overflow-hidden">
                {/* Low Balance Warning */}
                {lowBalanceWarning && (
                    <div className="absolute top-4 left-4 right-4 z-[100] animate-in slide-in-from-top fade-in duration-300">
                        <div className="bg-red-500 text-white p-3 rounded-xl flex items-center gap-3 shadow-lg">
                            <AlertTriangle className="w-5 h-5" />
                            <span className="text-sm font-medium">Insufficient balance! Please add money.</span>
                        </div>
                    </div>
                )}

                {/* Main Content */}
                <main className="flex-1 overflow-hidden">
                    {renderContent()}
                </main>

                {/* Bottom Navigation */}
                <nav className="sticky bottom-0 w-full bg-card/80 backdrop-blur-md border-t border-border px-4 py-2 z-40">
                    <div className="flex items-center justify-around max-w-md mx-auto">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => handleNavigate(tab.id)}
                                className={`flex flex-col items-center gap-1 py-2 px-4 rounded-xl transition-all ${activeTab === tab.id
                                    ? "bg-green-700/10 text-green-700 dark:bg-green-500/10 dark:text-green-500 scale-105"
                                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                                    }`}
                            >
                                <tab.icon className={`w-5 h-5 ${activeTab === tab.id ? "stroke-2" : ""}`} />
                                <span className={`text-[10px] ${activeTab === tab.id ? "font-semibold" : ""}`}>
                                    {tab.label}
                                </span>
                            </button>
                        ))}
                    </div>
                </nav>

                {/* Overlays */}
                {showSettings && (
                    <MobileProfileSettings
                        onClose={() => {
                            setShowSettings(false);
                            setSettingsSubPanel(null);
                        }}
                        onNavigate={handleNavigate}
                        onThemeToggle={toggleTheme}
                        isDarkMode={isDarkMode}
                        initialSubPanel={settingsSubPanel}
                        balance={balance}
                        transactions={transactions}
                        onAddMoney={() => {
                            setShowSettings(false);
                            setTimeout(() => setShowAddMoney(true), 300);
                        }}
                        onLogout={handleLogout}
                        hasPinSet={hasPinSet}
                        appLockEnabled={appLockEnabled}
                        biometricEnabled={biometricEnabled}
                        onSetPin={setPin}
                        onChangePin={changePin}
                        onRemovePin={removePin}
                        onToggleAppLock={setAppLockEnabled}
                        onToggleBiometric={setBiometricEnabled}
                    />
                )}

                {showAddMoney && (
                    <MobileAddMoney
                        onClose={() => setShowAddMoney(false)}
                        onAdd={(amount) => {
                            addMoney(amount);
                        }}
                        isDarkMode={isDarkMode}
                    />
                )}

                {showRewards && (
                    <MobileRewards
                        onClose={() => setShowRewards(false)}
                        isDarkMode={isDarkMode}
                    />
                )}

                {showNotifications && (
                    <MobileNotifications
                        onClose={() => setShowNotifications(false)}
                        isDarkMode={isDarkMode}
                        onOpen={handleNotificationsOpened}
                    />
                )}
            </div>
        </div>
    );
};

export default TFCPayApp;
