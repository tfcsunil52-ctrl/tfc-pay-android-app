import { useState } from "react";
import { ChevronRight, Sparkles, Tv, Smartphone, Zap, Flame, Ticket, History, X, Info, ExternalLink, Copy, Check } from "lucide-react";
import { Card, CardContent } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { useRewards } from "../../hooks/useRewards";

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

    // Offer Icon Component (Restored)
    const OfferIcon = ({ offer, size = "md" }: { offer: any, size?: "sm" | "md" | "lg" }) => {
        const [logoErrorCount, setLogoErrorCount] = useState(0);
        const dimension = size === "sm" ? "w-8 h-8" : size === "lg" ? "w-16 h-16" : "w-10 h-10";

        // Fallback chain for logos: Clearbit -> Google Favicon -> Styled SVG Icon
        const getLogoUrl = () => {
            if (!offer.logoUrl) return null;
            if (logoErrorCount === 0) return `https://logo.clearbit.com/${offer.logoUrl}`;
            if (logoErrorCount === 1) return `https://www.google.com/s2/favicons?domain=${offer.logoUrl}&sz=256`;
            return null;
        };

        const currentLogoUrl = getLogoUrl();
        const Icon = getOfferIcon(offer.title, offer.serviceType);

        if (currentLogoUrl && logoErrorCount < 2) {
            return (
                <div className={`${dimension} rounded-full flex items-center justify-center overflow-hidden flex-shrink-0 bg-white border border-white/10`}>
                    <img
                        src={currentLogoUrl}
                        alt={offer.companyName || offer.title}
                        className="w-full h-full object-contain p-0.5"
                        onError={() => setLogoErrorCount(prev => prev + 1)}
                        loading="lazy"
                    />
                </div>
            );
        }

        return (
            <div
                className={`${dimension} rounded-full flex items-center justify-center flex-shrink-0 border border-white/10`}
                style={{ backgroundColor: offer.bgColor || (offer.serviceType === 'bill_payment' ? '#1a1a1a' : '#222') }}
            >
                <Icon className={`${size === "lg" ? "w-8 h-8" : "w-5 h-5"} text-white`} />
            </div>
        );
    };

    const renderOfferDetailModal = () => {
        if (!selectedOffer) return null;

        return (
            <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
                <div
                    className="absolute inset-0"
                    onClick={() => setSelectedOffer(null)}
                />
                <div className="bg-black w-full max-w-md rounded-t-3xl sm:rounded-3xl border-t sm:border border-white/10 animate-in slide-in-from-bottom duration-300 relative overflow-hidden shadow-2xl">
                    <div className="h-1.5 w-12 bg-white/30 rounded-full mx-auto mt-3 mb-2 sm:hidden" />

                    <button
                        onClick={() => setSelectedOffer(null)}
                        className="absolute top-5 right-5 w-9 h-9 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 transition-all border border-white/10 z-10"
                    >
                        <X className="w-4 h-4 text-gray-300" />
                    </button>

                    {/* Header with gradient background */}
                    <div className="relative px-6 pt-8 pb-6 bg-gradient-to-br from-green-950/30 via-black to-black border-b border-white/5">
                        <div className="flex flex-col items-center text-center relative z-10">
                            <div className="mb-4 relative">
                                <div className="absolute inset-0 bg-green-500/20 blur-2xl rounded-full" />
                                <OfferIcon offer={selectedOffer} size="lg" />
                            </div>
                            <h2 className="text-2xl font-bold text-white mb-2 leading-tight">{selectedOffer.title}</h2>
                            <Badge className="bg-green-600/20 text-green-400 border border-green-500/30 rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-widest">
                                {selectedOffer.category}
                            </Badge>
                        </div>

                        {/* Decorative gradient orbs */}
                        <div className="absolute top-0 left-0 w-32 h-32 bg-green-500/10 rounded-full blur-3xl" />
                        <div className="absolute bottom-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full blur-3xl" />
                    </div>

                    {/* Content */}
                    <div className="p-6 space-y-5 max-h-[60vh] overflow-y-auto scrollbar-hide">


                        {/* Description */}
                        <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-5">
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                                <Info className="w-3.5 h-3.5" /> Offer Details
                            </h3>
                            <p className="text-sm text-gray-300 leading-relaxed">
                                {selectedOffer.description || "Enjoy exclusive benefits with this offer. Use it on your next transaction to save more."}
                            </p>
                        </div>

                        {/* Info Grid */}
                        <div className="grid grid-cols-2 gap-3">
                            <div className="bg-[#0a0a0a] border border-white/5 rounded-xl p-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center">
                                        <Smartphone className="w-4 h-4 text-green-500" />
                                    </div>
                                    <span className="text-[9px] font-bold text-gray-500 uppercase">Provider</span>
                                </div>
                                <span className="text-white font-bold text-sm">{selectedOffer.companyName || "All Operators"}</span>
                            </div>
                            <div className="bg-[#0a0a0a] border border-white/5 rounded-xl p-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center">
                                        <History className="w-4 h-4 text-blue-500" />
                                    </div>
                                    <span className="text-[9px] font-bold text-gray-500 uppercase">Valid Till</span>
                                </div>
                                <span className="text-white font-bold text-sm">31 Dec 2026</span>
                            </div>
                        </div>

                        {/* Terms & Conditions */}
                        <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-5">
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                                <Sparkles className="w-3.5 h-3.5" /> Terms & Conditions
                            </h3>
                            <ul className="space-y-2 text-xs text-gray-400">
                                <li className="flex items-start gap-2">
                                    <span className="text-green-500 mt-0.5">•</span>
                                    <span>Valid for new and existing users</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-green-500 mt-0.5">•</span>
                                    <span>Cashback will be credited within 24-48 hours</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-green-500 mt-0.5">•</span>
                                    <span>One offer per user per transaction</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-green-500 mt-0.5">•</span>
                                    <span>Cannot be combined with other offers</span>
                                </li>
                            </ul>
                        </div>

                    </div>

                    {/* Action Button - Sticky at bottom */}
                    <div className="p-6 pt-2 border-t border-white/5 bg-black/80 backdrop-blur-sm sticky bottom-0">
                        <button
                            onClick={() => handleUseOffer(selectedOffer)}
                            className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-green-600/30 hover:shadow-green-600/50 flex items-center justify-center gap-2 group"
                        >
                            <span>Apply Offer & Continue</span>
                            <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                        </button>
                    </div>

                    {/* Background decoration removed - using header gradients instead */}
                </div>
            </div>
        );
    };

    return (
        <div className="flex flex-col h-full bg-black text-white overflow-hidden">
            {/* Header */}
            <div className="p-6 pt-8 pb-4">
                <h1 className="text-2xl font-bold mb-1">Offers & Rewards</h1>
                <p className="text-sm text-gray-400">Exclusive deals just for you</p>
            </div>

            <div className="flex-1 overflow-y-auto px-4 pb-24 space-y-8 scrollbar-hide">

                {/* Featured Offers */}
                <section>
                    <div className="flex items-center gap-2 mb-4">
                        <Sparkles className="w-4 h-4 text-green-500 fill-current" />
                        <h2 className="text-sm font-bold uppercase tracking-wider text-gray-300">Featured Offers</h2>
                    </div>

                    <div className="space-y-4">
                        {/* Mobile Prepaid Offer */}
                        <div
                            onClick={() => handleUseOffer({
                                title: "Upto 5% Cashback",
                                description: "Get upto 5% instant cashback on all mobile prepaid recharges. Limited time offer!",
                                category: "Prepaid Recharge",
                                serviceType: "prepaid",
                                bgColor: "#1a2e23"
                            })}
                            className="bg-[#1a2e23] border border-green-900/30 rounded-2xl p-5 relative overflow-hidden group active:scale-[0.98] transition-all cursor-pointer"
                        >
                            <div className="absolute top-4 right-4 text-xs text-gray-400 flex items-center gap-1">
                                <History className="w-3 h-3" /> Valid till Dec 31
                            </div>
                            <Badge className="bg-green-600/20 text-green-500 mb-3 border-0 rounded-md px-2 py-0.5 text-xs font-bold uppercase tracking-wider">
                                PREPAID5
                            </Badge>
                            <h3 className="text-lg font-bold text-white mb-1">Upto 5% Cashback</h3>
                            <p className="text-sm text-gray-400">On mobile prepaid recharge</p>
                        </div>

                        {/* DTH Offer */}
                        <div
                            onClick={() => handleUseOffer({
                                title: "Upto 4% Cashback",
                                description: "Get upto 4% cashback on all DTH bill payments. Valid on all operators.",
                                category: "DTH",
                                serviceType: "dth",
                                bgColor: "#1e1b2e"
                            })}
                            className="bg-[#1e1b2e] border border-purple-900/30 rounded-2xl p-5 relative overflow-hidden group active:scale-[0.98] transition-all cursor-pointer"
                        >
                            <div className="absolute top-4 right-4 text-xs text-gray-400 flex items-center gap-1">
                                <History className="w-3 h-3" /> Valid till Dec 31
                            </div>
                            <Badge className="bg-purple-600/20 text-purple-400 mb-3 border-0 rounded-md px-2 py-0.5 text-xs font-bold uppercase tracking-wider">
                                DTH4
                            </Badge>
                            <h3 className="text-lg font-bold text-white mb-1">Upto 4% Cashback</h3>
                            <p className="text-sm text-gray-400">On DTH bill payment</p>
                        </div>
                    </div>
                </section>

                {/* All Offers with Category Tabs */}
                <section>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-sm font-bold uppercase tracking-wider text-gray-300">All Offers</h2>
                    </div>

                    {/* Category Tab Bar */}
                    <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all border ${activeCategory === cat
                                    ? 'bg-green-600/10 border-green-500 text-green-500 shadow-[0_0_15px_rgba(34,197,94,0.2)]'
                                    : 'bg-white/5 border-white/5 text-gray-500 hover:text-gray-300'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    {/* Filtered Unique Offers List */}
                    <div className="space-y-3">
                        {uniqueOffers
                            .filter(offer => (offer.category || 'Other Offers') === activeCategory)
                            .map((offer, index) => (
                                <div
                                    key={index}
                                    onClick={() => handleUseOffer(offer)}
                                    className="bg-[#111] border border-white/5 rounded-2xl p-4 flex items-center gap-4 active:scale-[0.98] transition-all hover:bg-[#161616] cursor-pointer group"
                                >
                                    <OfferIcon offer={offer} />
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <h4 className="font-bold text-white text-sm truncate">{offer.title}</h4>
                                            {index === 0 && <Badge className="h-4 px-1 text-[9px] bg-white/10 text-white border-0">New</Badge>}
                                        </div>
                                        <p className="text-[10px] text-gray-500 mt-0.5">Click to apply offer</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setSelectedOffer(offer);
                                            }}
                                            className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors"
                                        >
                                            <Info className="w-4 h-4 text-gray-400" />
                                        </button>
                                        <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-green-500 transition-colors" />
                                    </div>
                                </div>
                            ))}

                        {uniqueOffers.filter(offer => (offer.category || 'Other Offers') === activeCategory).length === 0 && (
                            <div className="py-12 text-center">
                                <p className="text-gray-500 text-sm">No offers available in this category</p>
                            </div>
                        )}
                    </div>
                </section>

                {/* Your Cashback Section (Restored) */}
                <section className="bg-[#111] border border-white/5 rounded-2xl p-5 relative overflow-hidden">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-sm font-bold text-white">Your Cashback</h2>
                        <button className="text-xs font-medium text-green-500 hover:text-green-400 transition-colors">History</button>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        {/* Total Earned */}
                        <div className="bg-[#0a0a0a] border border-white/5 rounded-xl p-3 flex flex-col justify-center h-24">
                            <span className="text-2xl font-bold text-green-500">₹{totalCashback.toFixed(2)}</span>
                            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mt-1">Total Earned</span>
                        </div>

                        {/* Pending */}
                        <div className="bg-[#0a0a0a] border border-white/5 rounded-xl p-3 flex flex-col justify-center h-24">
                            <span className="text-2xl font-bold text-white">₹{pendingCashback.toFixed(2)}</span>
                            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mt-1">Pending</span>
                        </div>
                    </div>

                    {/* Decorative glow */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                </section>

            </div >

            {/* Offer Detail Popup */}
            {renderOfferDetailModal()}
        </div >
    );
};

export default MobileOffers;
