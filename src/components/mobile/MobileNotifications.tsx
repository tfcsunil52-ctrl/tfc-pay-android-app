import { useState, useEffect } from "react";
import { ArrowLeft, Check, Bell, X, Info, CreditCard, Gift } from "lucide-react";
import { Button } from "../ui/Button";
import { Card, CardContent } from "../ui/Card";

interface Notification {
    id: string;
    title: string;
    message: string;
    time: string;
    type: 'payment' | 'offer' | 'info';
    isRead: boolean;
}

interface MobileNotificationsProps {
    onClose: () => void;
    isDarkMode?: boolean;
    onOpen?: () => void; // Callback when panel opens to reset counter
}

const MobileNotifications = ({ onClose, isDarkMode = true, onOpen }: MobileNotificationsProps) => {
    const [notifications, setNotifications] = useState<Notification[]>([
        {
            id: '1',
            title: 'Payment Successful',
            message: 'Your payment of ₹500 to Electricity Bill was successful.',
            time: '2 mins ago',
            type: 'payment',
            isRead: false
        },
        {
            id: '2',
            title: 'Super Offer! 🎁',
            message: 'Get flat 50% cashback on your first DTH recharge of the week.',
            time: '1 hour ago',
            type: 'offer',
            isRead: false
        },
        {
            id: '3',
            title: 'Account Update',
            message: 'Your KYC verification is pending. Please complete it to increase limits.',
            time: '5 hours ago',
            type: 'info',
            isRead: true
        },
        {
            id: '4',
            title: 'Cashback Received',
            message: 'Congratulations! You received ₹50 cashback for your referral.',
            time: 'Yesterday',
            type: 'offer',
            isRead: true
        }
    ]);

    // Auto-mark all notifications as read when panel opens
    useEffect(() => {
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
        onOpen?.(); // Notify parent to reset counter
    }, []); // Run only once on mount

    const deleteNotification = (id: string) => {
        setNotifications(notifications.filter(n => n.id !== id));
    };

    const getIcon = (type: Notification['type']) => {
        switch (type) {
            case 'payment': return <CreditCard className="w-5 h-5 text-blue-500" />;
            case 'offer': return <Gift className="w-5 h-5 text-orange-500" />;
            case 'info': return <Info className="w-5 h-5 text-green-700 dark:text-green-500" />;
            default: return <Bell className="w-5 h-5 text-muted-foreground" />;
        }
    };

    return (
        <div className={`fixed inset-0 z-50 flex flex-col bg-background animate-in slide-in-from-right duration-300 ${isDarkMode ? 'dark' : ''}`}>
            {/* Header */}
            <header className="px-4 py-4 border-b border-border flex items-center justify-between bg-card/50 backdrop-blur-md">
                <div className="flex items-center gap-3">
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-muted rounded-full transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <h2 className="text-lg font-bold">Notifications</h2>
                </div>
            </header>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {notifications.length > 0 ? (
                    notifications.map((notification) => (
                        <Card
                            key={notification.id}
                            className={`border-border group transition-all duration-300 ${!notification.isRead ? 'bg-green-600/5 dark:bg-green-500/5 border-green-700/20 dark:border-green-500/20 shadow-sm' : 'bg-card/30'}`}
                        >
                            <CardContent className="p-4 flex gap-4">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${!notification.isRead ? 'bg-card' : 'bg-muted/50'}`}>
                                    {getIcon(notification.type)}
                                </div>
                                <div className="flex-1 min-w-0 pt-0.5">
                                    <h3 className={`text-sm font-bold truncate mb-1 ${!notification.isRead ? 'text-foreground' : 'text-muted-foreground'}`}>
                                        {notification.title}
                                    </h3>
                                    <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                                        {notification.message}
                                    </p>
                                </div>
                                <div className="flex flex-col items-end justify-between min-w-[60px] flex-shrink-0 py-0.5">
                                    <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                                        {notification.time}
                                    </span>
                                    <button
                                        onClick={() => deleteNotification(notification.id)}
                                        className="p-1.5 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-muted rounded-md relative z-10"
                                    >
                                        <X className="w-4 h-4 text-muted-foreground" />
                                    </button>
                                </div>
                                {!notification.isRead && (
                                    <div className="w-2 h-2 bg-green-700 dark:bg-green-500 rounded-full absolute top-2 right-2 animate-pulse"></div>
                                )}
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center p-8 opacity-50">
                        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                            <Bell className="w-8 h-8" />
                        </div>
                        <h3 className="font-bold mb-1">All caught up!</h3>
                        <p className="text-sm">No new notifications at the moment.</p>
                    </div>
                )}
            </div>


        </div>
    );
};

export default MobileNotifications;
