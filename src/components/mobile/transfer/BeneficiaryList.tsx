
import { useState } from "react";
import { ArrowLeft, Search, Plus, User, Building2, MoreVertical, Trash2 } from "lucide-react";
import { Input } from "../../ui/Input";
import { Button } from "../../ui/Button";
import { Avatar, AvatarFallback } from "../../ui/Avatar";
import { Card, CardContent } from "../../ui/Card";
import { TransferView } from "../profile/TransferView";

interface Beneficiary {
    id: string;
    name: string;
    accountNumber: string;
    ifsc: string;
    bankName: string;
    initials: string;
}

interface BeneficiaryListProps {
    onBack: () => void;
}

const BeneficiaryList = ({ onBack }: BeneficiaryListProps) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([
        { id: "1", name: "Ramesh Kumar", accountNumber: "XXXX 1234", ifsc: "HDFC0001234", bankName: "HDFC Bank", initials: "RK" },
        { id: "2", name: "Sneha Gupta", accountNumber: "XXXX 5678", ifsc: "SBIN0005678", bankName: "SBI", initials: "SG" },
        { id: "3", name: "Amit Patel", accountNumber: "XXXX 9012", ifsc: "ICIC0009012", bankName: "ICICI Bank", initials: "AP" }
    ]);
    const [view, setView] = useState<'list' | 'add' | 'pay'>('list');
    const [selectedBen, setSelectedBen] = useState<Beneficiary | null>(null);

    const filteredBeneficiaries = beneficiaries.filter(b =>
        b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.accountNumber.includes(searchQuery)
    );

    const handleAddBeneficiary = () => {
        // Here you would normally save form data
        setView('list');
        const newBen: Beneficiary = {
            id: Date.now().toString(),
            name: "New Payee", // Mock
            accountNumber: "XXXX 0000",
            ifsc: "MOCK1234",
            bankName: "Mock Bank",
            initials: "NP"
        };
        setBeneficiaries([...beneficiaries, newBen]);
    };

    const handlePay = (ben: Beneficiary) => {
        setSelectedBen(ben);
        setView('pay');
    };

    if (view === 'add') {
        return (
            <TransferView
                title="Add Beneficiary"
                fields={[
                    { label: "Account Number", placeholder: "Enter Account Number", type: "number" },
                    { label: "Re-enter Account Number", placeholder: "Re-enter Account Number", type: "number" },
                    { label: "IFSC Code", placeholder: "Enter IFSC Code" },
                    { label: "Beneficiary Name", placeholder: "Enter Name" },
                    { label: "Bank Name", placeholder: "e.g. Axis Bank" }
                ]}
                onBack={() => setView('list')} // Canceling add goes back to list
                buttonText="Add Beneficiary"
                isClosing={false}
            // Mock on submit
            // onSubmit={handleAddBeneficiary} 
            />
        );
    }

    if (view === 'pay' && selectedBen) {
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
                note={`To: ${selectedBen.name} (${selectedBen.bankName})`}
                isClosing={false}
            />
        );
    }

    return (
        <div className="flex flex-col h-full bg-background animate-in slide-in-from-right duration-300 fixed inset-0 z-50">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border bg-card/50 backdrop-blur-md z-10 sticky top-0">
                <div className="flex items-center">
                    <button
                        onClick={onBack}
                        className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center hover:bg-card/80 transition-colors mr-4"
                    >
                        <ArrowLeft className="w-5 h-5 text-foreground" />
                    </button>
                    <h2 className="font-bold text-foreground text-lg">Send to beneficiary</h2>
                </div>
                <button
                    onClick={() => setView('add')}
                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-green-600/10 dark:bg-green-500/10 text-green-700 dark:text-green-500 hover:bg-green-600/20 dark:hover:bg-green-500/20 transition-all active:scale-95 border border-green-700/10 dark:border-green-500/10"
                >
                    <Plus className="w-4 h-4" />
                    <span className="text-sm font-bold">Add beneficiary</span>
                </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4">
                {/* Search */}
                <div className="relative mb-6">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        placeholder="Search by name or account number"
                        className="pl-10 bg-card border-border h-12 rounded-xl"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <div className="space-y-4">
                    <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-1">Beneficiaries</h3>

                    {filteredBeneficiaries.length > 0 ? (
                        filteredBeneficiaries.map((ben) => (
                            <Card
                                key={ben.id}
                                className="bg-card border-border hover:bg-muted/50 transition-colors cursor-pointer active:scale-[0.98] transform duration-100"
                                onClick={() => handlePay(ben)} // Opens payment view
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
                                    <Building2 className="w-5 h-5 text-muted-foreground opacity-50" />
                                </CardContent>
                            </Card>
                        ))
                    ) : (
                        <div className="text-center py-12 text-muted-foreground">
                            <p>No beneficiaries found</p>
                            <Button variant="link" onClick={() => setView('add')} className="mt-2 text-green-700 dark:text-green-500">
                                Add New Beneficiary
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BeneficiaryList;
