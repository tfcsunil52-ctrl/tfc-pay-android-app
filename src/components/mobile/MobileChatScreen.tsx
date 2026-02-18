import { useState, useRef, useEffect } from "react";
import { ArrowLeft, Send, User } from "lucide-react";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { getAssetPath } from "../../utils/assets";

interface Message {
    id: number;
    text: string;
    isBot: boolean;
    timestamp: Date;
    ticketId?: string;
}

interface MobileChatScreenProps {
    onBack: () => void;
    initialMessage?: string;
    initialTicketId?: string;
}

const initialMessages: Message[] = [
    {
        id: 1,
        text: "Hello! 👋 Welcome to TFC Pay Support. How can I help you today?",
        isBot: true,
        timestamp: new Date(),
    },
];

const quickReplies = [
    "Payment failed",
    "Refund status",
    "Recharge issue",
    "Talk to agent",
];

const MobileChatScreen = ({ onBack, initialMessage = "", initialTicketId }: MobileChatScreenProps) => {
    // Load messages from localStorage or use initialMessages
    const [messages, setMessages] = useState<Message[]>(() => {
        const stored = localStorage.getItem('chat_messages');
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                // Convert timestamp strings back to Date objects
                const loaded = parsed.map((m: any) => ({ ...m, timestamp: new Date(m.timestamp) }));

                // Filter messages older than 2 months AND remove known dummy messages (IDs 101-106)
                const twoMonthsAgo = new Date();
                twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);

                const filtered = loaded.filter((m: Message) =>
                    m.timestamp > twoMonthsAgo &&
                    !(m.id >= 101 && m.id <= 106) // Remove dummy messages
                );

                return filtered.length > 0 ? filtered : initialMessages;
            } catch (e) {
                console.error("Failed to parse messages", e);
                return initialMessages;
            }
        }
        return initialMessages;
    });

    const [inputValue, setInputValue] = useState(initialMessage);
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        // Save messages to localStorage whenever they change
        localStorage.setItem('chat_messages', JSON.stringify(messages));
        scrollToBottom();
    }, [messages]);

    // Filter messages if a ticket is selected
    const displayMessages = initialTicketId
        ? messages.filter(m => m.ticketId === initialTicketId || m.id === 1)
        : messages;

    const getBotResponse = (userMessage: string): string => {
        const lower = userMessage.toLowerCase();
        if (lower.includes("refund")) {
            return "Refunds are processed within 5-7 business days. Can you share your transaction ID for me to check the status?";
        }
        if (lower.includes("failed") || lower.includes("payment")) {
            return "I'm sorry to hear about your failed payment. Please share your transaction ID and I'll look into it right away.";
        }
        if (lower.includes("recharge")) {
            return "For recharge issues, please provide your mobile number and the recharge amount. I'll help you resolve this quickly.";
        }
        if (lower.includes("agent") || lower.includes("human")) {
            return "I'm connecting you with a live agent. Please wait a moment... 🔄";
        }
        return "Thank you for your message. Our support team will assist you shortly. Is there anything specific I can help you with?";
    };

    const sendMessage = (text: string) => {
        if (!text.trim()) return;

        const userMessage: Message = {
            id: messages.length + 1,
            text: text.trim(),
            isBot: false,
            timestamp: new Date(),
            ticketId: initialTicketId // Associate new message with current ticket if any
        };

        setMessages((prev) => [...prev, userMessage]);
        setInputValue("");
        setIsTyping(true);

        // Simulate bot response
        setTimeout(() => {
            const botMessage: Message = {
                id: messages.length + 2,
                text: getBotResponse(text),
                isBot: true,
                timestamp: new Date(),
                ticketId: initialTicketId
            };
            setMessages((prev) => [...prev, botMessage]);
            setIsTyping(false);
        }, 1500);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        sendMessage(inputValue);
    };

    return (
        <div className="flex flex-col h-full bg-background">
            {/* Header */}
            <header className="flex items-center p-4 border-b border-border bg-card/50 backdrop-blur-md">
                <button
                    onClick={onBack}
                    className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center hover:bg-card/80 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5 text-foreground" />
                </button>
                <div className="ml-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full border border-green-700/20 dark:border-green-500/20 overflow-hidden bg-card">
                        <img src={getAssetPath("/Icons/support-agent.webp")} alt="Support Agent" className="w-full h-full object-cover scale-x-[-1]" />
                    </div>
                    <div>
                        <h2 className="font-bold text-foreground">TFC Support</h2>
                        <p className="text-xs text-green-500">Online</p>
                    </div>
                </div>
            </header>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {displayMessages.map((message) => (
                    <div
                        key={message.id}
                        className={`flex gap-2 ${message.isBot ? "justify-start" : "justify-end"}`}
                    >
                        {message.isBot && (
                            <div className="w-8 h-8 rounded-full border border-green-700/20 dark:border-green-500/20 overflow-hidden bg-card flex-shrink-0">
                                <img src={getAssetPath("/Icons/support-agent.webp")} alt="Agent" className="w-full h-full object-cover scale-x-[-1]" />
                            </div>
                        )}
                        <div
                            className={`max-w-[75%] p-3 rounded-2xl ${message.isBot
                                ? "bg-card border border-border rounded-tl-sm"
                                : "bg-green-700 text-white dark:bg-green-500 dark:text-black rounded-tr-sm"
                                }`}
                        >
                            <p className="text-sm">{message.text}</p>
                            <p
                                className={`text-[10px] mt-1 ${message.isBot ? "text-muted-foreground" : "text-white/60 dark:text-black/60"}`}
                            >
                                {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                            </p>
                        </div>
                        {!message.isBot && (
                            <div className="w-8 h-8 rounded-full bg-green-700 dark:bg-green-500 flex items-center justify-center flex-shrink-0">
                                <User className="w-4 h-4 text-white dark:text-black" />
                            </div>
                        )}
                    </div>
                ))}

                {isTyping && (
                    <div className="flex gap-2 justify-start">
                        <div className="w-8 h-8 rounded-full border border-green-700/20 dark:border-green-500/20 overflow-hidden bg-card flex-shrink-0">
                            <img src={getAssetPath("/Icons/support-agent.webp")} alt="Agent" className="w-full h-full object-cover scale-x-[-1]" />
                        </div>
                        <div className="bg-card border border-border p-3 rounded-2xl rounded-tl-sm">
                            <div className="flex gap-1">
                                <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                                <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                                <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                            </div>
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Quick Replies */}
            <div className="px-4 pb-2">
                <div className="flex gap-2 overflow-x-auto pb-2">
                    {quickReplies.map((reply, index) => (
                        <button
                            key={index}
                            onClick={() => sendMessage(reply)}
                            className="flex-shrink-0 px-3 py-1.5 rounded-full bg-card border border-border text-sm text-foreground hover:bg-green-600/10 dark:hover:bg-green-500/10 hover:border-green-700 dark:hover:border-green-500 transition-colors"
                        >
                            {reply}
                        </button>
                    ))}
                </div>
            </div>

            {/* Input Area */}
            <form onSubmit={handleSubmit} className="p-4 border-t border-border bg-card">
                <div className="flex gap-2 items-end">
                    <textarea
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1 bg-background border border-border rounded-lg p-3 min-h-[44px] max-h-[120px] resize-none focus:outline-none focus:ring-1 focus:ring-green-700 dark:focus:ring-green-500 text-sm"
                        rows={1}
                        style={{ height: 'auto' }}
                        onInput={(e) => {
                            const target = e.target as HTMLTextAreaElement;
                            target.style.height = 'auto';
                            target.style.height = `${Math.min(target.scrollHeight, 120)}px`;
                        }}
                    />
                    <Button
                        type="submit"
                        size="icon"
                        className="bg-[#063140] hover:bg-[#063140]/90 text-white w-10 h-10 rounded-full shadow-lg"
                    >
                        <Send className="w-4 h-4" />
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default MobileChatScreen;
