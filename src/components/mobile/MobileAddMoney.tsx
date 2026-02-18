import { useState } from "react";
import { ArrowLeft, Wallet, Check, Plus } from "lucide-react";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import TransactionReceipt from "./TransactionReceipt";
import type { Transaction } from "../../types";

interface MobileAddMoneyProps {
    onClose: () => void;
    onAdd: (amount: number) => void;
    isDarkMode?: boolean;
}


const MobileAddMoney = ({ onClose, onAdd, isDarkMode }: MobileAddMoneyProps) => {
    const [amount, setAmount] = useState("");
    const [isClosing, setIsClosing] = useState(false);
    const [success, setSuccess] = useState(false);

    const quickAmounts = [100, 500, 1000, 2000];

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            onClose();
        }, 300);
    };

    const handleProceed = () => {
        const value = parseInt(amount);
        if (value > 0) {
            setSuccess(true);
            onAdd(value);
        } else {
            alert("Please enter a valid amount");
        }
    };

    return (
        <div
            className={`flex flex-col h-full bg-white dark:bg-[#060606] absolute inset-0 z-[60] overflow-hidden ${isClosing ? "animate-out slide-out-to-right duration-300" : "animate-in slide-in-from-right duration-300"
                }`}
        >
            {success && (
                <TransactionReceipt
                    transaction={{
                        id: `TFC${Math.floor(Math.random() * 1000000000)}`,
                        amount: `+₹${amount}`,
                        name: "Wallet Top-up",
                        category: "Add Money",
                        date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
                        time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
                        status: 'success',
                        type: 'wallet',
                        referenceId: `REF${Date.now()}`,
                        method: 'TFC Pay Wallet',
                        icon: Wallet,
                        isCredit: true
                    }}
                    onClose={handleClose}
                />
            )}
            {/* Header */}
            <header className="flex items-center p-4 border-b border-border bg-card/50 backdrop-blur-md z-10 sticky top-0">
                <button
                    onClick={handleClose}
                    className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center hover:bg-card/80 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5 text-foreground" />
                </button>
                <h2 className="ml-4 font-bold text-foreground flex items-center gap-2">
                    <Wallet className="w-5 h-5 text-green-700 dark:text-green-500" />
                    Add Money to Wallet
                </h2>
            </header>

            <div className="flex-1 p-6 flex flex-col items-center justify-center space-y-8">
                {/* Amount Input */}
                <div className="w-full max-w-xs text-center space-y-2">
                    <p className="text-muted-foreground font-medium">Enter Amount</p>
                    <div className="relative flex items-center justify-center gap-1">
                        <span className="text-4xl font-bold text-foreground">₹</span>
                        <Input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="text-center !text-4xl font-bold h-20 bg-transparent border-b-2 border-green-700 dark:border-green-500 border-t-0 border-x-0 rounded-none focus-visible:ring-0 px-2 w-[200px] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            placeholder="0"
                            autoFocus
                        />
                    </div>
                </div>

                {/* Quick Amounts */}
                <div className="grid grid-cols-2 gap-4 w-full max-w-xs">
                    {quickAmounts.map((val) => (
                        <button
                            key={val}
                            onClick={() => setAmount(val.toString())}
                            className="py-2 px-4 rounded-full border border-border bg-card hover:bg-green-600/10 dark:hover:bg-green-500/10 hover:border-green-700 dark:hover:border-green-500 transition-colors flex items-center justify-center gap-1"
                        >
                            <Plus className="w-3 h-3 text-green-700 dark:text-green-500" />
                            <span className="font-semibold text-foreground">₹{val}</span>
                        </button>
                    ))}
                </div>

                {/* Proceed Button */}
                <div className="w-full max-w-xs pt-8">
                    <Button
                        className="w-full h-14 text-lg font-bold bg-green-700 dark:bg-green-500 text-white dark:text-black hover:bg-green-800 dark:hover:bg-green-400 rounded-2xl shadow-lg shadow-green-700/20 dark:shadow-green-500/20"
                        onClick={handleProceed}
                    >
                        Proceed to Add
                    </Button>
                    <p className="text-xs text-center text-muted-foreground mt-4 flex items-center justify-center gap-1">
                        <Check className="w-3 h-3 text-green-700 dark:text-green-500 font-bold" />
                        Secure Payment Gateway
                    </p>
                </div>
            </div>
        </div>
    );
};

export default MobileAddMoney;
