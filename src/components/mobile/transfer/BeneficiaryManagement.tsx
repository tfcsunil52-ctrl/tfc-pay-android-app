
import { useState } from "react";
import { ArrowLeft, Search, Plus, Trash2, SearchCheck, Building2, User } from "lucide-react";
import { Input } from "../../ui/Input";
import { Button } from "../../ui/Button";
import { Avatar, AvatarFallback } from "../../ui/Avatar";
import { Card, CardContent } from "../../ui/Card";

interface Beneficiary {
    id: string;
    name: string;
    accountNumber: string;
    ifsc: string;
    bankName: string;
    initials: string;
}

interface BeneficiaryManagementProps {
    onBack: () => void;
}

const BeneficiaryManagement = ({ onBack }: BeneficiaryManagementProps) => {
    const [view, setView] = useState<'list' | 'add'>('list');
    const [searchQuery, setSearchQuery] = useState("");
    const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([
        { id: "1", name: "Ramesh Kumar", accountNumber: "XXXX 1234", ifsc: "HDFC0001234", bankName: "HDFC Bank", initials: "RK" },
        { id: "2", name: "Sneha Gupta", accountNumber: "XXXX 5678", ifsc: "SBIN0005678", bankName: "SBI", initials: "SG" },
        { id: "3", name: "Amit Patel", accountNumber: "XXXX 9012", ifsc: "ICIC0009012", bankName: "ICICI Bank", initials: "AP" }
    ]);

    // Add Beneficiary Form States
    const [benName, setBenName] = useState("");
    const [accNo, setAccNo] = useState("");
    const [reAccNo, setReAccNo] = useState("");
    const [ifsc, setIfsc] = useState("");
    const [bankName, setBankName] = useState("");
    const [ifscStatus, setIfscStatus] = useState<'idle' | 'verifying' | 'valid' | 'invalid'>('idle');

    const filteredBeneficiaries = beneficiaries.filter(b =>
        b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.accountNumber.includes(searchQuery)
    );

    const handleVerifyIFSC = () => {
        if (ifsc.length < 4) return;
        setIfscStatus('verifying');
        setTimeout(() => {
            // Mock logic
            if (ifsc.length === 11) {
                setIfscStatus('valid');
                setBankName("TFC Partner Bank");
            } else {
                setIfscStatus('invalid');
                setBankName("");
            }
        }, 800);
    };

    const handleAddBeneficiary = () => {
        if (!benName || !accNo || !ifsc || ifscStatus !== 'valid') {
            alert("Please fill all fields correctly.");
            return;
        }
        if (accNo !== reAccNo) {
            alert("Account numbers do not match.");
            return;
        }

        const newBen: Beneficiary = {
            id: Date.now().toString(),
            name: benName,
            accountNumber: `XXXX ${accNo.slice(-4)}`,
            ifsc: ifsc,
            bankName: bankName,
            initials: benName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
        };

        setBeneficiaries([newBen, ...beneficiaries]);
        setView('list');
        // Reset form
        setBenName(""); setAccNo(""); setReAccNo(""); setIfsc(""); setBankName(""); setIfscStatus('idle');
    };

    const handleDeleteBen = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (confirm("Are you sure you want to delete this beneficiary?")) {
            setBeneficiaries(prev => prev.filter(b => b.id !== id));
        }
    };

    if (view === 'add') {
        return (
            <div className="flex flex-col h-full bg-background overlay-gradient-bg fixed inset-0 z-50 animate-in slide-in-from-right duration-300">
                <div className="flex items-center p-4 border-b border-border bg-card/50 backdrop-blur-md sticky top-0 z-10">
                    <button
                        onClick={() => setView('list')}
                        className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center hover:bg-card/80 transition-colors mr-4"
                    >
                        <ArrowLeft className="w-5 h-5 text-foreground" />
                    </button>
                    <h2 className="font-bold text-foreground text-lg">Add New Beneficiary</h2>
                </div>

                <div className="p-6 space-y-6 overflow-y-auto flex-1">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-muted-foreground uppercase ml-1">Bank Details</label>
                            <Input
                                placeholder="Account Number"
                                type="number"
                                value={accNo}
                                onChange={(e) => setAccNo(e.target.value)}
                                className="bg-card border-border h-12"
                            />
                            <Input
                                placeholder="Re-enter Account Number"
                                type="number"
                                value={reAccNo}
                                onChange={(e) => setReAccNo(e.target.value)}
                                className={`bg-card border-border h-12 ${accNo && reAccNo && accNo !== reAccNo ? "border-red-500" : ""}`}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-muted-foreground uppercase ml-1">IFSC Code</label>
                            <div className="flex gap-2">
                                <Input
                                    placeholder="IFSC Code"
                                    value={ifsc}
                                    onChange={(e) => {
                                        setIfsc(e.target.value.toUpperCase());
                                        setIfscStatus('idle');
                                    }}
                                    className={`bg-card border-border h-12 flex-1 ${ifscStatus === 'valid' ? 'border-green-500' : ifscStatus === 'invalid' ? 'border-red-500' : ''}`}
                                    maxLength={11}
                                />
                                <Button
                                    disabled={ifsc.length < 4 || ifscStatus === 'verifying'}
                                    className="h-12 w-24 font-bold bg-[#021a10] hover:bg-[#021a10]/90 text-white"
                                    onClick={handleVerifyIFSC}
                                >
                                    Verify
                                </Button>
                            </div>
                            {ifscStatus === 'valid' && (
                                <p className="text-xs font-bold text-green-700 dark:text-green-500 px-1">
                                    {bankName} (Verified)
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-muted-foreground uppercase ml-1">Beneficiary Name</label>
                            <Input
                                placeholder="Beneficiary Name"
                                value={benName}
                                onChange={(e) => setBenName(e.target.value)}
                                className="bg-card border-border h-12"
                            />
                        </div>
                    </div>

                    <Button
                        onClick={handleAddBeneficiary}
                        className="w-full bg-[#021a10] hover:bg-[#021a10]/90 text-white font-bold h-12 rounded-xl mt-6 shadow-lg"
                    >
                        Save Beneficiary
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full bg-background overlay-gradient-bg fixed inset-0 z-50 animate-in slide-in-from-right duration-300">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border bg-card/50 backdrop-blur-md sticky top-0 z-10">
                <div className="flex items-center">
                    <button
                        onClick={onBack}
                        className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center hover:bg-card/80 transition-colors mr-4"
                    >
                        <ArrowLeft className="w-5 h-5 text-foreground" />
                    </button>
                    <h2 className="font-bold text-foreground text-lg">Manage Beneficiaries</h2>
                </div>
                <button
                    onClick={() => setView('add')}
                    className="w-10 h-10 rounded-full bg-[#021a10] text-white flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all"
                >
                    <Plus className="w-6 h-6" />
                </button>
            </div>

            {/* Unique Search Bar */}
            <div className="p-4 pb-0">
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                        placeholder="Search beneficiaries..."
                        className="pl-12 bg-card border-border h-14 rounded-2xl shadow-sm text-lg"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {filteredBeneficiaries.length > 0 ? (
                    filteredBeneficiaries.map((ben) => (
                        <Card
                            key={ben.id}
                            className="bg-card border-border hover:bg-muted/50 transition-colors group relative overflow-hidden"
                        >
                            <CardContent className="p-4 flex items-center justify-between">
                                <div className="flex items-center gap-4 z-10">
                                    <Avatar className="w-14 h-14 border-2 border-border shadow-sm">
                                        <AvatarFallback className="bg-green-600/10 dark:bg-green-500/10 text-green-700 dark:text-green-500 font-bold text-xl">
                                            {ben.initials}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <h4 className="font-bold text-foreground text-lg">{ben.name}</h4>
                                        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                                            <Building2 className="w-3.5 h-3.5" />
                                            <span>{ben.bankName}</span>
                                        </div>
                                        <p className="text-xs text-muted-foreground mt-0.5 tracking-wider">{ben.accountNumber}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={(e) => handleDeleteBen(ben.id, e)}
                                    className="w-10 h-10 rounded-full hover:bg-red-500/10 flex items-center justify-center transition-colors text-muted-foreground hover:text-red-500 z-10"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>

                                {/* Background decoration */}
                                <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-background/50 to-transparent pointer-events-none" />
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-muted-foreground opacity-60">
                        <User className="w-16 h-16 mb-4 stroke-1" />
                        <p className="text-lg font-medium">No beneficiaries found</p>
                        <p className="text-sm">Add a new beneficiary to get started</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BeneficiaryManagement;
