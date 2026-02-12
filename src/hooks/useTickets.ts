import { useState, useEffect, useCallback } from "react";
import type { SupportTicket } from "../types";

export interface UseTicketsReturn {
    tickets: SupportTicket[];
    resolveTicket: (id: string, resolutionMessage?: string) => void;
    createTicket: (subject: string, category: string, message: string) => SupportTicket;
}

const initialTickets: SupportTicket[] = [
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
        date: "Feb 08, 2026",
        category: "Offers",
        lastMessage: "Cashback has been credited to your wallet."
    }
];

export const useTickets = (): UseTicketsReturn => {
    const [tickets, setTickets] = useState<SupportTicket[]>(() => {
        const stored = localStorage.getItem('tfc_tickets');
        return stored ? JSON.parse(stored) : initialTickets;
    });

    useEffect(() => {
        localStorage.setItem('tfc_tickets', JSON.stringify(tickets));
    }, [tickets]);

    const resolveTicket = useCallback((id: string, resolutionMessage: string = "Issue has been resolved.") => {
        setTickets(prev => prev.map(ticket =>
            ticket.id === id
                ? { ...ticket, status: 'resolved', lastMessage: resolutionMessage }
                : ticket
        ));
    }, []);

    const createTicket = useCallback((subject: string, category: string, message: string) => {
        const newTicket: SupportTicket = {
            id: `TICK-${Math.floor(Math.random() * 100000)}`,
            subject,
            category,
            status: 'open',
            date: 'Just now',
            lastMessage: message
        };
        setTickets(prev => [newTicket, ...prev]);
        return newTicket;
    }, []);

    return {
        tickets,
        resolveTicket,
        createTicket
    };
};
