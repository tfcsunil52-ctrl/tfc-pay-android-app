import { useState } from "react";
import {
    ArrowLeft, Camera, ChevronRight, User, CreditCard,
    Mail, Globe, Moon, Headphones, Info, Share2, Star, LogOut, FileText,
    Wallet, Gift, Users, CheckCircle2, Edit2, Phone, Calendar, MapPin, Building2, User2, Copy, Send, MessageCircle,
    Lock, Fingerprint, ShieldCheck, KeyRound, Trash2, Plus
} from "lucide-react";
import AppLock from "./AppLock";
import { Card, CardContent } from "../ui/Card";
import { Button } from "../ui/Button";
import { Avatar, AvatarFallback } from "../ui/Avatar";
import { Input } from "../ui/Input";
import { SettingsItem, Divider } from "./shared/SettingsItem";
import { ProfileInputField } from "./profile/ProfileInputField";
import { TransferView } from "./profile/TransferView";
import { BankAccounts } from "./profile/BankAccounts";
import TransactionReceipt from "./TransactionReceipt";
import type { Transaction, TabType } from "../../types";

interface MobileProfileSettingsProps {
    onClose: () => void;
    onNavigate?: (tab: TabType) => void;
    onThemeToggle?: () => void;
    isDarkMode?: boolean;
    initialSubPanel?: string | null;
    balance?: number;
    transactions?: Transaction[];
    onAddMoney?: () => void;
    onLogout?: () => void;
    hasPinSet?: boolean;
    appLockEnabled?: boolean;
    biometricEnabled?: boolean;
    onSetPin?: (pin: string) => void;
    onChangePin?: (pin: string) => void;
    onRemovePin?: () => void;
    onToggleAppLock?: (enabled: boolean) => void;
    onToggleBiometric?: (enabled: boolean) => void;
}

