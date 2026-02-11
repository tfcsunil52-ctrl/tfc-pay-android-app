import { useState } from "react";
import { ChevronDown, ChevronUp, History, MessageSquare, Clock, ArrowLeft, Mail, Phone, Headphones } from "lucide-react";
import { Card, CardContent } from "../ui/Card";
import MobileChatScreen from "./MobileChatScreen";
import type { SupportTicket } from "../../types";
import { getAssetPath } from "../../utils/assets";

const faqs = [
    {
        question: "My money was deducted but recharge was not successful",
        answer: "If your recharge failed but amount was deducted, it will be automatically refunded within 5-7 business days. If you don't receive it, please contact our support team with your transaction ID.",
    },
    {
        question: "What should I do if I entered a wrong mobile number?",
        answer: "Unfortunately, once a successful recharge is completed, it cannot be reversed. Please double-check the mobile number before confirming your recharge. Contact support if money was deducted but recharge failed.",
    },
    {
        question: "Why is my bill payment pending?",
        answer: "Bill payment status depends on your service provider. It typically takes 24-48 hours to reflect. If it takes longer, please check with your service provider or contact our support.",
    },
    {
        question: "When will I get a refund for a failed transaction?",
        answer: "Refunds for failed transactions are processed automatically within 5-7 business days. The amount will be credited to your original payment method. For urgent queries, contact support.",
    },
    {
        question: "What should I do if my recharge is successful but balance is not updated?",
        answer: "Sometimes there's a delay from the operator's end. Please wait for 30 minutes and check again. If the issue persists, contact our 24x7 support with your transaction ID.",
    },
];

const tickets: SupportTicket[] = [
    {
        id: "TICK-84920",
        subject: "Money deducted but recharge failed",
        status: "open",
        date: "Today, 10:45 AM",
        category: "Recharge",
        lastMessage: "We are checking with the operator."
    },
    {
        id: "TICK-84815",
        subject: "Unable to add money from HDFC bank",
        status: "resolved",
        date: "Yesterday, 02:30 PM",
        category: "Wallet",
        lastMessage: "Issue has been resolved. Please try again."
    },
    {
        id: "TICK-83901",
        subject: "Cashback not received for DTH",
        status: "closed",
        date: "Feb 08, 2024",
        category: "Offers",
        lastMessage: "Cashback has been credited to your wallet."
    }
];

