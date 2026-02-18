
import { useState } from "react";
import { ArrowLeft, Search, Plus, User, Phone } from "lucide-react";
import { Input } from "../../ui/Input";
import { Button } from "../../ui/Button";
import { Avatar, AvatarFallback } from "../../ui/Avatar";
import { Card, CardContent } from "../../ui/Card";
import { TransferView } from "../profile/TransferView";

interface Contact {
    id: string;
    name: string;
    phone: string;
    initials: string;
    imageUrl?: string;
    isTFCUser?: boolean;
}

interface ContactListProps {
    onBack: () => void;
}

const ContactList = ({ onBack }: ContactListProps) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [view, setView] = useState<'list' | 'pay'>('list');
    const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

    // Mock Contacts
    const contacts: Contact[] = [
        { id: "1", name: "Rahul Sharma", phone: "+91 98765 43210", initials: "RS", isTFCUser: true },
        { id: "2", name: "Priya Singh", phone: "+91 98765 12345", initials: "PS", isTFCUser: true },
        { id: "3", name: "Amit Verma", phone: "+91 91234 56789", initials: "AV", isTFCUser: false },
        { id: "4", name: "Mom", phone: "+91 88888 88888", initials: "M", isTFCUser: true },
        { id: "5", name: "Dad", phone: "+91 77777 77777", initials: "D", isTFCUser: true }
    ];

    const filteredContacts = contacts.filter(c =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.phone.includes(searchQuery)
    );

    const handlePay = (contact: Contact) => {
        if (!contact.isTFCUser) {
            alert("Invite this user to TFC Pay to send money!");
            return;
        }
        setSelectedContact(contact);
        setView('pay');
    };

    if (view === 'pay' && selectedContact) {
        return (
            <TransferView
                title={`Pay ${selectedContact.name}`}
                fields={[
                    { label: "Amount", placeholder: "₹0", type: "number" },
                    { label: "Note", placeholder: "What's this for?" }
                ]}
                onBack={() => {
                    setView('list');
                    setSelectedContact(null);
                }}
                buttonText="Pay Now"
                note={`To: ${selectedContact.phone}`}
                isClosing={false}
            />
        );
    }

    return (
        <div className="flex flex-col h-full bg-background overlay-gradient-bg animate-in slide-in-from-right duration-300 fixed inset-0 z-50">
            {/* Header */}
            <div className="flex items-center p-4 border-b border-border bg-card/50 backdrop-blur-md sticky top-0 z-10">
                <button
                    onClick={onBack}
                    className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center hover:bg-card/80 transition-colors mr-4"
                >
                    <ArrowLeft className="w-5 h-5 text-foreground" />
                </button>
                <h2 className="font-bold text-foreground text-lg">Select Contact</h2>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4">
                {/* Search */}
                <div className="relative mb-6">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        placeholder="Search name or number"
                        className="pl-10 bg-card border-border h-12 rounded-xl"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <div className="space-y-4">
                    <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-1">Contacts on TFC Pay</h3>

                    {filteredContacts.length > 0 ? (
                        filteredContacts.map((contact) => (
                            <div
                                key={contact.id}
                                className="flex items-center justify-between p-3 hover:bg-muted/50 rounded-xl cursor-pointer active:scale-[0.98] transition-transform"
                                onClick={() => handlePay(contact)}
                            >
                                <div className="flex items-center gap-4">
                                    <Avatar className="w-12 h-12 border border-border">
                                        <AvatarFallback className={`${contact.isTFCUser ? 'bg-green-600/10 dark:bg-green-500/10 text-green-700 dark:text-green-500' : 'bg-muted text-muted-foreground'} font-bold text-lg`}>
                                            {contact.initials}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <h4 className="font-bold text-foreground">{contact.name}</h4>
                                        <p className="text-xs text-muted-foreground">{contact.phone}</p>
                                    </div>
                                </div>
                                {contact.isTFCUser ? (
                                    <span className="text-[10px] font-bold text-green-700 dark:text-green-500 bg-green-600/10 dark:bg-green-500/10 px-2 py-0.5 rounded-full">TFC USER</span>
                                ) : (
                                    <Button variant="outline" size="sm" className="h-7 text-xs rounded-full border-green-700/30 dark:border-green-500/30 text-green-700 dark:text-green-500 hover:bg-green-600/10 dark:hover:bg-green-500/10">Invite</Button>
                                )}
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-12 text-muted-foreground">
                            <p>No contacts found</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ContactList;
