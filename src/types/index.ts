// Transaction type
export interface Transaction {
    id?: string;
    name: string;
    amount: string;
    time: string;
    date?: string;
    status?: 'success' | 'pending' | 'failed';
    referenceId?: string;
    method?: string;
    icon: React.ComponentType<{ className?: string }>;
    isCredit: boolean;
}

// Service type
export interface Service {
    icon: React.ComponentType<{ className?: string }>;
    title: string;
    description?: string;
    image?: string;
}

// Navigation tab type
export type TabType = "home" | "services" | "offers" | "profile";

// Theme type
export type ThemeMode = "dark" | "light";

// Wallet state type
export interface WalletState {
    balance: number;
    previousBalance: number;
    transactions: Transaction[];
}

// Offer type
export interface Offer {
    title: string;
    description: string;
    code?: string;
    validTill?: string;
    color?: string;
    category?: string;
    icon?: React.ComponentType<{ className?: string }>;
}

// FAQ type
export interface FAQ {
    question: string;
    answer: string;
}

// Reward type
export interface Reward {
    id: number;
    type: "cashback" | "coins" | "coupon" | "bonus";
    value: string;
    isScratched: boolean;
    expiresAt: string;
}

// Support Ticket type
export interface SupportTicket {
    id: string;
    subject: string;
    status: 'open' | 'resolved' | 'closed' | 'pending';
    date: string;
    lastMessage?: string;
    category: string;
}
