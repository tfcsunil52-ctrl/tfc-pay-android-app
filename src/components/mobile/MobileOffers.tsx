import { useState } from "react";
import { ChevronRight, Sparkles, Tv, Smartphone, Zap, Flame, Ticket, History, X, Info, ExternalLink, Copy, Check } from "lucide-react";
import { Card, CardContent } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { useRewards } from "../../hooks/useRewards";
import { getAssetPath } from "../../utils/assets";

interface MobileOffersProps {
    onNavigate?: (tab: import("../../types").TabType) => void;
    onServiceSelect?: (serviceTitle: string) => void;
}

const MobileOffers = ({ onNavigate, onServiceSelect }: MobileOffersProps) => {
    const { offers, totalCashback, pendingCashback } = useRewards();
    const [activeCategory, setActiveCategory] = useState<string>('Bill Payments');
    const [selectedOffer, setSelectedOffer] = useState<any | null>(null);
    const [copied, setCopied] = useState(false);

    // Get unique categories for tabs
    const categories = ['Prepaid Recharge', 'DTH', 'Bill Payments'];

    // Remove duplicates based on title
    const uniqueOffers = Array.from(new Map(offers.map(offer => [offer.title, offer])).values());

    // Map offer to service title
    const getServiceTitle = (offer: any): string => {
        const title = offer.title.toLowerCase();
        const serviceType = offer.serviceType || '';
        const category = (offer.category || '').toLowerCase();

        // DTH services - Match MobileServices titles
        if (serviceType === 'dth' || title.includes('dth') || category.includes('dth')) {
            return 'DTH Recharge';
        }

        // Prepaid/Mobile Recharge - Match MobileServices titles
        if (serviceType === 'prepaid' || title.includes('recharge') || title.includes('repaid') || category.includes('prepaid')) {
            return 'Mobile Prepaid';
        }

        // Bill Payments - Match MobileServices titles exactly as they appear in services object
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
            return 'Electricity'; // Default safe bill payment
        }

        return 'Mobile Prepaid'; // Default fallback
    };

    // Handle "Use Offer Now" button click
    const handleUseOffer = (offer: any) => {
        const serviceTitle = getServiceTitle(offer);
        setSelectedOffer(null); // Close popup

        if (onServiceSelect) {
            onServiceSelect(serviceTitle);
        }
    };

    // Helper to get icon based on offer
    const getOfferIcon = (title: string, type: string) => {
        if (title.toLowerCase().includes('dth') || type === 'dth') return Tv;
        if (title.toLowerCase().includes('electricity') || title.toLowerCase().includes('power') || type === 'bill_payment') return Zap;
        if (title.toLowerCase().includes('gas') || title.toLowerCase().includes('cylinder')) return Flame;
        if (title.toLowerCase().includes('movie')) return Ticket;
        return Smartphone;
    };

    // Simplified OfferIcon using ONLY lucide icons as requested
    const OfferIcon = ({ offer, size = "md" }: { offer: any, size?: "sm" | "md" | "lg" }) => {
        const dimension = size === "sm" ? "w-8 h-8" : size === "lg" ? "w-16 h-16" : "w-10 h-10";
        const Icon = getOfferIcon(offer.title, offer.serviceType);

        return (
            <div
                className={`${dimension} rounded-full flex items-center justify-center flex-shrink-0 bg-white/5 border border-white/10 group-hover:bg-green-500/10 group-hover:border-green-500/20 transition-all`}
            >
                <Icon className={`${size === "lg" ? "w-8 h-8" : "w-5 h-5"} text-green-500 group-hover:scale-110 transition-transform`} />
            </div>
        );
    };

    const renderOfferDetailModal = () => {
        if (!selectedOffer) return null;

        return (
            <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-background/90 backdrop-blur-md animate-in fade-in duration-200">
                <div
                    className="absolute inset-0"
                    onClick={() => setSelectedOffer(null)}
                />
                <div className="bg-card w-full max-w-md rounded-t-3xl sm:rounded-3xl border-t sm:border border-white/10 animate-in slide-in-from-bottom duration-300 relative overflow-hidden shadow-2xl">
                    <div className="h-1.5 w-12 bg-white/10 rounded-full mx-auto mt-3 mb-2 sm:hidden" />

                    <button
                        onClick={() => setSelectedOffer(null)}
                        className="absolute top-5 right-5 w-9 h-9 rounded-full bg-white/5 backdrop-blur-sm flex items-center justify-center hover:bg-white/10 transition-all border border-white/10 z-10"
                    >
                        <X className="w-4 h-4 text-gray-400" />
                    </button>

                    {/* Header */}
                    <div className="relative px-6 pt-10 pb-6 border-b border-white/5">
                        <div className="flex flex-col items-center text-center relative z-10">
                            <div className="mb-6">
                                <OfferIcon offer={selectedOffer} size="lg" />
                            </div>
                            <h2 className="text-2xl font-bold text-white mb-2 leading-tight">{selectedOffer.title}</h2>
                            <div className="flex items-center gap-2">
                                <Badge className="bg-green-600/10 text-green-500 border border-green-500/20 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider">
                                    {selectedOffer.category}
                                </Badge>
                                <span className="text-[10px] text-gray-500 font-medium">Expires Dec 31</span>
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto scrollbar-hide">
                        <div className="space-y-4">
                            <div className="bg-white/5 rounded-2xl p-5 border border-white/5">
                                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Offer Benefits</h3>
                                <p className="text-sm text-gray-300 leading-relaxed">
                                    {selectedOffer.description || "Get instant benefits on your next transaction with TFC Pay. Valid across all payment methods."}
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                                    <span className="text-[9px] font-bold text-gray-500 uppercase block mb-1">Code</span>
                                    <span className="text-white font-bold text-sm tracking-wider">TFCNEW50</span>
                                </div>
                                <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                                    <span className="text-[9px] font-bold text-gray-500 uppercase block mb-1">Max Benefit</span>
                                    <span className="text-white font-bold text-sm">₹50.00</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Action Button */}
                    <div className="p-6 pt-2">
                        <button
                            onClick={() => handleUseOffer(selectedOffer)}
                            className="w-full bg-[#021a10] hover:bg-[#021a10]/90 text-white font-bold py-4 rounded-2xl transition-all shadow-lg active:scale-[0.98] flex items-center justify-center gap-2"
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
        <div className="flex flex-col h-full bg-background text-white overflow-hidden">
            {/* Header */}
            <div className="p-6 pt-10 pb-4">
                <h1 className="text-2xl font-bold mb-1 tracking-tight">Offers & Rewards</h1>
                <p className="text-sm text-gray-500 font-medium">Exclusive deals just for you</p>
            </div>

            <div className="flex-1 overflow-y-auto px-5 pb-24 space-y-9 scrollbar-hide">

                {/* Featured Offers */}
                <section>
                    <div className="flex items-center gap-2 mb-4">
                        <Sparkles className="w-4 h-4 text-green-500" />
                        <h2 className="text-sm font-bold text-gray-300 tracking-wide">Featured Offers</h2>
                    </div>

                    <div className="space-y-4">
                        {/* Premium Featured Card - Emerald */}
                        <div
                            onClick={() => handleUseOffer({ title: "5% Cashback on Recharge", category: "Recharge", serviceType: "prepaid" })}
                            className="bg-[#0d1c14] border border-green-900/20 rounded-3xl p-6 relative overflow-hidden group active:scale-[0.98] transition-all cursor-pointer"
                        >
                            <div className="flex items-center justify-between mb-5">
                                <Badge className="bg-green-900/40 text-green-500 border-0 rounded-lg px-3 py-1 text-[11px] font-bold uppercase tracking-wider">
                                    RECHARGE5
                                </Badge>
                                <span className="text-[10px] text-gray-500 font-medium flex items-center gap-1.5">
                                    <History className="w-3 h-3" /> Valid till Dec 31
                                </span>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-1.5">5% Cashback on Recharge</h3>
                            <p className="text-sm text-gray-500 font-medium">Get instant cashback on mobile & DTH recharge</p>

                            {/* Decorative elements */}
                            <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-green-500/10 rounded-full blur-2xl" />
                        </div>

                        {/* Premium Featured Card - Purple */}
                        <div
                            onClick={() => handleUseOffer({ title: "Flat ₹100 Cashback", category: "Bills", serviceType: "bill_payment" })}
                            className="bg-[#12101b] border border-purple-900/20 rounded-3xl p-6 relative overflow-hidden group active:scale-[0.98] transition-all cursor-pointer"
                        >
                            <div className="flex items-center justify-between mb-5">
                                <Badge className="bg-purple-900/40 text-purple-400 border-0 rounded-lg px-3 py-1 text-[11px] font-bold uppercase tracking-wider">
                                    POWER100
                                </Badge>
                                <span className="text-[10px] text-gray-500 font-medium flex items-center gap-1.5">
                                    <History className="w-3 h-3" /> Valid till Dec 25
                                </span>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-1.5">Flat ₹100 Cashback</h3>
                            <p className="text-sm text-gray-500 font-medium">On electricity bill payment above ₹1000</p>

                            {/* Decorative elements */}
                            <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl" />
                        </div>
                    </div>
                </section>

                {/* All Offers */}
                <section>
                    <h2 className="text-sm font-bold text-gray-300 tracking-wide mb-5">All Offers</h2>

                    <div className="space-y-4">
                        {uniqueOffers.slice(0, 6).map((offer, index) => (
                            <div
                                key={index}
                                onClick={() => handleUseOffer(offer)}
                                className="bg-white/5 border border-white/5 rounded-3xl p-4 flex items-center gap-5 active:scale-[0.98] transition-all hover:bg-white/[0.08] cursor-pointer group"
                            >
                                <OfferIcon offer={offer} />
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-3 mb-1">
                                        <h4 className="font-bold text-white text-[15px] truncate tracking-tight">{offer.title}</h4>
                                        <Badge className="h-5 px-1.5 text-[9px] bg-white/5 text-gray-500 border border-white/5 rounded-md font-bold uppercase">
                                            {offer.category === 'Prepaid Recharge' ? 'Recharge' : offer.category === 'Bill Payments' ? 'Bills' : offer.category}
                                        </Badge>
                                    </div>
                                    <p className="text-xs text-gray-500 font-medium">Maximum discount ₹50</p>
                                </div>
                                <ChevronRight className="w-5 h-5 text-gray-700 group-hover:text-green-500 transition-colors" />
                            </div>
                        ))}
                    </div>
                </section>

                {/* Your Cashback Section */}
                <section className="bg-white/5 border border-white/5 rounded-[2.5rem] p-6 relative overflow-hidden">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-base font-bold text-white tracking-tight">Total Cashback</h2>
                    </div>

                    <div className="flex flex-col gap-4">
                        {/* Total Earned */}
                        <div className="bg-[#050505] border border-white/5 rounded-3xl p-5 flex flex-col justify-between h-32">
                            <div>
                                <span className="text-3xl font-bold text-green-500">₹</span>
                                <span className="text-3xl font-bold text-green-500">{totalCashback.toFixed(2)}</span>
                            </div>
                            <span className="text-[10px] font-black text-gray-600 uppercase tracking-[0.2em]">Total Earned</span>
                        </div>
                    </div>
                </section>

            </div >

            {/* Offer Detail Popup */}
            {renderOfferDetailModal()}
        </div>
    );
};

export default MobileOffers;
