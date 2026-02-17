import { useState, useEffect } from "react";
import { Percent, Gift, Zap, Smartphone, Droplets, Tv, Home, CreditCard, Landmark, Coins, FileText, Phone, Wifi } from "lucide-react";
import type { Offer, Reward } from "../types";

const initialOffers: Offer[] = [
    // DTH Category
    {
        title: "Get 4.0% discount on Airtel DTH",
        description: "Get 4.0% discount on Airtel DTH",
        category: "DTH",
        serviceType: "dth",
        companyName: "Airtel",
        logoUrl: "airtel.in",
        bgColor: "#E40000"
    },
    {
        title: "Get 4.0% discount on Dish Tv",
        description: "Get 4.0% discount on Dish Tv",
        category: "DTH",
        serviceType: "dth",
        companyName: "Dish TV",
        logoUrl: "dishtv.in",
        bgColor: "#FFFFFF"
    },
    {
        title: "Get 4.0% discount on Sundirect",
        description: "Get 4.0% discount on Sundirect",
        category: "DTH",
        serviceType: "dth",
        companyName: "Sun Direct",
        logoUrl: "sundirect.in",
        bgColor: "#FF0000"
    },
    {
        title: "Get 4.0% discount on Tata Play",
        description: "Get 4.0% discount on Tata Play",
        category: "DTH",
        serviceType: "dth",
        companyName: "Tata Play",
        logoUrl: "tataplay.com",
        bgColor: "#E91E63"
    },
    {
        title: "Get 4.0% discount on Videocon d2h",
        description: "Get 4.0% discount on Videocon d2h",
        category: "DTH",
        serviceType: "dth",
        companyName: "Videocon d2h",
        logoUrl: "d2h.com",
        bgColor: "#673AB7"
    },

    // Bill Payments Category - Mapped to real brand domains for logo.dev
    {
        title: "Get 0.5% discount on Loan Repayment",
        description: "Get 0.5% discount on Loan Repayment",
        category: "Bill Payments",
        serviceType: "bill_payment",
        companyName: "HDFC Bank",
        logoUrl: "hdfcbank.com",
        bgColor: "#004C8F",
        icon: Coins
    },
    {
        title: "Get 0.5% discount on LPG Booking",
        description: "Get 0.5% discount on LPG Booking",
        category: "Bill Payments",
        serviceType: "bill_payment",
        companyName: "HP Gas",
        logoUrl: "hindustanpetroleum.com",
        bgColor: "#004792",
        icon: Zap
    },
    {
        title: "Get 0.5% discount on Muncipal",
        description: "Get 0.5% discount on Municipal",
        category: "Bill Payments",
        serviceType: "bill_payment",
        bgColor: "#FFB000",
        icon: Home
    },
    {
        title: "Get 0.5% discount on Municipal Taxes",
        description: "Get 0.5% discount on Municipal Taxes",
        category: "Bill Payments",
        serviceType: "bill_payment",
        companyName: "Digital India",
        logoUrl: "digitalindia.gov.in",
        bgColor: "#FFFFFF",
        icon: Landmark
    },
    {
        title: "Get 0.5% discount on Municipality",
        description: "Get 0.5% discount on Municipality",
        category: "Bill Payments",
        serviceType: "bill_payment",
        companyName: "Urban Development",
        logoUrl: "mohua.gov.in",
        bgColor: "#0083B0",
        icon: Home
    },
    {
        title: "Get 0.5% discount on Postpaid",
        description: "Get 0.5% discount on Postpaid",
        category: "Bill Payments",
        serviceType: "bill_payment",
        companyName: "Airtel",
        logoUrl: "airtel.in",
        bgColor: "#E40000",
        icon: Smartphone
    },
    {
        title: "Get 0.5% discount on Water",
        description: "Get 0.5% discount on Water",
        category: "Bill Payments",
        serviceType: "bill_payment",
        bgColor: "#0093D0",
        icon: Droplets
    },
    {
        title: "Get 0.5% discount on Water Supplier",
        description: "Get 0.5% discount on Water Supplier",
        category: "Bill Payments",
        serviceType: "bill_payment",
        companyName: "Aqua Guard",
        logoUrl: "eurekaforbes.com",
        bgColor: "#FFFFFF",
        icon: Droplets
    },
    {
        title: "Get 0.5% discount on Cable",
        description: "Get 0.5% discount on Cable",
        category: "Bill Payments",
        serviceType: "bill_payment",
        bgColor: "#ED1C24",
        icon: Tv
    },
    {
        title: "Get 0.5% discount on Donation",
        description: "Get 0.5% discount on Donation",
        category: "Bill Payments",
        serviceType: "bill_payment",
        companyName: "PM Cares",
        logoUrl: "pmcares.gov.in",
        bgColor: "#FFFFFF",
        icon: Home
    },
    {
        title: "Get 0.5% discount on Prepaid Meter",
        description: "Get 0.5% discount on Prepaid Meter",
        category: "Bill Payments",
        serviceType: "bill_payment",
        companyName: "Adani Electricity",
        logoUrl: "adanielectricity.com",
        bgColor: "#000000",
        icon: Smartphone
    },
    {
        title: "Get 0.5% discount on EMI Payment",
        description: "Get 0.5% discount on EMI Payment",
        category: "Bill Payments",
        serviceType: "bill_payment",
        companyName: "Bajaj Finserv",
        logoUrl: "bajajfinserv.in",
        bgColor: "#0072BB",
        icon: Coins
    },
    {
        title: "Get 0.5% discount on Fastag",
        description: "Get 0.5% discount on Fastag",
        category: "Bill Payments",
        serviceType: "bill_payment",
        companyName: "Paytm",
        logoUrl: "paytm.com",
        bgColor: "#002E6E",
        icon: CreditCard
    },
    {
        title: "Get 0.5% discount on Fee Payment",
        description: "Get 0.5% discount on Fee Payment",
        category: "Bill Payments",
        serviceType: "bill_payment",
        bgColor: "#FFCB05",
        icon: Landmark
    },
    {
        title: "Get 0.5% discount on Gas",
        description: "Get 0.5% discount on Gas",
        category: "Bill Payments",
        serviceType: "bill_payment",
        companyName: "Bharat Petroleum",
        logoUrl: "bharatpetroleum.in",
        bgColor: "#FFD400",
        icon: Zap
    },
    {
        title: "Get 0.5% discount on Insurance",
        description: "Get 0.5% discount on Insurance",
        category: "Bill Payments",
        serviceType: "bill_payment",
        companyName: "LIC",
        logoUrl: "licindia.in",
        bgColor: "#FFED00",
        icon: Landmark
    },
    {
        title: "Get 0.5% discount on Landline",
        description: "Get 0.5% discount on Landline",
        category: "Bill Payments",
        serviceType: "bill_payment",
        bgColor: "#004990",
        icon: Phone
    },
    {
        title: "Get 0.5% discount on Broadband",
        description: "Get 0.5% discount on Broadband",
        category: "Bill Payments",
        serviceType: "bill_payment",
        companyName: "ACT Fibernet",
        logoUrl: "actcorp.in",
        bgColor: "#ED1C24",
        icon: Wifi
    },
    {
        title: "Get 5.0% discount on Broadband Postpaid",
        description: "Get 5.0% discount on Broadband Postpaid",
        category: "Bill Payments",
        serviceType: "bill_payment",
        companyName: "Jio",
        logoUrl: "jio.com",
        bgColor: "#005EB8",
        icon: Wifi
    },
    {
        title: "Get 0.5% discount on Datacard Prepaid",
        description: "Get 0.5% discount on Datacard Prepaid",
        category: "Bill Payments",
        serviceType: "bill_payment",
        companyName: "TP-Link",
        logoUrl: "tp-link.com",
        bgColor: "#4ACBD6",
        icon: Wifi
    },
    {
        title: "Get 0.5% discount on Digital Voucher",
        description: "Get 0.5% discount on Digital Voucher",
        category: "Bill Payments",
        serviceType: "bill_payment",
        companyName: "Amazon",
        logoUrl: "amazon.in",
        bgColor: "#FF9900",
        icon: Gift
    },
    {
        title: "Get 0.5% discount on Electricity",
        description: "Get 0.5% discount on Electricity",
        category: "Bill Payments",
        serviceType: "bill_payment",
        companyName: "Tata Power",
        logoUrl: "tatapower.com",
        bgColor: "#005689",
        icon: Zap
    },
    {
        title: "Get 0.5% discount on EMI",
        description: "Get 0.5% discount on EMI",
        category: "Bill Payments",
        serviceType: "bill_payment",
        companyName: "HDFC Bank",
        logoUrl: "hdfcbank.com",
        bgColor: "#004C8F",
        icon: Coins
    },

    // Prepaid Recharge Category
    {
        title: "Get 0.5% discount on Airtel Recharge",
        description: "Get 0.5% discount on Airtel prepaid mobile recharges",
        category: "Prepaid Recharge",
        serviceType: "prepaid",
        companyName: "Airtel",
        logoUrl: "airtel.in",
        bgColor: "#E40000"
    },
    {
        title: "Get 0.5% discount on Jio Recharge",
        description: "Get 0.5% discount on Jio prepaid mobile recharges",
        category: "Prepaid Recharge",
        serviceType: "prepaid",
        companyName: "Reliance Jio",
        logoUrl: "jio.com",
        bgColor: "#005EB8"
    },
    {
        title: "Get 0.5% discount on Vi Recharge",
        description: "Get 0.5% discount on Vi prepaid mobile recharges",
        category: "Prepaid Recharge",
        serviceType: "prepaid",
        companyName: "Vodafone Idea",
        logoUrl: "myvi.in",
        bgColor: "#FF0000"
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
