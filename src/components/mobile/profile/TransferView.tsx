import { ArrowLeft, Wallet, Landmark, Phone, ShieldCheck } from "lucide-react";
import { Button } from "../../ui/Button";
import { Input } from "../../ui/Input";
import TransactionReceipt from "../TransactionReceipt";
import { useState } from "react";

interface TransferViewProps {
    title?: string;
    fields?: any[];
    onBack: () => void;
    buttonText: string;
    note?: string;
    beneficiaryInfo?: {
        name: string;
        subtext: string;
        initials: string;
        isVerified?: boolean;
        bankDetails?: boolean;
    };
    isClosing: boolean;
    onButtonClick?: () => void;
    walletBalance?: number;
}

export const TransferView = ({
    title = "Transfer",
    fields = [
        { label: "Amount", placeholder: "₹0", type: "number" },
        { label: "Note", placeholder: "What's this for?" }
    ],
    onBack,
    buttonText,
    note,
    beneficiaryInfo,
    isClosing,
    onButtonClick,
    walletBalance
}: TransferViewProps) => {
    const [success, setSuccess] = useState(false);

    // Extract amount if present in fields
    const amountField = fields.find(f => f.label.toLowerCase() === 'amount');
    const amount = amountField ? amountField.value : "0";

    if (success) {
        return (
            <TransactionReceipt
                transaction={{
                    id: `TFC${Math.floor(Math.random() * 1000000000)}`,
                    amount: `₹${amount}`,
                    name: title.replace('Pay ', ''),
                    category: "Transfer",
                    date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
                    time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
                    status: 'success',
                    type: 'wallet',
                    referenceId: `REF${Date.now()}`,
                    method: 'TFC Pay Wallet',
                    icon: Wallet,
                    isCredit: false
                }}
                onClose={onBack}
            />
        );
    }

    return (
        <div className={`flex flex-col h-full bg-background overlay-gradient-bg absolute inset-0 z-[60] overflow-hidden ${isClosing ? 'animate-out slide-out-to-right duration-300' : 'animate-in slide-in-from-right duration-300'}`}>
            <div className="flex items-center p-4 border-b border-border bg-card/50 backdrop-blur-md z-10">
                <button onClick={onBack} className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center hover:bg-card/80 transition-colors">
                    <ArrowLeft className="w-5 h-5 text-foreground" />
                </button>
                <h2 className="ml-4 font-bold text-foreground">{title}</h2>
            </div>
            <div className="p-6 space-y-6 overflow-y-auto flex-1">
                {beneficiaryInfo ? (
                    <div className="p-5 bg-card border border-green-700/20 dark:border-green-500/20 rounded-[2rem] shadow-lg relative overflow-hidden">
                        {/* Verfication Badge Background */}
                        <div className="absolute top-0 right-0 p-4">
                            {beneficiaryInfo.isVerified && (
                                <div className="flex items-center gap-1 bg-green-500/10 px-2 py-1 rounded-full border border-green-500/20">
                                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                                    <span className="text-[10px] font-bold text-green-600 dark:text-green-500 uppercase tracking-tighter">Verified</span>
                                </div>
                            )}
                        </div>

                        <div className="flex items-center gap-5">
                            <div className="w-16 h-16 rounded-full bg-green-600/10 dark:bg-green-500/10 flex items-center justify-center border-2 border-green-700/30 dark:border-green-500/30 text-2xl font-black text-green-700 dark:text-green-500 shadow-inner">
                                {beneficiaryInfo.initials}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="text-xl font-[900] text-foreground truncate ">{beneficiaryInfo.name}</h3>
                                <p className="text-sm text-muted-foreground font-medium flex items-center gap-1.5 mt-0.5">
                                    {beneficiaryInfo.bankDetails && <Landmark className="w-3.5 h-3.5 opacity-70" />}
                                    {!beneficiaryInfo.bankDetails && <Phone className="w-3.5 h-3.5 opacity-70" />}
                                    {beneficiaryInfo.subtext}
                                </p>
                            </div>
                        </div>

                        {/* Visual assurance note */}
                        <div className="mt-4 pt-4 border-t border-border/50 flex items-center gap-2">
                            <ShieldCheck className="w-4 h-4 text-green-600 dark:text-green-500" />
                            <p className="text-[10px] text-muted-foreground font-medium">Verify recipient details before proceeding with the payment.</p>
                        </div>
                    </div>
                ) : (
                    <div className="p-4 bg-green-600/10 dark:bg-green-500/10 rounded-2xl border border-green-700/20 dark:border-green-500/20">
                        <p className="text-sm text-green-700 dark:text-green-500 font-medium">Secure Transfer</p>
                        <p className="text-xs text-muted-foreground mt-1">Your transaction is protected by bank-grade security.</p>
                    </div>
                )}

                {walletBalance !== undefined && (
                    <div className="p-4 bg-blue-600/5 dark:bg-blue-500/5 rounded-2xl border border-blue-500/10 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-blue-600/10 dark:bg-blue-500/10 flex items-center justify-center">
                                <Wallet className="w-5 h-5 text-blue-600 dark:text-blue-500" />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Available Balance</p>
                                <p className="text-lg font-black text-foreground">₹{walletBalance.toLocaleString('en-IN')}</p>
                            </div>
                        </div>
                        <div className="text-[10px] font-bold text-blue-600 dark:text-blue-500 bg-blue-600/10 dark:bg-blue-500/10 px-2 py-1 rounded-md uppercase">
                            Wallet
                        </div>
                    </div>
                )}

                <div className="space-y-4">
                    {fields.map((field, i) => (
                        <div key={i} className="space-y-2">
                            <label className="text-xs font-semibold text-muted-foreground uppercase ml-1">{field.label}</label>
                            {field.type === "select" ? (
                                <select className="w-full bg-card border border-border h-12 rounded-md px-3 text-foreground focus:outline-none focus:ring-1 focus:ring-green-700 dark:focus:ring-green-500">
                                    {field.options?.map((opt: any, idx: number) => (
                                        <option key={idx} value={opt.value}>{opt.label}</option>
                                    ))}
                                </select>
                            ) : field.type === "button" ? (
                                <Button
                                    variant="outline"
                                    className="w-full h-12 border-dashed border-2 justify-start gap-2"
                                    onClick={field.onClick}
                                >
                                    {field.icon && <field.icon className="w-4 h-4" />}
                                    {field.placeholder}
                                </Button>
                            ) : (
                                <Input
                                    placeholder={field.placeholder}
                                    type={field.type || "text"}
                                    maxLength={field.maxLength}
                                    value={field.value}
                                    onChange={(e) => field.onChange?.(e.target.value)}
                                    className={`bg-card border-border h-12 text-lg ${field.className || ""}`}
                                />
                            )}
                            {field.extra && <div className="mt-2">{field.extra}</div>}
                        </div>
                    ))}
                </div>

                {note && <p className="text-xs text-muted-foreground italic px-1">{note}</p>}

                <Button className="w-full bg-green-700 hover:bg-green-800 dark:bg-green-500 dark:hover:bg-green-400 text-white dark:text-black font-bold h-12 rounded-xl" onClick={() => {
                    if (onButtonClick) {
                        onButtonClick();
                    } else {
                        setSuccess(true);
                    }
                }}>{buttonText}</Button>
            </div>
        </div>
    );
};
