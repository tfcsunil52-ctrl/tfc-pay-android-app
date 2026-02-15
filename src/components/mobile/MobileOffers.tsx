import { useState } from "react";
import { ChevronRight } from "lucide-react";
import { Card, CardContent } from "../ui/Card";
import { Badge } from "../ui/Badge";

import { useRewards } from "../../hooks/useRewards";

interface MobileOffersProps {
    onNavigate?: (tab: import("../../types").TabType) => void;
}

type OfferCategory = 'prepaid' | 'dth' | 'bill_payment';

const MobileOffers = ({ onNavigate }: MobileOffersProps) => {
    const { offers, totalCashback, pendingCashback } = useRewards();
    const [activeCategory, setActiveCategory] = useState<OfferCategory>('bill_payment');

    // Filter offers by category
    const filteredOffers = offers.filter(offer => offer.serviceType === activeCategory);

    // Offer Icon Component
    const OfferIcon = ({ offer }: { offer: any }) => {
        const [logoErrorCount, setLogoErrorCount] = useState(0);

        // Circular background style
        const circleStyle = {
            backgroundColor: offer.bgColor || (offer.serviceType === 'bill_payment' ? '#1a1a1a' : '#ffffff'),
        };

        // Fallback chain for logos: Clearbit -> Google Favicon -> Styled SVG Icon
        const getLogoUrl = () => {
            if (!offer.logoUrl) return null;
            if (logoErrorCount === 0) return `https://logo.clearbit.com/${offer.logoUrl}`;
            if (logoErrorCount === 1) return `https://www.google.com/s2/favicons?domain=${offer.logoUrl}&sz=256`;
            return null;
        };

        const currentLogoUrl = getLogoUrl();

        if (currentLogoUrl && logoErrorCount < 2) {
            return (
                <div
                    className="w-9 h-9 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0 shadow-sm border border-black/5 bg-white"
                >
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

        // Final fallback to localized category icons if logo attempt fails
        const Icon = offer.icon || ChevronRight;
        return (
            <div
                className="w-9 h-9 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0 shadow-sm border border-white/10"
                style={circleStyle}
            >
                {offer.image ? (
                    <img
                        src={offer.image}
                        alt={offer.title}
                        className="w-5 h-5 object-contain"
                    />
                ) : (
                    <Icon className="w-5 h-5 text-white" />
                )}
            </div>
        );
    };

    return (
        <div className="flex flex-col h-full overflow-hidden bg-[#0a0a0a]">
            <div className="flex-1 overflow-y-auto relative pb-20">
                {/* Premium Header */}
                <div className="relative">
                    {/* Top Green Curved Header */}
                    <div className="h-32 bg-gradient-to-b from-[#22c55e] to-[#16a34a] rounded-b-[40px] p-6 flex items-start">
                        <h1 className="text-3xl font-bold text-white mt-2">Offers</h1>
                    </div>

                    {/* Banner Section */}
                    <div className="px-4 -mt-10 mb-6">
                        <Card className="bg-[#050505] border-none shadow-xl overflow-hidden rounded-3xl">
                            <CardContent className="p-0 flex items-center">
                                <div className="flex-1 p-5 pr-0">
                                    <h2 className="text-xl font-bold text-white leading-tight">
                                        Get Discounts<br />
                                        On Recharge & Bill<br />
                                        Payments
                                    </h2>
                                </div>
                                <div className="w-[55%] p-0">
                                    <img
                                        src="/tfc-pay-android-app/offer.webp"
                                        alt="Offers"
                                        className="w-full h-auto object-contain transform scale-140 -mb-2"
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Category Tabs */}
                <div className="px-4 mb-4">
                    <div className="flex justify-around items-center border-b border-white/10">
                        <button
                            onClick={() => setActiveCategory('prepaid')}
                            className={`pb-3 text-sm font-medium transition-colors relative px-2 ${activeCategory === 'prepaid'
                                ? 'text-[#22c55e]'
                                : 'text-white/40'
                                }`}
                        >
                            Prepaid Recharge
                            {activeCategory === 'prepaid' && (
                                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#22c55e] rounded-t-full shadow-[0_-2px_8px_rgba(34,197,94,0.5)]" />
                            )}
                        </button>
                        <button
                            onClick={() => setActiveCategory('dth')}
                            className={`pb-3 text-sm font-medium transition-colors relative px-2 ${activeCategory === 'dth'
                                ? 'text-[#22c55e]'
                                : 'text-white/40'
                                }`}
                        >
                            DTH
                            {activeCategory === 'dth' && (
                                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#22c55e] rounded-t-full shadow-[0_-2px_8px_rgba(34,197,94,0.5)]" />
                            )}
                        </button>
                        <button
                            onClick={() => setActiveCategory('bill_payment')}
                            className={`pb-3 text-sm font-medium transition-colors relative px-2 ${activeCategory === 'bill_payment'
                                ? 'text-[#22c55e]'
                                : 'text-white/40'
                                }`}
                        >
                            Bill Payments
                            {activeCategory === 'bill_payment' && (
                                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#22c55e] rounded-t-full shadow-[0_-2px_8px_rgba(34,197,94,0.5)]" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Offers List */}
                <div className="px-4 space-y-4">
                    {filteredOffers.map((offer, index) => (
                        <div
                            key={index}
                            className="flex items-center gap-4 py-2 group cursor-pointer"
                        >
                            <OfferIcon offer={offer} />
                            <div className="flex-1 min-w-0">
                                <h4 className="font-medium text-white/90 text-[15px] truncate">
                                    {offer.title}
                                </h4>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="pb-16" />
            </div>
        </div>
    );
};

export default MobileOffers;