const MobileSupport = () => {
    const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
    const [showChat, setShowChat] = useState(false);
    const [showTickets, setShowTickets] = useState(false);
    const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);

    const toggleFAQ = (index: number) => {
        setExpandedIndex(expandedIndex === index ? null : index);
    };

    if (showChat) {
        return <MobileChatScreen onBack={() => setShowChat(false)} />;
    }

    if (showTickets) {
        return (
            <div className="flex flex-col h-full bg-background animate-in slide-in-from-right duration-300">
                <header className="px-4 py-4 border-b border-border flex items-center gap-3 bg-card/50 backdrop-blur-md sticky top-0 z-10">
                    <button onClick={() => setShowTickets(false)} className="p-2 hover:bg-muted rounded-full transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <h2 className="font-bold text-lg">Ticket History</h2>
                </header>
                <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-20 font-sans">
                    {tickets.map((ticket) => (
                        <Card
                            key={ticket.id}
                            className="bg-card border-border hover:border-green-700/50 dark:hover:border-green-500/50 transition-all cursor-pointer group shadow-sm"
                            onClick={() => setSelectedTicket(ticket)}
                        >
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{ticket.id}</span>
                                    <div className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${ticket.status === 'open' ? 'bg-blue-500/10 text-blue-500' :
                                        ticket.status === 'resolved' ? 'bg-green-600/10 dark:bg-green-500/10 text-green-700 dark:text-green-500' :
                                            'bg-muted text-muted-foreground'
                                        }`}>
                                        {ticket.status}
                                    </div>
                                </div>
                                <h4 className="font-bold text-foreground mb-1 group-hover:text-green-700 dark:group-hover:text-green-500 transition-colors">{ticket.subject}</h4>
                                <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {ticket.date}</span>
                                    <span className="flex items-center gap-1"><History className="w-3 h-3" /> {ticket.category}</span>
                                </div>
                                {ticket.lastMessage && (
                                    <div className="mt-3 p-2.5 bg-muted/30 rounded-lg border border-border/50">
                                        <p className="text-[11px] text-muted-foreground italic line-clamp-2 leading-relaxed">
                                            Last update: {ticket.lastMessage}
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    ))}

                    <div className="pt-4">
                        <p className="text-center text-xs text-muted-foreground">
                            Tickets older than 30 days are automatically closed.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full overflow-hidden relative font-sans">
            {/* Background Blurs for Light Mode */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 dark:hidden">
                <div className="absolute top-[10%] left-[20%] w-[60%] h-[40%] rounded-full bg-blue-100/40 blur-[80px]" />
                <div className="absolute bottom-[20%] right-[10%] w-[50%] h-[30%] rounded-full bg-green-100/40 blur-[80px]" />
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-5 pb-20 relative z-10">
                {/* Header */}
                <header>
                    <h1 className="text-2xl font-bold text-foreground mb-1">Support</h1>
                    <p className="text-sm text-muted-foreground">How can we assist you today?</p>
                </header>

                {/* Quick Action Cards */}
                <div className="grid grid-cols-2 gap-4">
                    <Card
                        className="bg-green-600/10 dark:bg-card border border-green-700/10 dark:border-border hover:border-green-700/50 dark:hover:border-green-500/50 transition-all cursor-pointer group active:scale-95 shadow-sm"
                        onClick={() => setShowChat(true)}
                    >
                        <CardContent className="p-3 flex flex-col items-center text-center gap-2">
                            <div className="w-16 h-16 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <img src={getAssetPath("/Icons/support-agent.webp")} alt="Live Chat" className="w-full h-full object-contain" />
                            </div>
                            <div>
                                <h4 className="text-base font-bold">Live Chat</h4>
                                <p className="text-xs text-muted-foreground mt-1">Chat with our experts</p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card
                        className="bg-blue-600/10 dark:bg-card border border-blue-700/10 dark:border-border hover:border-blue-700/50 transition-all cursor-pointer group active:scale-95 shadow-sm"
                        onClick={() => setShowTickets(true)}
                    >
                        <CardContent className="p-3 flex flex-col items-center text-center gap-2">
                            <div className="w-16 h-16 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <img src={getAssetPath("/ticket history.webp")} alt="Ticket History" className="w-full h-full object-contain" />
                            </div>
                            <div>
                                <h4 className="text-base font-bold">Ticket History</h4>
                                <p className="text-xs text-muted-foreground mt-1">Check status (1 active)</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Banner */}
                <Card className="bg-gradient-to-br from-green-600/10 dark:from-green-500/10 via-green-600/5 dark:via-green-500/5 to-transparent border-green-700/20 dark:border-green-500/20 overflow-hidden">
                    <CardContent className="p-5 flex items-center justify-between">
                        <div className="max-w-[60%]">
                            <h3 className="font-bold text-foreground">Need help with a payment?</h3>
                            <p className="text-[11px] text-muted-foreground mt-1">Select a transaction from your history to report an issue instantly.</p>
                        </div>
                        <div className="w-16 h-16 bg-green-600/20 dark:bg-green-500/20 rounded-full flex items-center justify-center">
                            <History className="w-8 h-8 text-green-700 dark:text-green-500 opacity-50" />
                        </div>
                    </CardContent>
                </Card>

                {/* FAQs Section */}
                <section className="space-y-3">
                    <div className="flex items-center justify-between mb-1">
                        <h3 className="text-lg font-bold text-foreground">Top FAQs</h3>
                        <button className="text-xs text-green-700 dark:text-green-500 font-semibold hover:underline">View All</button>
                    </div>

                    <div className="space-y-2.5">
                        {faqs.map((faq, index) => (
                            <Card key={index} className="bg-white dark:bg-card border-border overflow-hidden shadow-sm">
                                <CardContent className="p-0">
                                    <button
                                        onClick={() => toggleFAQ(index)}
                                        className="w-full flex items-center justify-between p-4 hover:bg-green-600/5 dark:hover:bg-muted/30 transition-colors group"
                                    >
                                        <span className="text-sm font-bold text-foreground text-left pr-3">{faq.question}</span>
                                        {expandedIndex === index ? (
                                            <ChevronUp className="w-5 h-5 text-green-700 dark:text-green-500 flex-shrink-0" />
                                        ) : (
                                            <ChevronDown className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                                        )}
                                    </button>

                                    {expandedIndex === index && (
                                        <div className="px-4 pb-4 pt-1 animate-in fade-in slide-in-from-top-1 duration-200">
                                            <div className="h-px bg-border/50 mb-3" />
                                            <p className="text-sm text-muted-foreground leading-relaxed">{faq.answer}</p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </section>

                {/* Still Need Help */}
                <section className="pt-2">
                    <Card className="bg-muted/30 border-dashed border-border">
                        <CardContent className="p-4">
                            <h4 className="text-sm font-bold text-foreground mb-4">Still need assistance?</h4>
                            <div className="grid grid-cols-1 gap-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-card flex items-center justify-center border border-border">
                                        <Mail className="w-4 h-4 text-green-700 dark:text-green-500" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-[11px] text-muted-foreground">Email us at</p>
                                        <p className="text-sm font-medium">support@tfcpay.com</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-card flex items-center justify-center border border-border">
                                        <Phone className="w-4 h-4 text-green-700 dark:text-green-500" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-[11px] text-muted-foreground">Call us toll-free</p>
                                        <p className="text-sm font-medium">1800-412-5566</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </section>

                <p className="text-center text-[10px] text-muted-foreground mt-4 pb-4 uppercase tracking-widest font-bold opacity-50">
                    TFC PAY SECURE SUPPORT
                </p>
            </div>
        </div>
    );
};

export default MobileSupport;
