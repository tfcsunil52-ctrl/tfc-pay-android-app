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
    icon: string | React.ComponentType<{ className?: string }>;
    isCredit: boolean;
    type?: 'mobile_recharge' | 'bill_payment' | 'cc_to_bank' | 'wallet';
    category?: string; // e.g., "Mobile Recharge", "Electricity", "DTH", "Transfer", "Add Money"
}

// Service type
export interface Service {
    icon: string | React.ComponentType<{ className?: string }>;
    title: string;
    description?: string;
    image?: string;
}

// Navigation tab type
export type TabType = "home" | "offers" | "history" | "profile";

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
    icon?: string | React.ComponentType<{ className?: string }>;
    companyName?: string; // For logo fetching
    logoUrl?: string; // Cached logo URL
    image?: string; // Local asset path
    bgColor?: string; // Background color for the logo circle
    serviceType?: 'prepaid' | 'dth' | 'bill_payment'; // Category type
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

// Notification type
export interface Notification {
    id: string;
    title: string;
    message: string;
    time: string;
    type: 'payment' | 'offer' | 'info';
    isRead: boolean;
}
