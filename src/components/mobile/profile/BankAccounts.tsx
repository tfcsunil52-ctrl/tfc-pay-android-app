import { useState } from "react";
import { Plus, Building2, Trash2, CheckCircle2, ArrowLeft, ShieldCheck, KeyRound, SearchCheck } from "lucide-react";
import { Input } from "../../ui/Input";
import { Button } from "../../ui/Button";
import { Card, CardContent } from "../../ui/Card";
import { TransferView } from "./TransferView";

interface BankAccount {
    id: string;
    bankName: string;
    accountNumber: string;
    ifsc: string;
    isPrimary: boolean;
    logo?: string;
}

interface BankAccountsProps {
    onBack: () => void;
}

export const BankAccounts = ({ onBack }: BankAccountsProps) => {
    const [accounts, setAccounts] = useState<BankAccount[]>([
        { id: "1", bankName: "HDFC Bank", accountNumber: "XXXX 1234", ifsc: "HDFC0001234", isPrimary: true },
        { id: "2", bankName: "SBI", accountNumber: "XXXX 5678", ifsc: "SBIN0005678", isPrimary: false },
    ]);
    const [isAdding, setIsAdding] = useState(false);

    // Link Bank Form States
    const [accNo, setAccNo] = useState("");
    const [reAccNo, setReAccNo] = useState("");
    const [ifsc, setIfsc] = useState("");
    const [holderName, setHolderName] = useState("");
    const [bankName, setBankName] = useState("");
    const [aadhaar, setAadhaar] = useState("");
    const [pan, setPan] = useState("");
    const [otp, setOtp] = useState("");
    const [aadhaarStatus, setAadhaarStatus] = useState<'idle' | 'otp_sent' | 'verified' | 'verifying'>('idle');
    const [ifscStatus, setIfscStatus] = useState<'idle' | 'verifying' | 'verified'>('idle');

    const handleVerifyIFSC = () => {
        if (ifsc.length < 11) return;
        setIfscStatus('verifying');
        // Simulate API call to fetch bank details from IFSC
        setTimeout(() => {
            setIfscStatus('verified');
            setBankName("HDFC BANK LIMITED"); // Mocked bank name
        }, 1200);
    };

    const handleSendOTP = () => {
        if (aadhaar.length !== 12) return;
        setAadhaarStatus('verifying');
        setTimeout(() => {
            setAadhaarStatus('otp_sent');
            alert("OTP sent to your registered mobile number ending with XXXX");
        }, 1000);
    };

    const handleVerifyOTP = () => {
        if (otp.length !== 6) return;
        setAadhaarStatus('verifying');
        setTimeout(() => {
            setAadhaarStatus('verified');
        }, 1200);
    };

    const handleAddBank = () => {
        // Mock addition
        setIsAdding(false);
        const newBank: BankAccount = {
            id: Date.now().toString(),
            bankName: "ICICI Bank", // Mock
            accountNumber: "XXXX 9012",
            ifsc: "ICIC0009012",
            isPrimary: false
        };
        setAccounts([...accounts, newBank]);
        alert("Bank Linked Successfully!");
    };

    const handleDelete = (id: string) => {
        if (confirm("Are you sure you want to unlink this bank account?")) {
            setAccounts(accounts.filter(acc => acc.id !== id));
        }
    };

    const handleSetPrimary = (id: string) => {
        setAccounts(accounts.map(acc => ({
            ...acc,
            isPrimary: acc.id === id
        })));
    };

    if (isAdding) {
        return (
            <TransferView
                title="Link Bank Account"
                fields={[
                    {
                        label: "Account Number",
                        placeholder: "Enter Account Number",
                        type: "number",
                        value: accNo,
                        onChange: setAccNo
                    },
                    {
                        label: "Re-enter Account Number",
                        placeholder: "Re-enter Account Number",
                        type: "number",
                        value: reAccNo,
                        onChange: setReAccNo
                    },
                    {
                        label: "IFSC Code",
                        placeholder: "Enter IFSC Code",
                        value: ifsc,
                        onChange: (val: string) => {
                            setIfsc(val.toUpperCase());
                            if (ifscStatus !== 'idle') setIfscStatus('idle');
                        },
                        maxLength: 11,
                        className: ifscStatus === 'verified' ? "border-green-500 ring-green-500/20" : "",
                        extra: (
                            <div className="mt-2">
                                {ifscStatus === 'idle' && (
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={handleVerifyIFSC}
                                        disabled={ifsc.length < 11}
                                        className="h-10 w-full font-bold border-2 border-green-700/30 text-green-700 dark:border-green-500/30 dark:text-green-500 flex gap-2"
                                    >
                                        <SearchCheck className="w-4 h-4" /> Verify IFSC
                                    </Button>
                                )}
                                {ifscStatus === 'verifying' && (
                                    <div className="flex items-center gap-2 p-3 bg-muted/50 border border-border rounded-xl animate-pulse">
                                        <div className="w-4 h-4 rounded-full border-2 border-green-700 border-t-transparent animate-spin" />
                                        <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Verifying IFSC...</span>
                                    </div>
                                )}
                                {ifscStatus === 'verified' && (
                                    <div className="flex items-center gap-2 p-3 bg-green-600/10 dark:bg-green-500/10 border border-green-700/20 dark:border-green-500/20 rounded-xl animate-in zoom-in-95 duration-300">
                                        <CheckCircle2 className="w-5 h-5 text-green-700 dark:text-green-500" />
                                        <span className="text-xs font-bold text-green-700 dark:text-green-500 uppercase tracking-wider">IFSC Verified</span>
                                    </div>
                                )}
                            </div>
                        )
                    },
                    {
                        label: "Pan Card Number",
                        placeholder: "Enter 10-digit PAN",
                        value: pan,
                        onChange: (val: string) => setPan(val.toUpperCase()),
                        maxLength: 10
                    },
                    {
                        label: "Aadhaar Number",
                        placeholder: "Enter 12-digit Aadhaar",
                        type: "number",
                        value: aadhaar,
                        onChange: (val: string) => {
                            if (aadhaarStatus === 'verified') return;
                            setAadhaar(val);
                            if (aadhaarStatus !== 'idle') setAadhaarStatus('idle');
                        },
                        maxLength: 12,
                        className: aadhaarStatus === 'verified' ? "border-green-500 ring-green-500/20" : "",
                        extra: (
                            <div className="space-y-3">
                                {aadhaarStatus === 'idle' && (
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={handleSendOTP}
                                        disabled={aadhaar.length !== 12}
                                        className="h-10 w-full font-bold border-2 border-green-700/30 text-green-700 dark:border-green-500/30 dark:text-green-500 flex gap-2"
                                    >
                                        <ShieldCheck className="w-4 h-4" /> Verify with Aadhaar OTP
                                    </Button>
                                )}

                                {aadhaarStatus === 'otp_sent' && (
                                    <div className="p-4 bg-muted/50 rounded-xl border border-border space-y-3 animate-in fade-in slide-in-from-top-2">
                                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                                            <KeyRound className="w-3 h-3" /> Enter 6-digit OTP
                                        </p>
                                        <div className="flex gap-2">
                                            <Input
                                                placeholder="XXXXXX"
                                                className="h-10 text-center text-lg tracking-[0.5rem] font-bold"
                                                maxLength={6}
                                                value={otp}
                                                onChange={(e) => setOtp(e.target.value)}
                                            />
                                            <Button
                                                size="sm"
                                                onClick={handleVerifyOTP}
                                                className="h-10 bg-green-700 dark:bg-green-500 px-4"
                                            >
                                                Verify
                                            </Button>
                                        </div>
                                    </div>
                                )}

                                {aadhaarStatus === 'verified' && (
                                    <div className="flex items-center gap-2 p-3 bg-green-600/10 dark:bg-green-500/10 border border-green-700/20 dark:border-green-500/20 rounded-xl animate-in zoom-in-95 duration-300">
                                        <SearchCheck className="w-5 h-5 text-green-700 dark:text-green-500" />
                                        <span className="text-xs font-bold text-green-700 dark:text-green-500">Aadhaar Verified Successfully</span>
                                    </div>
                                )}
                            </div>
                        )
                    },
                    {
                        label: "Account Holder Name",
                        placeholder: "Enter Name",
                        value: holderName,
                        onChange: setHolderName
                    },
                    {
                        label: "Bank Name",
                        placeholder: "e.g. HDFC Bank",
                        value: bankName,
                        onChange: setBankName,
                        readOnly: ifscStatus === 'verified'
                    }
                ]}
                onBack={() => setIsAdding(false)}
                buttonText="Link Bank Account"
                onButtonClick={() => {
                    if (aadhaarStatus !== 'verified') {
                        alert("Please verify your Aadhaar with OTP first.");
                        return;
                    }
                    handleAddBank();
                }}
                isClosing={false}
            />
        );
    }

    return (
        <div className="flex flex-col h-full bg-background absolute inset-0 z-[60] overflow-hidden animate-in slide-in-from-right duration-300">
            {/* Header */}
            <div className="flex items-center p-4 border-b border-border bg-card/50 backdrop-blur-md sticky top-0 z-10">
                <button
                    onClick={onBack}
                    className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center hover:bg-card/80 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5 text-foreground" />
                </button>
                <h2 className="ml-4 font-bold text-foreground text-lg">Bank Accounts</h2>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {/* Linked Accounts */}
                {accounts.map((acc) => (
                    <Card key={acc.id} className={`border-border ${acc.isPrimary ? 'border-green-700/50 dark:border-green-500/50 bg-green-600/5 dark:bg-green-500/5' : 'bg-card'}`}>
                        <CardContent className="p-4">
                            <div className="flex items-start justify-between">
                                <div className="flex gap-3">
                                    <div className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center">
                                        <Building2 className="w-5 h-5 text-muted-foreground" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-foreground">{acc.bankName}</h3>
                                        <p className="text-sm text-muted-foreground">{acc.accountNumber}</p>
                                        <p className="text-xs text-muted-foreground mt-0.5">{acc.ifsc}</p>
                                        {acc.isPrimary && (
                                            <span className="inline-flex items-center gap-1 bg-green-600/10 dark:bg-green-500/10 text-green-700 dark:text-green-500 text-[10px] px-2 py-0.5 rounded-full mt-2 font-medium">
                                                <CheckCircle2 className="w-3 h-3" /> Primary Account
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="flex flex-col gap-2">
                                    {!acc.isPrimary && (
                                        <button
                                            onClick={() => handleSetPrimary(acc.id)}
                                            className="text-green-700 dark:text-green-500 text-xs font-medium hover:underline"
                                        >
                                            Set Primary
                                        </button>
                                    )}
                                    <button
                                        onClick={() => handleDelete(acc.id)}
                                        className="text-red-500 text-xs font-medium hover:underline flex items-center justify-end gap-1"
                                    >
                                        <Trash2 className="w-3 h-3" /> Unlink
                                    </button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}

                {/* Add New Button */}
                <Button
                    variant="outline"
                    className="w-full h-14 border-dashed border-2 hover:border-green-700 dark:hover:border-green-500 hover:bg-green-600/5 dark:hover:bg-green-500/5 hover:text-green-700 dark:hover:text-green-500 transition-all gap-2"
                    onClick={() => setIsAdding(true)}
                >
                    <Plus className="w-5 h-5" /> Link New Bank Account
                </Button>

                <div className="bg-blue-500/5 p-4 rounded-xl border border-blue-500/10 mt-6">
                    <h4 className="text-xs font-bold text-blue-600 mb-1 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Safe & Secure
                    </h4>
                    <p className="text-[10px] text-muted-foreground leading-relaxed">
                        Your bank details are encrypted and stored securely. We use standard banking protocols to process your transactions safely.
                    </p>
                </div>
            </div>
        </div>
    );
};
