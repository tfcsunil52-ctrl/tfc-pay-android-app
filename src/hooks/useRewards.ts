import { useState, useEffect } from "react";
import { Sparkles, Percent, Gift, Star, Smartphone, Zap, ShoppingBag } from "lucide-react";
import type { Offer, Reward } from "../types";

const initialOffers: Offer[] = [
    {
        title: "Flat ₹100 Cashback",
        description: "On your first mobile recharge above ₹199",
        code: "FIRST100",
        validTill: "31 Jan 2026",
        color: "from-green-600/30 to-green-600/10 dark:from-green-500/30 dark:to-green-500/10",
        icon: Sparkles
    },
    {
        title: "20% Off on DTH",
        description: "Maximum cashback up to ₹75",
        code: "DTH20",
        validTill: "15 Feb 2026",
        color: "from-purple-500/30 to-purple-500/10",
        category: "DTH",
        icon: Percent
    },
    {
        category: "Mobile",
        title: "₹50 Cashback",
        description: "On recharge of ₹299 or more",
        icon: Smartphone,
    },
    {
        category: "Electricity",
        title: "₹25 Cashback",
        description: "First electricity bill payment",
        icon: Zap,
    },
    {
        category: "Shopping",
        title: "Zero Fee",
        description: "On payments this month",
        icon: ShoppingBag,
    },
    {
        category: "Referral",
        title: "Earn ₹100",
        description: "For each successful referral",
        icon: Star,
    }
];

const initialRewards: Reward[] = [
    {
        id: 1,
        type: "cashback",
        value: "₹50",
        isScratched: true,
        expiresAt: "2026-03-01"
    },
    {
        id: 2,
        type: "cashback",
        value: "₹25",
        isScratched: true,
        expiresAt: "2026-02-28"
    },
    {
        id: 3,
        type: "coupon",
        value: "20% OFF",
        isScratched: false,
        expiresAt: "2026-04-15"
    }
];

export const useRewards = () => {
    const [offers] = useState<Offer[]>(initialOffers);

    const [rewards, setRewards] = useState<Reward[]>(() => {
        const saved = localStorage.getItem('tfc_rewards');
        if (saved) {
            try {
                return JSON.parse(saved);
            } catch (e) {
                console.error("Failed to parse rewards", e);
                return initialRewards;
            }
        }
        return initialRewards;
    });

    const [totalCashback, setTotalCashback] = useState(0);
    const [pendingCashback, setPendingCashback] = useState(0);

    // Calculate totals from rewards
    useEffect(() => {
        const total = rewards
            .filter(r => r.type === 'cashback' && r.isScratched)
            .reduce((sum, r) => {
                const val = parseFloat(r.value.replace(/[^0-9.]/g, ''));
                return sum + (isNaN(val) ? 0 : val);
            }, 0);

        setTotalCashback(total);

        // Mock pending cashback (e.g. from scratch cards not yet scratched or processing)
        const pending = rewards
            .filter(r => r.type === 'cashback' && !r.isScratched)
            .reduce((sum, r) => {
                const val = parseFloat(r.value.replace(/[^0-9.]/g, ''));
                return sum + (isNaN(val) ? 0 : val);
            }, 0);

        // Add some base pending if no unscratched cards found, just to show UI
        setPendingCashback(pending > 0 ? pending : 75);

        localStorage.setItem('tfc_rewards', JSON.stringify(rewards));
    }, [rewards]);

    const addReward = (reward: Reward) => {
        setRewards(prev => [reward, ...prev]);
    };

    return {
        offers,
        rewards,
        totalCashback,
        pendingCashback,
        addReward
    };
};
