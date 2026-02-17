import { useState, useEffect, useCallback } from "react";
import type { Notification } from "../types";

export interface UseNotificationsReturn {
    notifications: Notification[];
    unreadCount: number;
    addNotification: (notification: Omit<Notification, "id" | "time" | "isRead">) => void;
    markAsRead: (id: string) => void;
    markAllAsRead: () => void;
    deleteNotification: (id: string) => void;
}

const initialNotifications: Notification[] = [
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
];

export const useNotifications = (): UseNotificationsReturn => {
    const [notifications, setNotifications] = useState<Notification[]>(() => {
        const stored = localStorage.getItem('tfc_notifications');
        return stored ? JSON.parse(stored) : initialNotifications;
    });

    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        localStorage.setItem('tfc_notifications', JSON.stringify(notifications));
        setUnreadCount(notifications.filter(n => !n.isRead).length);
    }, [notifications]);

    const addNotification = useCallback((notification: Omit<Notification, "id" | "time" | "isRead">) => {
        const newNotification: Notification = {
            ...notification,
            id: Date.now().toString(),
            time: 'Just now',
            isRead: false
        };
        setNotifications(prev => [newNotification, ...prev]);
    }, []);

    const markAsRead = useCallback((id: string) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    }, []);

    const markAllAsRead = useCallback(() => {
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    }, []);

    const deleteNotification = useCallback((id: string) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    }, []);

    return {
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead,
        deleteNotification
    };
};
