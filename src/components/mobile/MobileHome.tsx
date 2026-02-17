import { useState, useEffect } from "react";
import {
    Bell, Smartphone, Tv, Zap, Car, ChevronRight, Wallet,
    Building2, Gift, Users, QrCode, Repeat, Landmark, User,
    MonitorPlay, Flame, Fuel, Phone, Wifi, Droplets, CreditCard, Home, Plus, ArrowDownLeft, ArrowUpRight, Check, PieChart, BarChart2, AlertTriangle, Link, Eye, Headphones, ArrowUp, ArrowDown, ArrowDownRight
} from "lucide-react";
import { Card, CardContent } from "../ui/Card";
import { Button } from "../ui/Button";
import { Avatar, AvatarFallback } from "../ui/Avatar";
import ScanQR from "./ScanQR";
import UnifiedTransfer from "./transfer/UnifiedTransfer";
import BeneficiaryManagement from "./transfer/BeneficiaryManagement";
import MobileHistory from "./MobileHistory";
import { getAssetPath } from "../../utils/assets";
import { BankAccounts } from "./profile/BankAccounts";
import { TransferView } from "./profile/TransferView";
import type { Transaction, TabType } from "../../types";

interface MobileHomeProps {
    onNavigate: (tab: TabType) => void;
    onProfileClick?: (subPanel?: string) => void;
    isDarkMode?: boolean;
    balance?: number;
    previousBalance?: number;
    onBalanceSeen?: () => void;
    transactions?: Transaction[];
    onAddMoney?: () => void;
    onServiceSelect?: (serviceTitle: string) => void;
    onSeeAllServices?: () => void;
    onRewardsClick?: () => void;
    onNotificationsClick?: () => void;
    unreadNotifications?: number;
}

// Rolling number animation component
const RollingNumber = ({ value, startAt, onComplete }: { value: number; startAt: number; onComplete?: () => void }) => {
    const [display, setDisplay] = useState(startAt);

    useEffect(() => {
        if (startAt === value) {
            setDisplay(value);
            return;
        }

        let startTime: number;
        const duration = 1500;
        const startValue = startAt;
        const change = value - startAt;

        const animate = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const progress = timestamp - startTime;
            const percentage = Math.min(progress / duration, 1);
            const ease = 1 - Math.pow(1 - percentage, 3);
            const current = startValue + change * ease;
            setDisplay(current);

            if (progress < duration) {
                requestAnimationFrame(animate);
            } else {
                setDisplay(value);
                if (onComplete) onComplete();
            }
        };

        const frameId = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(frameId);
    }, [value, startAt, onComplete]);

    return (
        <span>
            {display.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </span>
    );
};

// Quick services configuration
const quickServices = [
    { icon: Smartphone, label: "Mobile", targetTitle: "Mobile Prepaid", image: "/New icons/mobile prepaid.webp" },
    { icon: Tv, label: "DTH", targetTitle: "DTH Recharge", image: "/New icons/Layer 4.webp" },
    { icon: Zap, label: "Electricity", targetTitle: "Electricity", image: "/New icons/Layer 6.webp" },
    { icon: CreditCard, label: "CC Bill", targetTitle: "CC Bill Payment", image: "/New icons/Credit Card Icon v3.webp" },
    { icon: Home, label: "Rent", targetTitle: "Rent Payment", image: "/New icons/Layer 20.webp" },
    { icon: Flame, label: "Gas", targetTitle: "Gas Cylinder", image: "/New icons/Layer 7.webp" },
    { icon: MonitorPlay, label: "Cable TV", targetTitle: "Cable TV", image: "/New icons/Layer 5.webp" },
    { icon: Wifi, label: "Broadband", targetTitle: "Broadband", image: "/New icons/Layer 12.webp" },
    { icon: Car, label: "Fastag", targetTitle: "Fastag", image: "/New icons/Layer 10.webp" },
    { icon: Fuel, label: "Piped Gas", targetTitle: "Piped Gas", image: "/New icons/Layer 8.webp" },
    { icon: Phone, label: "Landline", targetTitle: "Landline", image: "/New icons/Layer 9.webp" },
    { icon: Droplets, label: "Water", targetTitle: "Water Bill", image: "/New icons/Layer 16.webp" },
].map(s => ({ ...s, image: s.image ? getAssetPath(s.image) : undefined }));

