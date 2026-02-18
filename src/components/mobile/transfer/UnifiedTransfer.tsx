
import { useState } from "react";
import { ArrowLeft, Search, Plus, User, Building2, Users, Phone, SearchCheck, Trash2 } from "lucide-react";
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
    isTFCUser?: boolean;
}

interface Beneficiary {
    id: string;
    name: string;
    accountNumber: string;
    ifsc: string;
    bankName: string;
    initials: string;
}

interface UnifiedTransferProps {
    onBack: () => void;
    initialTab?: 'mobile' | 'bank';
    hideTabs?: boolean;
}

const UnifiedTransfer = ({ onBack, initialTab = 'mobile', hideTabs = false }: UnifiedTransferProps) => {
    const [activeTab, setActiveTab] = useState<'mobile' | 'bank'>(initialTab);
    const [searchQuery, setSearchQuery] = useState("");
    const [view, setView] = useState<'list' | 'add_ben' | 'pay_contact' | 'pay_ben'>('list');
    const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
    const [selectedBen, setSelectedBen] = useState<Beneficiary | null>(null);

    // Add Beneficiary States
    const [ifsc, setIfsc] = useState("");
    const [ifscStatus, setIfscStatus] = useState<'idle' | 'verifying' | 'valid' | 'invalid'>('idle');
    const [detectedBank, setDetectedBank] = useState("");
    const [accNo, setAccNo] = useState("");
    const [reAccNo, setReAccNo] = useState("");
    const [benName, setBenName] = useState("");

    const handleVerifyIFSC = () => {
        if (ifsc.length < 4) return;
        setIfscStatus('verifying');
        setTimeout(() => {
            // Mock logic: Valid if length is 11
            if (ifsc.length === 11) {
                setIfscStatus('valid');
                setDetectedBank("TFC Partner Bank, Branch 01");
            } else {
                setIfscStatus('invalid');
                setDetectedBank("");
            }
        }, 800);
    };

    // Mock Data
    const contacts: Contact[] = [
        { id: "1", name: "Rahul Sharma", phone: "+91 98765 43210", initials: "RS", isTFCUser: true },
        { id: "2", name: "Priya Singh", phone: "+91 98765 12345", initials: "PS", isTFCUser: true },
        { id: "3", name: "Amit Verma", phone: "+91 91234 56789", initials: "AV", isTFCUser: false },
        { id: "4", name: "Mom", phone: "+91 88888 88888", initials: "M", isTFCUser: true },
        { id: "5", name: "Dad", phone: "+91 77777 77777", initials: "D", isTFCUser: true }
    ];

    const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([
        { id: "1", name: "Ramesh Kumar", accountNumber: "XXXX 1234", ifsc: "HDFC0001234", bankName: "HDFC Bank", initials: "RK" },
        { id: "2", name: "Sneha Gupta", accountNumber: "XXXX 5678", ifsc: "SBIN0005678", bankName: "SBI", initials: "SG" },
        { id: "3", name: "Amit Patel", accountNumber: "XXXX 9012", ifsc: "ICIC0009012", bankName: "ICICI Bank", initials: "AP" }
    ]);

    const filteredContacts = contacts.filter(c =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.phone.includes(searchQuery)
    );

    const filteredBeneficiaries = beneficiaries.filter(b =>
        b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.accountNumber.includes(searchQuery)
    );

    const handlePayContact = (contact: Contact) => {
        if (!contact.isTFCUser) {
            alert("Invite this user to TFC Pay to send money!");
            return;
        }
        setSelectedContact(contact);
        setView('pay_contact');
    };

    const handlePayBen = (ben: Beneficiary) => {
        setSelectedBen(ben);
        setView('pay_ben');
    };

    const handleDeleteBen = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (confirm("Are you sure you want to delete this beneficiary?")) {
            setBeneficiaries(prev => prev.filter(b => b.id !== id));
        }
    };

    if (view === 'add_ben') {
        return (
            <TransferView
                title="Add Beneficiary"
                fields={[
                    {
                        label: "Account Number",
                        placeholder: "Enter Account Number",
                        type: "number",
                        value: accNo,
                        onChange: setAccNo
                    },
                    {
                        label: "Re-enter Account Number",
                        placeholder: "Re-enter Account Number",
                        type: "number",
                        value: reAccNo,
                        onChange: setReAccNo
                    },
                    {
                        label: "IFSC Code",
                        placeholder: "Enter 11-digit IFSC",
                        value: ifsc,
                        onChange: (val: string) => {
                            setIfsc(val.toUpperCase());
                            setIfscStatus('idle');
                        },
                        className: ifscStatus === 'valid' ? "border-green-500 ring-green-500/20" : ifscStatus === 'invalid' ? "border-red-500 ring-red-500/20" : "",
                        extra: (
                            <div className="flex flex-col gap-2">
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={handleVerifyIFSC}
                                    className={`h-9 text-xs font-bold rounded-lg border-2 ${ifscStatus === 'valid'
                                        ? "border-green-500 text-green-700 dark:text-green-500 bg-green-50 dark:bg-green-500/10"
                                        : ifscStatus === 'invalid'
                                            ? "border-red-500 text-red-700 dark:text-red-500 bg-red-50 dark:bg-red-500/10"
                                            : "border-green-700/30 dark:border-green-500/30 text-green-700 dark:text-green-500"
                                        }`}
                                >
                                    {ifscStatus === 'valid' ? (
                                        <div className="flex items-center gap-1.5"><SearchCheck className="w-3.5 h-3.5" /> Verified</div>
                                    ) : ifscStatus === 'invalid' ? (
                                        "Invalid IFSC - Retry"
                                    ) : (
                                        "Verify IFSC"
                                    )}
                                </Button>
                                {ifscStatus === 'valid' && detectedBank && (
                                    <p className="text-[10px] font-bold text-green-700 dark:text-green-500 animate-in fade-in slide-in-from-top-1 px-1">
                                        Detected: {detectedBank}
                                    </p>
                                )}
                            </div>
                        )
                    },
                    {
                        label: "Beneficiary Name",
                        placeholder: "Enter Name",
                        value: benName,
                        onChange: setBenName
                    },
                    {
                        label: "Bank Name",
                        placeholder: "e.g. Axis Bank",
                        value: detectedBank,
                        onChange: setDetectedBank
                    }
                ]}
                onBack={() => {
                    setView('list');
                    setIfscStatus('idle');
                    setIfsc("");
                    setDetectedBank("");
                }}
                buttonText="Add Beneficiary"
                isClosing={false}
            />
        );
    }

    if (view === 'pay_contact' && selectedContact) {
        return (
            <TransferView
                buttonText="Pay Now"
                beneficiaryInfo={{
                    name: selectedContact.name,
                    subtext: selectedContact.phone,
                    initials: selectedContact.initials,
                    isVerified: selectedContact.isTFCUser
                }}
                onBack={() => {
                    setView('list');
                    setSelectedContact(null);
                }}
                isClosing={false}
            />
        );
    }

    if (view === 'pay_ben' && selectedBen) {
        return (
            <TransferView
                title={`Pay ${selectedBen.name}`}
                fields={[
                    { label: "Amount", placeholder: "₹0", type: "number" },
                    { label: "Note", placeholder: "What's this for?" }
                ]}
                onBack={() => {
                    setView('list');
                    setSelectedBen(null);
                }}
                buttonText="Pay Now"
                beneficiaryInfo={{
                    name: selectedBen.name,
                    subtext: `${selectedBen.bankName} • ${selectedBen.accountNumber}`,
                    initials: selectedBen.initials,
                    isVerified: true,
                    bankDetails: true
                }}
                isClosing={false}
            />
        );
    }

    return (
        <div className="flex flex-col h-full bg-background animate-in slide-in-from-right duration-300 fixed inset-0 z-50">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border bg-card/50 backdrop-blur-md sticky top-0 z-10">
                <div className="flex items-center">
                    <button
                        onClick={onBack}
                        className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center hover:bg-card/80 transition-colors mr-4"
                    >
                        <ArrowLeft className="w-5 h-5 text-foreground" />
                    </button>
                    <h2 className="font-bold text-foreground text-lg">
                        {hideTabs ? (activeTab === 'mobile' ? 'To Mobile Number' : 'To Bank Account') : 'Transfer Money'}
                    </h2>
                </div>
                {activeTab === 'bank' && (
                    <button
                        onClick={() => setView('add_ben')}
                        className="flex items-center gap-2 px-4 py-2 rounded-full bg-green-600/10 dark:bg-green-500/10 text-green-700 dark:text-green-500 hover:bg-green-600/20 dark:hover:bg-green-500/20 transition-all active:scale-95 border border-green-700/10 dark:border-green-500/10"
                    >
                        <Plus className="w-4 h-4" />
                        <span className="text-sm font-bold">Add</span>
                    </button>
                )}
            </div>

            {/* Tabs */}
            {!hideTabs && (
                <div className="flex p-4 gap-2">
                    <button
                        onClick={() => setActiveTab('mobile')}
                        className={`flex-1 py-3 rounded-2xl font-bold transition-all ${activeTab === 'mobile' ? 'bg-[#063140] text-white' : 'bg-muted text-muted-foreground'}`}
                    >
                        To Mobile
                    </button>
                    <button
                        onClick={() => setActiveTab('bank')}
                        className={`flex-1 py-3 rounded-2xl font-bold transition-all ${activeTab === 'bank' ? 'bg-[#063140] text-white' : 'bg-muted text-muted-foreground'}`}
                    >
                        To Beneficiary
                    </button>
                </div>
            )}

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4">
                {/* Search */}
                <div className="relative mb-6">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        placeholder={activeTab === 'mobile' ? "Search name or number" : "Search name or account number"}
                        className="pl-10 bg-card border-border h-12 rounded-xl"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                {activeTab === 'mobile' ? (
                    <div className="space-y-4">
                        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-1">Contacts on TFC Pay</h3>
                        {filteredContacts.length > 0 ? (
                            filteredContacts.map((contact) => (
                                <div
                                    key={contact.id}
                                    className="flex items-center justify-between p-3 hover:bg-muted/50 rounded-xl cursor-pointer active:scale-[0.98] transition-transform"
                                    onClick={() => handlePayContact(contact)}
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
                                        <Button variant="outline" size="sm" className="h-7 text-xs rounded-full border-green-700/30 dark:border-green-500/30 text-green-700 dark:text-green-500">Invite</Button>
                                    )}
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-12 text-muted-foreground">
                                <p>No contacts found</p>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between px-1">
                            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Saved Beneficiaries</h3>
                        </div>

                        {filteredBeneficiaries.length > 0 ? (
                            filteredBeneficiaries.map((ben) => (
                                <Card
                                    key={ben.id}
                                    className="bg-card border-border hover:bg-muted/50 transition-colors cursor-pointer active:scale-[0.98] group"
                                    onClick={() => handlePayBen(ben)}
                                >
                                    <CardContent className="p-4 flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <Avatar className="w-12 h-12 border border-border">
                                                <AvatarFallback className="bg-green-600/10 dark:bg-green-500/10 text-green-700 dark:text-green-500 font-bold text-lg">
                                                    {ben.initials}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <h4 className="font-bold text-foreground">{ben.name}</h4>
                                                <p className="text-xs text-muted-foreground">{ben.bankName} • {ben.accountNumber}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={(e) => handleDeleteBen(ben.id, e)}
                                                className="w-8 h-8 rounded-full hover:bg-red-500/10 flex items-center justify-center transition-colors text-muted-foreground hover:text-red-500"
                                                title="Delete Beneficiary"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))
                        ) : (
                            <div className="text-center py-12 text-muted-foreground">
                                <p>No beneficiaries found</p>
                                <Button variant="link" onClick={() => setView('add_ben')} className="mt-2 text-green-700 dark:text-green-500">
                                    Add New Beneficiary
                                </Button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default UnifiedTransfer;
