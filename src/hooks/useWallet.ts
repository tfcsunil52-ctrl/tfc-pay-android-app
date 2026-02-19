import { useState, useCallback, useEffect } from "react";
import { Smartphone, Gift, Wallet, CreditCard, Zap } from "lucide-react";
import type { Transaction } from "../types";

interface UseWalletReturn {
    balance: number;
    previousBalance: number;
    transactions: Transaction[];
    addMoney: (amount: number) => void;
    processPayment: (amount: number, serviceName: string, type?: Transaction['type'], category?: string) => boolean;
    onBalanceSeen: () => void;
}

// Helper function to get icon based on type/category
const getTransactionIcon = (type?: Transaction['type'], category?: string) => {
    if (type === 'wallet') return Wallet;
    if (type === 'cc_to_bank') return CreditCard;
    if (type === 'mobile_recharge') return Smartphone;
    if (type === 'bill_payment') return Zap;
    return Smartphone;
};

// Helper to generate transaction ID
const generateTransactionId = (): string => {
    return `TRX${Date.now()}${Math.floor(Math.random() * 1000)}`;
};

// Helper to format date
const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

// Helper to format time
const formatTime = (date: Date): string => {
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    return `${hours}:${minutes} ${ampm}`;
};

export function useWallet(initialBalance = 4000): UseWalletReturn {
    // Load balance and transactions from localStorage
    const [balance, setBalance] = useState(() => {
        const saved = localStorage.getItem('tfc_wallet_balance');
        return saved ? parseFloat(saved) : initialBalance;
    });

    const [previousBalance, setPreviousBalance] = useState(0);

    const [transactions, setTransactions] = useState<Transaction[]>(() => {
        const saved = localStorage.getItem('tfc_transactions');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                // Restore icon functions
                return parsed.map((tx: any) => ({
                    ...tx,
                    icon: getTransactionIcon(tx.type, tx.category)
                }));
            } catch {
                return [];
            }
        }
        return [];
    });

    // Persist balance to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('tfc_wallet_balance', balance.toString());
    }, [balance]);

    // Persist transactions to localStorage whenever they change
    useEffect(() => {
        // Remove icon before saving (can't serialize functions)
        const serializableTransactions = transactions.map(({ icon, ...rest }) => rest);
        localStorage.setItem('tfc_transactions', JSON.stringify(serializableTransactions));
    }, [transactions]);

    const addMoney = useCallback((amount: number) => {
        const now = new Date();
        const newTransaction: Transaction = {
            id: generateTransactionId(),
            name: "Wallet Top-up",
            amount: `+₹${amount}`,
            time: formatTime(now),
            date: formatDate(now),
            icon: Wallet,
            isCredit: true,
            status: 'success',
            referenceId: `REF${Date.now()}`,
            type: 'wallet',
            category: 'Add Money'
        };

        setBalance((prev) => prev + amount);
        setTransactions((prev) => [newTransaction, ...prev]);
    }, []);

    const processPayment = useCallback(
        (amount: number, serviceName: string, type?: Transaction['type'], category?: string): boolean => {
            if (amount > balance) {
                return false;
            }

            const now = new Date();
            const newTransaction: Transaction = {
                id: generateTransactionId(),
                name: serviceName,
                amount: `-₹${amount}`,
                time: formatTime(now),
                date: formatDate(now),
                icon: getTransactionIcon(type, category),
                isCredit: false,
                status: 'success',
                referenceId: `REF${Date.now()}`,
                type: type || 'bill_payment',
                category: category || serviceName
            };

            setBalance((prev) => prev - amount);
            setTransactions((prev) => [newTransaction, ...prev]);
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