const MobileProfileSettings = ({ onClose, onNavigate, onThemeToggle, isDarkMode, initialSubPanel, balance = 0, transactions = [], onAddMoney, onLogout, hasPinSet = false, appLockEnabled = false, biometricEnabled = false, onSetPin, onChangePin, onRemovePin, onToggleAppLock, onToggleBiometric }: MobileProfileSettingsProps) => {
    const [activeSubPanel, setActiveSubPanel] = useState<string | null>(initialSubPanel || null);
    const [gstNumber, setGstNumber] = useState("");
    const [panNumber, setPanNumber] = useState("");
    const [aadhaarNumber, setAadhaarNumber] = useState("");
    const [email, setEmail] = useState("john.doe@email.com");
    const [userName, setUserName] = useState("John Doe");
    const [phone, setPhone] = useState("+91 98765 43210");
    const [gender, setGender] = useState("Male");
    const [dob, setDob] = useState("1990-01-01");
    const [city, setCity] = useState("Mumbai");
    const [district, setDistrict] = useState("Mumbai Suburban");
    const [stateName, setStateName] = useState("Maharashtra");
    const [pinCode, setPinCode] = useState("400001");
    const [isClosing, setIsClosing] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
    const [bankAccounts, setBankAccounts] = useState([
        { id: "1", bankName: "HDFC Bank", accountNumber: "XXXX 1234", ifsc: "HDFC0001234", isPrimary: true },
        { id: "2", bankName: "SBI", accountNumber: "XXXX 5678", ifsc: "SBIN0005678", isPrimary: false },
    ]);
    const [checkingBalanceId, setCheckingBalanceId] = useState<string | null>(null);
    const [visibleBalances, setVisibleBalances] = useState<Record<string, string>>({});

    const handleCheckBalance = (id: string) => {
        if (visibleBalances[id]) return;

        setCheckingBalanceId(id);
        // Simulate API call
        setTimeout(() => {
            const randomBalance = Math.floor(Math.random() * 50000) + 1000;
            setVisibleBalances(prev => ({ ...prev, [id]: `₹${randomBalance.toLocaleString()}` }));
            setCheckingBalanceId(null);
        }, 1500);
    };

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            onClose();
        }, 300);
    };

    const handleBack = () => {
        // Close receipt if open
        if (selectedTransaction) {
            setSelectedTransaction(null);
            return;
        }

        // If we opened directly to a sub-panel from Home (props), close the whole modal
        // We trust initialSubPanel implies "Deep Link Mode"
        if (initialSubPanel) {
            handleClose();
        } else {
            // Otherwise just go back to main list
            setActiveSubPanel(null);
        }
    };

    const handleAction = (title: string) => {
        // Handle specific navigation actions
        if (title === "24X7 Help & Support") {
            onNavigate?.("profile");
            handleClose();
        } else if (title === "Refer And Earn") {
            setActiveSubPanel("refer");
        } else if (title === "Theme") {
            onThemeToggle?.();
        } else if (title === "Log Out") {
            const confirmLogout = window.confirm("Are you sure you want to log out?");
            if (confirmLogout) {
                onLogout?.();
                handleClose();
            }
        } else if (title === "Profile") {
            setActiveSubPanel("profile");
        } else if (title === "Pan Number") {
            setActiveSubPanel("pan");
        } else if (title === "AADHAAR NUMBER") {
            setActiveSubPanel("aadhaar");
        } else if (title === "Update GST Number") {
            setActiveSubPanel("gst");
        } else if (title === "Update Email ID") {
            setActiveSubPanel("email");
        } else if (title === "Wallet") {
            setActiveSubPanel("wallet");
        } else if (title === "Language") {
            alert("Language settings coming soon!");
        } else if (title === "About Recharge Bill") {
            // Simple alert or open link
            alert("TFC Pay v1.0.0\nBuilt for seamless payments.");
        } else if (title === "Rate Us") {
            alert("Thank you for your rating! ⭐⭐⭐⭐⭐");
        } else if (title === "Setup PIN" || title === "Change PIN") {
            setActiveSubPanel("pin-setup");
        } else if (title === "Remove PIN") {
            const confirmRemove = window.confirm("This will remove your PIN and disable App Lock. Continue?");
            if (confirmRemove) {
                onRemovePin?.();
            }
        } else {
            // Check for transfer actions passed from Home
            if (["add-bank", "transfer-cc"].includes(title)) {
                setActiveSubPanel(title);
            } else {
                alert(`${title} feature coming soon!`);
            }
        }
    };

    // PIN Setup / Change sub-panel
    if (activeSubPanel === "pin-setup") {
        return (
            <div className="fixed inset-0 z-[100] bg-white dark:bg-[#060606]">
                <AppLock
                    mode="setup"
                    onUnlock={() => setActiveSubPanel(null)}
                    onPinSet={(newPin) => {
                        if (hasPinSet) {
                            onChangePin?.(newPin);
                        } else {
                            onSetPin?.(newPin);
                        }
                        setActiveSubPanel(null);
                    }}
                />
            </div>
        );
    }

    if (activeSubPanel === "wallet") {
        return (
            <div className={`flex flex-col h-full bg-white dark:bg-[#060606] absolute inset-0 z-[60] overflow-hidden ${isClosing ? 'animate-out slide-out-to-right duration-300' : 'animate-in slide-in-from-right duration-300'}`}>
                <div className="flex items-center p-4 border-b border-border bg-card/50 backdrop-blur-md z-10">
                    <button onClick={handleBack} className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center hover:bg-card/80 transition-colors">
                        <ArrowLeft className="w-5 h-5 text-foreground" />
                    </button>
                    <h2 className="ml-4 font-bold text-foreground">My Wallet</h2>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-6">
                    {/* Balance Card */}
                    <div className="relative overflow-hidden rounded-2xl bg-card border border-green-700/20 dark:border-green-500/20 p-6 shadow-lg">
                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-muted-foreground text-sm font-medium">Available Balance</p>
                                <Wallet className="w-5 h-5 text-green-700 dark:text-green-500" />
                            </div>
                            <h2 className="text-4xl font-bold mb-6 text-foreground">₹{balance.toLocaleString()}</h2>
                            <Button
                                className="w-full bg-green-700 hover:bg-green-800 dark:bg-green-500 dark:hover:bg-green-400 text-white dark:text-black font-bold shadow-lg shadow-green-700/20 dark:shadow-green-500/20"
                                onClick={() => {
                                    handleClose();
                                    setTimeout(() => onAddMoney?.(), 300);
                                }}
                            >
                                <CreditCard className="w-4 h-4 mr-2" /> Add Money
                            </Button>
                        </div>
                        {/* Subtle background decoration */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-green-600/10 dark:bg-green-500/10 rounded-full -mr-16 -mt-16 blur-3xl pointer-events-none" />
                        <div className="absolute bottom-0 left-0 w-24 h-24 bg-green-600/5 dark:bg-green-500/5 rounded-full -ml-8 -mb-8 blur-2xl pointer-events-none" />
                    </div>

                    {/* Transaction History */}
                    <div>
                        <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
                            <FileText className="w-4 h-4 text-muted-foreground" /> Transaction History
                        </h3>
                        <div className="space-y-3">
                            {transactions.filter(t => t.type === 'wallet').length > 0 ? (
                                transactions.filter(t => t.type === 'wallet').map((tx, index) => (
                                    <div key={index} onClick={() => setSelectedTransaction(tx)} className="cursor-pointer transition-transform active:scale-[0.98]">
                                        <Card className="bg-card border-border hover:bg-muted/50 transition-colors">
                                            <CardContent className="p-3 flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${tx.isCredit ? 'bg-green-500/10' : 'bg-red-500/10'}`}>
                                                        <tx.icon className={`w-5 h-5 ${tx.isCredit ? 'text-green-600' : 'text-red-500'}`} />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium text-foreground">{tx.name}</p>
                                                        <p className="text-xs text-muted-foreground">{tx.time}</p>
                                                    </div>
                                                </div>
                                                <span className={`font-semibold text-sm ${tx.isCredit ? 'text-green-600' : 'text-foreground'}`}>
                                                    {tx.amount}
                                                </span>
                                            </CardContent>
                                        </Card>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center p-8 text-muted-foreground">
                                    <p>No transactions yet</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div >
        );
    }



    if (selectedTransaction) {
        return <TransactionReceipt
            transaction={selectedTransaction}
            onClose={() => setSelectedTransaction(null)}
        />;
    }

    if (activeSubPanel === "add-bank") {
        return <BankAccounts onBack={handleBack} />;
    }

    if (activeSubPanel === "transfer-cc") {
        const bankOptions = bankAccounts.map(acc => ({
            label: `${acc.bankName} (${acc.accountNumber})`,
            value: acc.id
        }));

        const transferFields = [
            { label: "Card Number", placeholder: "XXXX XXXX XXXX XXXX", type: "number", maxLength: 16 },
            {
                label: "Select Bank Account",
                type: bankAccounts.length > 0 ? "select" : "button",
                options: bankOptions,
                placeholder: "Link a Bank Account",
                icon: Plus,
                onClick: () => setActiveSubPanel("add-bank")
            },
            { label: "Amount", placeholder: "Enter Amount", type: "number" }
        ];

        return <TransferView
            title="Credit Card to Bank"
            fields={transferFields}
            onBack={handleBack}
            buttonText="Transfer"
            note="Nominal charges may apply for credit card to bank transfers."
            isClosing={isClosing}
        />;
    }

    if (activeSubPanel === "profile") {
        return (
            <div className={`flex flex-col h-full bg-white dark:bg-[#060606] absolute inset-0 z-[60] overflow-hidden ${isClosing ? 'animate-out slide-out-to-right duration-300' : 'animate-in slide-in-from-right duration-300'}`}>
                <div className="flex items-center p-4 border-b border-border bg-card/50 backdrop-blur-md z-10">
                    <button onClick={handleBack} className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center">
                        <ArrowLeft className="w-5 h-5 text-foreground" />
                    </button>
                    <h2 className="ml-4 font-bold text-foreground">Edit Profile</h2>
                </div>
                <div className="flex-1 overflow-y-auto p-6 space-y-8">
                    <div className="flex flex-col items-center gap-4 mb-2">
                        <div className="relative">
                            <Avatar className="w-24 h-24 border-2 border-green-700 dark:border-green-500">
                                <AvatarFallback className="bg-green-600/20 dark:bg-green-500/20 text-green-700 dark:text-green-500 text-3xl font-bold">JD</AvatarFallback>
                            </Avatar>
                            <button className="absolute bottom-0 right-0 w-8 h-8 bg-green-700 dark:bg-green-500 rounded-full flex items-center justify-center border-2 border-background">
                                <Camera className="w-4 h-4 text-white dark:text-black" />
                            </button>
                        </div>
                        <div className="text-center">
                            <p className="text-xs text-muted-foreground">Active since - Feb 2026</p>
                        </div>
                    </div>

                    {/* Personal Information */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                            Personal Information
                        </h3>
                        <Card className="bg-card border-border overflow-hidden">
                            <CardContent className="p-0">
                                <ProfileInputField icon={User} label="Full Name" value={userName} onChange={setUserName} />
                                <ProfileInputField icon={Mail} label="Email" value={email} onChange={setEmail} />
                                <ProfileInputField icon={Phone} label="Phone" value={phone} onChange={setPhone} />
                                <ProfileInputField icon={User2} label="Gender" value={gender} onChange={setGender} />
                                <ProfileInputField icon={Calendar} label="Date Of Birth" value={dob} onChange={setDob} type="date" />
                                <ProfileInputField icon={CreditCard} label="Aadhaar" value={aadhaarNumber || "Not Linked"} onClick={() => setActiveSubPanel("aadhaar")} readOnly />
                                <ProfileInputField icon={FileText} label="Pan" value={panNumber || "Not Linked"} onClick={() => setActiveSubPanel("pan")} readOnly />
                                <ProfileInputField icon={Info} label="GST" value={gstNumber || "Not Added"} onClick={() => setActiveSubPanel("gst")} readOnly />
                            </CardContent>
                        </Card>
                    </div>

                    {/* Address Section */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-bold text-foreground">Address</h3>
                        <Card className="bg-card border-border overflow-hidden">
                            <CardContent className="p-0">
                                <ProfileInputField icon={Building2} label="City" value={city} onChange={setCity} />
                                <ProfileInputField icon={MapPin} label="District" value={district} onChange={setDistrict} />
                                <ProfileInputField icon={Globe} label="State" value={stateName} onChange={setStateName} />
                                <ProfileInputField icon={MapPin} label="Pin Code" value={pinCode} onChange={setPinCode} />
                            </CardContent>
                        </Card>
                    </div>

                    <Button className="w-full bg-green-700 hover:bg-green-800 dark:bg-green-500 dark:hover:bg-green-400 text-white dark:text-black font-bold h-12 rounded-xl mt-4 shadow-lg shadow-green-700/10 dark:shadow-green-500/10" onClick={handleBack}>
                        Save Changes
                    </Button>
                </div>
            </div>
        );
    }

    if (activeSubPanel === "pan") {
        return (
            <div className={`flex flex-col h-full bg-white dark:bg-[#060606] absolute inset-0 z-[60] overflow-hidden ${isClosing ? 'animate-out slide-out-to-right duration-300' : 'animate-in slide-in-from-right duration-300'}`}>
                <div className="flex items-center p-4 border-b border-border bg-card/50 backdrop-blur-md z-10">
                    <button onClick={handleBack} className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center">
                        <ArrowLeft className="w-5 h-5 text-foreground" />
                    </button>
                    <h2 className="ml-4 font-bold text-foreground">Update PAN</h2>
                </div>
                <div className="p-6 space-y-6">
                    <div className="p-4 bg-green-600/10 dark:bg-green-500/10 rounded-2xl border border-green-700/20 dark:border-green-500/20">
                        <p className="text-sm text-green-700 dark:text-green-500 font-medium">Identity Verification</p>
                        <p className="text-xs text-muted-foreground mt-1">Your PAN is required for high-value transactions and tax compliance.</p>
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-muted-foreground uppercase ml-1">Enter PAN Number</label>
                        <Input placeholder="ABCDE1234F" value={panNumber} onChange={(e) => setPanNumber(e.target.value.toUpperCase())} maxLength={10} className="bg-card border-border h-12 text-lg" />
                    </div>
                    <Button className="w-full bg-green-700 hover:bg-green-800 dark:bg-green-500 dark:hover:bg-green-400 text-white dark:text-black font-bold h-12 rounded-xl" onClick={handleBack}>Update PAN</Button>
                </div>
            </div>
        );
    }

    if (activeSubPanel === "aadhaar") {
        return (
            <div className={`flex flex-col h-full bg-white dark:bg-[#060606] absolute inset-0 z-[60] overflow-hidden ${isClosing ? 'animate-out slide-out-to-right duration-300' : 'animate-in slide-in-from-right duration-300'}`}>
                <div className="flex items-center p-4 border-b border-border bg-card/50 backdrop-blur-md z-10">
                    <button onClick={handleBack} className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center">
                        <ArrowLeft className="w-5 h-5 text-foreground" />
                    </button>
                    <h2 className="ml-4 font-bold text-foreground">Update Aadhaar</h2>
                </div>
                <div className="p-6 space-y-6">
                    <div className="p-4 bg-green-600/10 dark:bg-green-500/10 rounded-2xl border border-green-700/20 dark:border-green-500/20">
                        <p className="text-sm text-green-700 dark:text-green-500 font-medium">e-KYC Verification</p>
                        <p className="text-xs text-muted-foreground mt-1">Aadhaar verification is essential for full access to TFC Pay features.</p>
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-muted-foreground uppercase ml-1">Enter Aadhaar Number</label>
                        <Input placeholder="XXXX XXXX XXXX" value={aadhaarNumber} onChange={(e) => setAadhaarNumber(e.target.value)} maxLength={12} className="bg-card border-border h-12 text-lg" />
                    </div>
                    <Button className="w-full bg-green-700 hover:bg-green-800 dark:bg-green-500 dark:hover:bg-green-400 text-white dark:text-black font-bold h-12 rounded-xl" onClick={handleBack}>Update Aadhaar</Button>
                </div>
            </div>
        );
    }

    if (activeSubPanel === "gst") {
        return (
            <div className={`flex flex-col h-full bg-white dark:bg-[#060606] absolute inset-0 z-[60] overflow-hidden ${isClosing ? 'animate-out slide-out-to-right duration-300' : 'animate-in slide-in-from-right duration-300'}`}>
                <div className="flex items-center p-4 border-b border-border bg-card/50 backdrop-blur-md z-10">
                    <button onClick={handleBack} className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center hover:bg-card/80 transition-colors">
                        <ArrowLeft className="w-5 h-5 text-foreground" />
                    </button>
                    <h2 className="ml-4 font-bold text-foreground">Update GST</h2>
                </div>
                <div className="p-6 space-y-6">
                    <div className="space-y-4">
                        <div className="p-4 bg-green-600/10 dark:bg-green-500/10 rounded-2xl border border-green-700/20 dark:border-green-500/20">
                            <p className="text-sm text-green-700 dark:text-green-500 font-medium">Business Details</p>
                            <p className="text-xs text-muted-foreground mt-1">Updating your GST number helps in tax compliance and business invoicing.</p>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider ml-1">Enter GST Number</label>
                            <Input placeholder="e.g. 22AAAAA0000A1Z5" value={gstNumber} onChange={(e) => setGstNumber(e.target.value.toUpperCase())} className="bg-card border-border h-12 text-lg focus:ring-green-700/20 dark:focus:ring-green-500/20" maxLength={15} />
                            <p className="text-[10px] text-muted-foreground italic ml-1">Please ensure to enter your 15-digit GSTIN accurately.</p>
                        </div>
                    </div>
                    <Button className="w-full bg-green-700 hover:bg-green-800 dark:bg-green-500 dark:hover:bg-green-400 text-white dark:text-black font-bold h-12 rounded-xl shadow-lg shadow-green-700/10 dark:shadow-green-500/10" onClick={() => {
                        if (gstNumber.length < 15) { alert("Please enter a valid 15-digit GST number"); return; }
                        alert("GST Number Updated Successfully!");
                        handleBack();
                    }}>Update GST Number</Button>
                </div>
            </div>
        );
    }

    if (activeSubPanel === "refer") {
        return (
            <div className={`flex flex-col h-full bg-white dark:bg-[#060606] absolute inset-0 z-[60] overflow-hidden ${isClosing ? 'animate-out slide-out-to-right duration-300' : 'animate-in slide-in-from-right duration-300'}`}>
                <div className="flex items-center p-4 border-b border-border bg-card/50 backdrop-blur-md z-10">
                    <button onClick={handleBack} className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center hover:bg-card/80 transition-colors">
                        <ArrowLeft className="w-5 h-5 text-foreground" />
                    </button>
                    <h2 className="ml-4 font-bold text-foreground">Refer & Earn</h2>
                </div>
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {/* Hero Section */}
                    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-700 via-green-600 to-emerald-500 dark:from-green-500 dark:via-green-400 dark:to-emerald-400 p-6 shadow-lg">
                        <div className="relative z-10">
                            <h3 className="text-2xl font-bold mb-2 text-white dark:text-black">Invite & Earn ₹100</h3>
                            <p className="text-white/80 dark:text-black/80 text-sm mb-4">Share the app with friends and earn rewards when they make their first transaction.</p>
                            <div className="w-12 h-12 bg-black/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                                <Gift className="w-6 h-6 text-white dark:text-black" />
                            </div>
                        </div>
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full -mr-16 -mt-16 blur-2xl" />
                        <div className="absolute bottom-0 right-10 w-24 h-24 bg-teal-400/30 rounded-full blur-xl" />
                    </div>

                    {/* Referral Code */}
                    <Card className="bg-card border-border overflow-hidden">
                        <CardContent className="p-5">
                            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 text-center">Your Referral Code</p>
                            <div className="flex items-center gap-2 bg-muted/30 p-2 rounded-xl border border-dashed border-green-700/30 dark:border-green-500/30">
                                <div className="flex-1 text-center">
                                    <span className="text-xl font-bold font-mono tracking-wider text-green-700 dark:text-green-500">TFCPAY2026</span>
                                </div>
                                <Button size="sm" variant="ghost" className="h-10 w-10 p-0 rounded-full hover:bg-green-600/10 dark:hover:bg-green-500/10" onClick={() => alert("Code copied to clipboard!")}>
                                    <Copy className="w-4 h-4 text-green-700 dark:text-green-500" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Share Options */}
                    <div>
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-1">Share via</p>
                        <div className="grid grid-cols-3 gap-3">
                            <button className="flex flex-col items-center gap-2 p-4 rounded-xl bg-[#25D366]/10 border border-[#25D366]/20 hover:bg-[#25D366]/20 transition-colors" onClick={() => window.open('https://wa.me/?text=Join TFC Pay using my code TFCPAY2026', '_blank')}>
                                <div className="w-10 h-10 rounded-full bg-[#25D366] flex items-center justify-center text-white shadow-sm">
                                    <MessageCircle className="w-5 h-5" />
                                </div>
                                <span className="text-xs font-medium text-foreground">WhatsApp</span>
                            </button>
                            <button className="flex flex-col items-center gap-2 p-4 rounded-xl bg-[#0088cc]/10 border border-[#0088cc]/20 hover:bg-[#0088cc]/20 transition-colors" onClick={() => window.open('https://t.me/share/url?url=https://tfcpay.com&text=Join TFC Pay using my code TFCPAY2026', '_blank')}>
                                <div className="w-10 h-10 rounded-full bg-[#0088cc] flex items-center justify-center text-white shadow-sm">
                                    <Send className="w-5 h-5 ml-0.5" />
                                </div>
                                <span className="text-xs font-medium text-foreground">Telegram</span>
                            </button>
                            <button className="flex flex-col items-center gap-2 p-4 rounded-xl bg-green-600/10 dark:bg-green-500/10 border border-green-700/20 dark:border-green-500/20 hover:bg-green-600/20 dark:hover:bg-green-500/20 transition-colors" onClick={() => {
                                if (navigator.share) {
                                    navigator.share({
                                        title: 'TFC Pay',
                                        text: 'Join TFC Pay using my code TFCPAY2026',
                                        url: 'https://tfcpay.com',
                                    })
                                } else {
                                    alert("Sharing not supported on this device");
                                }
                            }}>
                                <div className="w-10 h-10 rounded-full bg-green-700 dark:bg-green-500 flex items-center justify-center text-white shadow-sm">
                                    <Share2 className="w-5 h-5" />
                                </div>
                                <span className="text-xs font-medium text-foreground">More</span>
                            </button>
                        </div>
                    </div>

                    {/* How it works */}
                    <div>
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-1">How it works</p>
                        <Card className="bg-card border-border overflow-hidden">
                            <CardContent className="p-0">
                                <div className="p-4 flex items-start gap-4 border-b border-border/50 last:border-0">
                                    <div className="w-8 h-8 rounded-full bg-green-600/10 dark:bg-green-500/10 text-green-700 dark:text-green-500 flex items-center justify-center font-bold text-sm">1</div>
                                    <div>
                                        <p className="font-medium text-sm text-foreground">Invite your friends</p>
                                        <p className="text-xs text-muted-foreground mt-0.5">Share your link or code with friends via WhatsApp, Telegram, etc.</p>
                                    </div>
                                </div>
                                <div className="p-4 flex items-start gap-4 border-b border-border/50 last:border-0">
                                    <div className="w-8 h-8 rounded-full bg-green-600/10 dark:bg-green-500/10 text-green-700 dark:text-green-500 flex items-center justify-center font-bold text-sm">2</div>
                                    <div>
                                        <p className="font-medium text-sm text-foreground">They join TFC Pay</p>
                                        <p className="text-xs text-muted-foreground mt-0.5">Your friend signs up using your referral code.</p>
                                    </div>
                                </div>
                                <div className="p-4 flex items-start gap-4 border-b border-border/50 last:border-0">
                                    <div className="w-8 h-8 rounded-full bg-green-600/10 dark:bg-green-500/10 text-green-700 dark:text-green-500 flex items-center justify-center font-bold text-sm">3</div>
                                    <div>
                                        <p className="font-medium text-sm text-foreground">You both earn ₹100</p>
                                        <p className="text-xs text-muted-foreground mt-0.5">Get instant cashback when they complete their first transaction.</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        );
    }

    if (activeSubPanel === "email") {
        return (
            <div className={`flex flex-col h-full bg-white dark:bg-[#060606] absolute inset-0 z-[60] overflow-hidden ${isClosing ? 'animate-out slide-out-to-right duration-300' : 'animate-in slide-in-from-right duration-300'}`}>
                <div className="flex items-center p-4 border-b border-border bg-card/50 backdrop-blur-md z-10">
                    <button onClick={handleBack} className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center">
                        <ArrowLeft className="w-5 h-5 text-foreground" />
                    </button>
                    <h2 className="ml-4 font-bold text-foreground">Update Email</h2>
                </div>
                <div className="p-6 space-y-6">
                    <div className="p-4 bg-green-600/10 dark:bg-green-500/10 rounded-2xl border border-green-700/20 dark:border-green-500/20">
                        <p className="text-sm text-green-700 dark:text-green-500 font-medium">Communication</p>
                        <p className="text-xs text-muted-foreground mt-1">We'll send transaction receipts and important alerts to this email.</p>
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-muted-foreground uppercase ml-1">Enter New Email</label>
                        <Input type="email" placeholder="email@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className="bg-card border-border h-12 text-lg" />
                    </div>
                    <Button className="w-full bg-green-700 hover:bg-green-800 dark:bg-green-500 dark:hover:bg-green-400 text-white dark:text-black font-bold h-12 rounded-xl" onClick={handleBack}>Update Email ID</Button>
                </div>
            </div>
        );
    }

    return (
        <div className={`flex flex-col h-full bg-white dark:bg-[#060606] absolute inset-0 z-50 overflow-hidden ${isClosing ? 'animate-out slide-out-to-left duration-300' : 'animate-in slide-in-from-left duration-300'}`}>
            {/* Header - Fixed at top */}
            <div className="flex items-center p-4 border-b border-border bg-card/50 backdrop-blur-md z-10">
                <button
                    onClick={handleClose}
                    className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center hover:bg-card/80 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5 text-foreground" />
                </button>
                <h2 className="ml-4 font-bold text-foreground">Profile Settings</h2>
            </div>

            {/* Settings Content - Scrollable */}
            <div className="flex-1 overflow-y-auto px-4 pb-8 space-y-5 pt-4">
                {/* Profile Header Card */}
                <Card className="bg-gradient-to-br from-green-700/20 to-card dark:from-green-500/20 border-green-700/30 dark:border-green-500/30">
                    <CardContent className="p-5">
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <Avatar className="w-16 h-16 border-2 border-green-700 dark:border-green-500">
                                    <AvatarFallback className="bg-green-600/20 dark:bg-green-500/20 text-green-700 dark:text-green-500 text-xl font-bold">
                                        JD
                                    </AvatarFallback>
                                </Avatar>
                                <button
                                    onClick={() => setActiveSubPanel("profile")}
                                    className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-700 dark:bg-green-500 rounded-full flex items-center justify-center transition-all active:scale-90"
                                >
                                    <Edit2 className="w-3 h-3 text-white dark:text-black" />
                                </button>
                            </div>
                            <div className="flex-1">
                                <h2 className="text-lg font-bold text-foreground">John Doe</h2>
                                <p className="text-sm text-muted-foreground">+91 98765 43210</p>
                                <p className="text-xs text-muted-foreground">john.doe@email.com</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Stats Cards */}
                <div className="grid grid-cols-3 gap-3">
                    <Card className="bg-card border-border">
                        <CardContent className="p-3 text-center">
                            <p className="text-xl font-bold text-green-700 dark:text-green-500">₹12.5K</p>
                            <p className="text-xs text-muted-foreground">Total Spent</p>
                        </CardContent>
                    </Card>
                    <Card className="bg-card border-border">
                        <CardContent className="p-3 text-center">
                            <p className="text-xl font-bold text-green-700 dark:text-green-500">48</p>
                            <p className="text-xs text-muted-foreground">Transactions</p>
                        </CardContent>
                    </Card>
                    <Card className="bg-card border-border">
                        <CardContent className="p-3 text-center">
                            <p className="text-xl font-bold text-green-700 dark:text-green-500">₹325</p>
                            <p className="text-xs text-muted-foreground">Cashback</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Linked Bank Accounts */}
                <div>
                    <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-2">
                        Linked Accounts
                    </h3>
                    <Card className="bg-card border-border overflow-hidden">
                        <CardContent className="p-0">
                            {bankAccounts.map((account, index) => (
                                <div key={account.id}>
                                    {index > 0 && <div className="h-px bg-border mx-4" />}
                                    <div className="p-4 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-blue-600/10 dark:bg-blue-500/10 flex items-center justify-center border border-blue-700/10 dark:border-blue-500/10">
                                                <Building2 className="w-5 h-5 text-blue-700 dark:text-blue-500" strokeWidth={1.5} />
                                            </div>
                                            <div>
                                                <h4 className="font-medium text-foreground text-sm">{account.bankName}</h4>
                                                <p className="text-xs text-muted-foreground">{account.accountNumber} {account.isPrimary && <span className="bg-green-100 text-green-800 text-[9px] px-1.5 py-0.5 rounded-full ml-1 dark:bg-green-900/30 dark:text-green-400">Primary</span>}</p>
                                            </div>
                                        </div>

                                        <div className="text-right min-w-[100px] flex justify-end">
                                            {visibleBalances[account.id] ? (
                                                <p className="text-sm font-bold text-green-700 dark:text-green-500 animate-in fade-in zoom-in duration-300">
                                                    {visibleBalances[account.id]}
                                                </p>
                                            ) : (
                                                <button
                                                    onClick={() => handleCheckBalance(account.id)}
                                                    disabled={checkingBalanceId === account.id || !!visibleBalances[account.id]}
                                                    className="text-[10px] font-bold uppercase tracking-wider text-green-700 dark:text-green-500 bg-green-600/10 dark:bg-green-500/10 px-3 py-1.5 rounded-full border border-green-700/20 dark:border-green-500/20 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed hover:bg-green-600/20 dark:hover:bg-green-500/20"
                                                >
                                                    {checkingBalanceId === account.id ? "Checking..." : "Check Balance"}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <button
                                onClick={() => handleAction("add-bank")}
                                className="w-full py-3 text-xs font-medium text-muted-foreground hover:bg-muted/50 transition-colors border-t border-border flex items-center justify-center gap-2 group"
                            >
                                <div className="p-0.5 rounded-full border border-muted-foreground/30 group-hover:border-green-500 group-hover:bg-green-500 group-hover:text-white transition-all">
                                    <Plus className="w-3 h-3" />
                                </div>
                                <span className="group-hover:text-foreground transition-colors">Manage Linked Banks</span>
                            </button>
                        </CardContent>
                    </Card>
                </div>

                {/* Complete KYC Banner */}
                <Card className="bg-yellow-500/10 border-yellow-500/30 overflow-hidden">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-yellow-500/20 rounded-full flex items-center justify-center">
                                    <CheckCircle2 className="w-5 h-5 text-yellow-500" strokeWidth={1.5} />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-foreground">Complete KYC</h4>
                                    <p className="text-xs text-muted-foreground">Unlock higher limits</p>
                                </div>
                            </div>
                            <button
                                onClick={() => handleAction("KYC Verification")}
                                className="px-3 py-1.5 bg-yellow-500 text-black text-sm font-medium rounded-lg hover:bg-yellow-600 transition-colors"
                            >
                                Verify
                            </button>
                        </div>
                    </CardContent>
                </Card>

                {/* General Settings */}
                <div>
                    <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-2">
                        General Settings
                    </h3>
                    <Card className="bg-card border-border overflow-hidden">
                        <CardContent className="p-0">
                            <SettingsItem
                                icon={User}
                                title="Profile"
                                description="Your profile details"
                                onClick={() => handleAction("Profile")}
                            />
                            <Divider />
                            <SettingsItem
                                icon={Building2}
                                title="Link Bank Account"
                                description="Add or remove bank accounts"
                                onClick={() => handleAction("add-bank")}
                            />
                            <Divider />
                            <SettingsItem
                                icon={FileText}
                                title="Pan Number"
                                description="Add your pan number"
                                onClick={() => handleAction("Pan Number")}
                            />
                            <Divider />
                            <SettingsItem
                                icon={FileText}
                                title="AADHAAR NUMBER"
                                description="Add your Aadhaar number"
                                onClick={() => handleAction("AADHAAR NUMBER")}
                            />
                            <Divider />
                            <SettingsItem
                                icon={CreditCard}
                                title="Update GST Number"
                                description=""
                                onClick={() => handleAction("Update GST Number")}
                            />
                            <Divider />
                            <SettingsItem
                                icon={Mail}
                                title="Update Email ID"
                                description=""
                                onClick={() => handleAction("Update Email ID")}
                            />
                        </CardContent>
                    </Card>
                </div>

                {/* Settings & Preferences */}
                <div>
                    <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-2">
                        Settings & Preferences
                    </h3>
                    <Card className="bg-card border-border overflow-hidden">
                        <CardContent className="p-0">
                            <SettingsItem
                                icon={Globe}
                                title="Language"
                                description="Choose Language: English"
                                onClick={() => handleAction("Language")}
                            />
                            <Divider />
                            <SettingsItem
                                icon={Moon}
                                title="Theme"
                                description={`${isDarkMode ? "Dark" : "Light"} mode active`}
                                onClick={() => handleAction("Theme")}
                            />
                            <Divider />
                            <SettingsItem
                                icon={Headphones}
                                title="24X7 Help & Support"
                                description="Customer Support, Your Queries"
                                onClick={() => handleAction("24X7 Help & Support")}
                            />
                        </CardContent>
                    </Card>
                </div>

                {/* Security & Privacy */}
                <div>
                    <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-2">
                        Security & Privacy
                    </h3>
                    <Card className="bg-card border-border overflow-hidden">
                        <CardContent className="p-0">
                            {/* App Lock Toggle */}
                            <div className="w-full flex items-center justify-between p-4 group">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-green-600/10 dark:bg-green-500/10 flex items-center justify-center">
                                        <Lock className="w-5 h-5 text-green-700 dark:text-green-500" strokeWidth={1.5} />
                                    </div>
                                    <div className="text-left">
                                        <h4 className="font-medium text-foreground">App Lock</h4>
                                        <p className="text-xs text-muted-foreground mt-0.5">
                                            {appLockEnabled ? 'PIN lock is active' : 'Secure app with PIN'}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => {
                                        if (!appLockEnabled && !hasPinSet) {
                                            // Need to set PIN first
                                            handleAction("Setup PIN");
                                        } else {
                                            onToggleAppLock?.(!appLockEnabled);
                                        }
                                    }}
                                    className={`relative w-12 h-7 rounded-full transition-all duration-300 ${appLockEnabled ? 'bg-green-700 dark:bg-green-500' : 'bg-muted-foreground/30'}`}
                                    role="switch"
                                    aria-checked={appLockEnabled}
                                    aria-label="Toggle app lock"
                                >
                                    <div className={`absolute top-0.5 w-6 h-6 rounded-full bg-white shadow-md transition-all duration-300 ${appLockEnabled ? 'left-[22px]' : 'left-0.5'}`} />
                                </button>
                            </div>

                            {/* Biometric Unlock Toggle - only when App Lock is ON */}
                            {appLockEnabled && (
                                <>
                                    <Divider />
                                    <div className="w-full flex items-center justify-between p-4 group">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-green-600/10 dark:bg-green-500/10 flex items-center justify-center">
                                                <Fingerprint className="w-5 h-5 text-green-700 dark:text-green-500" strokeWidth={1.5} />
                                            </div>
                                            <div className="text-left">
                                                <h4 className="font-medium text-foreground">Biometric Unlock</h4>
                                                <p className="text-xs text-muted-foreground mt-0.5">
                                                    {biometricEnabled ? 'Fingerprint active' : 'Use fingerprint to unlock'}
                                                </p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => onToggleBiometric?.(!biometricEnabled)}
                                            className={`relative w-12 h-7 rounded-full transition-all duration-300 ${biometricEnabled ? 'bg-green-700 dark:bg-green-500' : 'bg-muted-foreground/30'}`}
                                            role="switch"
                                            aria-checked={biometricEnabled}
                                            aria-label="Toggle biometric unlock"
                                        >
                                            <div className={`absolute top-0.5 w-6 h-6 rounded-full bg-white shadow-md transition-all duration-300 ${biometricEnabled ? 'left-[22px]' : 'left-0.5'}`} />
                                        </button>
                                    </div>
                                </>
                            )}

                            {/* Change PIN - only when PIN is set */}
                            {hasPinSet && (
                                <>
                                    <Divider />
                                    <SettingsItem
                                        icon={KeyRound}
                                        title="Change PIN"
                                        description="Set a new 4-digit PIN"
                                        onClick={() => handleAction("Change PIN")}
                                    />
                                </>
                            )}

                            {/* Remove PIN - only when PIN is set */}
                            {hasPinSet && (
                                <>
                                    <Divider />
                                    <SettingsItem
                                        icon={Trash2}
                                        title="Remove PIN"
                                        description="Remove PIN and disable app lock"
                                        onClick={() => handleAction("Remove PIN")}
                                    />
                                </>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* About Us */}
                <div>
                    <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-2">
                        About Us
                    </h3>
                    <Card className="bg-card border-border overflow-hidden">
                        <CardContent className="p-0">
                            <SettingsItem
                                icon={Info}
                                title="About Recharge Bill"
                                description="Privacy Policy, Terms & About Recharge Bill"
                                onClick={() => handleAction("About Recharge Bill")}
                            />
                            <Divider />
                            <SettingsItem
                                icon={Share2}
                                title="Refer And Earn"
                                description="Share your code and get rewards"
                                onClick={() => handleAction("Refer And Earn")}
                            />
                            <Divider />
                            <SettingsItem
                                icon={Star}
                                title="Rate Us"
                                description="Your Opinion Matters to us"
                                onClick={() => handleAction("Rate Us")}
                            />
                        </CardContent>
                    </Card>
                </div>

                {/* Logout */}
                <Card className="bg-card border-border overflow-hidden">
                    <CardContent className="p-0">
                        <button
                            onClick={() => handleAction("Log Out")}
                            className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors group"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center">
                                    <LogOut className="w-5 h-5 text-red-500" strokeWidth={1.5} />
                                </div>
                                <span className="font-medium text-foreground">Log Out</span>
                            </div>
                            <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                        </button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default MobileProfileSettings;
