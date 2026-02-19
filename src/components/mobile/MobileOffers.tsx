import { useState } from "react";
import { ChevronRight, Sparkles, Tv, Smartphone, Zap, Flame, Ticket, History, X } from "lucide-react";
import { Card, CardContent } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { useRewards } from "../../hooks/useRewards";

interface MobileOffersProps {
    onNavigate?: (tab: import("../../types").TabType) => void;
    onServiceSelect?: (serviceTitle: string) => void;
}

const MobileOffers = ({ onNavigate, onServiceSelect }: MobileOffersProps) => {
    const { offers, totalCashback, pendingCashback } = useRewards();
    const [selectedOffer, setSelectedOffer] = useState<any | null>(null);

    // Remove duplicates based on title
    const uniqueOffers = Array.from(new Map(offers.map(offer => [offer.title, offer])).values());

    // Create a mixed list of offers from different categories
    const getMixedOffers = () => {
        const prepaid = uniqueOffers.filter(o => o.category === 'Prepaid Recharge' || o.serviceType === 'prepaid');
        const bills = uniqueOffers.filter(o => o.category === 'Bill Payments' || o.serviceType === 'bill_payment');
        const dth = uniqueOffers.filter(o => o.category === 'DTH' || o.serviceType === 'dth');
        const mixed = [];
        const maxLength = Math.max(prepaid.length, bills.length, dth.length);
        for (let i = 0; i < maxLength; i++) {
            if (prepaid[i]) mixed.push(prepaid[i]);
            if (bills[i]) mixed.push(bills[i]);
            if (dth[i]) mixed.push(dth[i]);
        }
        return mixed;
    };

    const mixedOffers = getMixedOffers();

    // Map offer to service title
    const getServiceTitle = (offer: any): string => {
        const title = offer.title.toLowerCase();
        const serviceType = offer.serviceType || '';
        const category = (offer.category || '').toLowerCase();
        if (serviceType === 'dth' || title.includes('dth') || category.includes('dth')) return 'DTH Recharge';
        if (serviceType === 'prepaid' || title.includes('recharge') || title.includes('repaid') || category.includes('prepaid')) return 'Mobile Prepaid';
        if (serviceType === 'bill_payment' || category.includes('bill')) {
            if (title.includes('electricity') || title.includes('power')) return 'Electricity';
            if (title.includes('gas') || title.includes('lpg') || title.includes('cylinder')) return 'Gas Cylinder';
            if (title.includes('water')) return 'Water Bill';
            if (title.includes('broadband')) return 'Broadband';
            if (title.includes('landline')) return 'Landline';
            if (title.includes('postpaid')) return 'Postpaid';
            if (title.includes('loan')) return 'Loan Payment';
            if (title.includes('emi')) return 'EMI Payment';
            if (title.includes('insurance')) return 'Insurance';
            if (title.includes('municipal') || title.includes('tax')) return 'Municipal Tax';
            if (title.includes('municipality')) return 'Municipality';
            if (title.includes('cable')) return 'Cable TV';
            if (title.includes('fastag')) return 'Fastag';
            if (title.includes('metro')) return 'Metro Card';
            return 'Electricity';
        }
        return 'Mobile Prepaid';
    };

    const handleUseOffer = (offer: any) => {
        const serviceTitle = getServiceTitle(offer);
        setSelectedOffer(null);
        if (onServiceSelect) onServiceSelect(serviceTitle);
    };

    const getOfferIcon = (title: string, type: string) => {
        if (title.toLowerCase().includes('dth') || type === 'dth') return Tv;
        if (title.toLowerCase().includes('electricity') || title.toLowerCase().includes('power') || type === 'bill_payment') return Zap;
        if (title.toLowerCase().includes('gas') || title.toLowerCase().includes('cylinder')) return Flame;
        if (title.toLowerCase().includes('movie')) return Ticket;
        return Smartphone;
    };

    const OfferIcon = ({ offer, size = "md" }: { offer: any, size?: "sm" | "md" | "lg" }) => {
        const dimension = size === "sm" ? "w-8 h-8" : size === "lg" ? "w-16 h-16" : "w-10 h-10";
        const Icon = getOfferIcon(offer.title, offer.serviceType);
        return (
            <div className={`${dimension} rounded-2xl flex items-center justify-center flex-shrink-0 bg-green-600/10 dark:bg-green-500/10 border border-green-700/20 dark:border-green-500/20 group-hover:bg-green-600/20 dark:group-hover:bg-green-500/20 transition-all`}>
                <Icon className={`${size === "lg" ? "w-8 h-8" : "w-5 h-5"} text-green-700 dark:text-green-500 group-hover:scale-110 transition-transform`} />
            </div>
        );
    };

    const renderOfferDetailModal = () => {
        if (!selectedOffer) return null;
        return (
            <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/40 dark:bg-background/90 backdrop-blur-md animate-in fade-in duration-200">
                <div className="absolute inset-0" onClick={() => setSelectedOffer(null)} />
                <div className="bg-card w-full max-w-md rounded-t-3xl sm:rounded-3xl border-t sm:border border-border animate-in slide-in-from-bottom duration-300 relative overflow-hidden shadow-2xl">
                    <div className="h-1.5 w-12 bg-border rounded-full mx-auto mt-3 mb-2 sm:hidden" />
                    <button
                        onClick={() => setSelectedOffer(null)}
                        className="absolute top-5 right-5 w-9 h-9 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-all border border-border z-10"
                    >
                        <X className="w-4 h-4 text-muted-foreground" />
                    </button>
                    {/* Header */}
                    <div className="relative px-6 pt-10 pb-6 border-b border-border">
                        <div className="flex flex-col items-center text-center relative z-10">
                            <div className="mb-6 group">
                                <OfferIcon offer={selectedOffer} size="lg" />
                            </div>
                            <h2 className="text-2xl font-bold text-foreground mb-2 leading-tight">{selectedOffer.title}</h2>
                            <div className="flex items-center gap-2">
                                <Badge className="bg-green-600/10 text-green-700 dark:text-green-500 border border-green-700/30 dark:border-green-500/20 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider">
                                    {selectedOffer.category}
                                </Badge>
                                <span className="text-[10px] text-muted-foreground font-medium">Expires Dec 31</span>
                            </div>
                        </div>
                    </div>
                    {/* Content */}
                    <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto scrollbar-hide">
                        <div className="space-y-4">
                            <div className="bg-muted/50 rounded-2xl p-5 border border-border">
                                <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3">Offer Benefits</h3>
                                <p className="text-sm text-foreground leading-relaxed">
                                    {selectedOffer.description || "Get instant benefits on your next transaction with TFC Pay. Valid across all payment methods."}
                                </p>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="bg-muted/50 rounded-2xl p-4 border border-border">
                                    <span className="text-[9px] font-bold text-muted-foreground uppercase block mb-1">Code</span>
                                    <span className="text-foreground font-bold text-sm tracking-wider">TFCNEW50</span>
                                </div>
                                <div className="bg-muted/50 rounded-2xl p-4 border border-border">
                                    <span className="text-[9px] font-bold text-muted-foreground uppercase block mb-1">Max Benefit</span>
                                    <span className="text-foreground font-bold text-sm">₹50.00</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Action Button */}
                    <div className="p-6 pt-2">
                        <button
                            onClick={() => handleUseOffer(selectedOffer)}
                            className="w-full bg-green-700 hover:bg-green-600 dark:bg-green-500 dark:hover:bg-green-400 text-white dark:text-black font-bold py-4 rounded-2xl transition-all shadow-lg active:scale-[0.98] flex items-center justify-center gap-2"
                        >
                            <span>Use Offer Now</span>
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="flex flex-col h-full bg-background text-foreground overflow-hidden relative">
            {/* Light mode decorative blobs */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 dark:hidden">
                <div className="absolute -top-[5%] -left-[10%] w-[70%] h-[40%] rounded-full bg-green-200/40 blur-[100px]" />
                <div className="absolute top-[40%] -right-[15%] w-[60%] h-[50%] rounded-full bg-emerald-100/50 blur-[80px]" />
                <div className="absolute bottom-[0%] left-[20%] w-[50%] h-[30%] rounded-full bg-teal-100/40 blur-[80px]" />
            </div>

            {/* Header */}
            <div className="p-6 pt-10 pb-4 relative z-10">
                <h1 className="text-2xl font-bold mb-1 tracking-tight text-foreground">Offers &amp; Rewards</h1>
                <p className="text-sm text-muted-foreground font-medium">Exclusive deals just for you</p>
            </div>

            <div className="flex-1 overflow-y-auto px-5 pb-24 space-y-6 scrollbar-hide relative z-10">

                {/* Featured Offers */}
                <section>
                    <div className="flex items-center gap-2 mb-4">
                        <Sparkles className="w-4 h-4 text-green-700 dark:text-green-500" />
                        <h2 className="text-sm font-bold text-foreground tracking-wide">Featured Offers</h2>
                    </div>

                    <div className="space-y-4">
                        {/* Mobile Prepaid Card */}
                        <div
                            onClick={() => handleUseOffer({ title: "upto 5% instant cashback on prepaid mobile recharge", category: "Prepaid", serviceType: "prepaid" })}
                            className="bg-green-700 dark:bg-[#0d1c14] border border-green-600/30 dark:border-green-900/20 rounded-3xl p-6 relative overflow-hidden group active:scale-[0.98] transition-all cursor-pointer"
                        >
                            <div className="flex items-center justify-between mb-5">
                                <Badge className="bg-white/20 dark:bg-green-900/40 text-white border-0 rounded-lg px-3 py-1 text-[11px] font-bold uppercase tracking-wider">
                                    PREPAID5
                                </Badge>
                                <span className="text-[10px] text-green-100 dark:text-gray-500 font-medium flex items-center gap-1.5">
                                    <History className="w-3 h-3" /> Valid till Dec 31
                                </span>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-1.5">upto 5% instant cashback on prepaid mobile recharge</h3>
                            <p className="text-sm text-green-100/80 dark:text-gray-500 font-medium">Get instant cashback on all prepaid recharges</p>
                            <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-white/10 dark:bg-green-500/10 rounded-full blur-2xl" />
                        </div>

                        {/* DTH Card */}
                        <div
                            onClick={() => handleUseOffer({ title: "upto 4% cashback on dth recharge", category: "DTH", serviceType: "dth" })}
                            className="bg-blue-700 dark:bg-[#0a1219] border border-blue-600/30 dark:border-blue-900/20 rounded-3xl p-6 relative overflow-hidden group active:scale-[0.98] transition-all cursor-pointer"
                        >
                            <div className="flex items-center justify-between mb-5">
                                <Badge className="bg-white/20 dark:bg-blue-900/40 text-white border-0 rounded-lg px-3 py-1 text-[11px] font-bold uppercase tracking-wider">
                                    DTH4
                                </Badge>
                                <span className="text-[10px] text-blue-100 dark:text-gray-500 font-medium flex items-center gap-1.5">
                                    <History className="w-3 h-3" /> Valid till Dec 31
                                </span>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-1.5">upto 4% cashback on dth recharge</h3>
                            <p className="text-sm text-blue-100/80 dark:text-gray-500 font-medium">On all DTH service providers</p>
                            <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-white/10 dark:bg-blue-500/10 rounded-full blur-2xl" />
                        </div>
                    </div>
                </section>

                {/* All Offers */}
                <section>
                    <h2 className="text-sm font-bold text-foreground tracking-wide mb-4">All Offers</h2>
                    <div className="space-y-3">
                        {mixedOffers.slice(0, 8).map((offer, index) => (
                            <div
                                key={index}
                                onClick={() => handleUseOffer(offer)}
                                className="bg-card border border-border rounded-3xl p-4 flex items-center gap-4 active:scale-[0.98] transition-all hover:border-green-700/30 dark:hover:border-green-500/30 cursor-pointer group shadow-sm"
                            >
                                <OfferIcon offer={offer} />
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-3 mb-1">
                                        <h4 className="font-bold text-foreground text-[14px] truncate tracking-tight">{offer.title}</h4>
                                        <Badge className="h-5 px-1.5 text-[9px] bg-muted text-muted-foreground border border-border rounded-md font-bold uppercase flex-shrink-0">
                                            {offer.category === 'Prepaid Recharge' ? 'Recharge' : offer.category === 'Bill Payments' ? 'Bills' : offer.category}
                                        </Badge>
                                    </div>
                                    <p className="text-xs text-muted-foreground font-medium">Maximum discount ₹50</p>
                                </div>
                                <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-green-700 dark:group-hover:text-green-500 transition-colors flex-shrink-0" />
                            </div>
                        ))}
                    </div>
                </section>

                {/* Your Cashback Section */}
                <section className="bg-card border border-border rounded-[2rem] p-5 relative overflow-hidden shadow-sm">
                    {/* subtle green accent blob */}
                    <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-green-500/10 blur-2xl pointer-events-none dark:hidden" />
                    <div className="flex items-center justify-between mb-5">
                        <h2 className="text-base font-bold text-foreground tracking-tight">Your Cashback</h2>
                        <button className="text-sm font-bold text-green-700 dark:text-green-500 hover:opacity-80 transition-opacity">History</button>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        {/* Total Earned */}
                        <div className="bg-green-600/10 dark:bg-green-500/10 border border-green-700/20 dark:border-green-500/20 rounded-2xl p-5 flex flex-col justify-between h-28">
                            <div>
                                <span className="text-2xl font-bold text-green-700 dark:text-green-500">₹</span>
                                <span className="text-2xl font-bold text-green-700 dark:text-green-500">{totalCashback.toFixed(2)}</span>
                            </div>
                            <span className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.15em]">Total Earned</span>
                        </div>
                        {/* Pending */}
                        <div className="bg-muted/60 border border-border rounded-2xl p-5 flex flex-col justify-between h-28">
                            <div>
                                <span className="text-2xl font-bold text-foreground">₹</span>
                                <span className="text-2xl font-bold text-foreground">{pendingCashback.toFixed(2)}</span>
                            </div>
                            <span className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.15em]">Pending</span>
                        </div>
                    </div>
                </section>

            </div>

            {/* Offer Detail Popup */}
            {renderOfferDetailModal()}
        </div>
    );
};

export default MobileOffers;
