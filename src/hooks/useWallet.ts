import { useState, useCallback } from "react";
import { Smartphone, Gift } from "lucide-react";
import type { Transaction } from "../types";

interface UseWalletReturn {
    balance: number;
    previousBalance: number;
    transactions: Transaction[];
    addMoney: (amount: number) => void;
    processPayment: (amount: number, serviceName: string) => boolean;
    onBalanceSeen: () => void;
}

export function useWallet(initialBalance = 2450): UseWalletReturn {
    const [balance, setBalance] = useState(initialBalance);
    const [previousBalance, setPreviousBalance] = useState(0);
    const [transactions, setTransactions] = useState<Transaction[]>([
        {
            name: "Mobile Recharge",
            amount: "-₹199",
            time: "Today, 10:30 AM",
            icon: Smartphone,
            isCredit: false,
        },
        {
            name: "Cashback Credited",
            amount: "+₹25",
            time: "Yesterday",
            icon: Gift,
            isCredit: true,
        },
    ]);

    const addMoney = useCallback((amount: number) => {
        setBalance((prev) => prev + amount);
        setTransactions((prev) => [
            {
                name: "Wallet Top-up",
                amount: `+₹${amount}`,
                time: "Just now",
                icon: Gift,
                isCredit: true,
            },
            ...prev,
        ]);
    }, []);

    const processPayment = useCallback(
        (amount: number, serviceName: string): boolean => {
            if (amount > balance) {
                return false;
            }

            setBalance((prev) => prev - amount);
            setTransactions((prev) => [
                {
                    name: serviceName,
                    amount: `-₹${amount}`,
                    time: "Just now",
                    icon: Smartphone,
                    isCredit: false,
                },
                ...prev,
            ]);
            return true;
        },
        [balance]
    );

    const onBalanceSeen = useCallback(() => {
        setPreviousBalance(balance);
    }, [balance]);

    return {
        balance,
        previousBalance,
        transactions,
        addMoney,
        processPayment,
        onBalanceSeen,
    };
}
