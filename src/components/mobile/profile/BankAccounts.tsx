
import { useState } from "react";
import { Plus, Building2, Trash2, CheckCircle2, ArrowLeft } from "lucide-react";
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
                    { label: "Account Number", placeholder: "Enter Account Number", type: "number" },
                    { label: "Re-enter Account Number", placeholder: "Re-enter Account Number", type: "number" },
                    { label: "IFSC Code", placeholder: "Enter IFSC Code" },
                    { label: "Account Holder Name", placeholder: "Enter Name" },
                    { label: "Bank Name", placeholder: "e.g. HDFC Bank" }
                ]}
                onBack={() => setIsAdding(false)}
                buttonText="Link Bank Account"
                // Mock confirm action
                isClosing={false}
            />
        );
    }

    return (
        <div className="flex flex-col h-full bg-background animate-in slide-in-from-right duration-300">
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