// Banner carousel component
const BannerCarousel = ({ onNavigate }: { onNavigate: (tab: TabType) => void }) => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const banners = [
        { src: "/offer-banner.webp", alt: "5% Cashback" },
        { src: "/offer-banner-2.webp", alt: "Flat ₹100 Cashback" },
        { src: "/offer-banner-3.webp", alt: "20% Off on DTH" }
    ].map(b => ({ ...b, src: getAssetPath(b.src) }));

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % banners.length);
        }, 3000);
        return () => clearInterval(timer);
    }, [banners.length]);

    return (
        <div className="flex flex-col gap-3">
            <div className="relative group">
                <div className="rounded-2xl overflow-hidden shadow-md relative aspect-[2.2/1]">
                    {banners.map((banner, index) => (
                        <div
                            key={index}
                            className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${index === currentSlide ? "opacity-100" : "opacity-0"}`}
                        >
                            <img src={banner.src} alt={banner.alt} className="w-full h-full object-cover" />
                        </div>
                    ))}
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 px-3 py-1.5 bg-black/20 backdrop-blur-md rounded-full">
                        {banners.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentSlide(index)}
                                className={`h-1.5 rounded-full transition-all duration-300 ${index === currentSlide ? "w-4 bg-green-700 dark:bg-green-500" : "w-1.5 bg-white/50"}`}
                            />
                        ))}
                    </div>
                </div>
            </div>
            <Button
                size="sm"
                className="w-full h-10 text-sm bg-green-700 hover:bg-green-800 dark:bg-green-500 dark:hover:bg-green-400 shadow-sm text-white dark:text-black font-bold rounded-full"
                onClick={() => onNavigate("offers")}
            >
                All Offers
            </Button>
        </div>
    );
};

const MobileHome = ({
    onNavigate,
    onProfileClick,
    isDarkMode,
    balance = 2450,
    previousBalance = 0,
    onBalanceSeen,
    transactions = [],
    onAddMoney,
    onServiceSelect,
    onSeeAllServices,
    onRewardsClick,
    onNotificationsClick,
    unreadNotifications = 0
}: MobileHomeProps) => {
    const [isScanning, setIsScanning] = useState(false);
    const [transferMode, setTransferMode] = useState<'contact' | 'mobile' | 'bank' | 'beneficiary' | 'self' | 'spending' | null>(null);

    return (
        <div className="flex flex-col h-full overflow-hidden relative">
            {/* Premium Light Mode Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 dark:hidden">
                <div className="absolute -top-[10%] -left-[20%] w-[100%] h-[60%] rounded-full bg-green-100/20 blur-[120px]" />
                <div className="absolute top-[20%] -right-[30%] w-[80%] h-[70%] rounded-full bg-teal-50/15 blur-[100px]" />
                <div className="absolute bottom-[10%] -left-[20%] w-[70%] h-[50%] rounded-full bg-emerald-50/20 blur-[80px]" />
                <div className="absolute inset-0 bg-grid-slate-900/[0.02] bg-[bottom_center] [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
            </div>

            {/* Sticky Header */}
            <header className="sticky top-0 z-30 px-4 py-3 bg-white dark:bg-card border-b border-border shadow-sm">
                <div className="flex items-center justify-between relative">
                    <button
                        onClick={() => onProfileClick?.()}
                        className="flex-shrink-0 hover:scale-105 transition-transform"
                    >
                        <Avatar className="w-10 h-10 border-2 border-green-700 dark:border-green-500 shadow-sm">
                            <AvatarFallback className="bg-green-700 dark:bg-green-500 text-white dark:text-black text-sm font-bold">JD</AvatarFallback>
                        </Avatar>
                    </button>
                    <div className="absolute left-1/2 -translate-x-1/2">
                        <img
                            src={getAssetPath(isDarkMode ? "/tfcpay-logo.png" : "/tfcpay-logo-light.png")}
                            alt="TFC Pay"
                            className="h-5 w-auto object-contain"
                        />
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => alert("QR Scanning Coming Soon!")}
                            className="w-10 h-10 bg-card rounded-full flex items-center justify-center border border-border flex-shrink-0 shadow-sm hover:scale-105 active:scale-95 transition-all"
                        >
                            <QrCode className="w-5 h-5 text-foreground" />
                        </button>
                        <button
                            onClick={onNotificationsClick}
                            className="w-10 h-10 bg-card rounded-full flex items-center justify-center border border-border relative flex-shrink-0 shadow-sm hover:scale-105 active:scale-95 transition-all"
                        >
                            <Bell className="w-5 h-5 text-muted-foreground" />
                            {unreadNotifications > 0 && (
                                <span className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full text-[10px] text-black font-bold flex items-center justify-center border-2 border-background">
                                    {unreadNotifications}
                                </span>
                            )}
                        </button>
                    </div>
                </div>
            </header>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto px-4 pt-4 space-y-5 pb-8 relative z-10">
                {/* Wallet Balance & Add Money */}
                <section className="flex items-center justify-between">
                    <div>
                        <p className="text-xs text-muted-foreground font-medium mb-0.5">Available Balance</p>
                        <h2 className="text-2xl font-bold text-foreground">
                            ₹<RollingNumber value={balance} startAt={previousBalance} onComplete={onBalanceSeen} />
                        </h2>
                    </div>
                    <Button
                        size="sm"
                        className={`rounded-full px-5 h-9 font-bold active:scale-95 transition-all overflow-hidden relative ${isDarkMode
                            ? "bg-transparent border-2 border-foreground/70 text-foreground animate-gold-shine"
                            : "bg-white text-green-700 border-2 border-green-700 shadow-sm animate-silver-shine"
                            }`}
                        onClick={onAddMoney}
                    >
                        <Plus className="w-4 h-4 mr-1.5" strokeWidth={2.5} />Add Money
                    </Button>
                </section>

                {/* Banner Carousel */}
                <BannerCarousel onNavigate={onNavigate} />

                {/* Money Transfer */}
                <section className="relative z-10">
                    <div className="flex items-center justify-between mb-3 px-1">
                        <h3 className="font-bold text-foreground text-sm flex items-center gap-2">
                            <div className="w-1.5 h-4 bg-green-700 dark:bg-green-500 rounded-full" />
                            Transfer Money
                        </h3>
                    </div>
                    <Card className="bg-white dark:bg-card border-green-700/10 dark:border-border overflow-hidden relative shadow-lg">
                        <CardContent className="p-3 relative z-10">
                            <div className="grid grid-cols-4 gap-2">
                                {/* CC to Bank */}
                                <button
                                    className="flex flex-col items-center gap-1.5 group min-h-[68px] justify-center"
                                    onClick={() => onProfileClick?.("transfer-cc")}
                                >
                                    <div className="w-12 h-12 rounded-2xl bg-green-600/10 dark:bg-green-500/10 border-2 border-green-700/20 dark:border-green-500/20 flex items-center justify-center transition-all duration-200 group-hover:scale-105 group-hover:border-green-700/40 dark:group-hover:border-green-500/40 group-active:scale-95 relative">
                                        <CreditCard className="w-5 h-5 text-green-700 dark:text-green-500" strokeWidth={2} />
                                        <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-white dark:bg-gray-900 flex items-center justify-center shadow-sm border border-green-700/20 dark:border-green-500/20">
                                            <ArrowUpRight className="w-3 h-3 text-green-700 dark:text-green-500" strokeWidth={2.5} />
                                        </div>
                                    </div>
                                    <span className="text-[10px] font-medium text-center leading-tight text-foreground">CC to Bank</span>
                                </button>

                                {/* Send to Contact */}
                                <button
                                    className="flex flex-col items-center gap-1.5 group min-h-[68px] justify-center"
                                    onClick={() => setTransferMode('mobile')}
                                >
                                    <div className="w-12 h-12 rounded-2xl bg-green-600/10 dark:bg-green-500/10 border-2 border-green-700/20 dark:border-green-500/20 flex items-center justify-center transition-all duration-200 group-hover:scale-105 group-hover:border-green-700/40 dark:group-hover:border-green-500/40 group-active:scale-95 relative">
                                        <Users className="w-5 h-5 text-green-700 dark:text-green-500" strokeWidth={2} />
                                        <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-white dark:bg-gray-900 flex items-center justify-center shadow-sm border border-green-700/20 dark:border-green-500/20">
                                            <ArrowUpRight className="w-3 h-3 text-green-700 dark:text-green-500" strokeWidth={2.5} />
                                        </div>
                                    </div>
                                    <span className="text-[10px] font-medium text-center leading-tight text-foreground">To Contact</span>
                                </button>

                                {/* Send to Bank */}
                                <button
                                    className="flex flex-col items-center gap-1.5 group min-h-[68px] justify-center"
                                    onClick={() => setTransferMode('bank')}
                                >
                                    <div className="w-12 h-12 rounded-2xl bg-green-600/10 dark:bg-green-500/10 border-2 border-green-700/20 dark:border-green-500/20 flex items-center justify-center transition-all duration-200 group-hover:scale-105 group-hover:border-green-700/40 dark:group-hover:border-green-500/40 group-active:scale-95 relative">
                                        <Landmark className="w-5 h-5 text-green-700 dark:text-green-500" strokeWidth={2} />
                                        <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-white dark:bg-gray-900 flex items-center justify-center shadow-sm border border-green-700/20 dark:border-green-500/20">
                                            <ArrowDownLeft className="w-3 h-3 text-green-700 dark:text-green-500" strokeWidth={2.5} />
                                        </div>
                                    </div>
                                    <span className="text-[10px] font-medium text-center leading-tight text-foreground">To Bank</span>
                                </button>

                                {/* Send to Self */}
                                <button
                                    className="flex flex-col items-center gap-1.5 group min-h-[68px] justify-center"
                                    onClick={() => setTransferMode('self')}
                                >
                                    <div className="w-12 h-12 rounded-2xl bg-green-600/10 dark:bg-green-500/10 border-2 border-green-700/20 dark:border-green-500/20 flex items-center justify-center transition-all duration-200 group-hover:scale-105 group-hover:border-green-700/40 dark:group-hover:border-green-500/40 group-active:scale-95 relative">
                                        <Repeat className="w-5 h-5 text-green-700 dark:text-green-500" strokeWidth={2} />
                                        <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-white dark:bg-gray-900 flex items-center justify-center shadow-sm border border-green-700/20 dark:border-green-500/20">
                                            <Link className="w-3 h-3 text-green-700 dark:text-green-500" strokeWidth={2.5} />
                                        </div>
                                    </div>
                                    <span className="text-[10px] font-medium text-center leading-tight text-foreground">To Self</span>
                                </button>
                            </div>
                        </CardContent>
                    </Card>
                </section>

                {/* Quick Tools */}
                <section className="relative z-10">
                    <Card className="bg-white/50 dark:bg-card/50 border-border/50 overflow-hidden relative shadow-sm">
                        <CardContent className="p-3 relative z-10">
                            <div className="grid grid-cols-4 gap-2">
                                {/* Link Bank */}
                                <button
                                    className="flex flex-col items-center gap-1.5 group justify-center"
                                    onClick={() => onProfileClick?.("add-bank")}
                                >
                                    <div className="w-10 h-10 rounded-xl bg-muted/50 flex items-center justify-center transition-transform group-hover:scale-105 group-active:scale-95">
                                        <Landmark className="w-5 h-5 text-muted-foreground" strokeWidth={2} />
                                    </div>
                                    <span className="text-[9px] font-medium text-center leading-tight text-muted-foreground">Link Bank</span>
                                </button>

                                {/* Beneficiary */}
                                <button
                                    className="flex flex-col items-center gap-1.5 group justify-center"
                                    onClick={() => setTransferMode('beneficiary')}
                                >
                                    <div className="w-10 h-10 rounded-xl bg-muted/50 flex items-center justify-center transition-transform group-hover:scale-105 group-active:scale-95">
                                        <User className="w-5 h-5 text-muted-foreground" strokeWidth={2} />
                                    </div>
                                    <span className="text-[9px] font-medium text-center leading-tight text-muted-foreground">Beneficiary</span>
                                </button>

                                {/* See Report */}
                                <button
                                    className="flex flex-col items-center gap-1.5 group justify-center"
                                    onClick={() => setTransferMode('spending')}
                                >
                                    <div className="w-10 h-10 rounded-xl bg-muted/50 flex items-center justify-center transition-transform group-hover:scale-105 group-active:scale-95">
                                        <BarChart2 className="w-5 h-5 text-muted-foreground" strokeWidth={2} />
                                    </div>
                                    <span className="text-[9px] font-medium text-center leading-tight text-muted-foreground">Report</span>
                                </button>

                                {/* Support */}
                                <button
                                    className="flex flex-col items-center gap-1.5 group justify-center"
                                    onClick={() => onNavigate("profile")}
                                >
                                    <div className="w-10 h-10 rounded-xl bg-muted/50 flex items-center justify-center transition-transform group-hover:scale-105 group-active:scale-95">
                                        <AlertTriangle className="w-5 h-5 text-muted-foreground" strokeWidth={2} />
                                    </div>
                                    <span className="text-[9px] font-medium text-center leading-tight text-muted-foreground">Complain</span>
                                </button>
                            </div>
                        </CardContent>
                    </Card>
                </section>

                {/* Action Buttons */}
                <section className="rounded-2xl border border-blue-50/50 p-2 bg-white shadow-lg relative z-10 dark:bg-card dark:border-border dark:shadow-none">
                    <div className="grid grid-cols-3 gap-2">
                        <Card
                            className="bg-blue-500/15 border border-blue-200/50 cursor-pointer hover:scale-[1.02] active:scale-95 transition-all shadow-none dark:bg-blue-500/10 dark:border-0"
                            onClick={() => onProfileClick?.("wallet")}
                        >
                            <CardContent className="py-2 px-1 flex flex-col items-center gap-1">
                                <Wallet className="w-5 h-5 text-blue-600" strokeWidth={2} />
                                <span className="text-[11px] font-bold text-foreground">Wallet</span>
                                <span className="text-[10px] text-muted-foreground">
                                    ₹<RollingNumber value={balance} startAt={previousBalance} />
                                </span>
                            </CardContent>
                        </Card>

                        <button onClick={() => onRewardsClick?.()} className="h-full">
                            <Card className="bg-orange-500/15 border border-orange-200/50 cursor-pointer hover:scale-[1.02] active:scale-95 transition-all h-full shadow-none dark:bg-orange-500/10 dark:border-0">
                                <CardContent className="py-2 px-1 flex flex-col items-center gap-1">
                                    <Gift className="w-5 h-5 text-orange-600" strokeWidth={2} />
                                    <span className="text-[11px] font-bold text-foreground">Rewards</span>
                                    <span className="text-[10px] text-muted-foreground">5 New</span>
                                </CardContent>
                            </Card>
                        </button>

                        <Card
                            className="bg-purple-500/15 border border-purple-200/50 cursor-pointer hover:scale-[1.02] active:scale-95 transition-all shadow-none dark:bg-purple-500/10 dark:border-0"
                            onClick={() => onProfileClick?.("refer")}
                        >
                            <CardContent className="py-2 px-1 flex flex-col items-center gap-1">
                                <Users className="w-5 h-5 text-purple-600" strokeWidth={2} />
                                <span className="text-[11px] font-bold text-foreground">Refer</span>
                                <span className="text-[10px] text-muted-foreground">Get ₹100</span>
                            </CardContent>
                        </Card>
                    </div>
                </section>

                {/* Recharge & Pay Bills */}
                <section>
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold text-foreground text-sm">Recharge & Pay Bills</h3>
                    </div>
                    <Card className="bg-white dark:bg-card border-green-700/10 dark:border-border overflow-hidden relative shadow-lg">
                        <CardContent className="p-3 relative z-10">
                            <div className="grid grid-cols-4 gap-3">
                                {quickServices.map((service, index) => (
                                    <button
                                        key={index}
                                        className="flex flex-col items-center gap-1.5 active:scale-95 transition-transform"
                                        onClick={() => onServiceSelect?.(service.targetTitle || service.label)}
                                    >
                                        {service.image ? (
                                            <div className="w-10 h-10 flex items-center justify-center">
                                                <img src={service.image} alt={service.label} className="w-full h-full object-contain" />
                                            </div>
                                        ) : (
                                            <div className="w-10 h-10 rounded-xl bg-green-600/10 dark:bg-green-500/10 flex items-center justify-center">
                                                <service.icon className="w-5 h-5 text-green-700 dark:text-green-500" />
                                            </div>
                                        )}
                                        <span className="text-[10px] text-muted-foreground text-center font-medium leading-tight">{service.label}</span>
                                    </button>
                                ))}
                            </div>

                            <div className="mt-4 px-1">
                                <button
                                    onClick={() => onSeeAllServices?.()}
                                    className="w-full flex items-center justify-center gap-2 text-xs font-bold text-green-700 dark:text-green-500 bg-green-50 dark:bg-green-900/20 py-3 rounded-xl hover:bg-green-100 dark:hover:bg-green-900/30 transition-all active:scale-[0.98] border border-green-700/5 dark:border-green-500/5 shadow-sm"
                                >
                                    <span>View More</span>
                                    <div className="arrow-animated">
                                        <ChevronRight className="w-3.5 h-3.5" />
                                        <ChevronRight className="w-3.5 h-3.5" />
                                        <ChevronRight className="w-3.5 h-3.5" />
                                    </div>
                                </button>
                            </div>
                        </CardContent>
                    </Card>
                </section>

                {/* Transfer Money */}


                {/* Recent Activity */}
                <section>
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold text-foreground">Recent Activity</h3>
                        <button className="text-green-700 dark:text-green-500 text-xs" onClick={() => onNavigate("history")}>View All</button>
                    </div>
                    <div className="space-y-2">
                        {transactions.map((tx, index) => (
                            <Card key={index} className="bg-card border-border">
                                <CardContent className="p-3 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${tx.isCredit ? 'bg-green-600/20 dark:bg-green-500/20' : 'bg-red-600/10 dark:bg-red-500/10'}`}>
                                            {typeof tx.icon === 'string' ? (
                                                <img src={getAssetPath(tx.icon)} alt={tx.name} className="w-6 h-6 object-contain" />
                                            ) : (
                                                <tx.icon className={`w-5 h-5 ${tx.isCredit ? 'text-green-700 dark:text-green-500' : 'text-red-600 dark:text-red-500'}`} />
                                            )}
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-foreground">{tx.name}</p>
                                            <p className="text-xs text-muted-foreground">{tx.time}</p>
                                        </div>
                                    </div>
                                    <span className={`font-semibold text-sm ${tx.isCredit ? 'text-green-700 dark:text-green-500' : 'text-red-600 dark:text-red-500'}`}>
                                        {tx.amount}
                                    </span>
                                </CardContent>
                            </Card>
                        ))}
                        {transactions.length === 0 && (
                            <div className="text-center p-4 text-muted-foreground text-xs">No recent transactions</div>
                        )}
                    </div>
                </section>
            </div >
            {isScanning && (
                <ScanQR
                    onClose={() => setIsScanning(false)}
                    onScan={(data) => {
                        setIsScanning(false);
                        alert(`Scanned: ${data}`);
                    }}
                />
            )}

            {/* Transfer Overlays */}
            {(transferMode === 'mobile' || transferMode === 'bank') && (
                <UnifiedTransfer
                    onBack={() => setTransferMode(null)}
                    initialTab={transferMode === 'mobile' ? 'mobile' : 'bank'}
                    hideTabs={true}
                />
            )}
            {transferMode === 'beneficiary' && <BeneficiaryManagement onBack={() => setTransferMode(null)} />}
            {transferMode === 'spending' && (
                <div className="fixed inset-0 z-50 bg-background animate-in slide-in-from-right duration-300">
                    <MobileHistory
                        isDarkMode={isDarkMode}
                        transactions={transactions}
                        activeView="spending"
                        onBack={() => setTransferMode(null)}
                    />
                </div>
            )}
            {
                transferMode === 'self' && (
                    <div className="fixed inset-0 z-50 bg-background animate-in slide-in-from-right duration-300">
                        <TransferView
                            onBack={() => setTransferMode(null)}
                            title="Wallet to Bank"
                            buttonText="Transfer Now"
                            beneficiaryInfo={{
                                name: "John Doe (Self)",
                                subtext: "HDFC Bank • XXXX 1234",
                                initials: "JD",
                                isVerified: true,
                                bankDetails: true
                            }}
                            fields={[
                                { label: "Amount", placeholder: "₹0", type: "number" },
                                { label: "Transfer Note", placeholder: "e.g. Savings transfer", value: "Wallet to Bank Transfer" }
                            ]}
                            isClosing={false}
                            walletBalance={balance}
                            note="Funds will be transferred from your TFC Wallet to your primary bank account."
                        />
                    </div>
                )
            }
        </div >
    );
};

export default MobileHome;
