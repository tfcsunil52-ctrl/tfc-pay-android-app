import { useState } from "react";
import { Home, Gift, History, Headphones, AlertTriangle, ArrowLeft } from "lucide-react";
import {
    MobileHome,
    MobileServices,
    MobileOffers,
    MobileHistory,
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
    SplashScreen,
} from "./mobile";
import type { SignupData } from "./mobile/MobileSignup";
import { useWallet } from "../hooks/useWallet";
import { useTheme } from "../hooks/useTheme";
import { useAuth } from "../hooks/useAuth";
import { useNotifications } from "../hooks/useNotifications";
import { useTickets } from "../hooks/useTickets";
import type { TabType } from "../types";
import { getAssetPath } from "../utils/assets";

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
    const { notifications, unreadCount, addNotification, markAllAsRead, deleteNotification } = useNotifications();
    const { tickets, resolveTicket } = useTickets();

    const [activeTab, setActiveTab] = useState<TabType>(initialTab);
    const [showSettings, setShowSettings] = useState(false);
    const [showAddMoney, setShowAddMoney] = useState(false);
    const [showRewards, setShowRewards] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [settingsSubPanel, setSettingsSubPanel] = useState<string | null>(null);
    const [selectedService, setSelectedService] = useState<string | null>(null);
    const [showAllServices, setShowAllServices] = useState(false);
    const [lowBalanceWarning, setLowBalanceWarning] = useState(false);
    const [loginIdentifier, setLoginIdentifier] = useState<string>('');
    const [loginType, setLoginType] = useState<'email' | 'mobile'>('mobile');
    const [showOTP, setShowOTP] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showSignup, setShowSignup] = useState(false);
    const [rememberMe, setRememberMe] = useState(true);
    // Unread count is now managed by useNotifications hook
    const [isLocked, setIsLocked] = useState(appLockEnabled && hasPinSet); // App starts locked if PIN is set and lock is enabled
    const [supportMessage, setSupportMessage] = useState<string | undefined>(undefined);
    const [showSplash, setShowSplash] = useState(true);

    if (showSplash) {
        return <SplashScreen onComplete={() => setShowSplash(false)} isDarkMode={isDarkMode} />;
    }

    // Handle navigation
    const handleNavigate = (tab: TabType) => {
        setActiveTab(tab);
        setSelectedService(null);
        setSupportMessage(undefined);
    };

    const handleGetHelp = (message: string) => {
        setSupportMessage(message);
        setActiveTab('profile');
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
        setShowAllServices(true);
    };

    // Handle see all services
    const handleSeeAllServices = () => {
        setShowAllServices(true);
    };

    // Handle payment
    const handlePayment = (amount: number, serviceName: string, type?: 'mobile_recharge' | 'bill_payment' | 'cc_to_bank' | 'wallet', category?: string): boolean => {
        if (amount > balance) {
            setLowBalanceWarning(true);
            setTimeout(() => setLowBalanceWarning(false), 3000);
            return false;
        }
        return processPayment(amount, serviceName, type, category);
    };

    // Handle login flow
    const handleLoginContinue = (identifier: string, type: 'email' | 'mobile', rememberMe: boolean) => {
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
        // Handled in MobileNotifications component via onMarkAllAsRead
    };

    const handleResolveTicket = (ticketId: string) => {
        const ticket = tickets.find(t => t.id === ticketId);
        if (ticket) {
            resolveTicket(ticketId, "Ticket resolved via Mobile App.");
            addNotification({
                title: "Ticket Resolved",
                message: `Your ticket ${ticket.id} regarding "${ticket.subject}" has been marked as resolved.`,
                type: 'info'
            });
        }
    };

    // Tab navigation items
    const tabs = [
        { id: "home" as TabType, label: "Home", icon: Home },
        { id: "offers" as TabType, label: "Offers", icon: Gift },
        { id: "history" as TabType, label: "History", icon: History },
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
                        onSeeAllServices={handleSeeAllServices}
                        onRewardsClick={() => setShowRewards(true)}
                        onNotificationsClick={() => setShowNotifications(true)}
                        unreadNotifications={unreadCount}
                        onGetHelp={handleGetHelp}
                    />
                );
            case "offers":
                return <MobileOffers onNavigate={handleNavigate} onServiceSelect={handleServiceSelect} />;
            case "history":
                return <MobileHistory isDarkMode={isDarkMode} transactions={transactions} onGetHelp={handleGetHelp} />;
            case "profile":
                return <MobileSupport
                    initialMessage={supportMessage}
                    onClearMessage={() => setSupportMessage(undefined)}
                    tickets={tickets}
                    onResolveTicket={handleResolveTicket}
                />;
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
                    type={loginType as 'email'}
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
        <div
            className={`h-screen w-full max-w-md mx-auto flex flex-col ${isDarkMode ? "dark" : ""}`}
        >
            <div className="flex-1 flex flex-col bg-transparent text-foreground relative overflow-hidden">
                {/* Premium Dark Mode Background Decorations */}
                {isDarkMode && (
                    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 opacity-50">
                        {/* Central Focused Glow */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] rounded-full bg-green-500/[0.03] blur-[150px]" />

                        {/* Top Left Glow */}
                        <div className="absolute -top-[15%] -left-[15%] w-[80%] h-[60%] rounded-full bg-green-500/10 blur-[120px] animate-pulse" />

                        {/* Top Right Accent */}
                        <div className="absolute top-0 -right-[20%] w-[60%] h-[50%] rounded-full bg-emerald-600/5 blur-[100px]" />

                        {/* Center Edge Glow (Right) */}
                        <div className="absolute top-[30%] -right-[10%] w-[40%] h-[40%] rounded-full bg-green-400/5 blur-[80px]" />

                        {/* Bottom Left Deep Glow */}
                        <div className="absolute -bottom-[10%] -left-[20%] w-[100%] h-[60%] rounded-full bg-green-900/20 blur-[140px]" />

                        {/* Bottom Right Shape */}
                        <div className="absolute bottom-[10%] -right-[10%] w-[50%] h-[40%] rounded-full bg-emerald-900/10 blur-[100px]" />

                        {/* Subtle Floating Shapes */}
                        <div className="absolute top-[20%] left-[10%] w-32 h-32 rounded-full bg-green-400/5 blur-[40px] animate-bounce duration-[15s]" />
                        <div className="absolute bottom-[30%] right-[15%] w-48 h-48 rounded-[40%] bg-emerald-500/5 blur-[60px] animate-pulse duration-[8s]" />
                    </div>
                )}

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
                        notifications={notifications}
                        onDelete={deleteNotification}
                        onMarkAllAsRead={markAllAsRead}
                    />
                )}

                {showAllServices && (
                    <div className="absolute inset-0 z-50 bg-white dark:bg-transparent">
                        <MobileServices
                            isDarkMode={isDarkMode}
                            onPayment={handlePayment}
                            initialService={selectedService}
                            onServiceConsumed={() => setSelectedService(null)}
                            onNavigate={(tab) => {
                                setShowAllServices(false);
                                setSelectedService(null);
                                handleNavigate(tab);
                            }}
                        />
                        <button
                            onClick={() => {
                                setShowAllServices(false);
                                setSelectedService(null);
                            }}
                            className="absolute top-4 left-4 w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center hover:bg-card/80 transition-colors z-10"
                        >
                            <ArrowLeft className="w-5 h-5 text-foreground" />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TFCPayApp;
